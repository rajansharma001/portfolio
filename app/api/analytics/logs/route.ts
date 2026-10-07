import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { VisitLogModel } from '@/models/Analytics';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(5, parseInt(url.searchParams.get('limit') || '25', 10)));
    const search = (url.searchParams.get('search') || '').trim();
    const country = url.searchParams.get('country');
    const device = url.searchParams.get('device');
    const browser = url.searchParams.get('browser');
    const path = url.searchParams.get('path');
    const isBot = url.searchParams.get('isBot');
    const range = url.searchParams.get('range') || 'all'; // 'today', '7d', '30d', 'all'
    const format = url.searchParams.get('format'); // 'csv' or null

    const query: any = {};

    // 1. Date Range Filter
    const now = new Date();
    if (range === 'today') {
      query.timestamp = { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) };
    } else if (range === '7d') {
      query.timestamp = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    } else if (range === '30d') {
      query.timestamp = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    }

    // 2. Exact match filters
    if (country && country !== 'all') query.country = country;
    if (device && device !== 'all') query.device = device;
    if (browser && browser !== 'all') query.browser = new RegExp(browser, 'i');
    if (path && path !== 'all') query.path = path;
    if (isBot === 'true') query.isBot = true;
    else if (isBot === 'false') query.isBot = false;

    // 3. Search query (regex across IP, Country, City, Path, Referrer, UserAgent)
    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { ip: searchRegex },
        { country: searchRegex },
        { city: searchRegex },
        { path: searchRegex },
        { referrer: searchRegex },
        { userAgent: searchRegex },
        { os: searchRegex },
        { browser: searchRegex },
      ];
    }

    // Handle CSV Export
    if (format === 'csv') {
      const exportLogs = await VisitLogModel.find(query).sort({ timestamp: -1 }).limit(1000).lean();

      const headers = ['Timestamp', 'IP', 'Country', 'City', 'Region', 'Path', 'Referrer', 'Device', 'OS', 'Browser', 'Screen', 'Language', 'IsBot'];
      const rows = exportLogs.map((log: any) => [
        `"${new Date(log.timestamp).toISOString()}"`,
        `"${log.ip}"`,
        `"${log.country}"`,
        `"${log.city}"`,
        `"${log.region || ''}"`,
        `"${log.path}"`,
        `"${log.referrer || 'Direct'}"`,
        `"${log.device}"`,
        `"${log.os}"`,
        `"${log.browser}"`,
        `"${log.screenResolution || ''}"`,
        `"${log.language || ''}"`,
        `"${log.isBot ? 'Yes' : 'No'}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="portfolio_visitors_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Pagination query
    const skip = (page - 1) * limit;
    const [logs, totalCount, countryList, pathList] = await Promise.all([
      VisitLogModel.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      VisitLogModel.countDocuments(query),
      VisitLogModel.distinct('country'),
      VisitLogModel.distinct('path'),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      availableFilters: {
        countries: countryList.filter(Boolean).sort(),
        paths: pathList.filter(Boolean).sort(),
      },
    });
  } catch (error) {
    console.error('Analytics logs query error:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor logs' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const pruneBots = url.searchParams.get('pruneBots');

    if (id) {
      await VisitLogModel.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Log deleted' });
    }

    if (pruneBots === 'true') {
      const res = await VisitLogModel.deleteMany({ isBot: true });
      return NextResponse.json({ success: true, deletedCount: res.deletedCount });
    }

    return NextResponse.json({ error: 'Missing log ID or action' }, { status: 400 });
  } catch (error) {
    console.error('Analytics log delete error:', error);
    return NextResponse.json({ error: 'Failed to delete logs' }, { status: 500 });
  }
}
