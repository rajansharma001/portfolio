import { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'portfolio_admin_token';
const DEFAULT_PASSWORD = 'admin';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

export function generateToken(): string {
  const secret = process.env.JWT_SECRET || 'portfolio_admin_super_secret_key_2026';
  // Standard token hash based on secret and admin password
  const buffer = Buffer.from(`${getAdminPassword()}:${secret}`);
  return buffer.toString('base64');
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === generateToken();
}

export function verifyRequestAuth(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const headerToken = req.headers.get('x-admin-token');
  return isValidToken(cookieToken || headerToken || undefined);
}
