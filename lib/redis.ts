import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

export async function connectRedis() {
  try {
    await redis.connect();
    console.log("[Redis] Connected");
  } catch (error) {
    console.error("[Redis] Connection failed:", error);
  }
}