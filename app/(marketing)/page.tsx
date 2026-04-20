import Link from "next/link";
import type { Metadata } from "next";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";
import Navbar from "@/components/marketing/Navbar";
import { Features, HowItWorks } from "@/components/marketing/Sections";
import ThemeToggle from "@/components/ThemeToggle";

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
      imageUrl: "/images/ai-generated-insights.jpg",
    },
    {
      title: "Image-Based Analysis",
      description: "Upload drone images with GPS data. AI extracts patterns and identifies issues automatically.",
      imageUrl: "/images/image-based-analysis.jpg",
    },
    {
      title: "Structured Reports",
      description: "Build professional reports with consistent formatting. Export-ready in minutes.",
      imageUrl: "/images/structured-reports.jpg",
    },
    {
      title: "Map Visualisation",
      description: "See all your images on an interactive map. Pinpoint issues to exact locations.",
      imageUrl: "/images/map-visualisation.jpg",
    },
    {
      title: "Fast Export",
      description: "Generate PDF reports with one click. Share with stakeholders instantly.",
      imageUrl: "/images/hand-holding-stopwatch.jpg",
    },
  ];

  const useCases = [
    { title: "Agricultural Inspections", description: "Assess crop health, identify pest damage, monitor irrigation issues across large areas.", imageUrl: "/images/agricultural-inspections.jpg" },
    { title: "Land Surveys", description: "Document land conditions, track changes over time, create comprehensive survey reports.", imageUrl: "/images/land-surveys.jpg" },
    { title: "Infrastructure Inspections", description: "Inspect roofs, bridges, and utility infrastructure safely and efficiently.", imageUrl: "/images/infrastructure-inspections.jpg" },
    { title: "Drone Operators", description: "Add professional reporting to your drone services. Deliver more value to clients.", imageUrl: "/images/drone-operators.jpg" },
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
        backgroundColor: "var(--color-section-bg)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}>
        <style>{`
             .nav-link:hover { color: ${tokens.colors.primary} !important; opacity: 0.8; }
             .nav-link { text-decoration: none; transition: color 0.3s ease; color: ${tokens.colors.onSurface} !important; font-weight: 500; }
             .btn-primary:hover { background-color: ${tokens.colors.primaryContainer} !important; }
            .btn-primary { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; }
             .btn-outline:hover { background-color: ${tokens.colors.surfaceVariant} !important; }
             .btn-outline { text-decoration: none; transition: background-color 0.3s ease; color: ${tokens.colors.onSurface} !important; }
             .btn-text:hover { color: ${tokens.colors.primary} !important; opacity: 1; }
             .btn-text { text-decoration: none; transition: color 0.3s ease; color: ${tokens.colors.onSurfaceVariant} !important; }
              .social-icon { color: ${tokens.colors.onSurfaceVariant}; transition: color 0.3s ease; }
              .social-icon:hover { color: ${tokens.colors.onSurface} !important; }
             /* Desktop navigation */
             .desktop-nav {
               display: flex;
               flex: 1;
               justify-content: space-between;
               align-items: center;
             }
             .nav-center {
               display: flex;
               align-items: center;
               justify-content: center;
               flex: 1;
               gap: ${tokens.spacing.lg};
             }
             .nav-right {
               display: flex;
               align-items: center;
               gap: ${tokens.spacing.md};
               margin-left: auto;
             }
            /* Hamburger menu styles */
           .hamburger-menu {
             display: flex;
             flex-direction: column;
             justify-content: space-around;
             width: 30px;
             height: 24px;
             background: transparent;
             border: none;
             cursor: pointer;
             padding: 0;
             z-index: 101;
           }
           .hamburger-menu span {
             width: 100%;
             height: 3px;
              background: var(--sys-on-surface);
             border-radius: 2px;
             transition: all 0.3s ease;
           }
           .hamburger-menu span:nth-child(1) { transform-origin: 0% 0%; }
           .hamburger-menu span:nth-child(2) { opacity: 1; }
           .hamburger-menu span:nth-child(3) { transform-origin: 0% 100%; }
           #menu-toggle:checked ~ .hamburger-menu span:nth-child(1) {
             transform: rotate(45deg) translate(1px, -1px);
           }
           #menu-toggle:checked ~ .hamburger-menu span:nth-child(2) {
             opacity: 0;
           }
           #menu-toggle:checked ~ .hamburger-menu span:nth-child(3) {
             transform: rotate(-45deg) translate(1px, 1px);
           }
            /* Dropdown menu */
            .dropdown-menu {
              position: absolute;
              top: 100%;
              left: 0;
              width: 100%;
               background: var(--color-section-bg);
               border-bottom: 1px solid var(--sys-outline-variant);
              box-shadow: 0 8px 24px rgba(0,0,0,0.1);
              padding: ${tokens.spacing.lg};
              display: flex;
              flex-direction: column;
              gap: ${tokens.spacing.md};
              z-index: 99;
              opacity: 0;
              visibility: hidden;
              max-height: 0;
              overflow: hidden;
              transition: opacity 0.3s ease, visibility 0.3s ease, max-height 0.3s ease;
            }
            #menu-toggle:checked ~ .dropdown-menu {
              opacity: 1;
              visibility: visible;
              max-height: 500px;
            }
            .dropdown-link {
               color: var(--sys-on-surface);
              text-decoration: none;
              padding: ${tokens.spacing.sm} 0;
              transition: color 0.3s ease;
              font-weight: 500;
            }
            .dropdown-link:hover {
               color: var(--sys-primary) !important;
            }
           .dropdown-actions {
             display: flex;
             flex-direction: column;
             gap: ${tokens.spacing.sm};
             margin-top: ${tokens.spacing.md};
           }
            .dropdown-actions .btn-text,
            .dropdown-actions .btn-primary {
              width: 100%;
              text-align: center;
            }
            /* Media queries for responsive navigation */
            @media (max-width: 768px) {
              .desktop-nav {
                display: none;
              }
            }
            @media (min-width: 769px) {
              .hamburger-menu {
                display: none;
              }
              .dropdown-menu {
                display: none;
              }
            }
          `}</style>
        <Brand size="md" />
        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <div className="nav-center">
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
          <div className="nav-right">
            <Link href="/login" className="btn-text" style={{ ...tokens.typography.labelLarge }}>
              Log In
            </Link>
             <Link href="/signup" className="btn-primary" style={{
               padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
               backgroundColor: tokens.colors.primary,
               color: tokens.colors.onPrimary,
               textDecoration: "none",
               borderRadius: tokens.radius.md,
               ...tokens.typography.labelLarge,
               fontWeight: "600",
             }}>
              Get Started
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <input type="checkbox" id="menu-toggle" style={{ display: "none" }} />
        <label htmlFor="menu-toggle" className="hamburger-menu" style={{ marginLeft: "auto" }}>
          <span></span>
          <span></span>
          <span></span>
        </label>
        <div className="dropdown-menu">
          <Link href="#features" className="dropdown-link" style={{ ...tokens.typography.labelLarge }}>
            Features
          </Link>
          <Link href="#how-it-works" className="dropdown-link" style={{ ...tokens.typography.labelLarge }}>
            How It Works
          </Link>
          <Link href="#use-cases" className="dropdown-link" style={{ ...tokens.typography.labelLarge }}>
            Use Cases
          </Link>
          <div className="dropdown-actions">
            <Link href="/login" className="btn-text" style={{ ...tokens.typography.labelLarge }}>
              Log In
            </Link>
             <Link href="/signup" className="btn-primary final-cta-btn" style={{
               padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
               backgroundColor: tokens.colors.primary,
               color: tokens.colors.onPrimary,
               textDecoration: "none",
               borderRadius: tokens.radius.md,
               ...tokens.typography.labelLarge,
               fontWeight: "600",
             }}>
              Get Started
            </Link>
            <ThemeToggle />
          </div>
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
        backgroundColor: "var(--color-section-bg)",
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
            textShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>
            Turn Drone Images into<br />
            <span style={{ color: "#FFFFFF" }}>Professional Reports in Minutes</span>
          </h1>
          <p className="hero-subcopy" style={{
            fontFamily: tokens.typography.bodyLarge.fontFamily,
            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
            fontWeight: 400,
            color: "#FFFFFF",
            maxWidth: "700px",
            marginBottom: tokens.spacing.xl,
            lineHeight: 1.5,
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}>
            Upload your drone images. Let AI analyze them. Export structured reports ready for stakeholders. No manual work required.
          </p>
          <div className="hero-buttons" style={{
            display: "flex",
            gap: tokens.spacing.md,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <Link href="/signup" className="hero-btn-primary" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
              Get Started
            </Link>
            <Link href="/login" className="hero-btn-secondary" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
              Request Demo
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
            top: 0; left: 0; width: 100%; height: 100%;
            overflow: hidden;
            z-index: 0;
            background-color: #000;
          }
          .hero-video {
            position: absolute;
            top: 50%; left: 50%;
            min-width: 100%; min-height: 100%;
            width: auto; height: auto;
            transform: translate(-50%, -50%) scale(1.1);
            object-fit: cover;
            object-position: center center;
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
            padding: var(--sys-spacing-spacing-md) var(--sys-spacing-spacing-xl);
            background-color: var(--sys-primary);
            color: var(--sys-on-primary);
            text-decoration: none;
            border-radius: var(--sys-radius-md);
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
            background-color: var(--ref-primary-primary30);
            transform: translateY(-2px);
            box-shadow: var(--sys-elevation-8dp) !important;
          }

          /* Token-Based Secondary Button */
          .hero-btn-secondary {
            padding: var(--sys-spacing-spacing-md) var(--sys-spacing-spacing-xl);
            background-color: transparent;
            color: var(--ref-neutral-neutral100);
            text-decoration: none;
            border-radius: var(--sys-radius-md);
            font-family: var(--sys-typescale-label-large-fontfamily);
            font-size: var(--sys-typescale-label-large-fontsize);
            font-weight: 500;
            border: 2px solid var(--ref-neutral-neutral100);
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .hero-btn-secondary:hover {
            background-color: var(--ref-neutral-neutral100);
            color: var(--ref-primary-primary30);
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
            From Manual Hassle to Automated Insight
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            marginBottom: tokens.spacing.xxl,
          }}>
            Traditional drone data processing is time‑consuming and error‑prone. FieldSpec transforms raw images into actionable intelligence.
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
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Manual report writing is slow, inconsistent, and prone to human error</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: tokens.colors.primary, fontSize: tokens.typography.bodyMedium.fontSize, fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Drone data remains unstructured, making analysis and comparison difficult</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: tokens.colors.primary, fontSize: tokens.typography.bodyMedium.fontSize, fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Insights vary between team members, reducing decision‑making confidence</span>
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
                  <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-medium-fontsize)", color: tokens.colors.onSurfaceVariant }}>3 major pain points</span>
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
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>AI‑powered analysis delivers consistent, accurate insights in minutes</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                       <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.secondaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <span style={{ color: tokens.colors.secondary, fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                       </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Automatic structuring of drone data into searchable, comparable formats</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                       <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.secondaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <span style={{ color: tokens.colors.secondary, fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                       </div>
                    </div>
                    <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, lineHeight: 1.6 }}>Professional reports generated automatically, ready for stakeholders</span>
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
                   <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-medium-fontsize)", color: tokens.colors.onSurfaceVariant }}>3 key benefits</span>
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
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
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
            }}>Field Inspections</span>
            <h2 style={{
              ...tokens.typography.headlineLarge,
              color: tokens.colors.onSurface,
              textAlign: "center",
              margin: "0 auto",
              maxWidth: "800px",
            }}>
              Built for Field Inspections
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
              background-color: rgba(255,255,255,0.15);
              color: var(--sys-on-surface);
              padding: 12px 24px;
             border-radius: 8px;
             font-size: 15px;
             font-weight: 500;
             text-decoration: none;
             transition: background-color 0.2s, transform 0.2s;
             border: 1px solid rgba(255,255,255,0.05);
             display: inline-block;
           }
           .cta-primary-btn:hover {
             background-color: rgba(255,255,255,0.22);
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
              Start Building Reports Today
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
              Upload your first images and see how FieldSpec transforms your inspection workflow.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginTop: "40px" }}>
              <Link href="/signup" className="cta-primary-btn">
                Get started
              </Link>
              <Link href="/demo" className="cta-secondary-link">
                Learn more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

<footer style={{
        backgroundColor: "var(--color-section-bg)",
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        fontFamily: tokens.typography.bodyMedium.fontFamily,
      }}>
        <style>{`
          .footer-link { color: ${tokens.colors.onSurfaceVariant}; text-decoration: none; transition: color 0.3s ease; font-family: ${tokens.typography.bodyMedium.fontFamily}; }
          .footer-link:hover { color: #FFFFFF !important; }
          .social-footer-icon { color: rgba(255, 255, 255, 0.6); transition: color 0.3s ease; font-size: 20px; }
          .social-footer-icon:hover { color: #FFFFFF !important; }
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
            <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.md }}>
              AI-powered field analysis for agriculture, construction, and infrastructure.
            </p>
          </div>

          <div>
            <h4 style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface, marginBottom: tokens.spacing.md }}>
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
            <h4 style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface, marginBottom: tokens.spacing.md }}>
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
            <h4 style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface, marginBottom: tokens.spacing.md }}>
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
          <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>
            &copy; {new Date().getFullYear()} FieldSpec. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: tokens.spacing.md }}>
            <a href="#" className="social-footer-icon" aria-label="Twitter">𝕏</a>
            <a href="#" className="social-footer-icon" aria-label="LinkedIn">in</a>
            <a href="#" className="social-footer-icon" aria-label="GitHub">⌘</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
