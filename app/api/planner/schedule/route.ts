import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ScheduleBlockModel } from '@/models/Planner';
import { DEFAULT_SCHEDULE_BLOCKS } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    await connectToDatabase();
    const count = await ScheduleBlockModel.countDocuments();
    if (count === 0) {
      await ScheduleBlockModel.insertMany(DEFAULT_SCHEDULE_BLOCKS);
    }

    const blocks = await ScheduleBlockModel.find().sort({ startTime: 1, order: 1 }).lean();
    return NextResponse.json(blocks);
  } catch (error) {
    console.warn('Planner schedule GET notice, serving default schedule:', error);
    return NextResponse.json(DEFAULT_SCHEDULE_BLOCKS, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: 'Title, start time, and end time are required' },
        { status: 400 }
      );
    }

    const newBlock = {
      id: body.id || `sched-${randomUUID().slice(0, 8)}`,
      title: body.title.trim(),
      startTime: body.startTime,
      endTime: body.endTime,
      type: body.type || 'deep_work',
      description: body.description || '',
      daysOfWeek: Array.isArray(body.daysOfWeek) ? body.daysOfWeek : [0, 1, 2, 3, 4, 5, 6],
      specificDate: body.specificDate || '',
      completedDates: Array.isArray(body.completedDates) ? body.completedDates : [],
      color: body.color || '#6366f1',
      order: Number(body.order) || 0,
    };

    const created = await ScheduleBlockModel.create(newBlock);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Planner schedule POST error:', error);
    return NextResponse.json({ error: 'Failed to create schedule block' }, { status: 500 });
  }
}
