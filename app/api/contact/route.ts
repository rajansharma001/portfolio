import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { MessageModel } from '@/models/Message';
import { checkRateLimit, recordFailedAttempt } from '@/lib/rate-limiter';
import { sanitizeInput, isValidEmail } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const cfIp = req.headers.get('cf-connecting-ip');
    const realIp = req.headers.get('x-real-ip');
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = (cfIp || realIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1')).trim();

    // Rate Limiting (max 6 messages per 10 minutes per IP)
    const rateCheck = checkRateLimit(`contact:${ip}`, {
      windowMs: 10 * 60 * 1000,
      maxAttempts: 6,
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

    const { name, email, message, inquiryType, timeline, website_url, captchaAnswer, captchaToken } = body;

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
      return NextResponse.json({ error: 'Invalid CAPTCHA answer.' }, { status: 400 });
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
    const cleanInquiryType = inquiryType ? sanitizeInput(inquiryType).slice(0, 60) : 'General Inquiry';
    const cleanTimeline = timeline ? sanitizeInput(timeline).slice(0, 60) : 'Flexible';

    // Resolve Geolocation
    let country = req.headers.get('x-vercel-ip-country-name') || 'Nepal';
    let countryCode = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || 'NP';
    let flag = '🇳🇵';

    if (countryCode && countryCode.length === 2 && countryCode !== 'XX') {
      flag = String.fromCodePoint(...[...countryCode.toUpperCase()].map((c: string) => 127397 + c.charCodeAt(0)));
    }

    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
    if (isLocal) {
      country = 'Local / Direct';
      flag = '🇳🇵';
    }

    await connectToDatabase();

    const newLead = await MessageModel.create({
      id: `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      inquiryType: cleanInquiryType,
      timeline: cleanTimeline,
      status: 'new',
      priority: 'normal',
      notes: '',
      ip,
      country,
      flag,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Message delivered successfully.',
      leadId: newLead.id,
    });
  } catch (error) {
    console.error('MongoDB Contact lead error:', error);
    return NextResponse.json({ error: 'An error occurred while delivering your inquiry.' }, { status: 500 });
  }
}
