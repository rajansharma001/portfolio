import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { checkRateLimit, recordFailedAttempt } from '@/lib/rate-limiter';
import { sanitizeInput, isValidEmail } from '@/lib/security';

const messagesFile = path.join(process.cwd(), 'data', 'messages.json');

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Rate Limiting (max 5 messages per 10 minutes per IP)
    const rateCheck = checkRateLimit(`contact:${ip}`, {
      windowMs: 10 * 60 * 1000,
      maxAttempts: 5,
      lockoutDurationMs: 15 * 60 * 1000,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { name, email, message } = body;

    // Strict input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      recordFailedAttempt(`contact:${ip}`);
      return NextResponse.json({ error: 'Please provide a valid name (2-100 characters).' }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      recordFailedAttempt(`contact:${ip}`);
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 3000) {
      recordFailedAttempt(`contact:${ip}`);
      return NextResponse.json({ error: 'Please provide a message (5-3000 characters).' }, { status: 400 });
    }

    // Sanitize user inputs
    const cleanName = sanitizeInput(name);
    const cleanMessage = sanitizeInput(message);
    const cleanEmail = email.trim().toLowerCase();

    // Create message record
    const newMessage = {
      id: `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      read: false,
      ip: ip.slice(0, 45),
    };

    // Store in data/messages.json
    let messages = [];
    try {
      if (fs.existsSync(messagesFile)) {
        const raw = fs.readFileSync(messagesFile, 'utf-8');
        messages = JSON.parse(raw);
      }
    } catch {
      messages = [];
    }

    messages.unshift(newMessage);
    // Keep max 500 messages
    messages = messages.slice(0, 500);

    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Message delivered successfully.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while sending your message.' }, { status: 500 });
  }
}
