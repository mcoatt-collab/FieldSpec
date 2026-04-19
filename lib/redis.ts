import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  connectTimeout: 2000,
  maxRetriesPerRequest: 1,
});

export const redisQueue = new Redis(REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: null,
});

export async function connectRedis() {
  if (redis.status === "ready") return;
  try {
    await redis.connect();
    console.log("[Redis] Connected");
  } catch (error) {
    console.error("[Redis] Connection failed:", error);
  }
}

redis.on("error", (err) => {
  console.error("[Redis] Error:", err);
});

redisQueue.on("error", (err) => {
  console.error("[Redis Queue] Error:", err);
});