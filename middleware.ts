import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'portfolio_admin_token';

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.JWT_SECRET || 'portfolio_admin_super_secret_key_2026';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  const expectedToken = Buffer.from(`${password}:${secret}`).toString('base64');
  return token === expectedToken;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Protect /admin pages (allow /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isValidToken(token)) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect API mutation endpoints
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/login')) {
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
    if (isMutation && !isValidToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
