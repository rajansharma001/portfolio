import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { SkillsMap } from '@/lib/types';

const FILE_NAME = 'skills.json';

export async function GET() {
  try {
    const skills = await readJsonData<SkillsMap>(FILE_NAME);
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newSkills = await req.json() as SkillsMap;
    await writeJsonData(FILE_NAME, newSkills);
    return NextResponse.json(newSkills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update skills' }, { status: 500 });
  }
}
