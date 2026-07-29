import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const analyticsPath = path.join(process.cwd(), 'data', 'analytics.json');

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

function getAnalytics(): AnalyticsData {
  try {
    if (!fs.existsSync(analyticsPath)) {
      const initial: AnalyticsData = { totalViews: 0, uniqueVisitors: 0, visits: [] };
      fs.writeFileSync(analyticsPath, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(analyticsPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { totalViews: 0, uniqueVisitors: 0, visits: [] };
  }
}

function saveAnalytics(data: AnalyticsData) {
  try {
    fs.writeFileSync(analyticsPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving analytics:', e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const pagePath = body.path || '/';

    // Get IP address from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    let country = 'Nepal';
    let city = 'Kathmandu';
    let flag = '🇳🇵';

    // Lookup geo data for public IPs
    if (ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,countryCode`, {
          signal: AbortSignal.timeout(2000)
        });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.status === 'success') {
            country = geo.country || country;
            city = geo.city || city;
            if (geo.countryCode) {
              const code = geo.countryCode.toUpperCase();
              flag = String.fromCodePoint(...[...code].map(c => 127397 + c.charCodeAt(0)));
            }
          }
        }
      } catch (e) {
        // Fallback geo
      }
    }

    const analytics = getAnalytics();
    
    // Check if unique IP
    const isUnique = !analytics.visits.some(v => v.ip === ip);
    
    const newRecord: VisitRecord = {
      ip,
      country,
      city,
      flag,
      path: pagePath,
      userAgent: userAgent.slice(0, 100),
      timestamp: new Date().toISOString()
    };

    analytics.totalViews += 1;
    if (isUnique) {
      analytics.uniqueVisitors += 1;
    }
    
    // Store last 100 visits
    analytics.visits = [newRecord, ...analytics.visits].slice(0, 100);
    
    saveAnalytics(analytics);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  const analytics = getAnalytics();
  return NextResponse.json(analytics);
}
