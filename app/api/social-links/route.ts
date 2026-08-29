import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { SocialLink } from '@/lib/types';
import { verifyRequestAuth } from '@/lib/auth';

const FILE_NAME = 'social-links.json';

export async function GET() {
  try {
    const socialLinks = await readJsonData<SocialLink[]>(FILE_NAME);
    return NextResponse.json(socialLinks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const socialLinks = (await req.json()) as SocialLink[];
    await writeJsonData(FILE_NAME, socialLinks);
    return NextResponse.json(socialLinks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update social links' }, { status: 500 });
  }
}
