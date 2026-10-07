import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { HabitModel } from '@/models/Planner';
import { pickFields, HABIT_FIELDS } from '@/lib/planner-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = pickFields(await req.json(), HABIT_FIELDS);

    if ('title' in updates && (typeof updates.title !== 'string' || !updates.title.trim())) {
      return NextResponse.json({ error: 'Habit title cannot be empty' }, { status: 400 });
    }

    const updated = await HabitModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Planner habit PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await HabitModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Planner habit DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
  }
}
