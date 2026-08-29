interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number;
}

const rateLimitMap: Map<string, RateLimitRecord> = new Map();

// Clean up stale IP records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.lockedUntil < now && now - record.firstAttempt > 60 * 60 * 1000) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitOptions {
  windowMs: number;
  maxAttempts: number;
  lockoutDurationMs: number;
}

/**
 * Checks and updates rate limits for a given identifier (e.g. client IP + route).
 * Returns true if allowed, false if blocked.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 mins window
    maxAttempts: 5,           // max 5 failed attempts
    lockoutDurationMs: 15 * 60 * 1000, // 15 mins cooldown
  }
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record) {
    record = { count: 0, firstAttempt: now, lockedUntil: 0 };
    rateLimitMap.set(key, record);
  }

  // Check if currently locked out
  if (record.lockedUntil > now) {
    const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  // Reset window if expired
  if (now - record.firstAttempt > options.windowMs) {
    record.count = 0;
    record.firstAttempt = now;
  }

  return { allowed: true };
}

/**
 * Records a failed attempt for the identifier and triggers lockout if maxAttempts reached.
 */
export function recordFailedAttempt(
  key: string,
  options: RateLimitOptions = {
    windowMs: 15 * 60 * 1000,
    maxAttempts: 5,
    lockoutDurationMs: 15 * 60 * 1000,
  }
): void {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record) {
    record = { count: 1, firstAttempt: now, lockedUntil: 0 };
    rateLimitMap.set(key, record);
  } else {
    record.count += 1;
  }

  if (record.count >= options.maxAttempts) {
    // Progressive lockout: standard lockout + extra per attempt above limit
    const multiplier = Math.min(record.count - options.maxAttempts + 1, 5);
    record.lockedUntil = now + options.lockoutDurationMs * multiplier;
  }
}

/**
 * Resets rate limit upon successful action.
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}
