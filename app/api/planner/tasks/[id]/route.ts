import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/models/Planner';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const task = await TaskModel.findOne({ id }).lean();
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Planner task GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = await req.json();

    // If status is updated to completed, record completedAt timestamp
    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date().toISOString();
    } else if (updates.status && updates.status !== 'completed') {
      updates.completedAt = '';
    }

    const updatedTask = await TaskModel.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Planner task PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await TaskModel.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Planner task DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
