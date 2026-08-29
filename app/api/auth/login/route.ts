import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, authenticateAdminAsync, generateSessionToken } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // 1. Check IP brute-force rate limit (max 5 failed attempts per 15 minutes)
    const rateCheck = checkRateLimit(`login:${ip}`, {
      windowMs: 15 * 60 * 1000,
      maxAttempts: 5,
      lockoutDurationMs: 15 * 60 * 1000,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.password !== 'string') {
      recordFailedAttempt(`login:${ip}`);
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const { password } = body;

    // 2. Constant-time password hash verification against MongoDB
    const isValid = await authenticateAdminAsync(password);

    if (!isValid) {
      recordFailedAttempt(`login:${ip}`);
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // 3. Reset rate limit on success
    resetRateLimit(`login:${ip}`);

    // 4. Create cryptographically signed HMAC session token
    const token = await generateSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
    });

    // 5. Set HttpOnly, SameSite=Lax, Secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 500 });
  }
}
