import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";

const reportImageEntrySchema = z.object({
  imageId: z.string(),
  imageUrl: z.string(),
  caption: z.string(),
  finding: z.string(),
  recommendation: z.string(),
  confidenceScore: z.number().min(0).max(1),
});

const reportSectionSchema = z.object({
  category: z.string(),
  summary: z.string(),
  recommendations: z.string(),
  images: z.array(reportImageEntrySchema),
});

const updateReportSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.object({
    title: z.string(),
    projectId: z.string(),
    projectName: z.string(),
    projectLocation: z.string().nullable(),
    generatedAt: z.string(),
    totalImages: z.number(),
    sections: z.array(reportSectionSchema),
  }),
});

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

    const report = await prisma.report.findUnique({
      where: { projectId },
    });

    if (!report) {
      return NextResponse.json(
        { error: { message: "Report not found. Run AI generation first.", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(report.content);
    } catch {
      parsedContent = { raw: report.content };
    }

    return NextResponse.json(
      {
        data: {
          id: report.id,
          title: report.title,
          status: report.status,
          content: parsedContent,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/reports/[projectId] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const existingReport = await prisma.report.findUnique({
      where: { projectId },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: { message: "Report not found. Run AI generation first.", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateReportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { title, content } = result.data;

    const updatedReport = await prisma.report.update({
      where: { id: existingReport.id },
      data: {
        title: title || existingReport.title,
        content: JSON.stringify(content),
        status: "completed",
      },
    });

    return NextResponse.json(
      {
        data: {
          id: updatedReport.id,
          title: updatedReport.title,
          status: updatedReport.status,
          content: JSON.parse(updatedReport.content),
          createdAt: updatedReport.createdAt,
          updatedAt: updatedReport.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/reports/[projectId] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
