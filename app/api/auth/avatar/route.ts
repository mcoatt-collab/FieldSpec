import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { uploadBufferToCloudinary, deleteCloudinaryAsset } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB
const AVATAR_SIZE = 400;

export async function POST(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { message: "Image file is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".heic", ".heif"];
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = file.type && file.type.startsWith("image/");
    
    if (!hasValidMimeType && !hasAllowedExtension) {
      return NextResponse.json(
        { error: { message: "Only image uploads are supported", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    if (file.size > MAX_AVATAR_BYTES) {
      return NextResponse.json(
        { error: { message: "Image must be 5MB or smaller", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // Get current user to check for old avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    
    let processedBuffer: Buffer;
    
    // Process image: square crop and resize
    try {
      processedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize(AVATAR_SIZE, AVATAR_SIZE, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch (sharpError) {
      console.error("Sharp processing error:", sharpError);
      return NextResponse.json(
        { error: { message: "Failed to process HEIC image. Please convert to JPEG first.", code: "PROCESSING_ERROR" } },
        { status: 400 }
      );
    }

    const folder = `fieldspec/${userId}/profile`;
    const publicId = `avatar-${Date.now()}`;

    const uploadedAsset = await uploadBufferToCloudinary(processedBuffer, {
      folder,
      publicId,
      format: "jpg",
    });

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: uploadedAsset.secureUrl },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    // Cleanup old avatar if it exists and is a Cloudinary URL
    if (user?.avatarUrl && user.avatarUrl.includes("cloudinary.com")) {
      try {
        // Extract publicId from URL
        const parts = user.avatarUrl.split("/");
        const lastPart = parts[parts.length - 1];
        const publicIdWithExt = lastPart.split(".")[0];
        // The publicId in our case is prefix + folder + filename
        // But deleteCloudinaryAsset expects the full path after the cloud name/version
        // Actually uploadBufferToCloudinary returns the full publicId
        // Let's assume the publicId is folder/filename
        const oldPublicId = `${folder}/${user.avatarUrl.split('/').pop()?.split('.')[0]}`;
        // Wait, the folder might be different if we change logic. 
        // Safer way: we don't store publicId in DB, so we have to parse it.
        // For simplicity in this task, we'll try to parse it from the URL.
        const urlParts = user.avatarUrl.split('upload/');
        if (urlParts.length > 1) {
            const pathParts = urlParts[1].split('/');
            pathParts.shift(); // remove version (v12345678)
            const oldPublicIdParsed = pathParts.join('/').split('.')[0];
            await deleteCloudinaryAsset(oldPublicIdParsed);
        }
      } catch (cleanupError) {
        console.error("Old avatar cleanup error:", cleanupError);
      }
    }

    return NextResponse.json({ data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("POST /api/auth/avatar error:", error);
    return NextResponse.json(
      { error: { message: "Failed to upload avatar", code: "UPLOAD_ERROR" } },
      { status: 500 }
    );
  }
}
