import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { HabitModel } from '@/models/Planner';
import { DEFAULT_HABITS } from '@/lib/types';
import { randomUUID } from 'crypto';

export function calculateHabitStreaks(dates: string[]): { currentStreak: number; bestStreak: number } {
  if (!Array.isArray(dates) || dates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Sort dates descending
  const uniqueSorted = Array.from(new Set(dates)).sort().reverse();
  const dateSet = new Set(uniqueSorted);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Current streak calculation: starts from today or yesterday
  let currentStreak = 0;
  let checkDate = dateSet.has(todayStr) ? new Date(now) : dateSet.has(yesterdayStr) ? new Date(yesterday) : null;

  if (checkDate) {
    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (dateSet.has(checkStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Best streak calculation: consecutive days in all recorded history
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  // Sort ascending for best streak
  const ascDates = [...uniqueSorted].reverse();
  for (const dStr of ascDates) {
    const cur = new Date(dStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((cur.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    prevDate = cur;
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const includeArchived = url.searchParams.get('archived') === 'true';

    const count = await HabitModel.countDocuments();
    if (count === 0) {
      await HabitModel.insertMany(DEFAULT_HABITS);
    }

    const query = includeArchived ? {} : { archived: false };
    const rawHabits = await HabitModel.find(query).sort({ order: 1, createdAt: -1 }).lean();

    const habits = rawHabits.map((h: any) => {
      const streaks = calculateHabitStreaks(h.completedDates || []);
      return {
        ...h,
        currentStreak: streaks.currentStreak,
        bestStreak: Math.max(streaks.bestStreak, h.bestStreak || 0),
      };
    });

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

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Habit title is required' }, { status: 400 });
    }

    const newHabit = {
      id: body.id || `habit-${randomUUID().slice(0, 8)}`,
      title: body.title.trim(),
      emoji: body.emoji || '🎯',
      category: body.category || 'Engineering',
      targetDaysPerWeek: Number(body.targetDaysPerWeek) || 7,
      timeOfDay: body.timeOfDay || 'anytime',
      completedDates: Array.isArray(body.completedDates) ? body.completedDates : [],
      currentStreak: 0,
      bestStreak: 0,
      archived: false,
      order: Number(body.order) || 0,
    };

    const created = await HabitModel.create(newHabit);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Planner habits POST error:', error);
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}
