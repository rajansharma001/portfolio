import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MessageModel } from '@/models/Message';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const messages = await MessageModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(messages);
  } catch (err) {
    console.error('MongoDB Messages GET error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
