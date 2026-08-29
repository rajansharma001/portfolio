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

  // 3. Apply Security Headers to all responses
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/((?!_next/static|_next/image|favicon.ico|siteicon.png|uploads/).*)'],
};
