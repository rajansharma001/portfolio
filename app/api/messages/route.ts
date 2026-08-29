import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyRequestAuth } from '@/lib/auth';

const messagesFile = path.join(process.cwd(), 'data', 'messages.json');

export async function GET(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!fs.existsSync(messagesFile)) {
      return NextResponse.json([]);
    }
    const raw = fs.readFileSync(messagesFile, 'utf-8');
    const messages = JSON.parse(raw);
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
