import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = process.env.NODE_ENV === "production" ? 100 : 1000;

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(request: NextRequest): Promise<RateLimitResult> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
              request.headers.get("x-real-ip") ||
              "anonymous";
  
  const key = `ratelimit:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - RATE_LIMIT_WINDOW;

  try {
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.zcard(key);
    pipeline.expire(key, RATE_LIMIT_WINDOW);
    
    const results = await pipeline.exec();
    const requestCount = results?.[2]?.[1] as number || 0;

    const success = requestCount < RATE_LIMIT_MAX;
    const remaining = Math.max(0, RATE_LIMIT_MAX - requestCount - 1);

    return {
      success,
      limit: RATE_LIMIT_MAX,
      remaining,
      reset: now + RATE_LIMIT_WINDOW,
    };
  } catch (error) {
    console.error("[RateLimit] Redis error:", error);
    return {
      success: true,
      limit: RATE_LIMIT_MAX,
      remaining: RATE_LIMIT_MAX,
      reset: now + RATE_LIMIT_WINDOW,
    };
  }
}

export function rateLimitResponse(limit: number, remaining: number, reset: number): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: reset - Math.floor(Date.now() / 1000),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Retry-After": Math.ceil((reset * 1000 - Date.now()) / 1000).toString(),
      },
    }
  );
}
