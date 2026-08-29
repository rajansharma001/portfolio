import { NextResponse, type NextRequest } from 'next/server';
import { verifySignedSessionToken } from './lib/crypto-token';

const AUTH_COOKIE_NAME = 'portfolio_admin_token';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.headers.get('x-admin-token') || undefined;

  // 1. Protect Admin Pages (allow /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const isValid = await verifySignedSessionToken(token);
    if (!isValid) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Admin Mutation Endpoints (except public login, contact, & analytics)
  if (
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/auth/login') &&
    !pathname.startsWith('/api/contact') &&
    !pathname.startsWith('/api/analytics/track')
  ) {
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
    const isProtectedGet = pathname.startsWith('/api/messages');

    if (isMutation || isProtectedGet) {
      const isValid = await verifySignedSessionToken(token);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Unauthorized: Valid admin session required' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
