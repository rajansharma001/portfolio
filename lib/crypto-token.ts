/**
 * Edge-compatible and Node.js-compatible Cryptographic Token Utilities
 * Uses standard Web Crypto API (crypto.subtle) available in both Edge Runtime and Node.js.
 */

const DEFAULT_SECRET = 'portfolio_admin_super_secure_jwt_secret_key_2026_999';

function getSecretKey(): string {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
}

// Convert string to Uint8Array BufferSource
function strToBuf(str: string): BufferSource {
  return new TextEncoder().encode(str) as unknown as BufferSource;
}

// Convert ArrayBuffer to Hex string
function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generates an HMAC-SHA256 signature for data string using Web Crypto API.
 */
async function generateHmacSha256(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    strToBuf(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, strToBuf(data));
  return bufToHex(signature);
}

/**
 * Creates a cryptographically signed session token with timestamp and random entropy.
 * Format: `${timestamp}.${random}.${signature}`
 */
export async function createSignedSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  // Generate 16 bytes random hex using Web Crypto
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const payload = `${timestamp}.${randomHex}`;
  const secret = getSecretKey();
  const signature = await generateHmacSha256(payload, secret);

  return `${payload}.${signature}`;
}

/**
 * Verifies a signed session token.
 * Checks HMAC signature and token expiration (7 days TTL).
 */
export async function verifySignedSessionToken(token: string | undefined): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestampStr, randomHex, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;

  // Check TTL (7 days)
  const now = Date.now();
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (now < timestamp || now - timestamp > maxAgeMs) {
    return false;
  }

  // Verify HMAC signature
  const payload = `${timestampStr}.${randomHex}`;
  const secret = getSecretKey();
  const expectedSig = await generateHmacSha256(payload, secret);

  if (signature.length !== expectedSig.length) return false;

  // Constant time comparison
  let match = 0;
  for (let i = 0; i < signature.length; i++) {
    match |= signature.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }

  return match === 0;
}
