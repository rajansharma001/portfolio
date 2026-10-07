import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AnalyticsModel, VisitLogModel } from '@/models/Analytics';
import { syncAndMergeAnalytics } from '@/lib/analytics-migrator';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-merge legacy AnalyticsModel visits into VisitLogModel collection
    await syncAndMergeAnalytics();

    const url = new URL(req.url);
    const range = url.searchParams.get('range') || '7d'; // 'today', '7d', '30d', 'all'

    // Compute Date filter
    const now = new Date();
    let startDate: Date | null = null;
    if (range === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const dateQuery = startDate ? { timestamp: { $gte: startDate } } : {};

    // 1. Overall Merged KPIs
    const [summary, totalLogs, humanVisitors, botCount, todayCount, sevenDaysCount] = await Promise.all([
      AnalyticsModel.findOne({ key: 'global_analytics' }).lean(),
      VisitLogModel.countDocuments(dateQuery),
      VisitLogModel.distinct('ip', { ...dateQuery, isBot: false }),
      VisitLogModel.countDocuments({ ...dateQuery, isBot: true }),
      VisitLogModel.countDocuments({
        timestamp: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
      }),
      VisitLogModel.countDocuments({
        timestamp: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const consolidatedTotalViews = Math.max(summary?.totalViews || 0, totalLogs);
    const consolidatedUniqueVisitors = Math.max(summary?.uniqueVisitors || 0, humanVisitors.length);

    // 2. Timeline Aggregation (Daily views)
    const timelineDays = range === '30d' ? 30 : range === 'today' ? 1 : 7;
    const timelineStart = new Date(now.getTime() - timelineDays * 24 * 60 * 60 * 1000);

    const timelineAgg = await VisitLogModel.aggregate([
      { $match: { timestamp: { $gte: timelineStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: range === 'today' ? '%H:00' : '%Y-%m-%d', date: '$timestamp' },
          },
          views: { $sum: 1 },
          uniqueIps: { $addToSet: '$ip' },
        },
      },
      {
        $project: {
          label: '$_id',
          views: 1,
          uniques: { $size: '$uniqueIps' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Top Countries
    const topCountries = await VisitLogModel.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: { country: '$country', flag: '$flag', code: '$countryCode' },
          count: { $sum: 1 },
          uniques: { $addToSet: '$ip' },
        },
      },
      {
        $project: {
          country: '$_id.country',
          flag: '$_id.flag',
          code: '$_id.code',
          count: 1,
          uniqueCount: { $size: '$uniques' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // 4. Device Breakdown
    const deviceAgg = await VisitLogModel.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 5. Operating System Breakdown
    const osAgg = await VisitLogModel.aggregate([
      { $match: { ...dateQuery, isBot: false } },
      {
        $group: {
          _id: '$os',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 6. Browser Breakdown
    const browserAgg = await VisitLogModel.aggregate([
      { $match: { ...dateQuery, isBot: false } },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 7. Top Visited Pages
    const topPages = await VisitLogModel.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$path',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // 8. Top Referrers
    const topReferrers = await VisitLogModel.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$referrerHost',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    return NextResponse.json({
      kpis: {
        totalViews: consolidatedTotalViews,
        rangeViews: totalLogs,
        uniqueVisitors: consolidatedUniqueVisitors,
        botVisits: botCount,
        todayViews: todayCount,
        sevenDaysViews: sevenDaysCount,
      },
      timeline: timelineAgg,
      topCountries,
      deviceBreakdown: deviceAgg.map((d) => ({ device: d._id || 'desktop', count: d.count })),
      osBreakdown: osAgg.map((o) => ({ os: o._id || 'Unknown', count: o.count })),
      browserBreakdown: browserAgg.map((b) => ({ browser: b._id || 'Unknown', count: b.count })),
      topPages: topPages.map((p) => ({ path: p._id || '/', count: p.count })),
      topReferrers: topReferrers.map((r) => ({ host: r._id || 'direct', count: r.count })),
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Failed to compute analytics stats' }, { status: 500 });
  }
}
