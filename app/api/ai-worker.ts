import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redisQueue, connectRedis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { generateCaptionWithRetry, calculateConfidenceScore } from "@/lib/ai";
import { cache } from "@/lib/cache";

const AI_JOB_QUEUE = "ai-generation";

interface AIJobData {
  projectId: string;
  userId: string;
  jobId: string;
}

interface ReportImageEntry {
  imageId: string;
  imageUrl: string;
  caption: string;
  finding: string;
  recommendation: string;
  confidenceScore: number;
}

interface ReportSection {
  category: string;
  summary: string;
  recommendations: string;
  images: ReportImageEntry[];
}

interface StructuredReport {
  title: string;
  projectId: string;
  projectName: string;
  projectLocation: string | null;
  generatedAt: string;
  totalImages: number;
  sections: ReportSection[];
}

const CATEGORIES = ["crop_health", "erosion", "damage", "irrigation", "general"];

function generateSectionSummary(category: string, images: ReportImageEntry[]): string {
  if (images.length === 0) return "";

  const findings = images.map(img => img.finding);
  const uniqueFindings = [...new Set(findings)];

  if (uniqueFindings.length === 1) {
    return `${images.length} image(s) showing: ${uniqueFindings[0]}`;
  }

  return `${images.length} image(s) analyzed. Key observations include: ${uniqueFindings.slice(0, 3).join("; ")}${uniqueFindings.length > 3 ? "..." : ""}`;
}

function generateSectionRecommendations(images: ReportImageEntry[]): string {
  const recommendations = images.map(img => img.recommendation).filter(Boolean);
  const unique = [...new Set(recommendations)];

  if (unique.length === 0) return "No specific recommendations available.";
  if (unique.length === 1) return unique[0];

  return unique.slice(0, 3).map((rec, i) => `${i + 1}. ${rec}`).join("\n");
}

async function assembleStructuredReport(projectId: string, projectName: string, projectLocation: string | null): Promise<StructuredReport> {
  const imagesWithOutput = await prisma.image.findMany({
    where: { projectId },
    include: { aiOutput: true },
    orderBy: { category: "asc" },
  });

  const groupedByCategory = new Map<string, ReportImageEntry[]>();

  for (const category of CATEGORIES) {
    groupedByCategory.set(category, []);
  }

  for (const image of imagesWithOutput) {
    const category = image.category || "general";
    if (!groupedByCategory.has(category)) {
      groupedByCategory.set(category, []);
    }

    const entry: ReportImageEntry = {
      imageId: image.id,
      imageUrl: image.url,
      caption: image.aiOutput?.caption || "Caption pending",
      finding: image.aiOutput?.finding || "Analysis pending",
      recommendation: image.aiOutput?.recommendation || "",
      confidenceScore: image.aiOutput?.confidenceScore || 0,
    };

    groupedByCategory.get(category)!.push(entry);
  }

  const sections: ReportSection[] = [];

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

  return {
    title: `${projectName} Analysis Report`,
    projectId,
    projectName,
    projectLocation,
    generatedAt: new Date().toISOString(),
    totalImages: imagesWithOutput.length,
    sections,
  };
}

async function processAIJob(job: Job<AIJobData, void>) {
  const { projectId, jobId } = job.data;
  console.log(`[AI Worker] Processing job ${jobId} for project ${projectId}`);

  try {
    await prisma.aIJob.update({
      where: { id: jobId },
      data: { status: "processing", progress: 0 },
    });

    await job.updateProgress(5);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    console.log(`[AI Worker] Found ${project.images.length} images`);

    await job.updateProgress(10);

    const totalImages = project.images.length;
    let processedCount = 0;
    const BATCH_SIZE = 5;

    for (let i = 0; i < totalImages; i += BATCH_SIZE) {
      const batch = project.images.slice(i, i + BATCH_SIZE);
      console.log(`[AI Worker] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(totalImages / BATCH_SIZE)} (${batch.length} images)`);

      await Promise.all(batch.map(async (image) => {
        const existingAI = await prisma.aIOutput.findUnique({
          where: { imageId: image.id },
        });

        if (existingAI) {
          return;
        }

        const category = image.category || null;
        const userNote = image.notes || null;
        const hasContext = !!project.name;

        const aiResult = await generateCaptionWithRetry({
          category,
          userNote,
          context: `Project: ${project.name}`,
        });

        const confidenceScore = calculateConfidenceScore(category, !!userNote, hasContext);

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
      }));

      processedCount += batch.length;
      const baseProgress = 10;
      const progressRange = 80;
      const currentProgress = baseProgress + Math.floor((processedCount / totalImages) * progressRange);

      await job.updateProgress(currentProgress);
      await prisma.aIJob.update({
        where: { id: jobId },
        data: { progress: currentProgress },
      });
    }

    await job.updateProgress(90);

    const structuredReport = await assembleStructuredReport(
      projectId,
      project.name,
      project.location
    );

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

    await job.updateProgress(100);

    await prisma.aIJob.update({
      where: { id: jobId },
      data: { status: "completed", progress: 100 },
    });

    console.log(`[AI Worker] Job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`[AI Worker] Job ${jobId} failed:`, error);

    await prisma.aIJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });

    throw error;
  }
}

export async function startAIWorker() {
  await connectRedis();
  const worker = new Worker(AI_JOB_QUEUE, processAIJob, {
    connection: redisQueue,
    concurrency: 2,
  });

  worker.on("completed", (job) => {
    console.log(`[AI Worker] Job ${job?.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[AI Worker] Job ${job?.id} failed:`, err?.message);
  });

  console.log("[AI Worker] Started processing AI jobs");
  return worker;
}

// Start the worker when this file is executed directly
startAIWorker().catch(console.error);