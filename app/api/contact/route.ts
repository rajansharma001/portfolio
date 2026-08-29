import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { MessageModel } from '@/models/Message';
import { checkRateLimit, recordFailedAttempt } from '@/lib/rate-limiter';
import { sanitizeInput, isValidEmail } from '@/lib/security';

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

    const { name, email, message, website_url, captchaAnswer, captchaToken } = body;

    // Honeypot check
    if (website_url) {
      return NextResponse.json({ success: true, message: 'Message delivered successfully.' });
    }

    if (!captchaAnswer || !captchaToken) {
      return NextResponse.json({ error: 'Missing CAPTCHA.' }, { status: 400 });
    }

    const { verifyCaptcha } = await import('@/app/api/captcha/route');
    const isValidCaptcha = verifyCaptcha(captchaToken, captchaAnswer);

    if (!isValidCaptcha) {
      return NextResponse.json({ error: 'Invalid CAPTCHA.' }, { status: 400 });
    }

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
    const cleanEmail = sanitizeInput(email).toLowerCase();

    await connectToDatabase();

    await MessageModel.create({
      id: `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      read: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Message delivered successfully.',
    });
  } catch (error) {
    console.error('MongoDB Contact error:', error);
    return NextResponse.json({ error: 'An error occurred while sending your message.' }, { status: 500 });
  }
}
