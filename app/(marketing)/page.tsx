import Link from "next/link";
import type { Metadata } from "next";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";
import Navbar from "@/components/marketing/Navbar";
import { Features, HowItWorks } from "@/components/marketing/Sections";
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
      description: "AI examines every image and produces findings automatically. No more staring at photos wondering what to write.",
      imageUrl: "/images/ai-generated-insights.jpg",
    },
    {
      title: "GPS-Tagged Analysis",
      description: "Upload images with GPS coordinates. AI extracts patterns tied to exact locations so you know where issues are, not just what they are.",
      imageUrl: "/images/image-based-analysis.jpg",
    },
    {
      title: "Consistent Reports Every Time",
      description: "Generate formatted, professional PDF reports with one click. Your clients get the same quality, project after project.",
      imageUrl: "/images/structured-reports.jpg",
    },
    {
      title: "Pinpoint Issues on a Map",
      description: "Every image appears on an interactive map. See exactly where problems are without flipping through folders.",
      imageUrl: "/images/map-visualisation.jpg",
    },
    {
      title: "Export & Share in One Click",
      description: "Generate a PDF and share with stakeholders instantly. No formatting, no file conversion, no delays.",
      imageUrl: "/images/hand-holding-stopwatch.jpg",
    },
  ];

  const useCases = [
    { title: "Agricultural Inspections", description: "Assess crop health, map pest damage, and monitor irrigation across hundreds of acres. Deliver clear reports growers can act on.", imageUrl: "/images/agricultural-inspections.jpg" },
    { title: "Land Surveys", description: "Document site conditions, track changes between surveys, and produce professional reports clients trust for decision-making.", imageUrl: "/images/land-surveys.jpg" },
    { title: "Infrastructure Inspections", description: "Inspect roofs, bridges, and utility assets from the air. Generate professional reports without putting boots on the ground.", imageUrl: "/images/infrastructure-inspections.jpg" },
    { title: "Drone Service Providers", description: "Stand out from competitors by delivering polished inspection reports with every flight. Turn aerial data into a premium service.", imageUrl: "/images/drone-operators.jpg" },
  ];

  const steps = [
    { num: "1", title: "Upload Your Images", description: "Drag and drop your drone images. GPS data is extracted automatically.", icon: "upload" },
    { num: "2", title: "Tag & Organize", description: "Categorize images by project, location, or condition in seconds.", icon: "label" },
    { num: "3", title: "Analyze with AI", description: "AI detects patterns, flags issues, and generates findings for every image.", icon: "auto_awesome" },
    { num: "4", title: "Export Your Report", description: "Generate a polished PDF report and share with stakeholders immediately.", icon: "description" },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar />

{/* Hero Section */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingTop: "calc(var(--sys-header-offset) + 40px)", paddingBottom: "60px", paddingInline: tokens.spacing.lg}}>
        
        {/* Section Heading (Outside Box) */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ ...tokens.typography.displaySmall, color: tokens.colors.onSurface, fontWeight: 500, marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Automate your field reporting
          </h2>
          <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant }}>
            From drone flight to stakeholder delivery, instantly.
          </p>
        </div>

        {/* The Main Box */}
        <div style={{ width: "100%", height: "600px", borderRadius: "32px", backgroundColor: tokens.colors.surfaceContainer, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
          
          {/* Left: Content */}
          {/* Left: Content */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px", textAlign: "left", height: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "24px" }}>
              <h2 style={{
                ...tokens.typography.displayMedium,
                color: tokens.colors.onSurface,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "480px"
              }}>
                Turn Field images into <br/> structured reports instantly
              </h2>
              <p style={{
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurfaceVariant,
                maxWidth: "440px",
                lineHeight: 1.5,
              }}>
                Upload inspection images. FieldSpec analyzes them and generates stakeholder-ready reports in minutes.
              </p>

              {/* Buttons at bottom */}
              <div style={{ display: "flex", flexDirection: "row", gap: tokens.spacing.md, marginTop: "16px" }}>
                <Link
                  href="/signup"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.onPrimary,
                    borderRadius: "12px",
                    fontFamily: tokens.typography.labelLarge.fontFamily,
                    fontWeight: 600,
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
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "transparent",
                    color: tokens.colors.primary,
                    borderRadius: "12px",
                    border: `1px solid ${tokens.colors.primary}`,
                    fontFamily: tokens.typography.labelLarge.fontFamily,
                    fontWeight: 600,
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
          </div>

          {/* Right: Stacked UI Cards Bleeding */}
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end", // Align cards to the right
            gap: "24px",
            paddingTop: "24px",
            transform: "translateY(-120px)", // shift up to bleed top and bottom
          }}>
            {/* Top Card (White Bleeding) */}
            <div style={{
              width: "480px",
              height: "200px",
              backgroundColor: tokens.colors.surface,
              borderRadius: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              flexShrink: 0,
            }}></div>

            {/* Middle Card (Dark) */}
            <div style={{
              width: "480px",
              height: "400px",
              backgroundColor: "#1c1c1c",
              borderRadius: "24px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: 500, fontFamily: tokens.typography.bodyLarge.fontFamily }}>Report pdf placeholder</span>
            </div>

            {/* Bottom Card (White Bleeding) */}
            <div style={{
              width: "480px",
              height: "200px",
              backgroundColor: tokens.colors.surface,
              borderRadius: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              flexShrink: 0,
            }}></div>
            
          </div>
        </div>

        {/* Trust strip */}
        <div style={{
          position: "absolute",
          bottom: tokens.spacing.xl,
          left: 0,
          right: 0,
        }}>
          <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", paddingLeft: tokens.spacing.xl, paddingRight: tokens.spacing.xl, display: "flex", justifyContent: "center" }}>
            <p style={{
              ...tokens.typography.bodySmall,
              color: tokens.colors.onSurfaceVariant,
            }}>
              Generate reports 5x faster
            </p>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        backgroundColor: "var(--color-section-bg)",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
           .problem-solution-card:hover {
             transform: translateY(-4px);
             box-shadow: 0 12px 32px rgba(0,0,0,0.4);
             border-color: rgba(255,255,255,0.2) !important;
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
             .problem-solution-item {
               font-size: 15px !important;
               gap: 10px !important;
             }
             .problem-solution-dot {
               width: 16px !important;
               height: 16px !important;
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
         `}} />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.displaySmall,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xl,
          }}>
            From Hours of Manual Work to Automated Reports
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            marginBottom: tokens.spacing.xxl,
          }}>
            Turning drone data into professional reports takes too long, introduces inconsistencies, and wastes valuable time. FieldSpec does it automatically.
          </p>

          <div className="problem-solution-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: tokens.spacing.xl,
            alignItems: "stretch",
          }}>
            {/* Problem Card */}
            <div className="problem-solution-card" style={{
              padding: `${tokens.spacing.xxl} ${tokens.spacing.xl}`,
              backgroundColor: tokens.colors.surfaceContainer,
              borderRadius: tokens.radius.lg,
              border: `1px solid ${tokens.colors.outlineVariant}`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              <div style={{
                position: "absolute",
                top: `${tokens.spacing.lg}`,
                left: `${tokens.spacing.lg}`,
                width: "12px",
                height: "12px",
                 backgroundColor: tokens.colors.primary,
                 borderRadius: "50%",
                 boxShadow: `0 0 0 4px rgba(96, 165, 250, 0.2)`,
              }} />
              <h3 className="problem-solution-title" style={{
                ...tokens.typography.headlineMedium,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.lg,
                marginTop: tokens.spacing.xs,
              }}>
                The Problem
              </h3>
              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: tokens.colors.primary, fontSize: tokens.typography.bodyMedium.fontSize, fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Writing reports manually takes hours, and every report looks different from the last</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: tokens.colors.primary, fontSize: tokens.typography.bodyMedium.fontSize, fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Drone images sit unstructured, making it nearly impossible to track findings across projects</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: tokens.colors.primary, fontSize: tokens.typography.bodyMedium.fontSize, fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Team members interpret the same data differently, eroding trust with clients</span>
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: `1px solid ${tokens.colors.outlineVariant}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === 1 ? "var(--ref-key-accent-key-color)" : "var(--ref-neutral-neutral87)" }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-medium-fontsize)", color: tokens.colors.onSurfaceVariant }}>3 costly bottlenecks</span>
                </div>
              </div>
            </div>

            {/* Solution Card */}
            <div className="problem-solution-card" style={{
              padding: `${tokens.spacing.xxl} ${tokens.spacing.xl}`,
              backgroundColor: tokens.colors.surfaceContainer,
              borderRadius: tokens.radius.lg,
              border: `1px solid ${tokens.colors.outlineVariant}`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              <div style={{
                position: "absolute",
                top: `${tokens.spacing.lg}`,
                left: `${tokens.spacing.lg}`,
                width: "12px",
                height: "12px",
                 backgroundColor: tokens.colors.secondary,
                 borderRadius: "50%",
                 boxShadow: `0 0 0 4px rgba(52, 211, 153, 0.2)`,
              }} />
              <h3 className="problem-solution-title" style={{
                ...tokens.typography.headlineMedium,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.lg,
                marginTop: tokens.spacing.xs,
              }}>
                The Solution
              </h3>
              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                       <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.secondaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <span style={{ color: tokens.colors.secondary, fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                       </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>AI analyzes every image and generates consistent findings in minutes, not hours</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                       <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.secondaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <span style={{ color: tokens.colors.secondary, fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                       </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>All images and data are automatically organized, searchable, and comparable across projects</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                       <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.secondaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <span style={{ color: tokens.colors.secondary, fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                       </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Professional PDF reports are generated automatically — consistent, accurate, and client-ready</span>
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: `1px solid ${tokens.colors.outlineVariant}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map((i) => (
                       <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === 1 ? tokens.colors.secondary : tokens.colors.outlineVariant }} />
                    ))}
                  </div>
                   <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-medium-fontsize)", color: tokens.colors.onSurfaceVariant }}>3 ways FieldSpec delivers</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        backgroundColor: "var(--color-section-bg)",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            .step-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 32px rgba(0,0,0,0.4);
              border-color: rgba(255,255,255,0.2) !important;
            }
           @media (min-width: 768px) {
             .step-connector {
               display: block !important;
             }
           }
         `}} />
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xs,
          }}>
            How It Works
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: tokens.spacing.xxl,
          }}>
            Get from drone flight to delivered report in 4 steps
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {steps.map((step, index) => (
              <div
                key={step.num}
                className="step-card"
                style={{
                  padding: tokens.spacing.xl,
                  backgroundColor: tokens.colors.surfaceContainer,
                  borderRadius: tokens.radius.lg,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: tokens.radius.lg,
                  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.secondary} 100%)`,
                  color: tokens.colors.onPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: tokens.spacing.md,
                  boxShadow: `0 6px 20px ${tokens.colors.primary}40`,
                }}>
                  <span className="material-icons" style={{ fontSize: "28px" }}>{step.icon}</span>
                </div>
                <h3 style={{
                  ...tokens.typography.titleMedium,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.xs,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  ...tokens.typography.bodySmall,
                  color: tokens.colors.onSurfaceVariant,
                  lineHeight: 1.5,
                }}>
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="step-connector" style={{
                    position: "absolute",
                    right: "-12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "24px",
                    height: "24px",
                    color: tokens.colors.outlineVariant,
                    opacity: 0.3,
                    display: "none",
                  }}>
                    <span className="material-icons" style={{ fontSize: "24px" }}>arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        backgroundColor: "var(--color-section-bg)",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
           .feature-card:hover {
             transform: translateY(-4px);
             box-shadow: 0 12px 32px rgba(49,87,155,0.12);
              border-color: var(--sys-primary);
           }
           .use-case-card:hover {
             transform: translateY(-4px);
             box-shadow: 0 12px 32px rgba(0,0,0,0.4);
             border-color: var(--sys-primary);
           }
           :root.light .feature-card {
             background-color: #D8E4F3 !important;
             border-color: #c3d5ed !important;
           }
         `}} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.headlineLarge,
             color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xs,
          }}>
            Everything You Need to Deliver Professional Reports
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
             color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: tokens.spacing.xxl,
          }}>
            Speed, accuracy, and consistency — built for field inspectors
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  backgroundColor: tokens.colors.surfaceContainer,
                  borderRadius: "20px",
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  padding: tokens.spacing.md,
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {feature.imageUrl ? (
                  <div style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    marginBottom: tokens.spacing.lg,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ height: "16px" }} />
                )}
                <div style={{
                  padding: `0 ${tokens.spacing.sm}`,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <h4 style={{
                    fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                    fontSize: "20px",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: tokens.colors.onSurface,
                    marginBottom: "12px",
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                    fontSize: "15px",
                    fontStyle: "italic",
                    color: tokens.colors.onSurfaceVariant,
                    lineHeight: 1.6,
                    paddingBottom: tokens.spacing.sm,
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        backgroundColor: "var(--color-section-bg)",
        position: "relative",
      }}>
        <style dangerouslySetInnerHTML={{
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
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease;
          }
          .use-case-card-bento:hover {
            transform: translateY(-4px);
             border-color: var(--sys-outline-variant);
            box-shadow: 0 12px 32px rgba(0,0,0,0.3);
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
        `}} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", textAlign: "center" }}>
            <span style={{
               color: tokens.colors.primary,
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "var(--sys-typescale-body-large-fontfamily)",
              display: "block",
              marginBottom: "12px",
              letterSpacing: "0.01em"
            }}>Who It&apos;s For</span>
            <h2 style={{
              ...tokens.typography.headlineLarge,
              color: tokens.colors.onSurface,
              textAlign: "center",
              margin: "0 auto",
              maxWidth: "800px",
            }}>
              Built for Field Professionals
            </h2>
          </div>

          <div className="bento-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginTop: "48px",
          }}>
            {useCases.map((useCase, i) => {
              const spanClass = (i === 0 || i === 3) ? "bento-span-2" : "bento-span-1";

              return (
                <div
                  key={i}
                  className={`use-case-card-bento ${spanClass}`}
                >
                  {useCase.imageUrl && (
                    <div style={{
                      height: "240px",
                      width: "100%",
                      backgroundColor: "#0B1120",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      overflow: "hidden",
                    }}>
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
                  <div style={{
                    padding: "32px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end" // Pushes text down nicely
                  }}>
                    <span style={{
                      color: tokens.colors.onSurfaceVariant,
                      fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                      fontSize: "13px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      textTransform: "capitalize",
                    }}>
                      {useCase.title.split(" ")[0]}
                    </span>
                    <h4 style={{
                      color: tokens.colors.onSurface,
                      fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                      fontSize: "20px",
                      fontWeight: "500",
                      marginBottom: "12px",
                    }}>
                      {useCase.title}
                    </h4>
                    <p style={{
                      color: tokens.colors.onSurfaceVariant,
                      fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      opacity: 0.7,
                    }}>
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
      <section style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        backgroundColor: "var(--color-section-bg)",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
           .cta-card {
              background-color: var(--sys-surface-roles-surface-container);
             background-image: radial-gradient(ellipse at bottom, var(--sys-primary) 0%, transparent 60%);
             border: 1px solid var(--sys-outline-variant);
             border-radius: 20px;
             padding: 50px 24px; // Removed another 50px of total height
             text-align: center;
             position: relative;
             overflow: hidden;
             box-shadow: 0 20px 40px rgba(0,0,0,0.3);
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
         `}} />
        <div className="cta-card" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <h2 style={{
              fontFamily: "var(--sys-typescale-headline-large-fontfamily)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 600,
              color: tokens.colors.onSurface,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textAlign: "center",
            }}>
              Go From Images to Report in Minutes
            </h2>
            <p style={{
              fontFamily: "var(--sys-typescale-body-large-fontfamily)",
              fontSize: "17px",
              color: tokens.colors.onSurfaceVariant,
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "540px",
              margin: "0 auto 40px",
              textAlign: "center",
            }}>
              Upload your first set of images and see what FieldSpec can do. No credit card required.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginTop: "40px" }}>
              <Link href="/signup" className="cta-primary-btn">
                Start Free
              </Link>
              <Link href="#how-it-works" className="cta-secondary-link">
                Watch the Demo <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

<footer style={{
        backgroundColor: "var(--footer-bg)",
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        fontFamily: tokens.typography.bodyMedium.fontFamily,
      }}>
        <style>{`
            .footer-link { color: var(--footer-color); opacity: 0.8; text-decoration: none; transition: color 0.3s ease, opacity 0.3s ease; font-family: ${tokens.typography.bodyMedium.fontFamily}; }
            .footer-link:hover { opacity: 1; color: var(--footer-color) !important; }
            .social-footer-icon { color: var(--footer-color); opacity: 0.6; transition: color 0.3s ease, opacity 0.3s ease; font-size: 20px; display: flex; align-items: center; justify-content: center; }
            .social-footer-icon:hover { opacity: 1; color: var(--footer-color) !important; }
          `}</style>
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: tokens.spacing.xl,
        }}>
          <div>
            <Brand size="md" />
             <p style={{ ...tokens.typography.bodySmall, color: "var(--footer-color)", opacity: 0.8, marginTop: tokens.spacing.md }}>
              From drone images to professional reports. In minutes.
            </p>
          </div>

           <div>
             <h4 style={{ ...tokens.typography.labelLarge, color: "var(--footer-color)", marginBottom: tokens.spacing.md }}>
               Product
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#features" className="footer-link" style={tokens.typography.bodySmall}>Features</a>
              <a href="#how-it-works" className="footer-link" style={tokens.typography.bodySmall}>How It Works</a>
              <a href="#use-cases" className="footer-link" style={tokens.typography.bodySmall}>Use Cases</a>
              <Link href="/signup" className="footer-link" style={tokens.typography.bodySmall}>Get Started</Link>
            </div>
          </div>

           <div>
             <h4 style={{ ...tokens.typography.labelLarge, color: "var(--footer-color)", marginBottom: tokens.spacing.md }}>
               Company
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>About</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Blog</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Careers</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Contact</a>
            </div>
          </div>

           <div>
             <h4 style={{ ...tokens.typography.labelLarge, color: "var(--footer-color)", marginBottom: tokens.spacing.md }}>
               Legal
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Privacy Policy</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Terms of Service</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Cookie Policy</a>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: "1200px",
          margin: `${tokens.spacing.xl} auto 0`,
          paddingTop: tokens.spacing.lg,
          borderTop: `1px solid ${tokens.colors.outlineVariant}`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: tokens.spacing.md,
        }}>
           <p style={{ ...tokens.typography.bodySmall, color: "var(--footer-color)", opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} FieldSpec. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: tokens.spacing.md }}>
            <a href="https://x.com/fieldspec" target="_blank" rel="noopener noreferrer" className="social-footer-icon" aria-label="Twitter" style={{ padding: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.5H2.66l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com/company/fieldspec" target="_blank" rel="noopener noreferrer" className="social-footer-icon" aria-label="LinkedIn" style={{ padding: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://github.com/fieldspec" target="_blank" rel="noopener noreferrer" className="social-footer-icon" aria-label="GitHub" style={{ padding: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
