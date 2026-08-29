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

    const updated = await MessageModel.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: { read: true } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update message' }, { status: 500 });
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
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete message' }, { status: 500 });
  }
}
