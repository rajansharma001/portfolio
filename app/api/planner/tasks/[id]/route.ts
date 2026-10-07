import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/models/Planner';
import { pickFields, TASK_FIELDS } from '@/lib/planner-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const task = await TaskModel.findOne({ id }).lean();
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Planner task GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = pickFields(await req.json(), TASK_FIELDS);

    if ('title' in updates && (typeof updates.title !== 'string' || !updates.title.trim())) {
      return NextResponse.json({ error: 'Task title cannot be empty' }, { status: 400 });
    }

    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date().toISOString();
    } else if (updates.status && updates.status !== 'completed') {
      updates.completedAt = '';
    }

    const updated = await TaskModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Planner task PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await TaskModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Planner task DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
