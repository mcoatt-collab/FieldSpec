import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { jobId } = await params;

    const aiJob = await prisma.aIJob.findFirst({
      where: { id: jobId },
      include: { project: true },
    });

    if (!aiJob || aiJob.project.userId !== userId) {
      return NextResponse.json(
        { error: { message: "Job not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const statusMessages: Record<string, string> = {
      pending: "Preparing analysis...",
      processing: "Processing images...",
      completed: "Report generation complete",
      failed: "Generation failed",
    };

    const progressMessages: Record<string, string> = {
      pending: "Preparing analysis...",
      processing_10: "Analyzing images...",
      processing_30: "Generating captions...",
      processing_60: "Summarizing findings...",
      processing_90: "Finalizing report...",
      completed: "Complete",
      failed: "Failed",
    };

    let progressMessage = progressMessages.pending;
    if (aiJob.status === "processing") {
      if (aiJob.progress >= 90) progressMessage = progressMessages.processing_90;
      else if (aiJob.progress >= 60) progressMessage = progressMessages.processing_60;
      else if (aiJob.progress >= 30) progressMessage = progressMessages.processing_30;
      else progressMessage = progressMessages.processing_10;
    }

    return NextResponse.json(
      {
        data: {
          jobId: aiJob.id,
          status: aiJob.status,
          progress: aiJob.progress,
          progressMessage,
          errorMessage: aiJob.errorMessage || null,
          createdAt: aiJob.createdAt,
          updatedAt: aiJob.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/ai/status/[jobId] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}