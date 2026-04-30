import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tokens } from "@/lib/design-tokens";
import { getValidatedUserId } from "@/lib/auth/get-user";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Pull token colors for clean, consistent report styling
const SURFACE = tokens.colors.surface;              // #ffffff or theme surface
const SURFACE_CONTAINER = tokens.colors.surfaceContainerLow; // light container
const SURFACE_VARIANT = tokens.colors.surfaceVariant;  // subtle variant
const OUTLINE = tokens.colors.outlineVariant;          // border color
const ON_SURFACE = tokens.colors.onSurface;           // primary text
const ON_SURFACE_VARIANT = tokens.colors.onSurfaceVariant; // secondary text
const PRIMARY = tokens.colors.primary;                // brand accent

export const dynamic = "force-dynamic";

function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  if (!MAPBOX_TOKEN) return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place,region,country&limit=1`
    );
    if (!res.ok) return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const place = data.features[0].place_name as string;
      return place || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  } catch (err) {
    console.error("[Geocode] Failed:", err);
  }

  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }

    const body = await request.json();
    const projectId = body.projectId;

    if (!projectId) {
      return NextResponse.json({ error: { message: "projectId required" } }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { projectId },
      include: { project: true },
    });

    if (!report || report.project.userId !== userId) {
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
       return colors[cat] || PRIMARY;
     };

     // Confidence badge background
     const badgeColor = (score: number): string => {
       if (score >= 0.8) return "#22c55e";
       if (score >= 0.6) return "#f59e0b";
       return "#ef4444";
     };

    // Pre-compute GPS location displays for all images
    const allImages = sections.flatMap((s: any) => s.images || []);
    const allImageLocations = new Map<string, string>();
    for (const img of allImages) {
      if (img.gpsLat != null && img.gpsLng != null) {
        allImageLocations.set(img.imageId, await reverseGeocode(img.gpsLat, img.gpsLng));
      }
    }

    // Compute a single location name for report metadata
    const imagesWithGps = allImages.filter((img: any) => img.gpsLat != null && img.gpsLng != null);
    let locationDisplay = content.projectLocation || "Not specified";
    if (imagesWithGps.length > 0) {
      const { gpsLat, gpsLng } = imagesWithGps[0];
      const geocoded = await reverseGeocode(gpsLat, gpsLng);
      locationDisplay = content.projectLocation
        ? `${content.projectLocation} (${geocoded})`
        : geocoded;
    }

    const generatedDate = new Date(content.generatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

     // ── Build each section (Atlassian-inspired modern UI) ───────────────────────
     const sectionsHtml = sections.map((s: any) => {
       const accent = categoryColor(s.category);
       const label  = categoryLabel(s.category);

       const imagesHtml = s.images?.length
         ? s.images.map((img: any) => {
               const score = img.confidenceScore ??0;
               const badge = badgeColor(score);
               const pct   = Math.round(score * 100);
               const gpsDisplay = allImageLocations.get(img.imageId) || "N/A";
               return `
<div style="margin-bottom:12px;border:1px solid ${OUTLINE};border-radius:8px;background-color:${SURFACE};overflow:hidden;page-break-inside:avoid;">
  <div style="display:flex;flex-direction:row;gap:0;">
    <div style="flex:0 0 auto;padding:12px;">
      <img src="${img.imageUrl}"
           width="140" height="105"
           crossorigin="anonymous"
           style="display:block;border-radius:6px;border:1px solid ${OUTLINE};object-fit:cover;" />
    </div>
    <div style="flex:1;padding:12px 14px 12px 12px;border-left:1px solid ${SURFACE_VARIANT};">
      <div style="margin-bottom:6px;">
        <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5pt;font-weight:600;color:${ON_SURFACE_VARIANT};background-color:${SURFACE_CONTAINER};text-transform:uppercase;letter-spacing:0.3pt;">Caption</span>
        <span style="margin-left:6px;font-family:Arial,sans-serif;font-size:9pt;color:${ON_SURFACE};">${escapeHtml(img.caption) || "N/A"}</span>
      </div>
      <div style="margin-bottom:6px;">
        <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5pt;font-weight:600;color:${ON_SURFACE_VARIANT};background-color:${SURFACE_CONTAINER};text-transform:uppercase;letter-spacing:0.3pt;">Finding</span>
        <span style="margin-left:6px;font-family:Arial,sans-serif;font-size:9pt;color:${ON_SURFACE};">${escapeHtml(img.finding) || "N/A"}</span>
      </div>
      <div style="margin-bottom:6px;">
        <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5pt;font-weight:600;color:${ON_SURFACE_VARIANT};background-color:${SURFACE_CONTAINER};text-transform:uppercase;letter-spacing:0.3pt;">Recommendation</span>
        <span style="margin-left:6px;font-family:Arial,sans-serif;font-size:9pt;color:${ON_SURFACE};">${escapeHtml(img.recommendation) || "N/A"}</span>
      </div>
      <div style="margin-bottom:8px;">
        <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5pt;font-weight:600;color:${ON_SURFACE_VARIANT};background-color:${SURFACE_CONTAINER};text-transform:uppercase;letter-spacing:0.3pt;">Location</span>
        <span style="margin-left:6px;font-family:Arial,sans-serif;font-size:9pt;color:${ON_SURFACE_VARIANT};">${escapeHtml(gpsDisplay)}</span>
      </div>
      <div>
        <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:7.5pt;font-weight:600;color:${ON_SURFACE_VARIANT};background-color:${SURFACE_CONTAINER};text-transform:uppercase;letter-spacing:0.3pt;">Confidence</span>
        <span style="display:inline-block;margin-left:6px;padding:3px 10px;border-radius:12px;font-size:8pt;font-weight:bold;background-color:${badge};color:#ffffff;">${pct}%</span>
      </div>
    </div>
  </div>
</div>`;
           }).join("")
         : "";

       const imagesBlock = imagesHtml
         ? `<div style="margin-top:14px;">
              <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:8.5pt;font-weight:600;color:${ON_SURFACE_VARIANT};text-transform:uppercase;letter-spacing:0.5pt;">Analysis Images (${s.images.length})</p>
              ${imagesHtml}
            </div>`
         : "";

       return `
<div style="margin-bottom:24px;padding:20px 20px 20px 24px;background-color:${SURFACE};border:1px solid ${OUTLINE};border-radius:10px;border-left:5px solid ${accent};page-break-inside:avoid;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
    <div style="width:10px;height:10px;border-radius:50%;background-color:${accent};"></div>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:13pt;font-weight:600;color:${ON_SURFACE};letter-spacing:-0.2pt;">${escapeHtml(label)}</p>
    <span style="margin-left:auto;padding:4px 10px;border-radius:12px;font-size:8pt;font-weight:600;color:${accent};background-color:${accent}1a;">${s.images?.length || 0} images</span>
  </div>

  <div style="margin-bottom:12px;">
    <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:8pt;font-weight:600;color:${ON_SURFACE_VARIANT};text-transform:uppercase;letter-spacing:0.5pt;">Summary</p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:10pt;color:${ON_SURFACE};line-height:1.6;">${escapeHtml(s.summary) || "N/A"}</p>
  </div>

  <div style="margin-bottom:${imagesHtml ? "16px" : "0"};padding:12px 14px;background-color:${SURFACE_CONTAINER};border:1px solid ${SURFACE_VARIANT};border-radius:8px;">
    <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:8pt;font-weight:600;color:${ON_SURFACE_VARIANT};text-transform:uppercase;letter-spacing:0.5pt;">Recommendations</p>
    <div style="font-family:Arial,sans-serif;font-size:10pt;color:${ON_SURFACE};line-height:1.6;white-space:pre-wrap;">${escapeHtml(s.recommendations) || "N/A"}</div>
  </div>

  ${imagesBlock}
</div>`;
     }).join("");

     // ── Final HTML (Modern Atlassian-inspired) ───────────────────────────────
     const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(content.title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      background-color: #ffffff;
      color: #1a1a1a;
      font-size: 10pt;
      line-height: 1.5;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div style="max-width:900px;margin:0 auto;padding:40px 50px;background-color:#ffffff;">

  <!-- HEADER -->
  <div style="margin-bottom:32px;padding-bottom:24px;border-bottom:4px solid ${PRIMARY};">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <p style="font-family:Arial,sans-serif;font-size:26pt;font-weight:700;color:${PRIMARY};letter-spacing:-0.8px;margin:0;line-height:1.2;">Analysis Report</p>
        <p style="font-family:Arial,sans-serif;font-size:12pt;color:${ON_SURFACE_VARIANT};margin:8px 0 0 0;">${escapeHtml(content.title)}</p>
      </div>
      <div style="text-align:right;">
        <p style="font-family:Arial,sans-serif;font-size:9pt;color:${ON_SURFACE_VARIANT};margin:0;">Generated</p>
        <p style="font-family:Arial,sans-serif;font-size:11pt;font-weight:600;color:${PRIMARY};margin:4px 0 0 0;">${generatedDate}</p>
      </div>
    </div>
  </div>

  <!-- METADATA CARDS -->
  <div style="display:flex;gap:16px;margin-bottom:32px;">
    <div style="flex:1;padding:16px;border:1px solid ${OUTLINE};border-radius:10px;background-color:${SURFACE_CONTAINER};">
      <p style="font-family:Arial,sans-serif;font-size:8pt;font-weight:600;color:${ON_SURFACE_VARIANT};text-transform:uppercase;letter-spacing:0.5pt;margin:0 0 6px 0;">Project</p>
      <p style="font-family:Arial,sans-serif;font-size:11pt;font-weight:600;color:${ON_SURFACE};margin:0;">${escapeHtml(content.projectName)}</p>
    </div>
    <div style="flex:1;padding:16px;border:1px solid ${OUTLINE};border-radius:10px;background-color:${SURFACE_CONTAINER};">
      <p style="font-family:Arial,sans-serif;font-size:8pt;font-weight:600;color:${ON_SURFACE_VARIANT};text-transform:uppercase;letter-spacing:0.5pt;margin:0 0 6px 0;">Location</p>
      <p style="font-family:Arial,sans-serif;font-size:11pt;font-weight:600;color:${ON_SURFACE};margin:0;">${escapeHtml(locationDisplay)}</p>
    </div>
    <div style="flex:1;padding:16px;border:1px solid ${OUTLINE};border-radius:10px;background-color:${SURFACE_CONTAINER};">
      <p style="font-family:Arial,sans-serif;font-size:8pt;font-weight:600;color:${ON_SURFACE_VARIANT};text-transform:uppercase;letter-spacing:0.5pt;margin:0 0 6px 0;">Images</p>
      <p style="font-family:Arial,sans-serif;font-size:11pt;font-weight:600;color:${ON_SURFACE};margin:0;">${content.totalImages}</p>
    </div>
    <div style="flex:1;padding:16px;border:1px solid ${OUTLINE};border-radius:10px;background-color:${SURFACE_CONTAINER};">
      <p style="font-family:Arial,sans-serif;font-size:8pt;font-weight:600;color:${ON_SURFACE_VARIANT};text-transform:uppercase;letter-spacing:0.5pt;margin:0 0 6px 0;">Sections</p>
      <p style="font-family:Arial,sans-serif;font-size:11pt;font-weight:600;color:${ON_SURFACE};margin:0;">${sections.length}</p>
    </div>
  </div>

  <!-- FINDINGS HEADING -->
  <div style="margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid ${OUTLINE};">
    <p style="font-family:Arial,sans-serif;font-size:15pt;font-weight:600;color:${ON_SURFACE};margin:0;letter-spacing:-0.3pt;">Analysis Findings</p>
  </div>

  <!-- SECTIONS -->
  ${sectionsHtml}

  <!-- FOOTER -->
  <div style="margin-top:40px;padding-top:16px;border-top:2px solid ${OUTLINE};text-align:center;">
    <p style="font-family:Arial,sans-serif;font-size:9pt;color:${ON_SURFACE_VARIANT};margin:0;">
      Generated by <span style="color:${PRIMARY};font-weight:700;">FieldSpec</span> — AI-Powered Field Analysis Platform
    </p>
  </div>

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