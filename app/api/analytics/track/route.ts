import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AnalyticsModel, IVisitRecord } from '@/models/Analytics';

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

    // 1. Resolve real client IP
    const cfIp = req.headers.get('cf-connecting-ip');
    const realIp = req.headers.get('x-real-ip');
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = (cfIp || realIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1')).trim();

    const userAgent = req.headers.get('user-agent') || 'Browser Visitor';

    let country = 'Nepal';
    let city = 'Kathmandu';
    let flag = '🇳🇵';

    // 2. Lookup Geo for public IPs
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');

    if (!isLocal) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,countryCode`, {
          signal: AbortSignal.timeout(2500),
        });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.status === 'success') {
            country = geo.country || country;
            city = geo.city || city;
            if (geo.countryCode) {
              const code = geo.countryCode.toUpperCase();
              flag = String.fromCodePoint(...[...code].map((c: string) => 127397 + c.charCodeAt(0)));
            }
          }
        }
      } catch {
        // Fallback geo remains Nepal
      }
    } else {
      country = 'Local / Nepal';
      city = 'Kathmandu';
      flag = '🇳🇵';
    }

    await connectToDatabase();

    const newRecord: IVisitRecord = {
      ip,
      country,
      city,
      flag,
      path: pagePath,
      userAgent: userAgent.slice(0, 120),
      timestamp: new Date().toISOString(),
    };

    // Atomic update in MongoDB
    const analytics = await AnalyticsModel.findOne({ key: 'global_analytics' });
    const isUnique = !analytics || !(analytics.visits || []).some((v: IVisitRecord) => v.ip === ip);

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
            $slice: 100, // Keep last 100 visits
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
