import { redis, connectRedis } from "./redis";

const DEFAULT_TTL = 60;
const CACHE_TIMEOUT = 2000;

let redisConnected = false;
let redisFailed = false;

async function ensureRedis() {
  if (redisFailed) return false;
  if (redisConnected) return true;
  try {
    await connectRedis();
    redisConnected = true;
    return true;
  } catch (error) {
    console.error("[Cache] Redis connection failed:", error);
    redisFailed = true;
    return false;
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result as T | null;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (redisFailed) return null;
    try {
      const connected = await ensureRedis();
      if (!connected) return null;
      
      const data = await withTimeout(redis.get(key), CACHE_TIMEOUT);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("[Cache] Get error:", error);
      redisFailed = true;
      return null;
    }
  },

  async set(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
    if (redisFailed) return;
    try {
      const connected = await ensureRedis();
      if (!connected) return;
      await withTimeout(redis.set(key, JSON.stringify(value), "EX", ttl), CACHE_TIMEOUT);
    } catch (error) {
      console.error("[Cache] Set error:", error);
    }
  },

  async delete(key: string): Promise<void> {
    if (redisFailed) return;
    try {
      const connected = await ensureRedis();
      if (!connected) return;
      await withTimeout(redis.del(key), CACHE_TIMEOUT);
    } catch (error) {
      console.error("[Cache] Delete error:", error);
    }
  },

  async deletePattern(pattern: string): Promise<void> {
    if (redisFailed) return;
    try {
      const connected = await ensureRedis();
      if (!connected) return;
      const keys = await withTimeout(redis.keys(pattern), CACHE_TIMEOUT);
      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error("[Cache] DeletePattern error:", error);
    }
  },

  buildKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(":")}`;
  },
};

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL
): Promise<T> {
  try {
    const cached = await cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
  } catch (error) {
    console.warn("[Cache] Failed to get from cache");
  }
  
  const data = await fetcher();
  if (data) {
    try {
      await cache.set(key, data, ttl);
    } catch (error) {
      console.warn("[Cache] Failed to set cache");
    }
  }
  return data;
}