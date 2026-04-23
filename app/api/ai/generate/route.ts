import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";
import { generateCaptionWithRetry, calculateConfidenceScore } from "@/lib/ai";
import { aiQueue, AI_JOB_QUEUE } from "@/lib/queue";
import { aiLimiter } from "@/lib/security/rate-limit";

const generateSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
});

const CATEGORIES = ["crop_health", "erosion", "damage", "irrigation", "general"];
const LARGE_PROJECT_THRESHOLD = 20;

function generateSectionSummary(category: string, images: any[]): string {
  if (images.length === 0) return "";
  const findings = images.map(img => img.finding);
  const uniqueFindings = [...new Set(findings)];
  if (uniqueFindings.length === 1) {
    return `${images.length} image(s) showing: ${uniqueFindings[0]}`;
  }
  return `${images.length} image(s) analyzed. Key observations include: ${uniqueFindings.slice(0, 3).join("; ")}${uniqueFindings.length > 3 ? "..." : ""}`;
}

function generateSectionRecommendations(images: any[]): string {
  const recommendations = images.map(img => img.recommendation).filter(Boolean);
  const unique = [...new Set(recommendations)];
  if (unique.length === 0) return "No specific recommendations available.";
  if (unique.length === 1) return unique[0];
  return unique.slice(0, 3).map((rec, i) => `${i + 1}. ${rec}`).join("\n");
}

async function processProjectInline(projectId: string, onProgress: (progress: number, message: string) => void) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { images: true },
  });

  if (!project) throw new Error("Project not found");

  const totalImages = project.images.length;
  let processedCount = 0;

  const groupedByCategory = new Map<string, any[]>();
  for (const category of CATEGORIES) {
    groupedByCategory.set(category, []);
  }

  for (const image of project.images) {
    const category = image.category || "general";
    if (!groupedByCategory.has(category)) {
      groupedByCategory.set(category, []);
    }

    const existingAI = await prisma.aIOutput.findUnique({
      where: { imageId: image.id },
    });

    if (existingAI) {
      groupedByCategory.get(category)!.push({
        imageId: image.id,
        imageUrl: image.url,
        caption: existingAI.caption,
        finding: existingAI.finding,
        recommendation: existingAI.recommendation,
        confidenceScore: existingAI.confidenceScore,
      });
      processedCount++;
      const progress = 10 + Math.floor((processedCount / totalImages) * 70);
      onProgress(progress, `Using cached result for image ${processedCount}/${totalImages}`);
      continue;
    }

    onProgress(10 + Math.floor((processedCount / totalImages) * 70), `Analyzing image ${processedCount + 1}/${totalImages}...`);

    const aiResult = await generateCaptionWithRetry({
      category,
      userNote: image.notes || null,
      context: `Project: ${project.name}`,
    });

    const confidenceScore = calculateConfidenceScore(category, !!image.notes, !!project.name);

    await prisma.aIOutput.upsert({
      where: { imageId: image.id },
      create: {
        imageId: image.id,
        caption: aiResult.caption,
        finding: aiResult.finding,
        recommendation: aiResult.recommendation,
        confidenceScore,
        isEdited: false,
      },
      update: {
        caption: aiResult.caption,
        finding: aiResult.finding,
        recommendation: aiResult.recommendation,
        confidenceScore,
        isEdited: false,
      },
    });

    groupedByCategory.get(category)!.push({
      imageId: image.id,
      imageUrl: image.url,
      caption: aiResult.caption,
      finding: aiResult.finding,
      recommendation: aiResult.recommendation,
      confidenceScore,
    });

    processedCount++;
    const progress = 10 + Math.floor((processedCount / totalImages) * 70);
    onProgress(progress, `Processed ${processedCount}/${totalImages} images`);
  }

  onProgress(80, "Assembling report...");

  const sections = [];
  for (const category of CATEGORIES) {
    const categoryImages = groupedByCategory.get(category) || [];
    if (categoryImages.length === 0) continue;
    sections.push({
      category,
      summary: generateSectionSummary(category, categoryImages),
      recommendations: generateSectionRecommendations(categoryImages),
      images: categoryImages,
    });
  }

  const structuredReport = {
    title: `${project.name} Analysis Report`,
    projectId,
    projectName: project.name,
    projectLocation: project.location,
    generatedAt: new Date().toISOString(),
    totalImages: project.images.length,
    sections,
  };

  onProgress(90, "Saving report...");

  const existingReport = await prisma.report.findUnique({
    where: { projectId },
  });

  if (existingReport) {
    await prisma.report.update({
      where: { id: existingReport.id },
      data: {
        title: structuredReport.title,
        content: JSON.stringify(structuredReport),
        status: "completed",
      },
    });
  } else {
    await prisma.report.create({
      data: {
        projectId,
        title: structuredReport.title,
        content: JSON.stringify(structuredReport),
        status: "completed",
      },
    });
  }

  onProgress(100, "Report generated!");
  return structuredReport;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const limit = await aiLimiter(userId);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: { message: "AI generation rate limit exceeded. You can generate up to 5 reports per hour.", code: "RATE_LIMITED" } },
        { status: 429 }
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

    const isLargeProject = project.images.length > LARGE_PROJECT_THRESHOLD;

    if (isLargeProject) {
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
            status: "queued",
            message: `Large project (${project.images.length} images) queued for background processing`,
          },
        },
        { status: 202 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendProgress = (progress: number, message: string) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ progress, message })}\n\n`));
        };

        try {
          sendProgress(0, "Starting report generation...");
          const report = await processProjectInline(projectId, sendProgress);

          sendProgress(100, "Report generated!");
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, report, warnings: { untaggedCount: untaggedImages.length, notesCount: imagesWithNotes.length } })}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Report generation error:", error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : "Generation failed" })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("POST /api/ai/generate error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}