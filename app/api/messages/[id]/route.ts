import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyRequestAuth } from '@/lib/auth';

const messagesFile = path.join(process.cwd(), 'data', 'messages.json');

function getMessages() {
  try {
    if (fs.existsSync(messagesFile)) {
      return JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    }
  } catch {}
  return [];
}

function saveMessages(messages: any[]) {
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const messages = getMessages();
  const index = messages.findIndex((m: any) => m.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  messages[index].read = true;
  saveMessages(messages);

  return NextResponse.json({ success: true, message: messages[index] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const messages = getMessages();
  const filtered = messages.filter((m: any) => m.id !== id);

  saveMessages(filtered);

  return NextResponse.json({ success: true });
}
