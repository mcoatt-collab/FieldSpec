import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = body.projectId;

    if (!projectId) {
      return NextResponse.json({ error: { message: "projectId required" } }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { projectId },
      include: { project: true },
    });

    if (!report) {
      return NextResponse.json({ error: { message: "Report not found" } }, { status: 404 });
    }

    let content: any;
    try {
      content = typeof report.content === "string" ? JSON.parse(report.content) : report.content;
    } catch {
      content = null;
    }

    if (!content) {
      return NextResponse.json({ error: { message: "Report content is invalid" } }, { status: 400 });
    }

    const sections = content.sections || [];
    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ error: { message: "No sections in report" } }, { status: 400 });
    }

    const formatCategory = (cat: string) => {
      const labels: Record<string, string> = {
        crop_health: "Crop Health",
        erosion: "Erosion",
        damage: "Damage",
        irrigation: "Irrigation",
        general: "General Observations",
      };
      return labels[cat] || cat;
    };

    const generateSectionHtml = (section: any) => {
      const imagesHtml = section.images?.map((img: any) => `
        <div class="image-entry">
          <img src="${img.imageUrl}" alt="Report image" style="max-width: 300px; max-height: 200px;" />
          <p><strong>Caption:</strong> ${img.caption || "N/A"}</p>
          <p><strong>Finding:</strong> ${img.finding || "N/A"}</p>
          <p><strong>Recommendation:</strong> ${img.recommendation || "N/A"}</p>
          <p><strong>Confidence:</strong> ${Math.round(img.confidenceScore * 100)}%</p>
        </div>
      `).join("") || "";

      return `
        <div class="section">
          <h2>${formatCategory(section.category)}</h2>
          <p><strong>Summary:</strong> ${section.summary || "N/A"}</p>
          <p><strong>Recommendations:</strong></p>
          <pre style="white-space: pre-wrap;">${section.recommendations || "N/A"}</pre>
          <div class="images">${imagesHtml}</div>
        </div>
      `;
    };

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; border-bottom: 2px solid #666; padding-bottom: 10px; }
    .meta { color: #666; margin-bottom: 30px; }
    .section { margin-bottom: 40px; padding: 20px; background: #f9f9f9; border-radius: 8px; }
    .section h2 { color: #444; margin-top: 0; }
    .image-entry { margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #ddd; }
    .image-entry img { border-radius: 4px; }
    pre { background: #f0f0f0; padding: 10px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>${content.title}</h1>
  <div class="meta">
    <p><strong>Project:</strong> ${content.projectName}</p>
    <p><strong>Location:</strong> ${content.projectLocation || "N/A"}</p>
    <p><strong>Generated:</strong> ${new Date(content.generatedAt).toLocaleString()}</p>
    <p><strong>Total Images:</strong> ${content.totalImages}</p>
  </div>
  <h2>Report Sections (${sections.length})</h2>
  ${sections.map(generateSectionHtml).join("")}
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Internal error" } },
      { status: 500 }
    );
  }
}