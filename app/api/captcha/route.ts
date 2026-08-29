import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

const CAPTCHA_SECRET = process.env.AUTH_SECRET || 'fallback_captcha_secret_2026';

/**
 * Helper to verify captcha internally (can be imported by other routes)
 */
export function verifyCaptcha(token: string, answer: string): boolean {
  try {
    if (!token || !answer) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const [timestampStr, expectedAnswer, signature] = parts;
    
    // Check TTL (e.g. 5 minutes)
    const timestamp = parseInt(timestampStr, 10);
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      return false; // Expired
    }
    
    // Verify HMAC
    const payload = `${timestampStr}.${expectedAnswer}`;
    const expectedSig = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payload).digest('hex');
    
    if (signature !== expectedSig) return false;
    
    // Check answer
    return answer.trim() === expectedAnswer;
  } catch {
    return false;
  }
}

/**
 * GET: Generate a new Math CAPTCHA
 */
export async function GET() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = Math.random() > 0.5 ? '+' : '*';
  
  const question = `What is ${num1} ${operator} ${num2}?`;
  const answer = operator === '+' ? (num1 + num2).toString() : (num1 * num2).toString();
  
  const timestamp = Date.now().toString();
  const payload = `${timestamp}.${answer}`;
  const signature = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payload).digest('hex');
  
  const token = `${payload}.${signature}`;
  
  return NextResponse.json({ question, token }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}

/**
 * POST: Verify a CAPTCHA (for client-side or subagent validation)
 */
export async function POST(req: NextRequest) {
  try {
    const { token, answer } = await req.json();
    const isValid = verifyCaptcha(token, answer);
    return NextResponse.json({ success: isValid });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
