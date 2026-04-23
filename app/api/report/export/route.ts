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

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
      padding: 0; 
      background: #ffffff;
      color: #1a1a1a;
      font-size: 10pt;
      line-height: 1.4;
    }
    .page { padding: 35pt 40pt; }
    
    /* Typography Hierarchy */
    .report-title {
      font-size: 22pt;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: -0.5px;
    }
    .report-subtitle {
      font-size: 11pt;
      font-weight: 400;
      color: #666666;
      margin-top: 4pt;
    }
    .section-heading {
      font-size: 13pt;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8pt;
      padding-bottom: 6pt;
      border-bottom: 1.5pt solid #e0e0e0;
    }
    .subsection-heading {
      font-size: 10pt;
      font-weight: 600;
      color: #555555;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      margin-bottom: 4pt;
    }
    .body-text {
      font-size: 10pt;
      font-weight: 400;
      color: #333333;
      line-height: 1.5;
    }
    .caption-text {
      font-size: 8pt;
      font-weight: 400;
      color: #666666;
    }
    .label-text {
      font-size: 7.5pt;
      font-weight: 600;
      color: #888888;
      text-transform: uppercase;
      letter-spacing: 0.3pt;
    }
    
    /* Header */
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 25pt;
      padding-bottom: 15pt;
      border-bottom: 3pt solid #1e3a5f;
    }
    .header-left { }
    .header-right { text-align: right; }
    .header-right .date { 
      font-size: 9pt;
      color: #666666;
    }
    .header-right .brand { 
      font-size: 12pt;
      font-weight: 700;
      color: #1e3a5f;
      margin-top: 4pt;
    }
    
    /* Metadata Grid */
    .meta-grid { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 12pt; 
      margin-bottom: 20pt;
      background: #f5f5f5;
      padding: 15pt;
      border-radius: 6pt;
      border: 1pt solid #e8e8e8;
    }
    .meta-item { }
    .meta-item .label { 
      font-size: 7.5pt;
      font-weight: 600;
      color: #888888;
      text-transform: uppercase;
      letter-spacing: 0.3pt;
    }
    .meta-item .value { 
      font-size: 10pt;
      font-weight: 600;
      color: #1a1a1a;
      margin-top: 2pt;
    }
    
    /* Sections */
    .section { 
      margin-bottom: 18pt; 
      padding: 15pt; 
      background: #ffffff;
      border: 1pt solid #e0e0e0;
      border-radius: 6pt;
      border-left: 3pt solid #1e3a5f;
      page-break-inside: avoid;
    }
    .section.crop_health { border-left-color: #22c55e; }
    .section.erosion { border-left-color: #8b5cf6; }
    .section.damage { border-left-color: #ef4444; }
    .section.irrigation { border-left-color: #3b82f6; }
    .section.general { border-left-color: #6b7280; }
    
    .section h2 { 
      font-size: 12pt; 
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10pt;
    }
    .section.crop_health h2 { color: #22c55e; }
    .section.erosion h2 { color: #8b5cf6; }
    .section.damage h2 { color: #ef4444; }
    .section.irrigation h2 { color: #3b82f6; }
    .section.general h2 { color: #6b7280; }
    
    .summary-box, .recommendations-box { 
      margin-bottom: 10pt;
    }
    .summary-box .value, .recommendations-box .value { 
      font-size: 9.5pt;
      color: #333333;
    }
    .recommendations-box pre { 
      white-space: pre-wrap; 
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 9pt;
      background: #f8f8f8;
      padding: 10pt;
      border-radius: 4pt;
      border: 1pt solid #e8e8e8;
      line-height: 1.5;
    }
    
    /* Images Section */
    .images-section { margin-top: 12pt; }
    .images-section h3 { 
      font-size: 9pt;
      font-weight: 600;
      color: #666666;
      margin-bottom: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.3pt;
    }
    .images { display: flex; flex-direction: column; gap: 10pt; }
    .image-entry { 
      padding: 10pt; 
      background: #f8f8f8;
      border: 1pt solid #e8e8e8;
      border-radius: 4pt;
      page-break-inside: avoid;
    }
    .image-row { display: flex; gap: 10pt; align-items: flex-start; }
    .image-entry img { 
      width: 90pt; 
      height: 70pt;
      object-fit: cover; 
      border-radius: 3pt; 
      border: 1pt solid #e0e0e0;
    }
    .image-info { flex: 1; }
    .image-info p { margin-bottom: 4pt; font-size: 8.5pt; }
    .image-info p.caption { font-weight: 600; color: #1a1a1a; }
    .image-info p.finding { color: #444444; }
    .image-info p.recommendation { color: #666666; }
    .image-info .label { 
      color: #888888; 
      font-weight: 600;
      margin-right: 3pt;
      font-size: 7.5pt;
      text-transform: uppercase;
    }
    .confidence-row { display: flex; align-items: center; gap: 6pt; margin-top: 4pt; }
    .confidence-badge { 
      padding: 2pt 6pt;
      border-radius: 8pt;
      font-size: 8pt;
      font-weight: 700;
    }
    
    /* Footer */
    .footer { 
      margin-top: 25pt;
      padding-top: 12pt;
      border-top: 1.5pt solid #e0e0e0;
      text-align: center;
      color: #888888;
      font-size: 8pt;
    }
    .footer .brand { color: #1e3a5f; font-weight: 600; }
    
    /* Avoid page breaks inside elements */
    h1, h2, h3, .image-entry, .section { page-break-inside: avoid; }
    img { page-break-inside: avoid; }
    
    @media print { 
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <h1 class="report-title">FieldSpec Analysis Report</h1>
        <p class="report-subtitle">${content.title}</p>
      </div>
      <div class="header-right">
        <p class="date">${new Date(content.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <p class="brand">FieldSpec</p>
      </div>
    </div>
    
    <div class="meta-grid">
      <div class="meta-item">
        <p class="label">Project</p>
        <p class="value">${content.projectName}</p>
      </div>
      <div class="meta-item">
        <p class="label">Location</p>
        <p class="value">${content.projectLocation || "Not specified"}</p>
      </div>
      <div class="meta-item">
        <p class="label">Images Analyzed</p>
        <p class="value">${content.totalImages}</p>
      </div>
      <div class="meta-item">
        <p class="label">Sections</p>
        <p class="value">${sections.length}</p>
      </div>
    </div>
    
    <h2 class="section-heading">Analysis Findings</h2>
    ${sections.map((s: any) => {
      const imagesHtml = s.images?.map((img: any) => {
        const scoreColor = img.confidenceScore >= 0.8 ? "#22c55e" : img.confidenceScore >= 0.6 ? "#f59e0b" : "#ef4444";
        return `
        <div class="image-entry">
          <div class="image-row">
            <img src="${img.imageUrl}" alt="Analysis image" />
            <div class="image-info">
              <p class="caption"><span class="label">Caption</span>${img.caption || "N/A"}</p>
              <p class="finding"><span class="label">Finding</span>${img.finding || "N/A"}</p>
              <p class="recommendation"><span class="label">Recommendation</span>${img.recommendation || "N/A"}</p>
              <div class="confidence-row">
                <span class="label">Confidence</span>
                <span class="confidence-badge" style="background-color: ${scoreColor}; color: white;">
                  ${Math.round(img.confidenceScore * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>`;
      }).join("") || "";
      
      return `
        <div class="section ${s.category}">
          <h2>${formatCategory(s.category)}</h2>
          <div class="summary-box">
            <p class="subsection-heading">Summary</p>
            <p class="value">${s.summary || "N/A"}</p>
          </div>
          <div class="recommendations-box">
            <p class="subsection-heading">Recommendations</p>
            <pre>${s.recommendations || "N/A"}</pre>
          </div>
          ${imagesHtml ? `<div class="images-section"><h3>Analysis Images</h3><div class="images">${imagesHtml}</div></div>` : ""}
        </div>`;
    }).join("")}
    
    <div class="footer">
      <p>Generated by <span class="brand">FieldSpec</span> - AI-Powered Field Analysis Platform</p>
    </div>
  </div>
</body>
</html>`;

    return NextResponse.json({
      data: {
        html,
        contentType: "text/html",
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Internal error" } },
      { status: 500 }
    );
  }
}