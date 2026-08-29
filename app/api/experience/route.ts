import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ExperienceModel, IExperience } from '@/models/Experience';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const items = await ExperienceModel.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(items);
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
    const items = (await req.json()) as IExperience[];

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    await ExperienceModel.deleteMany({});

    const docsWithOrder = items.map((item, index) => ({
      id: item.id || `exp_${Date.now()}_${index}`,
      role: item.role,
      company: item.company,
      period: item.period,
      location: item.location,
      description: item.description || '',
      highlights: Array.isArray(item.highlights) ? item.highlights : [],
      order: index + 1,
    }));

    if (docsWithOrder.length > 0) {
      await ExperienceModel.insertMany(docsWithOrder);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update experience' }, { status: 500 });
  }
}
