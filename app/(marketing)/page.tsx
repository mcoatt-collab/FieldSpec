import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";
import Navbar from "@/components/marketing/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "FieldSpec — AI Report Builder for Drone Inspections",
  description:
    "Upload drone images, get AI-generated analysis, and export professional PDF reports. Built for agriculture, survey, and infrastructure teams.",
  keywords: [
    "drone survey",
    "AI analysis",
    "aerial inspection",
    "crop health",
    "infrastructure inspection",
    "professional reports",
    "drone mapping",
    "field analysis",
  ],
};

export default function MarketingPage() {
  const features = [
    {
      title: "Skip the Manual Analysis",
      description:
        "AI examines every image and produces findings automatically. No more staring at photos wondering what to write.",
      imageUrl: "/images/ai-generated-insights.jpg",
    },
    {
      title: "GPS-Tagged Analysis",
      description:
        "Upload images with GPS coordinates. AI extracts patterns tied to exact locations so you know where issues are, not just what they are.",
      imageUrl: "/images/image-based-analysis.jpg",
    },
    {
      title: "Consistent Reports Every Time",
      description:
        "Generate formatted, professional PDF reports with one click. Your clients get the same quality, project after project.",
      imageUrl: "/images/structured-reports.jpg",
    },
    {
      title: "Pinpoint Issues on a Map",
      description:
        "Every image appears on an interactive map. See exactly where problems are without flipping through folders.",
      imageUrl: "/images/map-visualisation.jpg",
    },
    {
      title: "Export & Share in One Click",
      description:
        "Generate a PDF and share with stakeholders instantly. No formatting, no file conversion, no delays.",
      imageUrl: "/images/hand-holding-stopwatch.jpg",
    },
  ];

  const useCases = [
    {
      title: "Agricultural Inspections",
      description:
        "Assess crop health, map pest damage, and monitor irrigation across hundreds of acres. Deliver clear reports growers can act on.",
      imageUrl: "/images/agricultural-inspections.jpg",
    },
    {
      title: "Land Surveys",
      description:
        "Document site conditions, track changes between surveys, and produce professional reports clients trust for decision-making.",
      imageUrl: "/images/land-surveys.jpg",
    },
    {
      title: "Infrastructure Inspections",
      description:
        "Inspect roofs, bridges, and utility assets from the air. Generate professional reports without putting boots on the ground.",
      imageUrl: "/images/infrastructure-inspections.jpg",
    },
    {
      title: "Drone Service Providers",
      description:
        "Stand out from competitors by delivering polished inspection reports with every flight. Turn aerial data into a premium service.",
      imageUrl: "/images/drone-operators.jpg",
    },
  ];

  const steps = [
    {
      title: "Upload Images",
      description:
        "Drag and drop your drone images. GPS data is extracted automatically.",
    },
    {
      title: "AI Analyzes & Generates Findings",
      description:
        "AI detects patterns, flags issues, and generates findings for every image.",
    },
    {
      title: "Review & Edit",
      description: "Review findings, make edits, and add your notes.",
    },
    {
      title: "Export Report",
      description: "Generate a polished PDF and share with stakeholders.",
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          maxWidth: "1266px",
          margin: "0 auto",
          width: "100%",
          paddingTop: tokens.spacing.section,
          paddingBottom: tokens.spacing.section,
          paddingInline: tokens.spacing.md,
        }}
      >
        {/* Section Heading (Outside Box) */}
        <div style={{ textAlign: "center", marginBottom: tokens.spacing.xl }}>
          <h1
            style={{
              ...tokens.typography.displaySmall,
              fontSize: "clamp(24px, 5vw, 36px)",
              color: tokens.colors.onSurface,
              fontWeight: 500,
              marginBottom: tokens.spacing.xs,
              letterSpacing: "-0.02em",
            }}
          >
            Turn Drone Images into
            <br />
            Structured Reports Instantly
          </h1>
          <p
            style={{
              ...tokens.typography.bodyLarge,
              color: tokens.colors.onSurfaceVariant,
            }}
          >
            Upload inspection images. FieldSpec analyzes them and generates
            stakeholder-ready reports in minutes.
          </p>
        </div>

        {/* The Main Box */}
        <div
          className="hero-grid"
          style={{
            width: "100%",
            height: "600px",
            borderRadius: tokens.radius.xl,
            backgroundColor: tokens.colors.surfaceContainer,
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            overflow: "hidden",
          }}
        >
          {/* Left: Content */}
          <div
            className="hero-left-content"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: tokens.spacing.xxl,
              padding: `${tokens.spacing.xxl} ${tokens.spacing.md}`,
              textAlign: "center",
              height: "100%",
            }}
          >
            {/* Text group: heading + description */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: tokens.spacing.lg,
              }}
            >
              <h2
                style={{
                  ...tokens.typography.headlineLarge,
                  fontSize: "clamp(18px, 5vw, 32px)",
                  color: tokens.colors.onSurface,
                  fontWeight: 500,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  maxWidth: "480px",
                }}
              >
                Eliminate your biggest pain
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyLarge,
                  color: tokens.colors.onSurfaceVariant,
                  maxWidth: "440px",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                Converting drone and field images into stakeholder-ready
                reports, instantly.
              </p>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: tokens.spacing.md,
                justifyContent: "center",
              }}
            >
              <Link
                href="/signup"
                className="hero-primary-btn hero-btn-primary"
                style={{
                  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                  borderRadius: tokens.radius.lg,
                  ...tokens.typography.labelLarge,
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                }}
              >
                Get Started
              </Link>
              <Link
                href="/sample-report"
                className="hero-btn-secondary"
                style={{
padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
                  backgroundColor: "transparent",
                  color: tokens.colors.onSurface,
                  borderRadius: tokens.radius.lg,
                  border: `1.5px solid ${tokens.colors.onSurface}`,
                  ...tokens.typography.labelLarge,
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                }}
              >
                View Sample Report
              </Link>
            </div>
          </div>

          {/* Right: Content */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: tokens.spacing.md,
            }}
          >
            <div
              style={{
                width: "100%",
                backgroundColor: tokens.colors.surfaceContainerLow,
                borderRadius: tokens.radius.lg,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/IMG_9160.PNG"
                alt="Product preview"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: tokens.radius.md,
                }}
              />
            </div>
          </div>

          <style>{`
            .hero-primary-btn:hover {
              background-color: color-mix(in srgb, ${tokens.colors.primary} 85%, white) !important;
            }
            @media (max-width: 768px) {
              .hero-grid {
                grid-template-columns: 1fr !important;
                grid-template-rows: auto 1fr;
              }
              .hero-btn-primary {
                padding: ${tokens.spacing.sm} ${tokens.spacing.md} !important;
              }
              .hero-btn-secondary {
                padding: ${tokens.spacing.sm} ${tokens.spacing.sm} !important;
              }
              .hero-section {
                padding-left: ${tokens.spacing.md} !important;
                padding-right: ${tokens.spacing.md} !important;
              }
              .hero-left-content {
                padding-bottom: 24px !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* Trust Strip */}
      <div
        style={{
          maxWidth: "1266px",
          margin: "0 auto",
          width: "100%",
paddingInline: tokens.spacing.md,
          paddingTop: tokens.spacing.md,
          paddingBottom: tokens.spacing.md,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: tokens.spacing.xxl,
        }}
      >
        <p
          style={{
            ...tokens.typography.bodyLarge,
            fontWeight: "600",
            color: tokens.colors.onSurfaceVariant,
          }}
        >
          Construction
        </p>
        <p
          style={{
            ...tokens.typography.bodyLarge,
            fontWeight: "600",
            color: tokens.colors.onSurfaceVariant,
          }}
        >
          Infrastructure
        </p>
        <p
          style={{
            ...tokens.typography.bodyLarge,
            fontWeight: "600",
            color: tokens.colors.onSurfaceVariant,
          }}
        >
          Agriculture
        </p>
        <p
          style={{
            ...tokens.typography.bodyLarge,
            fontWeight: "600",
            color: tokens.colors.onSurfaceVariant,
          }}
        >
          Land Surveys
        </p>
      </div>

      {/* Problem → Solution Section */}
      <section
        style={{
          maxWidth: "1266px",
          margin: "0 auto",
          width: "100%",
          paddingTop: tokens.spacing.section,
          paddingBottom:tokens.spacing.lg,
          paddingInline: tokens.spacing.md,
          borderRadius: tokens.radius.lg,
          overflow: "hidden",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
.problem-solution-grid {
              overflow: hidden;
            }
            .problem-solution-card {
              cursor: default;
              transition: none !important;
            }
.problem-solution-card:hover {
              transform: none !important;
              box-shadow: none !important;
              border: none !important;
            }
            .problem-solution-card:active {
              transform: none !important;
              box-shadow: none !important;
            }
            :root.light .problem-solution-card:hover {
              box-shadow: none !important;
              border: none !important;
            }
            @media (max-width: 900px) {
              .problem-solution-grid {
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
                gap: 24px !important;
              }
            }
@media (max-width: 640px) {
              .problem-solution-grid {
                grid-template-columns: 1fr !important;
              }
              .problem-solution-card {
                padding: 32px 24px !important;
              }
              .problem-solution-title {
                font-size: 24px !important;
              }
            }
           @media (max-width: 480px) {
             .problem-solution-card {
               padding: 24px 20px !important;
             }
             .problem-solution-title {
               font-size: 22px !important;
             }
           }
         `,
          }}
        />
        <div
          style={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            className="problem-solution-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: 0,
              alignItems: "stretch",
              height: "600px",
              borderRadius: tokens.radius.lg
            }}
          >
            {/* Problem Card */}
            <div
              className="problem-solution-card"
              style={{
                padding: tokens.spacing.lg,
               
                border: "none",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
                overflow: "hidden",
                backgroundImage:
                  "url('/images/agriculture-healthy-food 1.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
             
              <div />
              <h3
                style={{
                  ...tokens.typography.headlineSmall,
                  color: tokens.colors.onSecondary,
                  marginBottom: tokens.spacing.md,
                  fontWeight: 500,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                Your workflow is being slowed down
              </h3>
              <p
                style={{
                  ...tokens.typography.bodyLarge,
                  color: tokens.colors.onSecondary,
                  lineHeight: 1.6,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                Reporting is slow, manual, and inconsistent. Images are
                unstructured, making cross-project tracking difficult. Different
                interpretations across teams lead to inconsistent results and
                reduced client trust.
              </p>
            </div>

            {/* Solution Card */}
            <div
              className="problem-solution-card"
              style={{
                padding: tokens.spacing.lg,
                border: "none",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h3
                style={{
                  ...tokens.typography.headlineSmall,
                  color: tokens.colors.secondary,
                  marginBottom: tokens.spacing.md,
                  fontWeight: 500,
                }}
              >
                With Fieldspec, <br /> reporting is no longer manual or slow.
              </h3>
              <div
                style={{
                  ...tokens.typography.bodyLarge,
                  color: tokens.colors.onSurface,
                  display: "flex",
                  flexDirection: "column",
                  gap: tokens.spacing.md,
                  lineHeight: 1.6,
                }}
              >
                AI turns every image into consistent findings in minutes. Your
                images and data are structured automatically. Reports are
                generated automatically. They are accurate, consistent, and
                client-ready.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Engine Visual */}
      <section
        style={{
          maxWidth: "1266px",
          margin: "0 auto",
          width: "100%",
          paddingBottom: tokens.spacing.section,
          paddingInline: tokens.spacing.md,
        }}
      >
        <div style={{
          width: "100%",
          backgroundColor: tokens.colors.surfaceContainerLow,
          border: `1px solid ${tokens.colors.outlineVariant}`,
          borderRadius: "24px",
          boxShadow: `0 32px 64px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}>
          {/* Mock App Header */}
          <div style={{ height: "56px", borderBottom: `1px solid ${tokens.colors.outlineVariant}`, display: "flex", alignItems: "center", padding: "0 20px", backgroundColor: tokens.colors.surfaceContainer, zIndex: 2 }}>
            <div style={{ display: "flex", gap: tokens.spacing.xxxs }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: tokens.colors.error }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#facc15" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: tokens.colors.primary }} />
            </div>
            <div style={{ marginLeft: tokens.spacing.lg, ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant, fontWeight: 600, letterSpacing: "0.5px" }}>FieldSpec Transformation Engine</div>
          </div>
          
          {/* Split Interface Container */}
          <div className="transformation-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", minHeight: "400px", backgroundColor: tokens.colors.surface, position: "relative" }}>
            
            {/* Image Input side */}
            <div style={{ padding: tokens.spacing.lg, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
              <div style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant, marginBottom: tokens.spacing.md, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Raw Drone Data</div>
              <div style={{ flex: 1, borderRadius: "12px", border: `1px solid ${tokens.colors.outlineVariant}`, position: "relative", overflow: "hidden", backgroundImage: 'url("/images/map-visualisation.jpg")', backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 12px 24px rgba(0,0,0,0.15)", minHeight: "250px" }}>
                {/* Scanning animation overlay */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", backgroundColor: tokens.colors.primary, boxShadow: `0 4px 16px ${tokens.colors.primary}`, animation: "scanLine 3s infinite linear", zIndex: 10 }} />
                
                {/* AI Bounding Boxes */}
                <div style={{ position: "absolute", top: "30%", left: "40%", width: "60px", height: "60px", border: `2px solid ${tokens.colors.primary}`, borderRadius: "4px", backgroundColor: `color-mix(in srgb, ${tokens.colors.primary} 20%, transparent)`, animation: "pulseBox 2s infinite ease-in-out" }}>
                  <div style={{ position: "absolute", top: "-20px", left: "-2px", backgroundColor: tokens.colors.primary, color: tokens.colors.onPrimary, fontSize: "10px", padding: "2px 6px", borderRadius: "2px", fontWeight: "bold" }}>Defect 98%</div>
                </div>
                <div style={{ position: "absolute", top: "60%", left: "20%", width: "80px", height: "50px", border: `2px solid ${tokens.colors.error}`, borderRadius: "4px", backgroundColor: `color-mix(in srgb, ${tokens.colors.error} 20%, transparent)`, animation: "pulseBox 2s infinite ease-in-out 1s" }}>
                  <div style={{ position: "absolute", top: "-20px", left: "-2px", backgroundColor: tokens.colors.error, color: tokens.colors.onError, fontSize: "10px", padding: "2px 6px", borderRadius: "2px", fontWeight: "bold" }}>Rust 94%</div>
                </div>
              </div>
            </div>

            {/* Center Arrow Connector */}
            <div className="transformation-connector" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
              <div className="transformation-arrow" style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: tokens.colors.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${tokens.colors.surface}`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 2 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
              <div className="transformation-dashed-line" style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", borderLeft: `1px dashed ${tokens.colors.outlineVariant}`, zIndex: 1, transform: "translateX(-50%)" }} />
            </div>

            {/* Report Output side */}
            <div style={{ padding: tokens.spacing.lg, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
              <div style={{ ...tokens.typography.labelMedium, color: tokens.colors.primary, marginBottom: tokens.spacing.md, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Structured Report</div>
              <div style={{ flex: 1, backgroundColor: tokens.colors.surfaceContainerLow, borderRadius: "12px", border: `1px solid ${tokens.colors.outlineVariant}`, padding: tokens.spacing.lg, display: "flex", flexDirection: "column", gap: tokens.spacing.md, boxShadow: "0 12px 32px rgba(0,0,0,0.1)", overflow: "hidden", position: "relative", minHeight: "250px" }}>
                
                {/* Report Header Actual Data */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.colors.outlineVariant}`, paddingBottom: tokens.spacing.md }}>
                  <div>
                    <div style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface, fontWeight: 700 }}>Inspection Report #492</div>
                    <div style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant, marginTop: "4px" }}>Site: North Ridge Solar Array</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: tokens.colors.primaryContainer, borderRadius: "8px", color: tokens.colors.onPrimaryContainer }}>
                    <span className="material-icons" style={{ fontSize: "20px" }}>picture_as_pdf</span>
                  </div>
                </div>

                {/* Report Map/Image */}
                <div style={{ width: "100%", height: "100px", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: 'url("/images/map-visualisation.jpg")', backgroundSize: "cover", backgroundPosition: "center" }} />
                </div>

                {/* Report List Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
                  {[
                    { color: tokens.colors.error, title: "Critical: Severe Rust", desc: "Found on support structure B4", confidence: "98% Match" },
                    { color: "#facc15", title: "Warning: Micro-cracking", desc: "Detected on panel array 12", confidence: "87% Match" },
                    { color: tokens.colors.primary, title: "Routine: Maintenance", desc: "Scheduled cleaning needed", confidence: "Auto-tagged" }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start", backgroundColor: tokens.colors.surface, padding: "12px", borderRadius: "8px", border: `1px solid ${tokens.colors.outlineVariant}` }}>
                      <div style={{ marginTop: "4px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: item.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <div style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurface, fontWeight: 600 }}>{item.title}</div>
                          <div style={{ ...tokens.typography.labelSmall, color: item.color, fontWeight: 600 }}>{item.confidence}</div>
                        </div>
                        <div style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scanLine {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes pulseBox {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 12px var(--sys-primary); }
            100% { transform: scale(1); opacity: 0.8; }
          }
          @media (max-width: 768px) {
            .transformation-grid {
              display: flex !important;
              flex-direction: column !important;
            }
            .transformation-connector {
              padding: 24px 0;
            }
            .transformation-arrow {
              transform: rotate(90deg);
            }
            .transformation-dashed-line {
              width: 100% !important;
              height: 1px !important;
              border-left: none !important;
              border-top: 1px dashed var(--sys-outline-roles-outline-variant) !important;
              top: 50% !important;
              left: 0 !important;
              bottom: auto !important;
              transform: translateY(-50%) !important;
            }
          }
        `}} />
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        style={{
          padding: `${tokens.spacing.section} ${tokens.spacing.md}`,
          backgroundColor: "var(--color-section-bg)",
        }}
      >
        <div
          style={{
            maxWidth: "1266px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingInline: tokens.spacing.md,
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .hiw-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 24px;
              margin-top: 48px;
            }
            .hiw-card {
              background: var(--sys-surface-roles-surface-container-low);
              border: 1px solid var(--sys-outline-roles-outline);
              border-radius: 8px;
              padding: 32px;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              position: relative;
            }
            .hiw-card-icon {
              width: 56px;
              height: 56px;
              border-radius: 12px;
              background: linear-gradient(135deg, var(--sys-primary) 0%, var(--sys-secondary) 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 24px;
            }
            .hiw-card-decoration {
              position: absolute;
              bottom: -20px;
              right: -20px;
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: var(--sys-on-secondary-container);
              opacity: 0.06;
            }
            .hiw-card-icon span {
              font-size: 24px;
              color: var(--sys-on-primary);
            }
            .hiw-card-number {
              font-family: var(--sys-typescale-title-small-fontfamily);
              font-size: 13px;
              font-weight: 600;
              color: var(--sys-on-surface-variant);
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .hiw-card-title {
              font-family: var(--sys-typescale-title-large-fontfamily);
              font-size: 20px;
              font-weight: 600;
              color: var(--sys-on-surface);
              margin-bottom: 8px;
            }
            .hiw-card-description {
              font-family: var(--sys-typescale-body-medium-fontfamily);
              font-size: 15px;
              color: var(--sys-on-surface-variant);
              line-height: 1.5;
            }
            @media (max-width: 640px) {
              .hiw-grid {
                grid-template-columns: 1fr;
              }
              .hiw-card {
                padding: 24px;
              }
            }
          `,
            }}
          />
          <div
            style={{
              margin: `${tokens.spacing.xl} 0`,
              display: "flex",
              flexDirection: "column",
              gap: tokens.spacing.lg,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <h2
                style={{
                  ...tokens.typography.headlineLarge,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.xs,
                }}
              >
                How It Works
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyLarge,
                  color: tokens.colors.onSurfaceVariant,
                }}
              >
                Get from drone flight to delivered report in 4 steps
              </p>
            </div>
            <div className="hiw-grid">
              {steps.map((step, index) => (
                <div key={index} className="hiw-card">
                  <div className="hiw-card-decoration" />
                  <div className="hiw-card-icon">
                    <span className="material-symbols-outlined">
                      {index === 0
                        ? "cloud_upload"
                        : index === 1
                          ? "psychology"
                          : index === 2
                            ? "edit_note"
                            : "picture_as_pdf"}
                    </span>
                  </div>
                  <div className="hiw-card-number">Step {index + 1}</div>
                  <h3 className="hiw-card-title">{step.title}</h3>
                  <p className="hiw-card-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          padding: `${tokens.spacing.section} ${tokens.spacing.md}`,
          backgroundColor: "var(--color-section-bg)",
        }}
      >
        <div style={{ maxWidth: "1266px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: tokens.spacing.xxl }}>
            <h2
              style={{
                ...tokens.typography.headlineLarge,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}
            >
              Everything You Need to Deliver Professional Reports
            </h2>
            <p
              style={{
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurfaceVariant,
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              FieldSpec automates the tedious parts of drone inspection
              reporting, so you can focus on making decisions.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: tokens.spacing.xl,
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: tokens.colors.surfaceContainer,
                  borderRadius: tokens.radius.lg,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  padding: tokens.spacing.xl,
                  display: "flex",
                  flexDirection: "column",
                  gap: tokens.spacing.md,
                }}
                className="feature-card"
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: tokens.colors.primaryContainer,
                    color: tokens.colors.onPrimaryContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="material-symbols-outlined">
                    {index === 0
                      ? "psychology"
                      : index === 1
                        ? "location_on"
                        : index === 2
                          ? "description"
                          : index === 3
                            ? "map"
                            : "speed"}
                  </span>
                </div>
                <h3
                  style={{
                    ...tokens.typography.titleLarge,
                    color: tokens.colors.onSurface,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    ...tokens.typography.bodyMedium,
                    color: tokens.colors.onSurfaceVariant,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section
        id="use-cases"
        style={{
          padding: `${tokens.spacing.section} ${tokens.spacing.md}`,
          backgroundColor: "var(--color-section-bg)",
          position: "relative",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-top: 48px;
          }
          .use-case-card-bento {
             background: var(--sys-surface-roles-surface-container);
            border: 1px solid var(--sys-outline-variant);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .bento-span-2 {
            grid-column: span 2;
          }
          .bento-span-1 {
            grid-column: span 1;
          }
          @media (max-width: 900px) {
            .bento-grid {
              grid-template-columns: 1fr;
            }
            .bento-span-2, .bento-span-1 {
              grid-column: span 1;
            }
          }
        `,
          }}
        />
        <div style={{ maxWidth: "1266px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", textAlign: "center" }}>
            <span
              style={{
                color: tokens.colors.primary,
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                display: "block",
                marginBottom: tokens.spacing.xs,
                letterSpacing: "0.01em",
              }}
            >
              Who It&apos;s For
            </span>
            <h2
              style={{
                ...tokens.typography.headlineLarge,
                color: tokens.colors.onSurface,
                textAlign: "center",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              Built for Field Professionals
            </h2>
          </div>

          <div
            className="bento-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: tokens.spacing.lg,
              marginTop: tokens.spacing.lg,
            }}
          >
            {useCases.map((useCase, i) => {
              const spanClass =
                i === 0 || i === 3 ? "bento-span-2" : "bento-span-1";

              return (
                <div key={i} className={`use-case-card-bento ${spanClass}`}>
                  {useCase.imageUrl && (
                    <div
                      style={{
                        height: "240px",
                        width: "100%",
                        backgroundColor: "#0B1120",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={useCase.imageUrl}
                        alt={useCase.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      padding: tokens.spacing.lg,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        color: tokens.colors.onSurfaceVariant,
                        fontFamily:
                          "var(--sys-typescale-body-large-fontfamily)",
                        fontSize: "13px",
                        fontWeight: 500,
                        marginBottom: "8px",
                        textTransform: "capitalize",
                      }}
                    >
                      {useCase.title.split(" ")[0]}
                    </span>
                    <h4
                      style={{
                        color: tokens.colors.onSurface,
                        fontFamily:
                          "var(--sys-typescale-body-large-fontfamily)",
                        fontSize: "20px",
                        fontWeight: "500",
                        marginBottom: tokens.spacing.xs,
                      }}
                    >
                      {useCase.title}
                    </h4>
                    <p
                      style={{
                        color: tokens.colors.onSurfaceVariant,
                        fontFamily:
                          "var(--sys-typescale-body-large-fontfamily)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        opacity: 0.7,
                      }}
                    >
                      {useCase.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          paddingTop: tokens.spacing.section, paddingInline:tokens.spacing.md,
           
          backgroundColor: "var(--color-section-bg)",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
           .cta-card {
              background-color: var(--sys-surface-roles-surface-container);
             background-image: radial-gradient(ellipse at bottom, var(--sys-primary) 0%, transparent 60%);
             border: 1px solid var(--sys-outline-variant);
             border-radius: 8px;
padding: 50px 24px;
              text-align: center;


              position: relative;
              overflow: hidden;
            }
            .cta-primary-btn {
              background-color: var(--sys-primary);
              color: var(--sys-on-primary);
              padding: 12px 24px;
             border-radius: 8px;
             font-size: 15px;
             font-weight: 500;
             text-decoration: none;
             transition: background-color 0.2s, transform 0.2s;
             border: none;
             display: inline-block;
           }
           .cta-primary-btn:hover {
             background-color: var(--sys-primary-container);
             color: var(--sys-on-primary-container);
             transform: translateY(-1px);
           }
            .cta-secondary-link {
              color: var(--sys-on-surface);
              font-size: 15px;
             font-weight: 500;
             text-decoration: none;
             display: inline-flex;
             align-items: center;
             gap: 6px;
             transition: color 0.2s, transform 0.2s;
           }
           .cta-secondary-link:hover {
             color: rgba(255,255,255,0.8);
           }
         `,
          }}
        />
        <div
          className="cta-card"
          style={{ maxWidth: "1266px", margin: "0 auto" }}
        >
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--sys-typescale-headline-large-fontfamily)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 600,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.lg,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              Go From Images to Report in Minutes
            </h2>
            <p
              style={{
                fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                fontSize: "17px",
                color: tokens.colors.onSurfaceVariant,
                lineHeight: 1.6,
                marginBottom: "40px",
                maxWidth: "540px",
                margin: "0 auto 40px",
                textAlign: "center",
              }}
            >
              Upload your first set of images and see what FieldSpec can do. No
              credit card required.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: tokens.spacing.lg,
                flexWrap: "wrap",
                marginTop: "40px",
              }}
            >
              <Link href="/signup" className="cta-primary-btn">
                Start Free
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{
          backgroundColor: "var(--footer-bg)",
          borderTop: `1px solid ${tokens.colors.outlineVariant}`,
          padding: `${tokens.spacing.section} ${tokens.spacing.md}`,
          fontFamily: tokens.typography.bodyMedium.fontFamily,
        }}
      >
        <style>{`
            .footer-link { color: var(--footer-color); opacity: 0.8; text-decoration: none; transition: color 0.3s ease, opacity 0.3s ease; font-family: ${tokens.typography.bodyMedium.fontFamily}; }
            .footer-link:hover { opacity: 1; color: var(--footer-color) !important; }
            .social-footer-icon { color: var(--footer-color); opacity: 0.6; transition: color 0.3s ease, opacity 0.3s ease; font-size: 20px; display: flex; align-items: center; justify-content: center; }
            .social-footer-icon:hover { opacity: 1; color: var(--footer-color) !important; }
          `}</style>

        <div
          style={{
            maxWidth: "1266px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: tokens.spacing.xl,
          }}
        >
          <div>
            <Brand size="lg" />
            <p
              style={{
                ...tokens.typography.bodySmall,
                color: "var(--footer-color)",
                opacity: 0.8,
                marginTop: tokens.spacing.md,
              }}
            >
              From drone images to professional reports. In minutes.
            </p>
          </div>

          <div>
            <h4
              style={{
                ...tokens.typography.labelLarge,
                color: "var(--footer-color)",
                marginBottom: tokens.spacing.md,
              }}
            >
              Product
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.sm,
              }}
            >
              <a
                href="#features"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                How It Works
              </a>
              <a
                href="#use-cases"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Use Cases
              </a>
              <Link
                href="/signup"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Get Started
              </Link>
            </div>
          </div>

          <div>
            <h4
              style={{
                ...tokens.typography.labelLarge,
                color: "var(--footer-color)",
                marginBottom: tokens.spacing.md,
              }}
            >
              Company
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.sm,
              }}
            >
              <a
                href="#"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                About
              </a>
              <a
                href="#"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Blog
              </a>
              <a
                href="#"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Careers
              </a>
              <a
                href="#"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <h4
              style={{
                ...tokens.typography.labelLarge,
                color: "var(--footer-color)",
                marginBottom: tokens.spacing.md,
              }}
            >
              Legal
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.sm,
              }}
            >
              <a
                href="#"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="footer-link"
                style={tokens.typography.bodySmall}
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1266px",
            margin: `${tokens.spacing.xl} auto 0`,
            paddingTop: tokens.spacing.lg,
            borderTop: `1px solid ${tokens.colors.outlineVariant}`,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: tokens.spacing.md,
          }}
        >
          <p
            style={{
              ...tokens.typography.bodySmall,
              color: "var(--footer-color)",
              opacity: 0.8,
            }}
          >
            &copy; {new Date().getFullYear()} FieldSpec. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: tokens.spacing.md }}>
            <a
              href="https://x.com/FieldspecHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="social-footer-icon"
              aria-label="Twitter"
              style={{ padding: "6px" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.5H2.66l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/fieldspec"
              target="_blank"
              rel="noopener noreferrer"
              className="social-footer-icon"
              aria-label="LinkedIn"
              style={{ padding: "6px" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            
          </div>
        </div>
      </footer>
    </main>
  );
}
