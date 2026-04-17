import { NextRequest, NextResponse } from "next/server";
import { getValidatedUserId } from "@/lib/auth/get-user";

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
    const { filename, fileType } = body;

    if (!filename || !fileType) {
      return NextResponse.json(
        { error: { message: "Filename and file type required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Missing Cloudinary configuration: CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET");
      return NextResponse.json(
        { error: { message: "Cloudinary is not fully configured on the server.", code: "CONFIG_ERROR" } },
        { status: 500 }
      );
    }

    const folder = `fieldspec/${userId}`;

    return NextResponse.json({
      data: {
        cloudName,
        uploadPreset,
        folder,
      },
    });
  } catch (error) {
    console.error("Upload config error:", error);
    return NextResponse.json(
      { error: { message: "Failed to get upload config", code: "UPLOAD_ERROR" } },
      { status: 500 }
    );
  }
}