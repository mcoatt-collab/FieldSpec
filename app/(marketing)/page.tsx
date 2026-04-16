import Link from "next/link";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Drone Survey Report Builder | FieldSpec",
  description:
    "Transform drone imagery into actionable insights. FieldSpec uses AI to analyze aerial surveys and generate professional reports for agriculture, construction, and infrastructure.",
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
      title: "AI-Generated Insights",
      description: "Get automated findings and recommendations for every image. No more manual analysis.",
    },
    {
      title: "Image-Based Analysis",
      description: "Upload drone images with GPS data. AI extracts patterns and identifies issues automatically.",
    },
    {
      title: "Structured Reports",
      description: "Build professional reports with consistent formatting. Export-ready in minutes.",
    },
    {
      title: "Map Visualisation",
      description: "See all your images on an interactive map. Pinpoint issues to exact locations.",
    },
    {
      title: "Fast Export",
      description: "Generate PDF reports with one click. Share with stakeholders instantly.",
    },
  ];

  const useCases = [
    { title: "Agricultural Inspections", description: "Assess crop health, identify pest damage, monitor irrigation issues across large areas." },
    { title: "Land Surveys", description: "Document land conditions, track changes over time, create comprehensive survey reports." },
    { title: "Infrastructure Inspections", description: "Inspect roofs, bridges, and utility infrastructure safely and efficiently." },
    { title: "Drone Operators", description: "Add professional reporting to your drone services. Deliver more value to clients." },
  ];

  const steps = [
    { num: "1", title: "Upload Drone Images", description: "Drag and drop or batch upload images. GPS data is extracted automatically.", icon: "upload" },
    { num: "2", title: "Tag & Organize", description: "Categorize images by type, location, or condition. Keep everything structured.", icon: "label" },
    { num: "3", title: "Generate AI Insights", description: "Let AI analyze each image and produce findings and recommendations.", icon: "auto_awesome" },
    { num: "4", title: "Export Professional Report", description: "Build and export a structured PDF report. Ready for stakeholders.", icon: "description" },
  ];

  return (
    <main style={{ flex: 1 }}>
      {/* Navigation */}
      <nav style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: tokens.colors.surface,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <style>{`
          .nav-link:hover { color: ${tokens.colors.primary} !important; }
          .nav-link { text-decoration: none; transition: color 0.3s ease; }
          .btn-primary:hover { background-color: ${tokens.colors.primaryContainer} !important; color: ${tokens.colors.onPrimaryContainer} !important; }
          .btn-primary { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; }
          .btn-outline:hover { background-color: ${tokens.colors.surfaceVariant} !important; }
          .btn-outline { text-decoration: none; transition: background-color 0.3s ease; }
          .btn-text:hover { color: ${tokens.colors.primary} !important; }
          .btn-text { text-decoration: none; transition: color 0.3s ease; }
          .social-icon { color: ${tokens.colors.onSurfaceVariant}; transition: color 0.3s ease; }
          .social-icon:hover { color: ${tokens.colors.primary} !important; }

          /* Responsive adjustments for ≤1366px screens */
          @media (max-width: 1366px) {
            .hero-section {
              padding-top: 10vh !important;
            }
            .hero-content {
              max-width: 90vw;
            }
            .hero-title {
              font-size: calc(var(--sys-typescale-display-large-fontsize) * 0.9) !important; /* 54px */
            }
            .hero-subcopy {
              font-size: 18px !important;
              max-width: 90vw;
            }
            .hero-buttons .btn-primary,
            .hero-buttons .btn-outline {
              font-size: calc(var(--sys-typescale-label-large-fontsize) * 1) !important; /* 14px */
              padding: ${tokens.spacing.md} ${tokens.spacing.xl} !important;
            }
          }

          /* Scale up for large screens (≥1920px) */
          @media (min-width: 1920px) {
            .hero-title {
              font-size: calc(var(--sys-typescale-display-large-fontsize) * 1.5) !important; /* 90px */
            }
            .hero-subcopy {
              font-size: 28px !important;
            }
            .hero-buttons .btn-primary,
            .hero-buttons .btn-outline {
              font-size: calc(var(--sys-typescale-label-large-fontsize) * 1.5) !important; /* 21px */
              padding: ${tokens.spacing.lg} ${tokens.spacing.xxl} !important;
            }
          }

          /* Further adjustments for mobile */
          @media (max-width: 768px) {
            .hero-title {
              font-size: calc(var(--sys-typescale-display-large-fontsize) * 0.7) !important; /* 42px */
            }
            .hero-subcopy {
              font-size: 16px !important;
            }
            .hero-buttons {
              flex-direction: column;
              align-items: center;
            }
            .hero-buttons .btn-primary,
            .hero-buttons .btn-outline {
              width: 100%;
              max-width: 300px;
              font-size: calc(var(--sys-typescale-label-large-fontsize) * 0.9) !important; /* ~13px */
              padding: ${tokens.spacing.sm} ${tokens.spacing.lg} !important;
            }
          }

          /* Extra small devices (≤480px) */
          @media (max-width: 480px) {
            .hero-title {
              font-size: calc(var(--sys-typescale-display-large-fontsize) * 0.6) !important; /* 36px */
            }
            .hero-subcopy {
              font-size: 14px !important;
            }
            .hero-buttons .btn-primary,
            .hero-buttons .btn-outline {
              font-size: calc(var(--sys-typescale-label-large-fontsize) * 0.8) !important; /* ~11px */
              padding: ${tokens.spacing.xs} ${tokens.spacing.md} !important;
            }
          }
        `}</style>
        <Brand size="md" />
        <div style={{ display: "flex", gap: tokens.spacing.xl, alignItems: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Link href="#features" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant }}>
            Features
          </Link>
          <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant }}>
            How It Works
          </Link>
          <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant }}>
            Use Cases
          </Link>
        </div>
        <div style={{ display: "flex", gap: tokens.spacing.md, alignItems: "center" }}>
          <Link href="/login" className="btn-text" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface }}>
            Log In
          </Link>
          <Link href="/signup" className="btn-primary" style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.onPrimary,
            textDecoration: "none",
            borderRadius: tokens.radius.md,
            ...tokens.typography.labelLarge,
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        padding: '0',
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingTop: '5vh',
      }}>
        {/* Video Background */}
        <div style={{ 
          position: 'absolute',
          top: '-10px',
          left: '-10px',
          right: '-10px',
          bottom: '-10px',
          zIndex: 0,
        }}>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%',
            overflow: 'hidden',
          }}>
            <iframe
              allow="autoplay; fullscreen"
              allowFullScreen
              height="100%"
              src="https://streamable.com/e/lbw4qo?autoplay=1&loop=1&muted=1"
              width="100%"
              style={{ 
                border: 'none', 
                width: '100%', 
                height: '100%', 
                position: 'absolute', 
                left: '0px', 
                top: '0px',
                objectFit: 'cover',
                minWidth: '100%',
                minHeight: '100%',
                display: 'block',
                transform: 'scale(1.1)',
              }}
              title="FieldSpec Demo Video"
            />
            {/* Dark overlay for text readability */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
        
        {/* Content Overlay */}
        <div className="hero-content" style={{ 
          position: 'relative', 
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0',
          width: '100%',
        }}>
          <h1 className="hero-title" style={{
            ...tokens.typography.displayLarge,
            fontSize: 'calc(var(--sys-typescale-display-large-fontsize) * 1)',
            color: tokens.colors.onPrimary,
            marginBottom: tokens.spacing.xl,
            lineHeight: 1.1,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            Turn Drone Images into <span style={{ color: tokens.colors.primaryContainer }}>Professional Reports in Minutes</span>
          </h1>
           <p className="hero-subcopy" style={{
             ...tokens.typography.bodyLarge,
             color: tokens.colors.onPrimary,
             maxWidth: '1200px',
             margin: `0 auto ${tokens.spacing.xxl}`,
              fontSize: '20px',
             lineHeight: 1.6,
             textShadow: '0 1px 4px rgba(0,0,0,0.3)',
             opacity: 0.9,
           }}>
            Upload your drone images. Let AI analyze them. Export structured reports ready for stakeholders. No manual work required.
          </p>
           <div className="hero-buttons" style={{ display: "flex", gap: tokens.spacing.md, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn-primary" style={{
              padding: `${tokens.spacing.lg} ${tokens.spacing.xxl}`,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.onPrimary,
              textDecoration: "none",
              borderRadius: tokens.radius.md,
               ...tokens.typography.labelLarge,
               fontSize: 'calc(var(--sys-typescale-label-large-fontsize) * 1)',
               boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              Get Started
            </Link>
            <Link href="/login" className="btn-outline" style={{
              padding: `${tokens.spacing.lg} ${tokens.spacing.xxl}`,
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: tokens.colors.onPrimary,
              textDecoration: "none",
              borderRadius: tokens.radius.md,
              border: `1px solid rgba(255,255,255,0.3)`,
               ...tokens.typography.labelLarge,
               fontSize: 'calc(var(--sys-typescale-label-large-fontsize) * 1)',
               backdropFilter: 'blur(10px)',
            }}>
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surfaceVariant,
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: tokens.spacing.xl }}>
            {/* Problem */}
            <div style={{
              padding: tokens.spacing.xl,
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.radius.lg,
              borderLeft: `4px solid ${tokens.colors.error}`,
            }}>
              <h3 style={{
                ...tokens.typography.titleLarge,
                color: tokens.colors.error,
                marginBottom: tokens.spacing.lg,
              }}>
                The Problem
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: tokens.spacing.md }}>
                <li style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.error }}>✕</span>
                  <span style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>Manual report writing is slow and inconsistent</span>
                </li>
                <li style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.error }}>✕</span>
                  <span style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>Drone data is hard to structure and analyze</span>
                </li>
                <li style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.error }}>✕</span>
                  <span style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>Insights vary between team members</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div style={{
              padding: tokens.spacing.xl,
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.radius.lg,
              borderLeft: `4px solid ${tokens.colors.primary}`,
            }}>
              <h3 style={{
                ...tokens.typography.titleLarge,
                color: tokens.colors.primary,
                marginBottom: tokens.spacing.lg,
              }}>
                The Solution
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: tokens.spacing.md }}>
                <li style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.primary }}>✓</span>
                  <span style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>AI automates analysis for consistent insights</span>
                </li>
                <li style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.primary }}>✓</span>
                  <span style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>Structured data from every image automatically</span>
                </li>
                <li style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.primary }}>✓</span>
                  <span style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>Professional reports ready in minutes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surface,
      }}>
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
            Four simple steps from images to reports
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {steps.map((step, index) => (
              <div
                key={step.num}
                style={{
                  padding: tokens.spacing.xl,
                  backgroundColor: tokens.colors.surfaceVariant,
                  borderRadius: tokens.radius.lg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: tokens.spacing.md,
                  boxShadow: `0 4px 12px ${tokens.colors.primary}40`,
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
                  <div style={{
                    position: "absolute",
                    right: "-12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "24px",
                    height: "24px",
                    color: tokens.colors.onSurfaceVariant,
                    display: "none",
                  }}>
                    <span className="material-icons" style={{ fontSize: "24px" }}>chevron_right</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surfaceVariant,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xs,
          }}>
            Features Built for Inspection Reports
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: tokens.spacing.xxl,
          }}>
            Everything you need, nothing you don&apos;t
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: tokens.spacing.xl,
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius.lg,
                }}
              >
                <h4 style={{
                  ...tokens.typography.titleMedium,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.sm,
                }}>
                  {feature.title}
                </h4>
                <p style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  lineHeight: 1.5,
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surface,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xs,
          }}>
            Built for Field Inspections
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: tokens.spacing.xxl,
          }}>
            Designed for clarity, speed, and accuracy
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {useCases.map((useCase, i) => (
              <div
                key={i}
                style={{
                  padding: tokens.spacing.xl,
                  backgroundColor: tokens.colors.surfaceVariant,
                  borderRadius: tokens.radius.lg,
                }}
              >
                <h4 style={{
                  ...tokens.typography.titleMedium,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.sm,
                }}>
                  {useCase.title}
                </h4>
                <p style={{
                  ...tokens.typography.bodySmall,
                  color: tokens.colors.onSurfaceVariant,
                  lineHeight: 1.5,
                }}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.primaryContainer,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onPrimaryContainer,
            marginBottom: tokens.spacing.md,
          }}>
            Start Building Reports Today
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onPrimaryContainer,
            marginBottom: tokens.spacing.xl,
            opacity: 0.9,
          }}>
            Upload your first images and see how FieldSpec transforms your inspection workflow.
          </p>
          <Link href="/signup" className="btn-primary" style={{
            display: "inline-block",
            padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.onPrimary,
            textDecoration: "none",
            borderRadius: tokens.radius.md,
            ...tokens.typography.labelLarge,
          }}>
            Start Building Reports
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surfaceVariant,
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: tokens.spacing.xxl,
            marginBottom: tokens.spacing.xl,
          }}>
            {/* Brand Column */}
            <div>
              <Brand size="md" className="mb-md" />
              <p style={{
                ...tokens.typography.bodySmall,
                color: tokens.colors.onSurfaceVariant,
                lineHeight: 1.6,
                maxWidth: "250px",
              }}>
                AI-powered inspection reports for drone surveys. Turn images into professional reports in minutes.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 style={{
                ...tokens.typography.labelLarge,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}>
                Product
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
                <Link href="#features" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Features</Link>
                <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>How It Works</Link>
                <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Use Cases</Link>
                <Link href="/signup" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Get Started</Link>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 style={{
                ...tokens.typography.labelLarge,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}>
                Company
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
                <Link href="#" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>About</Link>
                <Link href="#" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Blog</Link>
                <Link href="#" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Careers</Link>
                <Link href="#" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Contact</Link>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 style={{
                ...tokens.typography.labelLarge,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}>
                Legal
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
                <Link href="#" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Privacy Policy</Link>
                <Link href="#" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Terms of Service</Link>
                <Link href="#" className="nav-link" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>Cookie Policy</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: tokens.spacing.lg,
            borderTop: `1px solid ${tokens.colors.outlineVariant}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: tokens.spacing.md,
          }}>
            <p style={{
              ...tokens.typography.bodySmall,
              color: tokens.colors.onSurfaceVariant,
            }}>
              © {new Date().getFullYear()} FieldSpec. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: tokens.spacing.md }}>
              <Link href="#" className="social-icon" style={{ display: "flex", alignItems: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              <Link href="#" className="social-icon" style={{ display: "flex", alignItems: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Link>
              <Link href="#" className="social-icon" style={{ display: "flex", alignItems: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
