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
    { title: "Drone Operators", description: "Deliver reports faster to clients" },
    { title: "Infrastructure Inspectors", description: "Standardize inspection workflows" },
    { title: "Field Teams", description: "Organize and analyze large image sets" },
  ];

  const steps = [
    { num: "1", title: "Upload Your Images", description: "Drag and drop your drone images. GPS data is extracted automatically.", icon: "upload" },
    { num: "2", title: "Tag & Organize", description: "Categorize images by project, location, or condition in seconds.", icon: "label" },
    { num: "3", title: "Analyze with AI", description: "AI detects patterns, flags issues, and generates findings for every image.", icon: "auto_awesome" },
    { num: "4", title: "Export Your Report", description: "Generate a polished PDF report and share with stakeholders immediately.", icon: "description" },
  ];

  return (
    <main style={{ flex: 1 }}>
      {/* Navigation */}
      <nav style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.xxl}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 10,
      }}>
<style>{`
              .nav-link:hover { color: ${tokens.colors.primary} !important; opacity: 0.8; }
              .nav-link { text-decoration: none; transition: color 0.3s ease; color: #ffffff !important; font-weight: 500; }
              .btn-primary:hover { background-color: ${tokens.colors.primaryContainer} !important; color: ${tokens.colors.onPrimaryContainer} !important; }
              .btn-primary { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; border-radius: 16px; }
              .btn-outline:hover { background-color: ${tokens.colors.surfaceVariant} !important; }
              .btn-outline { text-decoration: none; transition: background-color 0.3s ease; color: ${tokens.colors.onSurface} !important; border-radius: 16px; }
              .btn-text:hover { color: ${tokens.colors.onPrimary} !important; opacity: 1; }
              .btn-text { text-decoration: none; transition: color 0.3s ease; color: ${tokens.colors.onPrimary} !important; border-radius: 16px; }
              .social-icon { color: ${tokens.colors.onSurfaceVariant}; transition: color 0.3s ease; }
              .social-icon:hover { color: ${tokens.colors.onSurface} !important; }
              /* Header layout */
              .header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              }
              .header-brand {
                display: flex;
                align-items: center;
              }
              .header-nav {
                display: flex;
                align-items: center;
                gap: ${tokens.spacing.lg};
              }
              .header-actions {
                display: flex;
                align-items: center;
                gap: ${tokens.spacing.lg};
              }
            `}</style>
          <div className="header-brand">
            <Brand size="md" />
          </div>
          <div className="header-nav">
            <Link href="#features" className="nav-link" style={{ ...tokens.typography.labelLarge }}>
              Features
            </Link>
            <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.labelLarge }}>
              How It Works
            </Link>
            <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.labelLarge }}>
              Use Cases
            </Link>
          </div>
          <div className="header-actions">
<Link href="/login" className="btn-text" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onPrimary }}>
              Log In
            </Link>
            <Link href="/signup" className="btn-primary" style={{
                padding: "16px 20px",
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.onPrimary,
                textDecoration: "none",
                borderRadius: "16px",
                ...tokens.typography.labelLarge,
                fontWeight: "600",
              }}>
              Get Started
            </Link>
<ThemeToggle />
          </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "700px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        zIndex: 1,
        animation: "heroFadeIn 1s ease-out forwards",
        backgroundColor: "#000",
      }}>
        {/* Video Background */}
        <div className="hero-video-container">
          <iframe
            className="hero-video"
            src="https://streamable.com/e/lbw4qo?autoplay=1&loop=1&muted=1&controls=0"
            title="Promotional video background"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            loading="eager"
            aria-hidden="true"
            sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          />
        </div>
        <div className="hero-video-overlay" />
        {/* Image Background for Mobile */}
        <div className="hero-image-container">
          <img
            className="hero-image"
            src="https://i.postimg.cc/fLq17NNx/agriculture-healthy-food-(1).jpg"
            alt="Drone surveying healthy crops"
            loading="eager"
          />
        </div>

        {/* Content */}
        <div className="hero-content" style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1000px",
          width: "100%",
          padding: `0 ${tokens.spacing.lg}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "contentSlideUp 1.2s ease-out forwards",
          opacity: 0,
          animationDelay: "0.2s",
        }}>
          <h1 className="hero-title" style={{
            fontFamily: tokens.typography.displayLarge.fontFamily,
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 600,
            color: "#FFFFFF",
            marginBottom: tokens.spacing.lg,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}>
            Turn Drone Images into<br />
            <span style={{ color: "#FFFFFF" }}>Client-Ready Reports</span>
          </h1>
          <p className="hero-subcopy" style={{
            fontFamily: tokens.typography.bodyLarge.fontFamily,
            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
            fontWeight: 500,
            color: "#f0f4fa",
            maxWidth: "700px",
            marginBottom: tokens.spacing.xl,
            lineHeight: 1.5,
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}>
            Upload aerial images, get AI-generated analysis and findings, and export a structured PDF report. No manual writing, no missed details, no delays.
          </p>
          <div className="hero-buttons" style={{
            display: "flex",
            gap: tokens.spacing.md,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <Link href="/signup" className="hero-btn-primary">
              Start Your First Report
            </Link>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes heroFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes contentSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .hero-video-container {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
            background-color: #000;
          }
          .hero-video-overlay {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.55) 0%,
              rgba(0, 0, 0, 0.45) 100%
            );
            z-index: 1;
          }
          .hero-video {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 177.77778vh;
            min-width: 100%;
            height: 56.25vw;
            min-height: 100%;
            transform: translate(-50%, -50%);
            border: none;
            pointer-events: none;
          }
          .hero-image-container {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            overflow: hidden;
            z-index: 0;
            background-color: #000;
            display: none;
          }
          .hero-image {
            position: absolute;
            top: 50%; left: 50%;
            min-width: 100%; min-height: 100%;
            width: auto; height: auto;
            transform: translate(-50%, -50%);
            object-fit: cover;
          }

          /* Token-Based Primary Button */
          .hero-btn-primary {
            padding: var(--sys-spacing-spacing-md) var(--sys-spacing-spacing-md-y);
            background-color: #315f9b;
            color: #ffffff;
            text-decoration: none;
            border-radius: 16px;
            font-family: var(--sys-typescale-label-large-fontfamily);
            font-size: var(--sys-typescale-label-large-fontsize);
            font-weight: 500;
            border: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .hero-btn-primary:hover {
            background-color: #d8e4f3;
            color: #0c1827;
            transform: translateY(-2px);
            box-shadow: var(--sys-elevation-8dp) !important;
          }

          /* Token-Based Secondary Button */
          .hero-btn-secondary {
            padding: var(--sys-spacing-spacing-md) var(--sys-spacing-spacing-xl);
            background-color: transparent;
            color: #ffffff;
            text-decoration: none;
            border-radius: 16px;
            font-family: var(--sys-typescale-label-large-fontfamily);
            font-size: var(--sys-typescale-label-large-fontsize);
            font-weight: 500;
            border: 2px solid #ffffff;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .hero-btn-secondary:hover {
            background-color: #d8e4f3;
            color: #0c1827;
            border-color: #d8e4f3;
            transform: translateY(-2px);
            box-shadow: var(--sys-elevation-8dp) !important;
          }

          /* Responsive Adjustments */
          @media (max-width: 1024px) {
            .hero-section {
              height: 90vh;
              min-height: 600px;
            }
          }
          @media (max-width: 768px) {
            .hero-section {
              height: 100vh;
              min-height: 600px;
            }
            .hero-video-container { display: none; }
            .hero-image-container { display: block; }
            
            .hero-buttons { flex-direction: column; width: 100%; }
            .hero-buttons > a { width: 100%; max-width: none; }
          }
        `}} />
      </section>

      {/* Problem → Solution Section */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
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
        padding: `160px ${tokens.spacing.lg} ${tokens.spacing.xxl}`, 
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
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
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
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: "var(--color-section-bg)",
        position: "relative",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--sys-spacing-lg);
            margin-top: var(--sys-spacing-spacing-xl);
          }
          .use-case-card-bento {
            background: var(--sys-surface-roles-surface-container);
            border: 1px solid var(--sys-outline-roles-outline-variant);
            border-radius: var(--sys-radius-lg);
            padding: var(--sys-spacing-lg);
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease, border-color 0.3s ease;
          }
          .use-case-card-bento:hover {
            transform: translateY(-4px);
            border-color: var(--sys-primary);
            box-shadow: var(--sys-elevation-8dp);
          }
          @media (max-width: 900px) {
            .bento-grid {
              grid-template-columns: 1fr;
            }
          }
        `}} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "var(--sys-spacing-xxl)", textAlign: "center" }}>
            <h2 style={{
              color: "var(--sys-surface-roles-on-surface)",
              fontFamily: "var(--sys-typescale-headline-large-fontfamily)",
              fontSize: "var(--sys-typescale-headline-large-fontsize)",
              fontWeight: 600,
              textAlign: "center",
              margin: "0 auto",
            }}>
              Who It&apos;s For
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
                  className="use-case-card-bento"
                >
                  <div style={{
                    padding: "var(--sys-spacing-md)",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <h4 style={{
                      color: "var(--sys-surface-roles-on-surface)",
                      fontFamily: "var(--sys-typescale-title-large-fontfamily)",
                      fontSize: "var(--sys-typescale-title-large-fontsize)",
                      fontWeight: 500,
                      marginBottom: "var(--sys-spacing-sm)",
                    }}>
                      {useCase.title}
                    </h4>
                    <p style={{
                      color: "var(--sys-surface-roles-on-surface-variant)",
                      fontFamily: "var(--sys-typescale-body-medium-fontfamily)",
                      fontSize: "var(--sys-typescale-body-medium-fontsize)",
                      lineHeight: "var(--sys-typescale-body-medium-lineheight)",
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

      {/* SECTION 2: OUTPUT */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: "var(--color-section-bg)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sys-spacing-xxl)", alignItems: "center" }}>
          <div>
            <h2 style={{
              fontFamily: "var(--sys-typescale-headline-large-fontfamily)",
              fontSize: "var(--sys-typescale-headline-large-fontsize)",
              fontWeight: 600,
              color: "var(--sys-surface-roles-on-surface)",
              marginBottom: "var(--sys-spacing-lg)",
            }}>
              Professional reports, ready in minutes
            </h2>
            <p style={{
              fontFamily: "var(--sys-typescale-body-large-fontfamily)",
              fontSize: "var(--sys-typescale-body-large-fontsize)",
              color: "var(--sys-surface-roles-on-surface-variant)",
              lineHeight: "var(--sys-typescale-body-large-lineheight)",
            }}>
              No formatting. No repetitive writing. Just export.
            </p>
          </div>
          <div style={{
            backgroundColor: "var(--sys-surface-roles-surface-container)",
            borderRadius: "var(--sys-radius-lg)",
            padding: "var(--sys-spacing-lg)",
            border: "1px solid var(--sys-outline-roles-outline-variant)",
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <p style={{
              color: "var(--sys-surface-roles-on-surface-variant)",
              fontFamily: "var(--sys-typescale-body-medium-fontfamily)",
              fontSize: "var(--sys-typescale-body-medium-fontsize)",
            }}>
              Report Preview
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: `0 24px 160px`, // Added large explicit spacing between CTA and footer
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
        <div className="cta-card" style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <h2 style={{
              fontFamily: "var(--sys-typescale-headline-large-fontfamily)",
              fontSize: "var(--sys-typescale-headline-large-fontsize)",
              fontWeight: 600,
              color: "var(--sys-surface-roles-on-surface)",
              marginBottom: "var(--sys-spacing-lg)",
              textAlign: "center",
            }}>
              Start generating inspection reports in minutes
            </h2>
            <Link href="/signup" className="cta-primary-btn">
              Get Started
            </Link>
            <p style={{
              fontFamily: "var(--sys-typescale-body-medium-fontfamily)",
              fontSize: "var(--sys-typescale-body-medium-fontsize)",
              color: "var(--sys-surface-roles-on-surface-variant)",
              marginTop: "var(--sys-spacing-md)",
              textAlign: "center",
            }}>
              No credit card required
            </p>
          </div>
        </div>
      </section>

<footer style={{
        backgroundColor: "var(--footer-bg)",
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
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
