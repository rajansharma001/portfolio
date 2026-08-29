import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { createSignedSessionToken, verifySignedSessionToken } from './crypto-token';

export const AUTH_COOKIE_NAME = 'portfolio_admin_token';
const authFile = path.join(process.cwd(), 'data', 'auth.json');

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
 * Retrieves the stored admin password hash & salt.
 */
function getStoredAuth(): { hash: string; salt: string } {
  try {
    if (fs.existsSync(authFile)) {
      const raw = fs.readFileSync(authFile, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}

  // Default initial credentials (admin) securely hashed
  const defaultAuth = hashPassword(process.env.ADMIN_PASSWORD || 'admin');
  try {
    fs.writeFileSync(authFile, JSON.stringify(defaultAuth, null, 2));
  } catch {}
  return defaultAuth;
}

/**
 * Authenticates admin password.
 */
export function authenticateAdmin(password: string): boolean {
  if (typeof password !== 'string' || password.length === 0) {
    return false;
  }

  const { hash, salt } = getStoredAuth();
  return verifyPassword(password, hash, salt);
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
export async function verifyRequestAuthAsync(req: NextRequest): Promise<boolean> {
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const headerToken = req.headers.get('x-admin-token');
  const token = cookieToken || headerToken || undefined;

  return await verifySignedSessionToken(token);
}

/**
 * Synchronous fallback verification for routes.
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
