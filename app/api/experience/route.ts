import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ExperienceModel, IExperience } from '@/models/Experience';
import { verifyRequestAuth } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/auto-seed';

export async function GET() {
  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();

    const experiences = await ExperienceModel.find({}).sort({ period: -1 }).lean();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('MongoDB Experience GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = (await req.json()) as Partial<IExperience>;

    if (!body.role || !body.company) {
      return NextResponse.json({ error: 'Role and Company are required' }, { status: 400 });
    }

    const newExperience = await ExperienceModel.create({
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: body.role,
      company: body.company,
      period: body.period || '2024 — Present',
      location: body.location || 'Nepal',
      description: body.description || '',
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
    });

    return NextResponse.json(newExperience, { status: 201 });
  } catch (error: any) {
    console.error('MongoDB Experience create error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create experience milestone' }, { status: 500 });
  }
}
