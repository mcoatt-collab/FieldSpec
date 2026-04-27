import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  companyName: z.string().optional(),
  reportAuthor: z.string().optional(),
  reportCompany: z.string().optional(),
  reportSubtitle: z.string().optional(),
  includeConfidence: z.boolean().optional(),
  includeImages: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        avatarUrl: true,
        reportAuthor: true,
        reportCompany: true,
        reportSubtitle: true,
        includeConfidenceScores: true,
        includeImagesInExport: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: "User not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    // Map internal names to frontend names if necessary, 
    // or just return as is if frontend expects these names.
    // Based on settings page, it uses user.includeConfidence ?? true
    return NextResponse.json({ 
      data: {
        ...user,
        includeConfidence: user.includeConfidenceScores,
        includeImages: user.includeImagesInExport,
      } 
    }, { status: 200 });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            message: result.error.issues[0].message,
            code: "VALIDATION_ERROR",
          },
        },
        { status: 400 }
      );
    }

    const { 
      name, 
      companyName, 
      reportAuthor, 
      reportCompany, 
      reportSubtitle,
      includeConfidence,
      includeImages
    } = result.data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(companyName !== undefined && { companyName }),
        ...(reportAuthor !== undefined && { reportAuthor }),
        ...(reportCompany !== undefined && { reportCompany }),
        ...(reportSubtitle !== undefined && { reportSubtitle }),
        ...(includeConfidence !== undefined && { includeConfidenceScores: includeConfidence }),
        ...(includeImages !== undefined && { includeImagesInExport: includeImages }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        avatarUrl: true,
        reportAuthor: true,
        reportCompany: true,
        reportSubtitle: true,
        includeConfidenceScores: true,
        includeImagesInExport: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ 
      data: {
        ...updatedUser,
        includeConfidence: updatedUser.includeConfidenceScores,
        includeImages: updatedUser.includeImagesInExport,
      } 
    }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/auth/me error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
