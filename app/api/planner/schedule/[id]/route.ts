import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ScheduleBlockModel } from '@/models/Planner';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const block = await ScheduleBlockModel.findOne({ id }).lean();
    if (!block) return NextResponse.json({ error: 'Schedule block not found' }, { status: 404 });
    return NextResponse.json(block);
  } catch (error) {
    console.error('Planner schedule GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule block' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const existing = await ScheduleBlockModel.findOne({ id });
    if (!existing) {
      return NextResponse.json({ error: 'Schedule block not found' }, { status: 404 });
    }

    // Toggle completed date
    if (body.toggleDate) {
      const dateStr = body.toggleDate;
      const currentDates: string[] = existing.completedDates || [];
      if (currentDates.includes(dateStr)) {
        existing.completedDates = currentDates.filter((d) => d !== dateStr);
      } else {
        existing.completedDates = [...currentDates, dateStr];
      }
      await existing.save();
      return NextResponse.json(existing);
    }

    Object.assign(existing, body);
    await existing.save();
    return NextResponse.json(existing);
  } catch (error) {
    console.error('Planner schedule PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update schedule block' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await ScheduleBlockModel.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json({ error: 'Schedule block not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Schedule block deleted' });
  } catch (error) {
    console.error('Planner schedule DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete schedule block' }, { status: 500 });
  }
}
