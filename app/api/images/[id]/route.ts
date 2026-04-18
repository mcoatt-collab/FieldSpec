import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";

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

    await prisma.image.delete({ where: { id: imageId } });

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