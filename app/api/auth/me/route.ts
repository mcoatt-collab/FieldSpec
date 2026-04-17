import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/cache";

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    // Try cache
    const cachedUser = await getCache(userId, "user");
    if (cachedUser) {
      return NextResponse.json({ data: cachedUser, _cached: true }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        createdAt: true,
      },
    });

    if (user) {
      // Cache for 1 hour (3600s)
      await setCache(userId, "user", user, "all", 3600);
    }

    if (!user) {
      return NextResponse.json(
        { error: { message: "User not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
