import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { withRateLimit } from "@/lib/api-wrapper";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientId: z.string().uuid("Invalid client ID").optional().nullable(),
});

export async function GET(request: NextRequest) {
  const rateLimit = await checkRateLimit(request);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
  }

  try {
    const userId = await getValidatedUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized - no user found", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        status: true,
        photoCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
  }

  try {
    const userId = await getValidatedUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized - no user found", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { name, clientId } = result.data;

    let finalClientId: string | undefined = clientId || undefined;

    if (finalClientId) {
      const client = await prisma.client.findFirst({
        where: { id: finalClientId, userId },
      });
      if (!client) {
        return NextResponse.json(
          { error: { message: "Client not found or access denied", code: "NOT_FOUND" } },
          { status: 404 }
        );
      }
    }

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        clientId: finalClientId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("POST projects error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}