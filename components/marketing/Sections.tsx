"use client";

import { tokens } from "@/lib/design-tokens";

export function ProblemSolution() {
  return (
    <section id="problem-solution" style={{
      padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
      backgroundColor: "#0f172a",
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .problem-solution-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.4);
            border-color: rgba(255,255,255,0.2) !important;
          }
        `}} />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          ...tokens.typography.displaySmall,
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: tokens.spacing.xl,
        }}>
          From Manual Hassle to Automated Insight
        </h2>
        <p style={{
          ...tokens.typography.bodyLarge,
          color: "rgba(255, 255, 255, 0.7)",
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
            backgroundColor: "#1e293b",
            borderRadius: tokens.radius.lg,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <h3 className="problem-solution-title" style={{
              ...tokens.typography.headlineMedium,
              color: "#FFFFFF",
              marginBottom: tokens.spacing.lg,
            }}>
              The Problem
            </h3>
            <div style={{ flex: 1 }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.primary, fontWeight: "bold" }}>✕</span>
                  <span style={{ ...tokens.typography.bodyLarge, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6 }}>Manual report writing is slow, inconsistent, and prone to human error</span>
                </li>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: tokens.colors.primary, fontWeight: "bold" }}>✕</span>
                  <span style={{ ...tokens.typography.bodyLarge, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6 }}>Drone data remains unstructured, making analysis and comparison difficult</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Card */}
          <div className="problem-solution-card" style={{
            padding: `${tokens.spacing.xxl} ${tokens.spacing.xl}`,
            backgroundColor: "#1e293b",
            borderRadius: tokens.radius.lg,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <h3 className="problem-solution-title" style={{
              ...tokens.typography.headlineMedium,
              color: "#FFFFFF",
              marginBottom: tokens.spacing.lg,
            }}>
              The Solution
            </h3>
            <div style={{ flex: 1 }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: "#34D399", fontWeight: "bold" }}>✓</span>
                  <span style={{ ...tokens.typography.bodyLarge, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6 }}>AI‑powered analysis delivers consistent, accurate insights in minutes</span>
                </li>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: "#34D399", fontWeight: "bold" }}>✓</span>
                  <span style={{ ...tokens.typography.bodyLarge, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6 }}>Automatic structuring of drone data into searchable formats</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    { title: "AI-Generated Insights", description: "Get automated findings and recommendations for every image. No more manual analysis." },
    { title: "Image-Based Analysis", description: "Upload drone images with GPS data. AI extracts patterns and identifies issues automatically." },
    { title: "Structured Reports", description: "Build professional reports with consistent formatting. Export-ready in minutes." },
    { title: "Map Visualisation", description: "See all your images on an interactive map. Pinpoint issues to exact locations." },
    { title: "Fast Export", description: "Generate PDF reports with one click. Share with stakeholders instantly." },
  ];

  return (
    <section id="features" style={{ padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`, backgroundColor: "#31579b" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ ...tokens.typography.headlineLarge, textAlign: "center", marginBottom: tokens.spacing.xxl, color: "#FFFFFF" }}>Key Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: tokens.spacing.lg }}>
          {features.map((f) => (
            <div key={f.title} style={{ padding: tokens.spacing.xl, borderRadius: tokens.radius.lg, border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#1B293D" }}>
              <h3 style={{ ...tokens.typography.titleLarge, marginBottom: tokens.spacing.sm, color: "#FFFFFF" }}>{f.title}</h3>
              <p style={{ ...tokens.typography.bodyLarge, color: "rgba(255,255,255,0.7)" }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { num: "1", title: "Upload Drone Images", description: "Drag and drop or batch upload images. GPS data is extracted automatically.", icon: "upload" },
    { num: "2", title: "Tag & Organize", description: "Categorize images by type, location, or condition. Keep everything structured.", icon: "label" },
    { num: "3", title: "Generate AI Insights", description: "Let AI analyze each image and produce findings and recommendations.", icon: "auto_awesome" },
    { num: "4", title: "Export Professional Report", description: "Build and export a structured PDF report. Ready for stakeholders.", icon: "description" },
  ];

  return (
    <section id="how-it-works" style={{ padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`, backgroundColor: "#0f172a" }}>
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
        <h2 style={{ ...tokens.typography.headlineLarge, textAlign: "center", marginBottom: tokens.spacing.xxl, color: "#FFFFFF" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: tokens.spacing.lg }}>
          {steps.map((step, index) => (
            <div key={step.num} className="step-card" style={{ padding: tokens.spacing.xl, backgroundColor: "#1e293b", borderRadius: tokens.radius.lg, textAlign: "center", position: "relative", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.3s ease" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: tokens.radius.md, backgroundColor: tokens.colors.primary, color: tokens.colors.onPrimary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <span className="material-icons">{step.icon}</span>
              </div>
              <h3 style={{ ...tokens.typography.titleMedium, marginBottom: tokens.spacing.xs, color: "#FFFFFF" }}>{step.title}</h3>
              <p style={{ ...tokens.typography.bodyMedium, color: "rgba(255,255,255,0.7)" }}>{step.description}</p>
              {index < steps.length - 1 && (
                <div className="step-connector" style={{
                  position: "absolute",
                  right: "-12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "24px",
                  height: "24px",
                  color: "rgba(255, 255, 255, 0.3)",
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
  );
}
