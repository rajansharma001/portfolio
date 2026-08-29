import { Redis } from '@upstash/redis';

// In-Memory Cache Store (Fallback & Local High-Speed L1 Cache)
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

// Initialize Upstash Redis if environment variables are provided
let redisClient: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (e) {
    console.warn('Upstash Redis initialization failed, falling back to in-memory cache:', e);
  }
}

/**
 * Retrieve data from Redis or High-Speed Memory Cache (<1ms)
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const now = Date.now();

  // 1. Check Redis if available
  if (redisClient) {
    try {
      const data = await redisClient.get<T>(key);
      if (data !== null && data !== undefined) {
        return data;
      }
    } catch (e) {
      console.warn(`Redis get error for key ${key}:`, e);
    }
  }

  // 2. Check In-Memory L1 Cache
  const entry = memoryCache.get(key);
  if (entry) {
    if (entry.expiresAt > now) {
      return entry.value as T;
    }
    memoryCache.delete(key);
  }

  return null;
}

/**
 * Store data in Redis & High-Speed Memory Cache
 * Default TTL: 300 seconds (5 minutes)
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
  const now = Date.now();

  // 1. Store in memory cache
  memoryCache.set(key, {
    value,
    expiresAt: now + ttlSeconds * 1000,
  });

  // 2. Store in Redis if available
  if (redisClient) {
    try {
      await redisClient.set(key, value, { ex: ttlSeconds });
    } catch (e) {
      console.warn(`Redis set error for key ${key}:`, e);
    }
  }
}

/**
 * Invalidate cache key or collection prefix on mutations
 */
export async function invalidateCache(key: string): Promise<void> {
  memoryCache.delete(key);

  if (redisClient) {
    try {
      await redisClient.del(key);
    } catch (e) {
      console.warn(`Redis del error for key ${key}:`, e);
    }
  }
}

/**
 * Clear all cache entries
 */
export async function clearAllCache(): Promise<void> {
  memoryCache.clear();
}
