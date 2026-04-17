import { redis } from "./redis";

const DEFAULT_TTL = 300; // 5 minutes in seconds

export type CacheType = "projects" | "images" | "user";

/**
 * Generates a consistent, namespaced cache key for a specific user and resource.
 */
function getCacheKey(userId: string, type: CacheType, id: string = "all"): string {
  return `fs:cache:user:${userId}:${type}:${id}`;
}

/**
 * Gets data from the cache.
 */
export async function getCache<T>(
  userId: string,
  type: CacheType,
  id: string = "all"
): Promise<T | null> {
  try {
    const key = getCacheKey(userId, type, id);
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      console.log(`[Cache] HIT: ${key}`);
      return JSON.parse(cachedData) as T;
    }
    
    console.log(`[Cache] MISS: ${key}`);
    return null;
  } catch (error) {
    console.warn(`[Cache] Error getting key:`, error);
    return null;
  }
}

/**
 * Sets data in the cache with a TTL.
 */
export async function setCache<T>(
  userId: string,
  type: CacheType,
  data: T,
  id: string = "all",
  ttl: number = DEFAULT_TTL
): Promise<void> {
  try {
    const key = getCacheKey(userId, type, id);
    await redis.set(key, JSON.stringify(data), "EX", ttl);
    // console.log(`[Cache] SET: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    console.warn(`[Cache] Error setting key:`, error);
  }
}

/**
 * Invalidates (deletes) a specific cache key.
 */
export async function invalidateCache(
  userId: string,
  type: CacheType,
  id: string = "all"
): Promise<void> {
  try {
    const key = getCacheKey(userId, type, id);
    await redis.del(key);
    console.log(`[Cache] INVALIDATE: ${key}`);
  } catch (error) {
    console.warn(`[Cache] Error invalidating key:`, error);
  }
}

/**
 * Invalidates all cache entries for a specific resource type for a user using patterns.
 * Note: Use sparingly in production as KEYS/SCAN can be slow on large datasets, 
 * but fine for this scale.
 */
export async function invalidateResourceCache(
  userId: string,
  type: CacheType
): Promise<void> {
  try {
    const pattern = `fs:cache:user:${userId}:${type}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] INVALIDATE TYPE: ${type} for user ${userId} (${keys.length} keys)`);
    }
  } catch (error) {
    console.warn(`[Cache] Error in mass invalidation:`, error);
  }
}
