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

    // Category display names
    const categoryLabel = (cat: string): string => {
      const labels: Record<string, string> = {
        crop_health: "Crop Health",
        erosion: "Erosion",
        damage: "Damage",
        irrigation: "Irrigation",
        general: "General Observations",
      };
      return labels[cat] || cat;
    };

    // Category accent colors — resolved server-side so no CSS class override can touch them
    const categoryColor = (cat: string): string => {
      const colors: Record<string, string> = {
        crop_health: "#22c55e",
        erosion: "#8b5cf6",
        damage: "#ef4444",
        irrigation: "#3b82f6",
        general: "#6b7280",
      };
      return colors[cat] || "#1e3a5f";
    };

    // Confidence badge background
    const badgeColor = (score: number): string => {
      if (score >= 0.8) return "#22c55e";
      if (score >= 0.6) return "#f59e0b";
      return "#ef4444";
    };

    const generatedDate = new Date(content.generatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ── Build each section ──────────────────────────────────────────────────────
    const sectionsHtml = sections.map((s: any) => {
      const accent = categoryColor(s.category);
      const label  = categoryLabel(s.category);

      // Images — table layout so html2canvas renders them correctly
      const imagesHtml = s.images?.length
        ? s.images.map((img: any) => {
            const score = img.confidenceScore ?? 0;
            const badge = badgeColor(score);
            const pct   = Math.round(score * 100);
            return `
<table width="100%" cellpadding="0" cellspacing="0"
  style="margin-bottom:10px;border:1px solid #e8e8e8;border-radius:4px;background-color:#f8f8f8;">
  <tr>
    <td width="130" valign="top" style="padding:10px;">
      <img src="${img.imageUrl}"
           width="120" height="90"
           crossorigin="anonymous"
           style="display:block;border-radius:3px;border:1px solid #e0e0e0;" />
    </td>
    <td valign="top" style="padding:10px 10px 10px 0;">
      <p style="margin:0 0 5px 0;font-family:Arial,sans-serif;font-size:8.5pt;color:#1a1a1a;">
        <span style="font-size:7pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;">Caption&nbsp;</span>${img.caption || "N/A"}
      </p>
      <p style="margin:0 0 5px 0;font-family:Arial,sans-serif;font-size:8.5pt;color:#444444;">
        <span style="font-size:7pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;">Finding&nbsp;</span>${img.finding || "N/A"}
      </p>
      <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:8.5pt;color:#666666;">
        <span style="font-size:7pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;">Recommendation&nbsp;</span>${img.recommendation || "N/A"}
      </p>
      <span style="font-size:7pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;">Confidence&nbsp;</span>
      <span style="display:inline-block;padding:2px 8px;border-radius:8px;font-size:8pt;font-weight:bold;background-color:${badge};color:#ffffff;">${pct}%</span>
    </td>
  </tr>
</table>`;
          }).join("")
        : "";

      const imagesBlock = imagesHtml
        ? `<p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:8pt;font-weight:bold;color:#666666;text-transform:uppercase;letter-spacing:0.3pt;">Analysis Images</p>${imagesHtml}`
        : "";


      return `
<div style="margin-bottom:18px;padding:14px 14px 14px 16px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:6px;border-left:4px solid ${accent};page-break-inside:avoid;">
  <p style="margin:0 0 10px 0;font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;color:${accent};">${label}</p>

  <p style="margin:0 0 3px 0;font-family:Arial,sans-serif;font-size:8pt;font-weight:bold;color:#555555;text-transform:uppercase;letter-spacing:0.5pt;">Summary</p>
  <p style="margin:0 0 10px 0;font-family:Arial,sans-serif;font-size:9.5pt;color:#333333;line-height:1.5;">${s.summary || "N/A"}</p>

  <p style="margin:0 0 3px 0;font-family:Arial,sans-serif;font-size:8pt;font-weight:bold;color:#555555;text-transform:uppercase;letter-spacing:0.5pt;">Recommendations</p>
  <div style="margin:0 0 ${imagesHtml ? "12px" : "0"} 0;padding:9px 10px;background-color:#f8f8f8;border:1px solid #e8e8e8;border-radius:4px;font-family:Arial,sans-serif;font-size:9pt;color:#333333;line-height:1.5;white-space:pre-wrap;">${s.recommendations || "N/A"}</div>

  ${imagesBlock}
</div>`;
    }).join("");

    // ── Final HTML ──────────────────────────────────────────────────────────────
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${content.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #ffffff;
      color: #1a1a1a;
      font-size: 10pt;
      line-height: 1.4;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div style="padding:30px 35px;background-color:#ffffff;">

  <!-- HEADER -->
  <table width="100%" cellpadding="0" cellspacing="0"
    style="margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #1e3a5f;">
    <tr>
      <td valign="bottom">
        <p style="font-family:Arial,sans-serif;font-size:22pt;font-weight:bold;color:#1e3a5f;letter-spacing:-0.5px;margin:0;">FieldSpec Analysis Report</p>
        <p style="font-family:Arial,sans-serif;font-size:11pt;color:#666666;margin:4px 0 0 0;">${content.title}</p>
      </td>
      <td valign="bottom" align="right">
        <p style="font-family:Arial,sans-serif;font-size:9pt;color:#666666;margin:0;">${generatedDate}</p>
        <p style="font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;color:#1e3a5f;margin:4px 0 0 0;">FieldSpec</p>
      </td>
    </tr>
  </table>

  <!-- METADATA -->
  <table width="100%" cellpadding="12" cellspacing="0"
    style="margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e8e8e8;border-radius:6px;">
    <tr>
      <td width="25%" valign="top">
        <p style="font-family:Arial,sans-serif;font-size:7.5pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;margin:0 0 2px 0;">Project</p>
        <p style="font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;color:#1a1a1a;margin:0;">${content.projectName}</p>
      </td>
      <td width="25%" valign="top">
        <p style="font-family:Arial,sans-serif;font-size:7.5pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;margin:0 0 2px 0;">Location</p>
        <p style="font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;color:#1a1a1a;margin:0;">${content.projectLocation || "Not specified"}</p>
      </td>
      <td width="25%" valign="top">
        <p style="font-family:Arial,sans-serif;font-size:7.5pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;margin:0 0 2px 0;">Images Analyzed</p>
        <p style="font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;color:#1a1a1a;margin:0;">${content.totalImages}</p>
      </td>
      <td width="25%" valign="top">
        <p style="font-family:Arial,sans-serif;font-size:7.5pt;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.3pt;margin:0 0 2px 0;">Sections</p>
        <p style="font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;color:#1a1a1a;margin:0;">${sections.length}</p>
      </td>
    </tr>
  </table>

  <!-- FINDINGS HEADING -->
  <p style="font-family:Arial,sans-serif;font-size:13pt;font-weight:600;color:#1a1a1a;margin:0 0 14px 0;padding-bottom:6px;border-bottom:1.5px solid #e0e0e0;">Analysis Findings</p>

  <!-- SECTIONS -->
  ${sectionsHtml}

  <!-- FOOTER -->
  <table width="100%" cellpadding="0" cellspacing="0"
    style="margin-top:25px;padding-top:12px;border-top:1.5px solid #e0e0e0;">
    <tr>
      <td align="center">
        <p style="font-family:Arial,sans-serif;font-size:8pt;color:#888888;margin:0;">
          Generated by <span style="color:#1e3a5f;font-weight:bold;">FieldSpec</span> — AI-Powered Field Analysis Platform
        </p>
      </td>
    </tr>
  </table>

</div>
</body>
</html>`;

    return NextResponse.json({
      data: { html, contentType: "text/html" },
    }, { status: 200 });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Internal error" } },
      { status: 500 }
    );
  }
}