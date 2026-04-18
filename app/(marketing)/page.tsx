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
            /* Desktop navigation */
            .desktop-nav {
              display: flex;
              align-items: center;
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
             background: ${tokens.colors.onSurface};
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
              background: ${tokens.colors.surface};
              border-bottom: 1px solid ${tokens.colors.outlineVariant};
              box-shadow: 0 8px 16px rgba(0,0,0,0.1);
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
              color: ${tokens.colors.onSurfaceVariant};
              text-decoration: none;
              padding: ${tokens.spacing.sm} 0;
              transition: color 0.3s ease;
            }
            .dropdown-link:hover {
              color: ${tokens.colors.primary} !important;
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
            <Link href="#features" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant, marginRight: tokens.spacing.lg }}>
              Features
            </Link>
            <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant, marginRight: tokens.spacing.lg }}>
              How It Works
            </Link>
            <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant, marginRight: tokens.spacing.lg }}>
              Use Cases
            </Link>
            <Link href="/login" className="btn-text" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface, marginRight: tokens.spacing.md }}>
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
         </div>
       </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        position: "relative",
        overflow: "hidden",
        height: "100vh",
        minHeight: "768px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        textAlign: "center",
      }}>
        {/* Video Background */}
        <div className="hero-video-container">
          <iframe
            className="hero-video"
            src="https://streamable.com/e/lbw4qo?autoplay=1&loop=1&muted=1"
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
         {/* Light gradient overlay */}
         <div style={{
           position: "absolute",
           top: 0,
           left: 0,
           width: "100%",
           height: "100%",
           background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
           zIndex: 1,
         }} />
        
        {/* Content */}
        <div className="hero-content" style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          width: "100%",
          padding: "0 24px",
          marginTop: "-10vh",
        }}>
          <h1 className="hero-title" style={{
            fontFamily: tokens.typography.displayLarge.fontFamily,
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 500,
            color: "var(--ref-neutral-neutral100)",
            marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
            lineHeight: 1.1,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}>
            Turn Drone Images into<br />
             <span style={{ color: tokens.colors.primary }}>Professional Reports in Minutes</span>
          </h1>
          <p className="hero-subcopy" style={{
            fontFamily: tokens.typography.bodyLarge.fontFamily,
            fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.9)",
            maxWidth: "800px",
            margin: "0 auto",
            marginBottom: "clamp(2rem, 5vw, 3rem)",
            lineHeight: 1.6,
            textShadow: "0 1px 5px rgba(0,0,0,0.2)",
          }}>
            Upload your drone images. Let AI analyze them. Export structured reports ready for stakeholders. No manual work required.
          </p>
          <div className="hero-buttons" style={{
            display: "flex",
            gap: "clamp(1rem, 2vw, 1.5rem)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <Link href="/signup" className="hero-primary-btn">
              Get Started
            </Link>
            <Link href="/login" className="hero-outline-btn">
              Log In
            </Link>
          </div>
        </div>
        
        {/* Responsive CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
            .hero-video-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              z-index: 0;
              background-color: #000000; /* Fallback background */
            }
            .hero-video {
              position: absolute;
              top: 50%;
              left: 50%;
              min-width: 100%;
              min-height: 100%;
              width: auto;
              height: auto;
              transform: translate(-50%, -50%) scale(1.1); /* Slight zoom for better coverage */
              object-fit: cover;
              object-position: center center;
               background-color: #000000;
               border: none;
               margin: 0;
               padding: 0;
               opacity: 1;
                pointer-events: none;
             }
             /* Image background */
             .hero-image-container {
               position: absolute;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               overflow: hidden;
               z-index: 0;
               background-color: #000000;
               display: none;
             }
              .hero-image {
                position: absolute;
                top: 50%;
                left: 50%;
                min-width: 100%;
                min-height: 100%;
                width: auto;
                height: auto;
                transform: translate(-50%, -50%) scale(1.1);
                 object-fit: cover;
                 object-position: center center;
                 opacity: 1;
               }
           .hero-primary-btn {
             padding: clamp(1rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem);
             background-color: var(--sys-primary);
             color: var(--ref-neutral-neutral100);
             text-decoration: none;
             border-radius: var(--sys-radius-md);
             font-family: var(--sys-typescale-label-large-fontfamily);
             font-size: clamp(1rem, 1.5vw, 1.25rem);
             font-weight: 600;
             border: none;
             cursor: pointer;
             transition: background-color 0.2s;
             box-shadow: 0 4px 12px rgba(49, 95, 155, 0.3);
             display: inline-block;
           }
           .hero-primary-btn:hover {
             background-color: var(--ref-primary-primary30);
           }
          .hero-outline-btn {
            padding: clamp(1rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem);
            background-color: transparent;
            color: var(--ref-neutral-neutral100);
            text-decoration: none;
            border-radius: var(--sys-radius-md);
            font-family: var(--sys-typescale-label-large-fontfamily);
            font-size: clamp(1rem, 1.5vw, 1.25rem);
            font-weight: 600;
            border: 2px solid rgba(255,255,255,0.8);
            cursor: pointer;
            transition: all 0.2s;
            display: inline-block;
          }
          .hero-outline-btn:hover {
            background-color: rgba(255,255,255,0.1);
            border-color: var(--ref-neutral-neutral100);
          }
          .hero-section {
            /* Responsive height adjustments */
          }
          @media (max-width: 1366px) {
            .hero-section {
              min-height: 700px;
            }
            .hero-content {
              margin-top: -8vh;
            }
          }
          @media (max-width: 1024px) {
            .hero-section {
              min-height: 650px;
            }
            .hero-title {
              font-size: clamp(2.5rem, 7vw, 4.5rem) !important;
            }
            .hero-subcopy {
              font-size: clamp(1.125rem, 2vw, 1.75rem) !important;
            }
          }
           @media (max-width: 768px) {
             .hero-section {
               min-height: 600px;
             }
             .hero-content {
               margin-top: -5vh;
               padding: 0 20px;
             }
             .hero-buttons {
               flex-direction: column;
               align-items: center;
             }
             .hero-buttons .hero-primary-btn,
             .hero-buttons .hero-outline-btn {
               width: 100%;
               max-width: 300px;
               text-align: center;
             }
              /* Tablet video optimization */
              .hero-video {
                 transform: translate(-50%, -50%) scale(1.35);
              }
              /* Show image, hide video on mobile/tablet */
              .hero-video-container {
                display: none;
              }
              .hero-image-container {
                display: block;
              }
            }
           @media (max-width: 480px) {
             .hero-section {
               min-height: 550px;
             }
             .hero-title {
               font-size: clamp(2rem, 6vw, 3rem) !important;
             }
             .hero-subcopy {
               font-size: clamp(1rem, 1.8vw, 1.5rem) !important;
             }
             /* Mobile video optimization */
             .hero-video {
                transform: translate(-50%, -50%) scale(1.6); /* Increased zoom to eliminate black bars */
             }
           }
            @media (min-width: 1920px) {
              .hero-section {
                min-height: 900px;
              }
              .hero-content {
                margin-top: -12vh;
              }
              /* Large screen video optimization */
              .hero-video {
                transform: translate(-50%, -50%) scale(1.05); /* Less zoom on large screens */
              }
            }
            /* Landscape orientation optimizations */
            @media (max-width: 768px) and (orientation: landscape) {
              .hero-video {
                transform: translate(-50%, -50%) scale(1.6); /* Increased zoom for landscape */
              }
              .hero-section {
                min-height: 500px; /* Reduced height for landscape */
              }
            }
            @media (max-width: 480px) and (orientation: landscape) {
              .hero-section {
                min-height: 400px; /* Even smaller for mobile landscape */
              }
            }
            /* Accessibility: reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
              .hero-video {
                transform: translate(-50%, -50%) scale(1); /* Remove zoom animation */
              }
            }
         `}} />
      </section>

      {/* Problem → Solution Section */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: "var(--sys-surface-roles-surface)",
      }}>
        <style dangerouslySetInnerHTML={{ __html: `

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
             color: "var(--ref-primary-primary40)",
             textAlign: "center",
            marginBottom: tokens.spacing.xl,
          }}>
            From Manual Hassle to Automated Insight
          </h2>
          <p style={{
             ...tokens.typography.bodyLarge,
             color: "var(--ref-neutral-neutral40)",
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
            gap: "32px",
            alignItems: "stretch",
          }}>
            {/* Problem Card */}
            <div className="problem-solution-card" style={{
              padding: "40px 32px",
              backgroundColor: "var(--ref-neutral-neutral98)",
              borderRadius: "20px",
              border: "1px solid var(--ref-neutral-neutral92)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                width: "8px",
                height: "8px",
                backgroundColor: "var(--ref-key-accent-key-color)",
                borderRadius: "50%",
              }} />
               <h3 className="problem-solution-title" style={{
                 fontFamily: "var(--sys-typescale-title-large-fontfamily)",
                 fontSize: "var(--sys-typescale-headline-medium-fontsize)",
                 fontWeight: 600,
                 color: "var(--ref-neutral-neutral40)",
                 marginBottom: "24px",
                 marginTop: "8px",
               }}>
                 The Problem
               </h3>
              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "rgba(255, 107, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--ref-neutral-neutral40)", fontSize: "var(--sys-typescale-body-medium-fontsize)", fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-large-fontsize)", lineHeight: 1.6, color: "var(--ref-neutral-neutral40)" }}>Manual report writing is slow, inconsistent, and prone to human error</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "rgba(255, 107, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--ref-neutral-neutral40)", fontSize: "var(--sys-typescale-body-medium-fontsize)", fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-large-fontsize)", lineHeight: 1.6, color: "var(--ref-neutral-neutral40)" }}>Drone data remains unstructured, making analysis and comparison difficult</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "rgba(255, 107, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--ref-neutral-neutral40)", fontSize: "var(--sys-typescale-body-medium-fontsize)", fontWeight: "bold" }}>✕</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-large-fontsize)", lineHeight: 1.6, color: "var(--ref-neutral-neutral40)" }}>Insights vary between team members, reducing decision‑making confidence</span>
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--ref-neutral-neutral92)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === 1 ? "var(--ref-key-accent-key-color)" : "var(--ref-neutral-neutral87)" }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-medium-fontsize)", color: "var(--ref-neutral-neutral40)" }}>3 major pain points</span>
                </div>
              </div>
            </div>

            {/* Solution Card */}
            <div className="problem-solution-card" style={{
              padding: "40px 32px",
              backgroundColor: "var(--ref-neutral-neutral98)",
              borderRadius: "20px",
              border: "1px solid var(--ref-neutral-neutral92)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                width: "8px",
                height: "8px",
                backgroundColor: "var(--ref-key-accent-key-color)",
                borderRadius: "50%",
              }} />
               <h3 className="problem-solution-title" style={{
                 fontFamily: "var(--sys-typescale-title-large-fontfamily)",
                 fontSize: "var(--sys-typescale-headline-medium-fontsize)",
                 fontWeight: 600,
                 color: "var(--ref-neutral-neutral40)",
                 marginBottom: "24px",
                 marginTop: "8px",
               }}>
                 The Solution
               </h3>
              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "rgba(255, 107, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--ref-neutral-neutral40)", fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-large-fontsize)", lineHeight: 1.6, color: "var(--ref-neutral-neutral40)" }}>AI‑powered analysis delivers consistent, accurate insights in minutes</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "rgba(255, 107, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--ref-neutral-neutral40)", fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-large-fontsize)", lineHeight: 1.6, color: "var(--ref-neutral-neutral40)" }}>Automatic structuring of drone data into searchable, comparable formats</span>
                  </li>
                  <li className="problem-solution-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: "4px" }}>
                      <div className="problem-solution-dot" style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "rgba(255, 107, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--ref-neutral-neutral40)", fontSize: "var(--sys-typescale-body-large-fontsize)", fontWeight: "bold" }}>✓</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-large-fontsize)", lineHeight: 1.6, color: "var(--ref-neutral-neutral40)" }}>Professional reports generated automatically, ready for stakeholders</span>
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--ref-neutral-neutral92)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === 1 ? "var(--ref-key-accent-key-color)" : "var(--ref-neutral-neutral87)" }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "var(--sys-typescale-body-large-fontfamily)", fontSize: "var(--sys-typescale-body-medium-fontsize)", color: "var(--ref-neutral-neutral40)" }}>3 key benefits</span>
                </div>
              </div>
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
