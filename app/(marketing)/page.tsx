import Link from "next/link";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";

export default function MarketingPage() {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your field images to provide automated findings, recommendations, and actionable insights.",
      icon: "🤖",
    },
    {
      title: "GPS-Enabled Mapping",
      description: "Every image is automatically tagged with GPS coordinates and displayed on an interactive map for precise location tracking.",
      icon: "🗺️",
    },
    {
      title: "Professional Reports",
      description: "Generate comprehensive PDF reports with findings, recommendations, and visual summaries ready for stakeholders.",
      icon: "📊",
    },
    {
      title: "Scalable for Any Farm",
      description: "From small plots to large commercial operations, FieldSpec scales to meet your needs with flexible project management.",
      icon: "🌾",
    },
    {
      title: "Cloud Storage",
      description: "Securely store and organize all your field data in the cloud with automatic backup and easy access from any device.",
      icon: "☁️",
    },
    {
      title: "Real-Time Collaboration",
      description: "Share insights and reports with your team instantly. Collaborate on field analysis from anywhere.",
      icon: "👥",
    },
  ];

  const benefits = [
    {
      title: "Faster Decisions",
      description: "Get actionable insights in minutes instead of days. Make informed decisions quickly.",
      stat: "10x",
      statLabel: "Faster Analysis",
    },
    {
      title: "Better Yields",
      description: "Identify issues early and take corrective action before they impact your harvest.",
      stat: "25%",
      statLabel: "Yield Improvement",
    },
    {
      title: "Cost Savings",
      description: "Reduce manual scouting costs and optimize input usage with precision data.",
      stat: "30%",
      statLabel: "Cost Reduction",
    },
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
        <Brand size="md" />
        <div style={{ display: "flex", gap: tokens.spacing.lg, alignItems: "center" }}>
          <Link
            href="#features"
            style={{
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurfaceVariant,
              textDecoration: "none",
            }}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            style={{
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurfaceVariant,
              textDecoration: "none",
            }}
          >
            How It Works
          </Link>
          <Link
            href="#benefits"
            style={{
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurfaceVariant,
              textDecoration: "none",
            }}
          >
            Benefits
          </Link>
          <Link
            href="/login"
            style={{
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurface,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
          <Link
            href="/signup"
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.onPrimary,
              textDecoration: "none",
              borderRadius: tokens.radius.md,
              ...tokens.typography.labelLarge,
            }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        textAlign: "center",
        backgroundColor: tokens.colors.surfaceVariant,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${tokens.colors.primary}10 0%, transparent 50%)`,
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.displayLarge,
            color: tokens.colors.onSurface,
            marginBottom: tokens.spacing.lg,
            lineHeight: 1.1,
          }}>
            Farm Smarter with<br />
            <span style={{ color: tokens.colors.primary }}>AI-Powered Insights</span>
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            maxWidth: "600px",
            margin: `0 auto ${tokens.spacing.xl}`,
          }}>
            Capture field data, generate AI-powered insights, and create professional reports in minutes. Make data-driven decisions that improve yields and reduce costs.
          </p>
          <div style={{ display: "flex", gap: tokens.spacing.md, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/signup"
              style={{
                padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.onPrimary,
                textDecoration: "none",
                borderRadius: tokens.radius.md,
                ...tokens.typography.labelLarge,
              }}
            >
              Get Started Free
            </Link>
            <Link
              href="#how-it-works"
              style={{
                padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.onSurface,
                textDecoration: "none",
                borderRadius: tokens.radius.md,
                border: `1px solid ${tokens.colors.outline}`,
                ...tokens.typography.labelLarge,
              }}
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Stats Section */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surface,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: tokens.spacing.xl,
          maxWidth: "1000px",
          margin: "0 auto",
        }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                ...tokens.typography.displayMedium,
                color: tokens.colors.primary,
                marginBottom: tokens.spacing.xs,
              }}>
                {benefit.stat}
              </div>
              <div style={{
                ...tokens.typography.labelLarge,
                color: tokens.colors.onSurfaceVariant,
                marginBottom: tokens.spacing.sm,
              }}>
                {benefit.statLabel}
              </div>
              <p style={{
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurfaceVariant,
              }}>
                {benefit.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surfaceVariant,
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.md,
          }}>
            Powerful Features for Modern Agriculture
          </h3>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            maxWidth: "600px",
            margin: `0 auto ${tokens.spacing.xxl}`,
          }}>
            Everything you need to capture, analyze, and act on field data
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: tokens.spacing.xl,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  borderRadius: tokens.radius.lg,
                  backgroundColor: tokens.colors.surface,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div style={{
                  fontSize: "40px",
                  marginBottom: tokens.spacing.md,
                }}>
                  {feature.icon}
                </div>
                <h4 style={{
                  ...tokens.typography.titleLarge,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.sm,
                }}>
                  {feature.title}
                </h4>
                <p style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  lineHeight: 1.6,
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surface,
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h3 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.md,
          }}>
            How FieldSpec Works
          </h3>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: tokens.spacing.xxl,
          }}>
            Three simple steps to actionable insights
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.lg }}>
            {[
              {
                step: "01",
                title: "Create a Project",
                description: "Set up a new project for your field or farm. Organize by location, crop type, or season.",
              },
              {
                step: "02",
                title: "Capture Field Data",
                description: "Upload photos from your drone, phone, or camera. Each image is automatically tagged with GPS coordinates.",
              },
              {
                step: "03",
                title: "Get AI Insights",
                description: "Our AI analyzes your images and generates a comprehensive report with findings and recommendations.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: tokens.spacing.lg,
                  alignItems: "flex-start",
                  padding: tokens.spacing.xl,
                  backgroundColor: tokens.colors.surfaceVariant,
                  borderRadius: tokens.radius.lg,
                }}
              >
                <div style={{
                  ...tokens.typography.headlineLarge,
                  color: tokens.colors.primary,
                  minWidth: "60px",
                }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{
                    ...tokens.typography.titleLarge,
                    color: tokens.colors.onSurface,
                    marginBottom: tokens.spacing.sm,
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    ...tokens.typography.bodyMedium,
                    color: tokens.colors.onSurfaceVariant,
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.primaryContainer,
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <h3 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onPrimaryContainer,
            marginBottom: tokens.spacing.md,
          }}>
            Why Farmers Choose FieldSpec
          </h3>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onPrimaryContainer,
            marginBottom: tokens.spacing.xxl,
            maxWidth: "600px",
            margin: `0 auto ${tokens.spacing.xxl}`,
          }}>
            Join hundreds of farmers who have transformed their operations with data-driven insights
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {[
              { title: "Early Problem Detection", desc: "Identify crop issues before they spread" },
              { title: "Precision Application", desc: "Apply inputs exactly where needed" },
              { title: "Better Record Keeping", desc: "Build a historical database of your fields" },
              { title: "Stakeholder Communication", desc: "Share professional reports with investors and partners" },
            ].map((benefit, i) => (
              <div
                key={i}
                style={{
                  padding: tokens.spacing.lg,
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius.md,
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: `0 auto ${tokens.spacing.md}`,
                  fontSize: "20px",
                }}>
                  ✓
                </div>
                <h5 style={{
                  ...tokens.typography.titleMedium,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.xs,
                }}>
                  {benefit.title}
                </h5>
                <p style={{
                  ...tokens.typography.bodySmall,
                  color: tokens.colors.onSurfaceVariant,
                }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surfaceVariant,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h3 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            marginBottom: tokens.spacing.md,
          }}>
            Ready to Transform Your Farm?
          </h3>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            marginBottom: tokens.spacing.xl,
          }}>
            Start your free trial today. No credit card required.
          </p>
          <Link
            href="/signup"
            style={{
              display: "inline-block",
              padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.onPrimary,
              textDecoration: "none",
              borderRadius: tokens.radius.md,
              ...tokens.typography.labelLarge,
            }}
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surface,
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: tokens.spacing.xl,
        }}>
          <div>
            <Brand size="md" className="mb-md" />
            <p style={{
              ...tokens.typography.bodySmall,
              color: tokens.colors.onSurfaceVariant,
              marginBottom: tokens.spacing.md,
            }}>
              AI-powered field intelligence for modern agriculture.
            </p>
            <div style={{ display: "flex", gap: tokens.spacing.md }}>
              <span style={{ color: tokens.colors.onSurfaceVariant }}>Twitter</span>
              <span style={{ color: tokens.colors.onSurfaceVariant }}>LinkedIn</span>
            </div>
          </div>

          <div>
            <h5 style={{
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurface,
              marginBottom: tokens.spacing.md,
            }}>
              Product
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <Link href="#features" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Features</Link>
              <Link href="#pricing" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Pricing</Link>
              <Link href="#" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Documentation</Link>
            </div>
          </div>

          <div>
            <h5 style={{
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurface,
              marginBottom: tokens.spacing.md,
            }}>
              Company
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <Link href="#" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>About</Link>
              <Link href="#" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Blog</Link>
              <Link href="#" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Careers</Link>
            </div>
          </div>

          <div>
            <h5 style={{
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurface,
              marginBottom: tokens.spacing.md,
            }}>
              Support
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <Link href="#" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Help Center</Link>
              <Link href="#" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Contact Us</Link>
              <Link href="#" style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, textDecoration: "none" }}>Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: "1200px",
          margin: `${tokens.spacing.xl} auto 0`,
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
            © 2025 FieldSpec. All rights reserved.
          </p>
          <p style={{
            ...tokens.typography.bodySmall,
            color: tokens.colors.onSurfaceVariant,
          }}>
            Powered by AI for a sustainable future
          </p>
        </div>
      </footer>
    </main>
  );
}