import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { aiQueue, AI_JOB_QUEUE } from "@/lib/queue";

const generateSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
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
    const result = generateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { projectId } = result.data;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: { images: { select: { id: true, category: true, notes: true } } },
    });

    if (!project) {
      return NextResponse.json(
        { error: { message: "Project not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    if (project.images.length === 0) {
      return NextResponse.json(
        { error: { message: "Project has no images to analyze", code: "NO_IMAGES" } },
        { status: 400 }
      );
    }

    const existingJob = await prisma.aIJob.findFirst({
      where: {
        projectId,
        status: { in: ["pending", "processing"] },
      },
    });

    if (existingJob) {
      return NextResponse.json(
        { error: { message: "A job is already running for this project", code: "JOB_IN_PROGRESS" } },
        { status: 400 }
      );
    }

    const untaggedImages = project.images.filter(img => !img.category || img.category === "general");
    const imagesWithNotes = project.images.filter(img => img.notes);

    const aiJob = await prisma.aIJob.create({
      data: {
        projectId,
        type: "full_report",
        status: "pending",
        progress: 0,
      },
    });

    await aiQueue.add(
      AI_JOB_QUEUE,
      {
        projectId: project.id,
        userId,
        jobId: aiJob.id,
      },
      {
        jobId: aiJob.id,
      }
    );

    return NextResponse.json(
      {
        data: {
          jobId: aiJob.id,
          status: aiJob.status,
          progress: aiJob.progress,
          warnings: {
            untaggedCount: untaggedImages.length,
            notesCount: imagesWithNotes.length,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/ai/generate error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}