import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import exifReader from "exif-reader";

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

async function extractGPSCoordinates(buffer: Buffer): Promise<{ gpsLat: number; gpsLng: number } | null> {
  try {
    // Use sharp to extract metadata (includes EXIF) without loading full image
    const { exif } = await sharp(buffer).metadata();
    
    if (!exif) {
      console.log("No EXIF data found in image");
      return null;
    }

    const tags = exifReader(Buffer.from(exif));
    
    if (!tags?.GPSInfo) {
      console.log("No GPSInfo in EXIF");
      return null;
    }

    const gps = tags.GPSInfo;

    // GPSLatitude and GPSLongitude are typically arrays: [degrees, minutes, seconds]
    // GPSLatitudeRef: "N" or "S", GPSLongitudeRef: "E" or "W"
    if (!gps.GPSLatitude || !gps.GPSLongitude) {
      console.log("Missing GPSLatitude or GPSLongitude");
      return null;
    }

    const lat = convertDMSToDecimal(gps.GPSLatitude, gps.GPSLatitudeRef);
    const lng = convertDMSToDecimal(gps.GPSLongitude, gps.GPSLongitudeRef);

    if (lat === null || lng === null) {
      console.log("Failed to convert GPS coordinates");
      return null;
    }

    // Validate coordinates are within valid ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.log("GPS coordinates out of range", { lat, lng });
      return null;
    }

    console.log("Extracted GPS:", { lat, lng });
    return { gpsLat: lat, gpsLng: lng };
  } catch (error) {
    console.error("GPS extraction error:", error);
    return null;
  }
}

function convertDMSToDecimal(
  dms: number[],
  ref?: string,
): number | null {
  if (!dms || dms.length < 3) return null;

  let decimal = dms[0] + dms[1] / 60 + dms[2] / 3600;

  // Apply reference direction (S and W are negative)
  if (ref === "S" || ref === "W") {
    decimal = decimal * -1;
  }

  return decimal;
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

    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
    
    const fileName = file.name.toLowerCase();
    const hasAllowedMime = ALLOWED_MIME_TYPES.includes(file.type);
    const hasAllowedExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    
    if (!hasAllowedMime && !hasAllowedExtension) {
      return NextResponse.json(
        { error: { message: "Only JPG, PNG, WEBP, HEIC, and HEIF images are supported", code: "VALIDATION_ERROR" } },
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
    const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif");

    // Extract GPS coordinates BEFORE Sharp processing (strips EXIF)
    // Note: May fail for HEIC/HEIF if Sharp doesn't have libvips support
    let gpsCoords: { gpsLat: number; gpsLng: number } | null = null;
    try {
      gpsCoords = await extractGPSCoordinates(inputBuffer);
    } catch (gpsError) {
      console.log("GPS extraction failed, continuing without GPS:", gpsError);
    }

    // Convert HEIC/HEIF to JPEG if needed (Sharp may not support HEIC natively)
    let processingBuffer: Buffer = inputBuffer;
    if (isHeic) {
      try {
        const converted = await sharp(inputBuffer)
          .jpeg({ quality: 90 })
          .toBuffer();
        processingBuffer = converted;
        console.log("Converted HEIC/HEIF to JPEG for processing, buffer size:", processingBuffer.length);
      } catch (heicError) {
        console.error("HEIC conversion error:", heicError);
        return NextResponse.json(
          { error: { message: "Failed to process HEIC/HEIF image. Please convert to JPEG first.", code: "PROCESSING_ERROR" } },
          { status: 400 }
        );
      }
    }

    console.log("About to create optimized buffer...");
    let optimizedBuffer: Buffer;
    try {
      optimizedBuffer = await sharp(processingBuffer)
        .rotate()
        .resize({
          width: MAX_IMAGE_DIMENSION,
          height: MAX_IMAGE_DIMENSION,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      console.log("Optimized image buffer created, size:", optimizedBuffer.length);
    } catch (sharpError: any) {
      console.error("Sharp optimization error:", sharpError?.message);
      return NextResponse.json(
        { error: { message: "Failed to optimize image: " + (sharpError?.message || "unknown error"), code: "PROCESSING_ERROR" } },
        { status: 400 }
      );
    }

    console.log("About to create thumbnail buffer...");
    let thumbnailBuffer: Buffer;
    try {
      thumbnailBuffer = await sharp(processingBuffer)
        .rotate()
        .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
          fit: "cover",
          position: "attention",
        })
        .webp({ quality: 72 })
        .toBuffer();
      console.log("Thumbnail buffer created, size:", thumbnailBuffer.length);
    } catch (sharpError: any) {
      console.error("Sharp thumbnail error:", sharpError?.message);
      return NextResponse.json(
        { error: { message: "Failed to create thumbnail: " + (sharpError?.message || "unknown error"), code: "PROCESSING_ERROR" } },
        { status: 400 }
      );
    }

    console.log("About to upload to Cloudinary...");
    let uploadedImage: { publicId: string; secureUrl: string };
    let uploadedThumbnail: { publicId: string; secureUrl: string };
    try {
      [uploadedImage, uploadedThumbnail] = await Promise.all([
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
      console.log("Uploaded to Cloudinary successfully");
    } catch (cloudinaryError: any) {
      console.error("Cloudinary upload error:", cloudinaryError?.message);
      return NextResponse.json(
        { error: { message: "Failed to upload image to storage: " + (cloudinaryError?.message || "unknown error"), code: "UPLOAD_ERROR" } },
        { status: 400 }
      );
    }

    uploadedAssetIds.push(uploadedImage.publicId, uploadedThumbnail.publicId);

    const createdImage = await prisma.$transaction(async (tx) => {
      const image = await tx.image.create({
        data: {
          projectId,
          url: uploadedImage.secureUrl,
          thumbnailUrl: uploadedThumbnail.secureUrl,
          category: "general",
          gpsLat: gpsCoords?.gpsLat ?? null,
          gpsLng: gpsCoords?.gpsLng ?? null,
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

      await tx.project.update({
        where: { id: projectId },
        data: { photoCount: { increment: 1 } },
      });

      return image;
    });

    await cache.delete(cache.buildKey("projects", userId));
    await cache.delete(cache.buildKey("images", projectId, userId));

    return NextResponse.json({ data: createdImage }, { status: 201 });
    } catch (error: any) {
    await Promise.all(
      uploadedAssetIds.map(async (assetId) => {
        try {
          await deleteCloudinaryAsset(assetId);
        } catch (cleanupError) {
          console.error("Cloudinary cleanup error:", cleanupError);
        }
      }),
    );

    console.error("POST /api/upload/image error:", error?.message, error?.stack);
    return NextResponse.json(
      { error: { message: error?.message || "Failed to upload image", code: "UPLOAD_ERROR" } },
      { status: 500 },
    );
  }
}
