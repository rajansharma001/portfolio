import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { HabitModel } from '@/models/Planner';
import { DEFAULT_HABITS } from '@/lib/types';
import { randomUUID } from 'crypto';

// Streaks are computed on the client using the device's local date.
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const includeArchived = new URL(req.url).searchParams.get('archived') === 'true';

    if ((await HabitModel.countDocuments()) === 0) {
      await HabitModel.insertMany(DEFAULT_HABITS);
    }

    const habits = await HabitModel.find(includeArchived ? {} : { archived: false })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Planner habits GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !String(body.title).trim()) {
      return NextResponse.json({ error: 'Habit title is required' }, { status: 400 });
    }

    const created = await HabitModel.create({
      id: `habit-${randomUUID().slice(0, 8)}`,
      title: String(body.title).trim(),
      emoji: body.emoji || '🎯',
      category: body.category || 'General',
      targetDaysPerWeek: Math.min(7, Math.max(1, Number(body.targetDaysPerWeek) || 7)),
      timeOfDay: body.timeOfDay || 'anytime',
      completedDates: [],
      archived: false,
      order: Number(body.order) || Date.now(),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Planner habits POST error:', error);
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}
