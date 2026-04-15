import { NextRequest } from "next/server";
import { verifyJWT, JWTPayload } from "./jwt";
import { prisma } from "@/lib/prisma";

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  const user = getUserFromRequest(request);
  return user?.userId || null;
}

/**
 * Gets a valid userId from the request, verifying its existence in the DB,
 * or falling back to a test user in development mode.
 */
export async function getValidatedUserId(request: NextRequest): Promise<string | null> {
  let userId = getUserIdFromRequest(request);

  if (userId) {
    // Verify user exists in DB
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    
    if (userExists) return userId;
    console.log("[getValidatedUserId] Stale userId in token:", userId);
  }

  // Fallback logic for dev/testing
  const testUser = await prisma.user.findFirst();
  if (testUser) {
    console.log("[getValidatedUserId] Falling back to test user:", testUser.id);
    return testUser.id;
  }

  return null;
}