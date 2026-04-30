import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";
type ActiveJobWithProject = {
  id: string;
  projectId: string;
  status: string;
  progress: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  project: {
    name: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const activeJobs = await prisma.aIJob.findMany({
      where: {
        project: {
          userId: userId,
        },
        status: { in: ["pending", "processing"] },
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedJobs = activeJobs.map((job: ActiveJobWithProject) => ({
      id: job.id,
      projectName: job.project.name,
      type: "full_report", // AIJob in schema doesn't seem to have a type, defaulting to full_report
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
    }));

    return NextResponse.json({ data: formattedJobs }, { status: 200 });
  } catch (error) {
    console.error("GET /api/ai/active-jobs error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
