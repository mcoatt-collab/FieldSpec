import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: { message: "Project not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const job = await prisma.aIJob.findFirst({
      where: {
        projectId,
        status: { in: ["pending", "processing"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!job) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        data: {
          id: job.id,
          status: job.status,
          progress: job.progress,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/ai/job/:projectId error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}