import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { PortfolioSettings } from '@/lib/types';

const FILE_NAME = 'settings.json';

export async function GET() {
  try {
    const settings = await readJsonData<PortfolioSettings>(FILE_NAME);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const settings = await req.json() as PortfolioSettings;
    await writeJsonData(FILE_NAME, settings);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
