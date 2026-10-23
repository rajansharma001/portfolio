import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ExperienceModel, IExperience } from '@/models/Experience';
import { verifyRequestAuth } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/auto-seed';
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-data';

export async function GET() {
  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();

    const experiences = await ExperienceModel.find({}).sort({ period: -1 }).lean();
    return NextResponse.json(experiences && experiences.length > 0 ? experiences : FALLBACK_EXPERIENCES);
  } catch (error) {
    console.warn('MongoDB Experience GET notice, serving fallback experiences:', error);
    return NextResponse.json(FALLBACK_EXPERIENCES, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();

    // Bulk save: the admin Experience page submits the ENTIRE timeline array
    // at once, so replace the whole collection (persists edits, deletions,
    // and reordering) instead of creating a single record.
    if (Array.isArray(body)) {
      const items = body as Array<Partial<IExperience>>;

      const hasInvalidItem = items.some(
        (item) =>
          !item ||
          typeof item.role !== 'string' ||
          item.role.trim() === '' ||
          typeof item.company !== 'string' ||
          item.company.trim() === ''
      );
      if (hasInvalidItem) {
        return NextResponse.json({ error: 'Role and Company are required' }, { status: 400 });
      }

      const docs = (items as IExperience[]).map((item, index) => ({
        id: item.id || `exp_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
        role: item.role,
        company: item.company,
        period: item.period || '2024 — Present',
        location: item.location || 'Nepal',
        description: item.description || '',
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        order: index,
      }));

      await ExperienceModel.deleteMany({});
      const saved = docs.length > 0 ? await ExperienceModel.insertMany(docs) : [];

      return NextResponse.json(saved, { status: 200 });
    }

    const single = body as Partial<IExperience>;

    if (!single.role || !single.company) {
      return NextResponse.json({ error: 'Role and Company are required' }, { status: 400 });
    }

    const newExperience = await ExperienceModel.create({
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: single.role,
      company: single.company,
      period: single.period || '2024 — Present',
      location: single.location || 'Nepal',
      description: single.description || '',
      highlights: Array.isArray(single.highlights) ? single.highlights : [],
    });

    return NextResponse.json(newExperience, { status: 201 });
  } catch (error: any) {
    console.error('MongoDB Experience create error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create experience milestone' }, { status: 500 });
  }
}
