import { redis, connectRedis } from "@/lib/redis";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Sliding-window rate limiter backed by Redis sorted sets.
 * Falls open (allows request) if Redis is unavailable.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    await connectRedis();
    const key = `${config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.zcard(key);
    pipeline.pexpire(key, config.windowMs);

    const results = await pipeline.exec();
    const requestCount = (results?.[2]?.[1] as number) || 0;

    return {
      allowed: requestCount <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - requestCount),
      retryAfterMs: requestCount > config.maxRequests ? config.windowMs : 0,
    };
  } catch {
    // Fail-open: if Redis is down, allow the request
    return { allowed: true, remaining: config.maxRequests, retryAfterMs: 0 };
  }
}

/** 5 login attempts per minute per IP */
export const authLimiter = (ip: string) =>
  checkRateLimit(ip, { windowMs: 60_000, maxRequests: 5, keyPrefix: "rl:auth" });

/** 3 signup attempts per minute per IP */
export const signupLimiter = (ip: string) =>
  checkRateLimit(ip, { windowMs: 60_000, maxRequests: 3, keyPrefix: "rl:signup" });

/** 5 AI jobs per hour per user */
export const aiLimiter = (userId: string) =>
  checkRateLimit(userId, { windowMs: 3_600_000, maxRequests: 5, keyPrefix: "rl:ai" });
