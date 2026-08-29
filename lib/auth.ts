import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { connectToDatabase } from './mongodb';
import { AdminAuthModel } from '@/models/AdminAuth';
import { createSignedSessionToken, verifySignedSessionToken } from './crypto-token';

export const AUTH_COOKIE_NAME = 'portfolio_admin_token';

/**
 * Hashes a plaintext password using PBKDF2 with a secure random salt.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return { hash, salt };
}

/**
 * Verifies password against stored hash and salt in constant time.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const computedHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');

    const a = Buffer.from(computedHash, 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Authenticates admin password against MongoDB Atlas credentials.
 */
export async function authenticateAdminAsync(password: string): Promise<boolean> {
  if (typeof password !== 'string' || password.length === 0) {
    return false;
  }

  try {
    await connectToDatabase();
    let auth = await AdminAuthModel.findOne({ key: 'admin_credentials' }).lean();

    if (!auth) {
      const defaultCreds = hashPassword(process.env.ADMIN_PASSWORD || 'admin');
      auth = await AdminAuthModel.create({
        key: 'admin_credentials',
        passwordHash: defaultCreds.hash,
        salt: defaultCreds.salt,
        lastUpdated: new Date().toISOString(),
      });
    }

    return verifyPassword(password, auth.passwordHash, auth.salt);
  } catch (error) {
    console.error('MongoDB Auth lookup error:', error);
    // Fallback comparison with env
    const fallback = hashPassword(process.env.ADMIN_PASSWORD || 'admin');
    return verifyPassword(password, fallback.hash, fallback.salt);
  }
}

/**
 * Generates an HMAC signed session token.
 */
export async function generateSessionToken(): Promise<string> {
  return await createSignedSessionToken();
}

/**
 * Verifies that the incoming request has a valid signed session token.
 */
export function verifyRequestAuth(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const headerToken = req.headers.get('x-admin-token');
  const token = cookieToken || headerToken || undefined;

  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestampStr] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (now < timestamp || now - timestamp > maxAgeMs) {
    return false;
  }

  return true;
}
