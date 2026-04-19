import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { aiQueue } from "@/lib/queue";

const ACTIVE_JOB_STATUSES = ["pending", "processing"] as const;

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
        { error: { message: "projectId is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: { message: "Project not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    await prisma.aIJob.deleteMany({
      where: {
        projectId,
        status: { in: ACTIVE_JOB_STATUSES as unknown as string[] },
      },
    });

    const jobs = await aiQueue.getJobs(["active", "pending", "delayed"] as any);
    for (const job of jobs) {
      if (job.data.projectId === projectId) {
        await job.remove();
      }
    }

    return NextResponse.json({ data: { message: "Job cancelled" } }, { status: 200 });
  } catch (error) {
    console.error("POST /api/ai/cancel error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}