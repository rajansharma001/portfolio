import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NoteModel } from '@/models/Planner';
import { pickFields, NOTE_FIELDS } from '@/lib/planner-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = pickFields(await req.json(), NOTE_FIELDS);
    if ('title' in updates && (typeof updates.title !== 'string' || !updates.title.trim())) {
      updates.title = 'Untitled';
    }

    const updated = await NoteModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Planner note PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await NoteModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Planner note DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
