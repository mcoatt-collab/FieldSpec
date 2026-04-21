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
 * Gets a valid userId from the request and verifies it still exists.
 */
export async function getValidatedUserId(request: NextRequest): Promise<string | null> {
  const userId = getUserIdFromRequest(request);

  if (!userId) return null;

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!userExists) {
    console.log("[getValidatedUserId] Stale userId in token:", userId);
    return null;
  }

  return userId;
}
