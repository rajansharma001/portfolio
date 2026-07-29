import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { ExperienceItem } from '@/lib/types';

const FILE_NAME = 'experience.json';

export async function GET() {
  try {
    const experience = await readJsonData<ExperienceItem[]>(FILE_NAME);
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as ExperienceItem[];
    await writeJsonData(FILE_NAME, data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}
