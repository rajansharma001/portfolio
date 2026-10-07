import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ScheduleBlockModel } from '@/models/Planner';
import { pickFields, BLOCK_FIELDS } from '@/lib/planner-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const updates = pickFields(await req.json(), BLOCK_FIELDS);

    if ('title' in updates && (typeof updates.title !== 'string' || !updates.title.trim())) {
      return NextResponse.json({ error: 'Block title cannot be empty' }, { status: 400 });
    }

    const updated = await ScheduleBlockModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Schedule block not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Planner schedule PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update schedule block' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await ScheduleBlockModel.findOneAndDelete({ id });
    if (!deleted) return NextResponse.json({ error: 'Schedule block not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Planner schedule DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete schedule block' }, { status: 500 });
  }
}
