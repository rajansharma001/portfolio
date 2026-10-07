import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/models/Planner';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await TaskModel.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(tasks);
  } catch (error) {
    console.warn('Planner tasks GET notice, serving empty tasks array:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const newTask = {
      id: body.id || `task-${randomUUID().slice(0, 8)}`,
      title: body.title.trim(),
      description: body.description || '',
      priority: body.priority || 'medium',
      status: body.status || 'todo',
      category: body.category || 'Engineering',
      dueDate: body.dueDate || '',
      dueTime: body.dueTime || '',
      subtasks: Array.isArray(body.subtasks) ? body.subtasks : [],
      estimatedMinutes: Number(body.estimatedMinutes) || 0,
      actualMinutes: Number(body.actualMinutes) || 0,
      recurring: body.recurring || 'none',
      completedDates: [],
      order: Number(body.order) || 0,
    };

    const created = await TaskModel.create(newTask);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Planner tasks POST error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
