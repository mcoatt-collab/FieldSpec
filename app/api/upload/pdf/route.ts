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
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: { message: "projectId required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "fieldspec_reports";

    return NextResponse.json({
      data: {
        cloudName,
        uploadPreset,
        folder: `fieldspec/${userId}/reports`,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("POST /api/upload/pdf error:", error);
    return NextResponse.json(
      { error: { message: "Failed to get upload config", code: "UPLOAD_ERROR" } },
      { status: 500 }
    );
  }
}