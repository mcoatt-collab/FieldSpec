import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

import { getValidatedUserId } from "@/lib/auth/get-user";
import { cache } from "@/lib/cache";
import { deleteCloudinaryAsset, uploadBufferToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2560;
const THUMBNAIL_SIZE = 480;

function sanitizeBaseName(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
}

export async function POST(request: NextRequest) {
  const uploadedAssetIds: string[] = [];

  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const projectId = formData.get("projectId");
    const file = formData.get("file");

    if (typeof projectId !== "string" || !projectId) {
      return NextResponse.json(
        { error: { message: "Project is required", code: "VALIDATION_ERROR" } },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { message: "Image file is required", code: "VALIDATION_ERROR" } },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: { message: "Only image uploads are supported", code: "VALIDATION_ERROR" } },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: { message: "Image must be 15MB or smaller", code: "VALIDATION_ERROR" } },
        { status: 400 },
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: { message: "Project not found", code: "NOT_FOUND" } },
        { status: 404 },
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const baseName = sanitizeBaseName(file.name);
    const assetIdBase = `${Date.now()}-${baseName}`;
    const folder = `fieldspec/${userId}/projects/${projectId}`;

    const optimizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    const thumbnailBuffer = await sharp(inputBuffer)
      .rotate()
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: "cover",
        position: "attention",
      })
      .webp({ quality: 72 })
      .toBuffer();

    const [uploadedImage, uploadedThumbnail] = await Promise.all([
      uploadBufferToCloudinary(optimizedBuffer, {
        folder,
        publicId: assetIdBase,
        format: "jpg",
      }),
      uploadBufferToCloudinary(thumbnailBuffer, {
        folder,
        publicId: `${assetIdBase}-thumb`,
        format: "webp",
      }),
    ]);

    uploadedAssetIds.push(uploadedImage.publicId, uploadedThumbnail.publicId);

    const createdImage = await prisma.$transaction(async (tx) => {
      const image = await tx.image.create({
        data: {
          projectId,
          url: uploadedImage.secureUrl,
          thumbnailUrl: uploadedThumbnail.secureUrl,
          category: "general",
        },
        select: {
          id: true,
          url: true,
          thumbnailUrl: true,
          category: true,
          notes: true,
          createdAt: true,
        },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { photoCount: { increment: 1 } },
      });

      return image;
    });

    await cache.delete(cache.buildKey("projects", userId));
    await cache.delete(cache.buildKey("images", projectId, userId));

    return NextResponse.json({ data: createdImage }, { status: 201 });
  } catch (error) {
    await Promise.all(
      uploadedAssetIds.map(async (assetId) => {
        try {
          await deleteCloudinaryAsset(assetId);
        } catch (cleanupError) {
          console.error("Cloudinary cleanup error:", cleanupError);
        }
      }),
    );

    console.error("POST /api/upload/image error:", error);
    return NextResponse.json(
      { error: { message: "Failed to upload image", code: "UPLOAD_ERROR" } },
      { status: 500 },
    );
  }
}
