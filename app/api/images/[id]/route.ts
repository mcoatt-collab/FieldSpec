import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { cache } from "@/lib/cache";

const updateImageSchema = z.object({
  category: z.string().optional(),
  notes: z.string().max(500).optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { id: imageId } = await params;

    const body = await request.json();
    const result = updateImageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const image = await prisma.image.findFirst({
      where: { id: imageId },
      include: { project: true },
    });

    if (!image || image.project.userId !== userId) {
      return NextResponse.json(
        { error: { message: "Image not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const { category, notes, gpsLat, gpsLng } = result.data;

    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: {
        ...(category !== undefined && { category }),
        ...(notes !== undefined && { notes }),
        ...(gpsLat !== undefined && { gpsLat }),
        ...(gpsLng !== undefined && { gpsLng }),
      },
      select: {
        id: true,
        url: true,
        thumbnailUrl: true,
        category: true,
        notes: true,
        gpsLat: true,
        gpsLng: true,
        createdAt: true,
      },
    });

    // Invalidate project and image cache
    await cache.delete(cache.buildKey("images", image.projectId || "all", userId));

    return NextResponse.json({ data: updatedImage }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/images/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { id: imageId } = await params;

    const image = await prisma.image.findFirst({
      where: { id: imageId },
      include: { project: true },
    });

    if (!image || image.project.userId !== userId) {
      return NextResponse.json(
        { error: { message: "Image not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const projectId = image.projectId;

    // Use a transaction to ensure both deletion and count update happen together
    await prisma.$transaction([
      prisma.image.delete({ where: { id: imageId } }),
      prisma.project.update({
        where: { id: projectId },
        data: { photoCount: { decrement: 1 } },
      }),
    ]);

    // Invalidate cache for projects and images
    await cache.delete(cache.buildKey("projects", userId));
    await cache.delete(cache.buildKey("images", projectId || "all", userId));

    return NextResponse.json({ data: { deleted: true } }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/images/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { id: imageId } = await params;

    const image = await prisma.image.findFirst({
      where: { id: imageId },
      include: { project: true },
    });

    if (!image || image.project.userId !== userId) {
      return NextResponse.json(
        { error: { message: "Image not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: image }, { status: 200 });
  } catch (error) {
    console.error("GET /api/images/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}