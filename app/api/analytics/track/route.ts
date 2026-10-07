import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AnalyticsModel, VisitLogModel, IVisitRecord, IVisitLog } from '@/models/Analytics';
import { parseUserAgent } from '@/lib/ua-parser';

export async function GET() {
  try {
    await connectToDatabase();
    let analytics = await AnalyticsModel.findOne({ key: 'global_analytics' }).lean();

    if (!analytics) {
      analytics = await AnalyticsModel.create({
        key: 'global_analytics',
        totalViews: 0,
        uniqueVisitors: 0,
        visits: [],
      });
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('MongoDB Analytics GET error:', error);
    return NextResponse.json({ totalViews: 0, uniqueVisitors: 0, visits: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pagePath = body.path || '/';

    // Ignore tracking for internal admin paths
    if (pagePath.startsWith('/admin') || pagePath.startsWith('/api')) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // 1. Resolve real client IP
    const cfIp = req.headers.get('cf-connecting-ip');
    const realIp = req.headers.get('x-real-ip');
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = (cfIp || realIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1')).trim();

    const userAgent = req.headers.get('user-agent') || 'Browser Visitor';
    const parsedUA = parseUserAgent(userAgent);

    // 2. Resolve Client Environment Metadata
    const clientReferrer = body.referrer || req.headers.get('referer') || 'Direct';
    let referrerHost = 'direct';
    try {
      if (clientReferrer && clientReferrer !== 'Direct') {
        const parsedUrl = new URL(clientReferrer);
        referrerHost = parsedUrl.hostname.replace(/^www\./, '');
      }
    } catch {
      referrerHost = clientReferrer.slice(0, 50);
    }

    const screenResolution = body.screenResolution || 'Unknown';
    const language = body.language || req.headers.get('accept-language')?.split(',')[0]?.split(';')[0] || 'en';

    // 3. Resolve Geolocation (Edge headers first, fallback to IP lookup)
    let country = req.headers.get('x-vercel-ip-country-name') || 'Nepal';
    let countryCode = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || 'NP';
    let city = req.headers.get('x-vercel-ip-city') || 'Kathmandu';
    let region = req.headers.get('x-vercel-ip-country-region') || 'Bagmati';
    let flag = '🇳🇵';

    if (countryCode && countryCode.length === 2 && countryCode !== 'XX') {
      flag = String.fromCodePoint(...[...countryCode.toUpperCase()].map((c: string) => 127397 + c.charCodeAt(0)));
    }

    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');

    if (!isLocal && (!req.headers.get('x-vercel-ip-country') || country === 'Nepal')) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName,countryCode`, {
          signal: AbortSignal.timeout(2500),
        });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.status === 'success') {
            country = geo.country || country;
            city = geo.city || city;
            region = geo.regionName || region;
            if (geo.countryCode) {
              countryCode = geo.countryCode.toUpperCase();
              flag = String.fromCodePoint(...[...countryCode].map((c: string) => 127397 + c.charCodeAt(0)));
            }
          }
        }
      } catch {
        // Keep fallback
      }
    } else if (isLocal) {
      country = 'Local Environment';
      city = 'Kathmandu';
      region = 'Bagmati';
      flag = '🇳🇵';
      countryCode = 'NP';
    }

    await connectToDatabase();

    const timestampDate = new Date();

    // 4. Deduplicate burst hits (within 15 seconds from the same IP & Path)
    const recentDuplicate = await VisitLogModel.findOne({
      ip,
      path: pagePath,
      timestamp: { $gte: new Date(Date.now() - 15000) },
    });

    if (recentDuplicate) {
      if (screenResolution && screenResolution !== 'Unknown' && recentDuplicate.screenResolution === 'Unknown') {
        await VisitLogModel.findByIdAndUpdate(recentDuplicate._id, {
          screenResolution,
          referrer: clientReferrer.slice(0, 200),
          referrerHost,
        });
      }
      return NextResponse.json({ success: true, deduplicated: true });
    }

    // 5. Create Detailed Visit Log in dedicated collection
    await VisitLogModel.create({
      ip,
      country,
      countryCode,
      city,
      region,
      flag,
      path: pagePath,
      referrer: clientReferrer.slice(0, 200),
      referrerHost,
      device: parsedUA.device,
      os: parsedUA.os,
      browser: parsedUA.browser,
      screenResolution,
      language,
      isBot: parsedUA.isBot,
      botName: parsedUA.botName || '',
      userAgent: userAgent.slice(0, 300),
      timestamp: timestampDate,
    });

    // 5. Update Aggregate Overview in AnalyticsModel
    const newRecord: IVisitRecord = {
      ip,
      country,
      city,
      flag,
      path: pagePath,
      userAgent: `${parsedUA.os} • ${parsedUA.browser}`,
      timestamp: timestampDate.toISOString(),
    };

    const previousVisitByIp = await VisitLogModel.findOne({ ip, _id: { $ne: null } }).skip(1);
    const isUnique = !previousVisitByIp;

    const updated = await AnalyticsModel.findOneAndUpdate(
      { key: 'global_analytics' },
      {
        $inc: {
          totalViews: 1,
          uniqueVisitors: isUnique ? 1 : 0,
        },
        $push: {
          visits: {
            $each: [newRecord],
            $position: 0,
            $slice: 100, // Keep last 100 recent visits for lightweight overview
          },
        },
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      totalViews: updated.totalViews,
      uniqueVisitors: updated.uniqueVisitors,
    });
  } catch (error) {
    console.error('MongoDB Analytics track error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
