import { connectToDatabase } from '@/lib/mongodb';
import { AnalyticsModel, VisitLogModel, IVisitRecord } from '@/models/Analytics';
import { parseUserAgent } from '@/lib/ua-parser';

export async function syncAndMergeAnalytics() {
  try {
    await connectToDatabase();

    // 1. Fetch old global analytics doc
    const analyticsDoc = await AnalyticsModel.findOne({ key: 'global_analytics' });

    if (analyticsDoc && Array.isArray(analyticsDoc.visits) && analyticsDoc.visits.length > 0) {
      // 2. Migrate any old visits from AnalyticsModel.visits into VisitLogModel
      for (const oldRecord of analyticsDoc.visits) {
        if (!oldRecord.ip || !oldRecord.timestamp) continue;

        const recordDate = new Date(oldRecord.timestamp);
        if (isNaN(recordDate.getTime())) continue;

        // Check if this visit log already exists in VisitLogModel
        const existing = await VisitLogModel.findOne({
          ip: oldRecord.ip,
          path: oldRecord.path || '/',
          timestamp: {
            $gte: new Date(recordDate.getTime() - 2000),
            $lte: new Date(recordDate.getTime() + 2000),
          },
        });

        if (!existing) {
          const uaString = oldRecord.userAgent || '';
          const parsedUA = parseUserAgent(uaString);

          let countryCode = 'NP';
          if (oldRecord.country === 'Nepal') countryCode = 'NP';
          else if (oldRecord.country === 'United States') countryCode = 'US';
          else if (oldRecord.country === 'India') countryCode = 'IN';

          await VisitLogModel.create({
            ip: oldRecord.ip,
            country: oldRecord.country || 'Nepal',
            countryCode,
            city: oldRecord.city || 'Kathmandu',
            region: 'Bagmati',
            flag: oldRecord.flag || '🇳🇵',
            path: oldRecord.path || '/',
            referrer: 'Direct / Legacy',
            referrerHost: 'direct',
            device: parsedUA.device,
            os: parsedUA.os,
            browser: parsedUA.browser,
            screenResolution: 'Unknown',
            language: 'en',
            isBot: parsedUA.isBot,
            botName: parsedUA.botName || '',
            userAgent: uaString,
            timestamp: recordDate,
          });
        }
      }
    }

    // 3. Compute consolidated KPIs across both datasets
    const totalLogsCount = await VisitLogModel.countDocuments();
    const storedTotalViews = analyticsDoc?.totalViews || 0;
    const mergedTotalViews = Math.max(storedTotalViews, totalLogsCount);

    const distinctIpsInLogs = await VisitLogModel.distinct('ip', { isBot: false });
    const distinctIpsInOldRecords = analyticsDoc?.visits ? analyticsDoc.visits.map((v: IVisitRecord) => v.ip) : [];
    const allUniqueIps = Array.from(new Set([...distinctIpsInLogs, ...distinctIpsInOldRecords])).filter(Boolean);

    // 4. Fetch top 100 recent visit logs from VisitLogModel to mirror into AnalyticsModel.visits
    const recentLogs = await VisitLogModel.find().sort({ timestamp: -1 }).limit(100).lean();

    const mirroredVisits: IVisitRecord[] = recentLogs.map((log: any) => ({
      ip: log.ip,
      country: log.country,
      city: log.city,
      flag: log.flag,
      path: log.path,
      userAgent: `${log.os} • ${log.browser}`,
      timestamp: new Date(log.timestamp).toISOString(),
    }));

    // 5. Update AnalyticsModel doc with consolidated metrics
    const updatedAnalytics = await AnalyticsModel.findOneAndUpdate(
      { key: 'global_analytics' },
      {
        $set: {
          totalViews: mergedTotalViews,
          uniqueVisitors: allUniqueIps.length,
          visits: mirroredVisits,
        },
      },
      { new: true, upsert: true }
    ).lean();

    return {
      success: true,
      totalViews: mergedTotalViews,
      uniqueVisitors: allUniqueIps.length,
      logCount: totalLogsCount,
      analytics: updatedAnalytics,
    };
  } catch (error) {
    console.error('Analytics merge error:', error);
    return { success: false, error };
  }
}
