import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';

const FILE_NAME = 'analytics.json';

export interface VisitRecord {
  ip: string;
  country: string;
  city: string;
  flag: string;
  path: string;
  userAgent: string;
  timestamp: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  visits: VisitRecord[];
}

export async function GET() {
  try {
    const data = await readJsonData<AnalyticsData>(FILE_NAME);
    return NextResponse.json(data || { totalViews: 0, uniqueVisitors: 0, visits: [] });
  } catch {
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

    // 3. Thread-safe atomic read & update
    let analytics: AnalyticsData;
    try {
      analytics = await readJsonData<AnalyticsData>(FILE_NAME);
      if (!analytics || typeof analytics.totalViews !== 'number') {
        analytics = { totalViews: 0, uniqueVisitors: 0, visits: [] };
      }
    } catch {
      analytics = { totalViews: 0, uniqueVisitors: 0, visits: [] };
    }

    const isUnique = !analytics.visits.some((v) => v.ip === ip);

    const newRecord: VisitRecord = {
      ip,
      country,
      city,
      flag,
      path: pagePath,
      userAgent: userAgent.slice(0, 120),
      timestamp: new Date().toISOString(),
    };

    analytics.totalViews += 1;
    if (isUnique) {
      analytics.uniqueVisitors += 1;
    }

    // Keep last 100 visits
    analytics.visits = [newRecord, ...(analytics.visits || [])].slice(0, 100);

    await writeJsonData(FILE_NAME, analytics);

    return NextResponse.json({ success: true, totalViews: analytics.totalViews, uniqueVisitors: analytics.uniqueVisitors });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
