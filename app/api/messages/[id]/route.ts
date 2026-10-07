import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MessageModel } from '@/models/Message';
import { verifyRequestAuth } from '@/lib/auth';

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const updateFields: any = {};
    if (typeof body.read === 'boolean') updateFields.read = body.read;
    if (body.status) updateFields.status = body.status;
    if (body.priority) updateFields.priority = body.priority;
    if (typeof body.notes === 'string') updateFields.notes = body.notes;

    // Default if body is empty
    if (Object.keys(updateFields).length === 0) {
      updateFields.read = true;
    }

    const updated = await MessageModel.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Lead message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await MessageModel.findOneAndDelete({
      $or: [{ id }, { _id: id }],
    });

    if (!deleted) {
      return NextResponse.json({ error: 'Lead message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete lead' }, { status: 500 });
  }
}
