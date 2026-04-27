import { NextRequest, NextResponse } from "next/server";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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
      select: { avatarUrl: true },
    });

    if (!user?.avatarUrl) {
      return NextResponse.json(
        { error: { message: "No avatar to remove", code: "NOT_FOUND" } },
        { status: 400 }
      );
    }

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    // Cleanup from Cloudinary
    if (user.avatarUrl.includes("cloudinary.com")) {
      try {
        const urlParts = user.avatarUrl.split('upload/');
        if (urlParts.length > 1) {
            const pathParts = urlParts[1].split('/');
            pathParts.shift(); // remove version
            const publicId = pathParts.join('/').split('.')[0];
            await deleteCloudinaryAsset(publicId);
        }
      } catch (cleanupError) {
        console.error("Avatar removal cleanup error:", cleanupError);
      }
    }

    return NextResponse.json({ data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("POST /api/auth/avatar/remove error:", error);
    return NextResponse.json(
      { error: { message: "Failed to remove avatar", code: "REMOVE_ERROR" } },
      { status: 500 }
    );
  }
}
