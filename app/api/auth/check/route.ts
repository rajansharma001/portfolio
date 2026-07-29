import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const isAuthenticated = verifyRequestAuth(req);
  return NextResponse.json({ authenticated: isAuthenticated });
}
