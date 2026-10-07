import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SkillModel } from '@/models/Skill';
import { verifyRequestAuth } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/auto-seed';
import { FALLBACK_SKILLS_MAP } from '@/lib/fallback-data';

export async function GET() {
  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();

    const records = await SkillModel.find({}).lean();

    // Convert array of categories to SkillsMap object: Record<string, string[]>
    const skillsMap: Record<string, string[]> = {};
    records.forEach((r: any) => {
      skillsMap[r.category] = r.skills || [];
    });

    return NextResponse.json(Object.keys(skillsMap).length > 0 ? skillsMap : FALLBACK_SKILLS_MAP);
  } catch (error) {
    console.warn('MongoDB Skills GET notice, serving fallback skills:', error);
    return NextResponse.json(FALLBACK_SKILLS_MAP, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const skillsMap = (await req.json()) as Record<string, string[]>;

    if (!skillsMap || typeof skillsMap !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Replace all skills in collection
    await SkillModel.deleteMany({});

    const docs = Object.entries(skillsMap).map(([category, skills]) => ({
      category,
      skills: Array.isArray(skills) ? skills : [],
    }));

    if (docs.length > 0) {
      await SkillModel.insertMany(docs);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update skills' }, { status: 500 });
  }
}
