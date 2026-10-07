import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { HabitModel } from '@/models/Planner';
import { calculateHabitStreaks } from '../route';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const habit = await HabitModel.findOne({ id }).lean();
    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });

    const streaks = calculateHabitStreaks(habit.completedDates || []);
    return NextResponse.json({
      ...habit,
      currentStreak: streaks.currentStreak,
      bestStreak: Math.max(streaks.bestStreak, habit.bestStreak || 0),
    });
  } catch (error) {
    console.error('Planner habit GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch habit' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const existing = await HabitModel.findOne({ id });
    if (!existing) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Special handler: toggle a specific date
    if (body.toggleDate) {
      const dateStr = body.toggleDate;
      const currentDates: string[] = existing.completedDates || [];
      let newDates: string[];

      if (currentDates.includes(dateStr)) {
        newDates = currentDates.filter((d) => d !== dateStr);
      } else {
        newDates = [...currentDates, dateStr];
      }

      const streaks = calculateHabitStreaks(newDates);
      existing.completedDates = newDates;
      existing.currentStreak = streaks.currentStreak;
      existing.bestStreak = Math.max(existing.bestStreak || 0, streaks.bestStreak);
      await existing.save();

      return NextResponse.json(existing);
    }

    // Standard updates
    Object.assign(existing, body);
    if (body.completedDates) {
      const streaks = calculateHabitStreaks(body.completedDates);
      existing.currentStreak = streaks.currentStreak;
      existing.bestStreak = Math.max(existing.bestStreak || 0, streaks.bestStreak);
    }

    await existing.save();
    return NextResponse.json(existing);
  } catch (error) {
    console.error('Planner habit PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await HabitModel.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Planner habit DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
  }
}
