import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NoteModel } from '@/models/Planner';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const note = await NoteModel.findOne({ id }).lean();
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json(note);
  } catch (error) {
    console.error('Planner note GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = await req.json();

    const updated = await NoteModel.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Planner note PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await NoteModel.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error('Planner note DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
