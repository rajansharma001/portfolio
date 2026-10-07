import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NoteModel } from '@/models/Planner';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    const query: any = {};
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await NoteModel.find(query).sort({ pinned: -1, updatedAt: -1 }).lean();
    return NextResponse.json(notes);
  } catch (error) {
    console.warn('Planner notes GET notice, serving empty notes array:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Note title is required' }, { status: 400 });
    }

    const newNote = {
      id: body.id || `note-${randomUUID().slice(0, 8)}`,
      title: body.title.trim(),
      content: body.content || '',
      category: body.category || 'Scratchpad',
      pinned: Boolean(body.pinned),
      color: body.color || 'default',
      tags: Array.isArray(body.tags) ? body.tags : [],
      order: Number(body.order) || 0,
    };

    const created = await NoteModel.create(newNote);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Planner notes POST error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
