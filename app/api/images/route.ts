import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { cache, withCache } from "@/lib/cache";

const createImageSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  imageUrl: z.string().url("Invalid image URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createImageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { projectId, imageUrl, thumbnailUrl } = result.data;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: { message: "Project not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const image = await prisma.image.create({
      data: {
        projectId,
        url: imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        category: "general",
      },
      select: {
        id: true,
        url: true,
        thumbnailUrl: true,
        category: true,
        createdAt: true,
      },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { photoCount: { increment: 1 } },
    });

    await cache.delete(cache.buildKey("projects", userId));
    await cache.delete(cache.buildKey("images", projectId || "all", userId));

    return NextResponse.json({ data: image }, { status: 201 });
  } catch (error) {
    console.error("POST images error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const cacheKey = cache.buildKey("images", `${projectId || "all"}_${userId}_${limit}_${offset}`);

    const data = await withCache(cacheKey, async () => {
      const where: any = {
        project: { userId },
      };

      if (projectId) {
        where.projectId = projectId;
      }

      const [images, total] = await Promise.all([
        prisma.image.findMany({
          where,
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
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.image.count({ where }),
      ]);
      return { images, total };
    }, 30);

    return NextResponse.json({ 
      data: data.images,
      meta: {
        total: data.total,
        limit,
        offset,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("GET images error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}