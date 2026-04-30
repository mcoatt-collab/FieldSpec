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

const useCases = [
  {
    title: "Drone Operators",
    description: "Deliver professional reports to clients faster",
    imageUrl: "/images/drone-operators.jpg",
  },
  {
    title: "Infrastructure Inspectors",
    description: "Standardize inspection workflows across teams",
    imageUrl: "/images/infrastructure-inspections.jpg",
  },
  {
    title: "Field Teams",
    description: "Organize and analyze large sets of field images",
    imageUrl: "/images/land-surveys.jpg",
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

const pricingPlans = [
  {
    title: "Starter",
    price: "Free",
    description: "For individuals testing FieldSpec.",
    features: [
      "Limited projects",
      "Upload and organize images",
      "Basic AI-generated report",
      "PDF export",
    ],
    cta: "Get Started",
    link: "/signup",
    primary: false,
  },
  {
    title: "Professional",
    price: "$20/month",
    badge: "Recommended",
    description: "For active drone operators and inspection workflows.",
    features: [
      "More projects",
      "AI captions, findings, recommendations",
      "Editable report builder",
      "Map with marker review",
      "Client management",
      "PDF export",
    ],
    cta: "Start Building Reports",
    link: "/signup",
    primary: true,
  },
  {
    title: "Business",
    price: "$299/month",
    description: "For teams and agencies managing multiple inspections.",
    features: [
      "High project limits",
      "Team collaboration",
      "Shared clients",
      "Priority processing",
      "Custom branding",
    ],
    cta: "Get Started",
    link: "/signup",
    primary: false,
  },
];

export default function MarketingPage() {
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
        <div style={{ textAlign: "center", marginBottom: tokens.spacing.xl, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            Upload your inspection images.<br />
            FieldSpec analyzes them, maps findings, and generates clear, ready-to-share reports.
          </p>

          {/* Buttons Moved Here */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: tokens.spacing.md,
              justifyContent: "center",
              marginTop: tokens.spacing.xl,
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

        {/* The Main Box */}
        <div
          className="hero-grid"
          style={{
            width: "100%",
            minHeight: "600px",
            borderRadius: tokens.radius.xl,
            background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.secondary} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: tokens.spacing.xl,
          }}
        >
          <img
            src="/images/Product.jpg"
            alt="Product preview"
            style={{
              maxWidth: "800px",
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: tokens.radius.lg,
              border: `2px solid ${tokens.colors.primary}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          />

          <style>{`
            .hero-primary-btn:hover {
              background-color: color-mix(in srgb, ${tokens.colors.primary} 85%, white) !important;
            }
            @media (max-width: 768px) {
              .hero-grid {
                min-height: 400px !important;
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
          paddingTop: tokens.spacing.md,
          paddingBottom: tokens.spacing.md,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <style>{`
          .trust-strip-track {
            display: flex;
            align-items: center;
            gap: ${tokens.spacing.xxl};
            width: max-content;
            animation: scrollTrust 30s linear infinite;
          }
          @keyframes scrollTrust {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (max-width: 768px) {
            .trust-strip-track {
              gap: ${tokens.spacing.xl};
              animation-duration: 20s;
            }
          }
        `}</style>
        <div className="trust-strip-track">
          {["Construction", "Infrastructure", "Agriculture", "Land Surveys"]
            .concat([
              "Construction",
              "Infrastructure",
              "Agriculture",
              "Land Surveys",
            ])
            .map((text, idx) => (
              <p
                key={idx}
                style={{
                  ...tokens.typography.bodyLarge,
                  fontWeight: "600",
                  color: tokens.colors.onSurfaceVariant,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {text}
              </p>
            ))}
        </div>
      </div>

      {/* Problem → Solution & Transformation Section */}
      <section
        style={{
          maxWidth: "1266px",
          margin: "0 auto",
          width: "100%",
          paddingTop: tokens.spacing.section,
          paddingBottom: tokens.spacing.section,
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
              transition: border-color 0.2s ease !important;
              border: 1px solid transparent !important;
            }
            .problem-solution-card:hover {
              transform: none !important;
              box-shadow: none !important;
              border-color: ${tokens.colors.outlineVariant} !important;
            }
            .problem-solution-card:active {
              transform: none !important;
              box-shadow: none !important;
            }
            @media (max-width: 900px) {
              .problem-solution-grid {
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
                gap: ${tokens.spacing.lg} !important;
              }
            }
            @media (max-width: 640px) {
              .problem-solution-grid {
                grid-template-columns: 1fr !important;
              }
              .problem-solution-card {
                padding: ${tokens.spacing.xl} ${tokens.spacing.lg} !important;
              }
            }
         `,
          }}
        />
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.xxl,
          }}
        >
          <div
            className="problem-solution-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: tokens.spacing.xl,
              alignItems: "stretch",
              borderRadius: tokens.radius.lg,
            }}
          >
            {/* Problem Card */}
            <div
              className="problem-solution-card"
              style={{
                padding: tokens.spacing.lg,
                borderRadius: tokens.radius.lg,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "relative",
                overflow: "hidden",
                gap: tokens.spacing.md,
                backgroundColor: tokens.colors.onPrimary,
              }}
            >
              <h3
                style={{
                  ...tokens.typography.headlineSmall,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.md,
                  fontWeight: 500,
                }}
              >
                Your workflow is being slowed down
              </h3>
              <p
                style={{
                  ...tokens.typography.bodyLarge,
                  color: tokens.colors.onSurfaceVariant,
                  lineHeight: 1.6,
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
                borderRadius: tokens.radius.lg,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "relative",
                overflow: "hidden",
                gap: tokens.spacing.md,
                backgroundColor: tokens.colors.primaryContainer,
              }}
            >
              <h3
                style={{
                  ...tokens.typography.headlineSmall,
                  color: tokens.colors.onPrimaryContainer,
                  marginBottom: tokens.spacing.md,
                  fontWeight: 500,
                }}
              >
                With Fieldspec, <br /> reporting is no longer manual or slow.
              </h3>
              <div
                style={{
                  ...tokens.typography.bodyLarge,
                  color: tokens.colors.onPrimaryContainer,
                  display: "flex",
                  flexDirection: "column",
                  gap: tokens.spacing.md,
                  lineHeight: 1.6,
                }}
              >
                AI turns every image into consistent findings in minute and
                generates consistent, accurate, client-ready reports in
                automatically.
              </div>
            </div>
          </div>

          {/* Transformation Engine Visual */}
          <div
            style={{
              width: "100%",
              backgroundColor: tokens.colors.surfaceContainerLow,
              border: `1px solid ${tokens.colors.outlineVariant}`,
              borderRadius: "24px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Mock App Header */}
            <div
              style={{
                height: "56px",
                borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                backgroundColor: tokens.colors.surfaceContainer,
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", gap: tokens.spacing.xxxs }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: tokens.colors.error,
                  }}
                />
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#facc15",
                  }}
                />
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: tokens.colors.primary,
                  }}
                />
              </div>
              <div
                style={{
                  marginLeft: tokens.spacing.lg,
                  ...tokens.typography.labelMedium,
                  color: tokens.colors.onSurfaceVariant,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                FieldSpec Transformation Engine
              </div>
            </div>

            {/* Split Interface Container */}
            <div
              className="transformation-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                minHeight: "400px",
                backgroundColor: tokens.colors.surface,
                position: "relative",
              }}
            >
              {/* Image Input side */}
              <div
                style={{
                  padding: tokens.spacing.lg,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    ...tokens.typography.labelMedium,
                    color: tokens.colors.onSurfaceVariant,
                    marginBottom: tokens.spacing.md,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    fontWeight: 700,
                  }}
                >
                  Raw Drone Data
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRadius: "12px",
                    border: `1px solid ${tokens.colors.outlineVariant}`,
                    position: "relative",
                    overflow: "hidden",
                    backgroundImage: 'url("/images/map-visualisation.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "250px",
                  }}
                >
                  {/* Scanning animation overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "3px",
                      backgroundColor: tokens.colors.primary,
                      boxShadow: `0 4px 16px ${tokens.colors.primary}`,
                      animation: "scanLine 3s infinite linear",
                      zIndex: 10,
                    }}
                  />

                  {/* AI Bounding Boxes */}
                  <div
                    style={{
                      position: "absolute",
                      top: "30%",
                      left: "40%",
                      width: "60px",
                      height: "60px",
                      border: `2px solid ${tokens.colors.primary}`,
                      borderRadius: "4px",
                      backgroundColor: `color-mix(in srgb, ${tokens.colors.primary} 20%, transparent)`,
                      animation: "pulseBox 2s infinite ease-in-out",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-2px",
                        backgroundColor: tokens.colors.primary,
                        color: tokens.colors.onPrimary,
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "2px",
                        fontWeight: "bold",
                      }}
                    >
                      Defect 98%
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "60%",
                      left: "20%",
                      width: "80px",
                      height: "50px",
                      border: `2px solid ${tokens.colors.error}`,
                      borderRadius: "4px",
                      backgroundColor: `color-mix(in srgb, ${tokens.colors.error} 20%, transparent)`,
                      animation: "pulseBox 2s infinite ease-in-out 1s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-2px",
                        backgroundColor: tokens.colors.error,
                        color: tokens.colors.onError,
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "2px",
                        fontWeight: "bold",
                      }}
                    >
                      Rust 94%
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Arrow Connector */}
              <div
                className="transformation-connector"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  className="transformation-arrow"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: tokens.colors.primaryContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `4px solid ${tokens.colors.surface}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 2,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={tokens.colors.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
                <div
                  className="transformation-dashed-line"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    width: "1px",
                    borderLeft: `1px dashed ${tokens.colors.outlineVariant}`,
                    zIndex: 1,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>

              {/* Report Output side */}
              <div
                style={{
                  padding: tokens.spacing.lg,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    ...tokens.typography.labelMedium,
                    color: tokens.colors.primary,
                    marginBottom: tokens.spacing.md,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    fontWeight: 700,
                  }}
                >
                  Structured Report
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: tokens.colors.surfaceContainerLow,
                    borderRadius: "12px",
                    border: `1px solid ${tokens.colors.outlineVariant}`,
                    padding: tokens.spacing.lg,
                    display: "flex",
                    flexDirection: "column",
                    gap: tokens.spacing.md,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    position: "relative",
                    minHeight: "250px",
                  }}
                >
                  {/* Report Header Actual Data */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
                      paddingBottom: tokens.spacing.md,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          ...tokens.typography.titleMedium,
                          color: tokens.colors.onSurface,
                          fontWeight: 700,
                        }}
                      >
                        Inspection Report #492
                      </div>
                      <div
                        style={{
                          ...tokens.typography.labelSmall,
                          color: tokens.colors.onSurfaceVariant,
                          marginTop: "4px",
                        }}
                      >
                        Site: North Ridge Solar Array
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        backgroundColor: tokens.colors.primaryContainer,
                        borderRadius: "8px",
                        color: tokens.colors.onPrimaryContainer,
                      }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: "20px" }}
                      >
                        picture_as_pdf
                      </span>
                    </div>
                  </div>

                  {/* Report Map/Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "100px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: 'url("/images/map-visualisation.jpg")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>

                  {/* Report List Items */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: tokens.spacing.sm,
                    }}
                  >
                    {[
                      {
                        color: tokens.colors.error,
                        title: "Critical: Severe Rust",
                        desc: "Found on support structure B4",
                        confidence: "98% Match",
                      },
                      {
                        color: "#facc15",
                        title: "Warning: Micro-cracking",
                        desc: "Detected on panel array 12",
                        confidence: "87% Match",
                      },
                      {
                        color: tokens.colors.primary,
                        title: "Routine: Maintenance",
                        desc: "Scheduled cleaning needed",
                        confidence: "Auto-tagged",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "flex-start",
                          backgroundColor: tokens.colors.surface,
                          padding: "12px",
                          borderRadius: "8px",
                          border: `1px solid ${tokens.colors.outlineVariant}`,
                        }}
                      >
                        <div
                          style={{
                            marginTop: "4px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: item.color,
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "4px",
                            }}
                          >
                            <div
                              style={{
                                ...tokens.typography.labelMedium,
                                color: tokens.colors.onSurface,
                                fontWeight: 600,
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              style={{
                                ...tokens.typography.labelSmall,
                                color: item.color,
                                fontWeight: 600,
                              }}
                            >
                              {item.confidence}
                            </div>
                          </div>
                          <div
                            style={{
                              ...tokens.typography.bodySmall,
                              color: tokens.colors.onSurfaceVariant,
                            }}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
          @media (max-width: 640px) {
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
        `,
          }}
        />
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        style={{
          padding: `${tokens.spacing.section} ${tokens.spacing.md}`,
          backgroundColor: tokens.colors.secondary,
        }}
      >
        <div
          style={{
            maxWidth: "1266px",
            margin: "0 auto",
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .hiw-split-grid {
              display: grid;
              grid-template-columns: 0.4fr 0.6fr;
              gap: 80px;
            }
            .hiw-intro-block {
              display: flex;
              flex-direction: column;
              gap: 24px;
              position: sticky;
              top: 100px;
              height: fit-content;
            }
            .hiw-steps-list {
              display: flex;
              flex-direction: column;
              gap: ${tokens.spacing.xxl};
            }
            .hiw-step-item {
              display: flex;
              flex-direction: column;
              gap: ${tokens.spacing.sm};
              padding-bottom: ${tokens.spacing.xxl};
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .hiw-step-item:last-child {
              border-bottom: none;
            }
            .hiw-step-number {
               color: var(--sys-on-secondary);
               font-weight: 700;
               font-size: 18px;
             }
            .hiw-step-title {
              font-family: var(--sys-typescale-headline-small-fontfamily);
              font-size: 24px;
              font-weight: 600;
              color: var(--sys-on-secondary);
            }
            .hiw-step-description {
              font-family: var(--sys-typescale-body-large-fontfamily);
              font-size: 18px;
              color: var(--sys-on-secondary);
              opacity: 0.8;
              line-height: 1.6;
              max-width: 480px;
            }
            .hiw-cta-link {
               display: inline-flex;
               align-items: center;
               gap: ${tokens.spacing.xs};
               color: var(--sys-on-secondary);
               text-decoration: none;
               font-weight: 600;
               font-size: 18px;
               transition: transform 0.2s ease;
               border: 2px solid var(--sys-on-secondary);
               border-radius: var(--sys-radius-pill);
               padding: 12px 24px;
               align-self: flex-start;
             }
            .hiw-cta-link:hover {
              transform: translateX(4px);
            }
            @media (max-width: 968px) {
              .hiw-split-grid {
                grid-template-columns: 1fr;
                gap: ${tokens.spacing.xl};
              }
              .hiw-intro-block {
                position: static;
              }
              .hiw-step-item {
                padding-bottom: ${tokens.spacing.xl};
              }
              .hiw-steps-list {
                gap: ${tokens.spacing.xl};
              }
            }
            `,
            }}
          />
          <div className="hiw-split-grid">
            {/* Left Column: Intro Block */}
            <div className="hiw-intro-block">
              <div
                style={{
                  ...tokens.typography.labelLarge,
                  color: tokens.colors.onSecondary,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "4px 12px",
                  borderRadius: tokens.radius.pill,
                  width: "fit-content",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                How It Works
              </div>
              <h2
                style={{
                  ...tokens.typography.displaySmall,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  color: tokens.colors.onSecondary,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Turn drone images into reports—fast
              </h2>
              <Link href="/signup" className="hiw-cta-link">
                Get Started
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            {/* Right Column: Steps List */}
            <div className="hiw-steps-list">
              {steps.map((step, index) => (
                <div key={index} className="hiw-step-item">
                  <div className="hiw-step-number">{index + 1}.</div>
                  <h3 className="hiw-step-title">{step.title}</h3>
                  <p className="hiw-step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section
        id="use-cases"
        style={{
          padding: `${tokens.spacing.xxl} ${tokens.spacing.md}`,
          backgroundColor: "var(--color-section-bg)",
        }}
      >
        <div style={{ maxWidth: "1266px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "4px 12px",
              borderRadius: tokens.radius.pill,
              backgroundColor: tokens.colors.secondary,
              color: tokens.colors.onSecondary,
              ...tokens.typography.labelMedium,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: tokens.spacing.xl,
            }}
          >
            Who it&apos;s built for
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
          .use-cases-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            width: 100%;
          }
          .use-case-card {
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            min-height: 488px;
          }
          .use-case-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
          }
          .use-case-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }
          .use-case-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .use-case-content {
            position: relative;
            z-index: 1;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 100%;
            min-height: 488px;
            background: linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.85) 100%);
          }
          .use-case-card-title {
            font-family: var(--sys-typescale-title-large-fontfamily);
            font-size: 22px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .use-case-card-desc {
            font-family: var(--sys-typescale-body-medium-fontfamily);
            font-size: 14px;
            color: rgba(255,255,255,0.85);
            line-height: 1.5;
          }
          @media (max-width: 768px) {
            .use-cases-cards {
              grid-template-columns: 1fr;
            }
          }
        `,
            }}
          />
          <div className="use-cases-cards">
            {useCases.map((useCase, i) => (
              <div key={i} className="use-case-card">
                <div className="use-case-image">
                  <img src={useCase.imageUrl} alt={useCase.title} />
                </div>
                <div className="use-case-content">
                  <h3 className="use-case-card-title">{useCase.title}</h3>
                  <p className="use-case-card-desc">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        style={{
          padding: `${tokens.spacing.xxl} ${tokens.spacing.md}`,
          backgroundColor: "var(--color-section-bg)",
        }}
      >
        <div style={{ maxWidth: "1266px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "4px 12px",
              borderRadius: tokens.radius.pill,
              backgroundColor: tokens.colors.secondary,
              color: tokens.colors.onSecondary,
              ...tokens.typography.labelMedium,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: tokens.spacing.xl,
            }}
          >
            Pricing
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                .pricing-cards {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 24px;
                  width: 100%;
                }
                .pricing-card {
                  transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .pricing-card:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }
                .pricing-primary-btn:hover {
                  background-color: color-mix(in srgb, ${tokens.colors.primary} 85%, white) !important;
                  color: ${tokens.colors.onPrimary} !important;
                }
                .pricing-outline-btn:hover {
                  background-color: color-mix(in srgb, ${tokens.colors.primary} 10%, transparent) !important;
                }
                @media (max-width: 768px) {
                  .pricing-cards {
                    grid-template-columns: 1fr;
                  }
                }
              `,
            }}
          />

          <div className="pricing-cards">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className="pricing-card"
                style={{
                  borderRadius: "16px",
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  backgroundColor: plan.primary
                    ? tokens.colors.primaryContainer
                    : tokens.colors.surfaceContainer,
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      backgroundColor: tokens.colors.primary,
                      color: tokens.colors.onPrimary,
                      padding: "4px 8px",
                      borderRadius: tokens.radius.pill,
                      ...tokens.typography.labelSmall,
                      fontWeight: 600,
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <h3
                  style={{
                    ...tokens.typography.titleLarge,
                    color: tokens.colors.onSurface,
                    marginBottom: "8px",
                  }}
                >
                  {plan.title}
                </h3>
                <div
                  style={{
                    ...tokens.typography.headlineSmall,
                    fontSize: "32px",
                    fontWeight: 700,
                    color: tokens.colors.onSurface,
                    marginBottom: "12px",
                  }}
                >
                  {plan.price}
                </div>
                <p
                  style={{
                    ...tokens.typography.bodyMedium,
                    color: tokens.colors.onSurfaceVariant,
                    lineHeight: 1.5,
                    marginBottom: "24px",
                  }}
                >
                  {plan.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginBottom: "24px",
                    flex: 1,
                  }}
                >
                  {plan.features.map((feature, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        ...tokens.typography.bodyMedium,
                        color: tokens.colors.onSurface,
                      }}
                    >
                      <span
                        style={{
                          color: tokens.colors.primary,
                          fontSize: "18px",
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
                <Link
                  href={plan.link}
                  className={plan.primary ? "pricing-primary-btn" : "pricing-outline-btn"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 24px",
                    borderRadius: tokens.radius.lg,
                    backgroundColor: plan.primary
                      ? tokens.colors.primary
                      : "transparent",
                    color: plan.primary
                      ? tokens.colors.onPrimary
                      : tokens.colors.primary,
                    border: plan.primary
                      ? "none"
                      : `1.5px solid ${tokens.colors.primary}`,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    width: "100%",
                    textAlign: "center",
                    ...tokens.typography.labelLarge,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: tokens.spacing.xl,
            }}
          >
            <p
              style={{
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurfaceVariant,
                marginBottom: tokens.spacing.md,
              }}
            >
              Need enterprise-level features?
            </p>
            <Link
              href="/contact"
              style={{
                ...tokens.typography.labelLarge,
                color: tokens.colors.primary,
                textDecoration: "none",
                fontWeight: 600,
                transition: "opacity 0.2s ease",
              }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          padding: `${tokens.spacing.xxl} 16px`,
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .cta-card {
              text-align: center;
              position: relative;
              overflow: visible;
              padding: 48px 24px;
              background: transparent;
              box-shadow: none;
              border: none;
            }
            .cta-primary-btn {
              background-color: var(--sys-primary);
              color: var(--sys-on-primary);
              padding: 16px 32px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              text-decoration: none;
              transition: all 0.2s ease;
              border: none;
              display: inline-block;
            }
            .cta-primary-btn:hover {
              background-color: color-mix(in srgb, var(--sys-primary) 85%, white) !important;
              color: var(--sys-on-primary) !important;
            }
            .cta-trust {
              font-family: var(--sys-typescale-body-medium-fontfamily);
              font-size: 14px;
              color: var(--sys-on-surface);
              margin-top: -18px;
              opacity: 0.8;
              line-height: 2.34;
            }
          `,
          }}
        />
        <div
          className="cta-card"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          <h2
            style={{
              fontFamily: "var(--sys-typescale-headline-large-fontfamily)",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 600,
              color: tokens.colors.onSurface,
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            Start generating inspection reports in minutes
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <p className="cta-trust">No credit card required</p>
            <Link href="/signup" className="cta-primary-btn">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <footer
        style={{
          backgroundColor: "var(--footer-bg)",
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
            borderTop: `1px solid ${tokens.colors.outlineVariant}`,
            paddingBottom: tokens.spacing.lg,
          }}
        />

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
            <a
              href="https://github.com/fieldspec"
              target="_blank"
              rel="noopener noreferrer"
              className="social-footer-icon"
              aria-label="GitHub"
              style={{ padding: "6px" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
