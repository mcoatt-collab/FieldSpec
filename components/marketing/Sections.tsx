"use client";

import { tokens } from "@/lib/design-tokens";

export function Features() {
  const features = [
    { title: "Skip the Manual Analysis", description: "AI examines every image and produces findings automatically. No more staring at photos wondering what to write." },
    { title: "GPS-Tagged Analysis", description: "Upload images with GPS coordinates. AI extracts patterns tied to exact locations so you know where issues are, not just what they are." },
    { title: "Consistent Reports Every Time", description: "Generate formatted, professional PDF reports with one click. Your clients get the same quality, project after project." },
    { title: "Pinpoint Issues on a Map", description: "Every image appears on an interactive map. See exactly where problems are without flipping through folders." },
    { title: "Export & Share in One Click", description: "Generate a PDF and share with stakeholders instantly. No formatting, no file conversion, no delays." },
  ];

  return (
    <section id="features" style={{ padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`, backgroundColor: tokens.colors.surface }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ ...tokens.typography.headlineLarge, textAlign: "center", marginBottom: tokens.spacing.xxl }}>Everything You Need to Deliver Professional Reports</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: tokens.spacing.lg }}>
          {features.map((f) => (
            <div key={f.title} style={{ padding: tokens.spacing.xl, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.outlineVariant}`, backgroundColor: tokens.colors.surface }}>
              <h3 style={{ ...tokens.typography.titleLarge, marginBottom: tokens.spacing.sm }}>{f.title}</h3>
              <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { num: "1", title: "Upload Your Images", description: "Drag and drop your drone images. GPS data is extracted automatically.", icon: "upload" },
    { num: "2", title: "Tag & Organize", description: "Categorize images by project, location, or condition in seconds.", icon: "label" },
    { num: "3", title: "Analyze with AI", description: "AI detects patterns, flags issues, and generates findings for every image.", icon: "auto_awesome" },
    { num: "4", title: "Export Your Report", description: "Generate a polished PDF report and share with stakeholders immediately.", icon: "description" },
  ];

  return (
    <section id="how-it-works" style={{ padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`, backgroundColor: tokens.colors.surfaceVariant }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ ...tokens.typography.headlineLarge, textAlign: "center", marginBottom: tokens.spacing.xxl }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: tokens.spacing.lg }}>
          {steps.map((step, index) => (
            <div key={step.num} style={{ 
              padding: tokens.spacing.xl, 
              backgroundColor: tokens.colors.surface, 
              borderRadius: tokens.radius.lg, 
              textAlign: "center",
              position: "relative"
            }}>
              <div style={{ width: "56px", height: "56px", borderRadius: tokens.radius.md, backgroundColor: tokens.colors.primary, color: tokens.colors.onPrimary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <span className="material-icons">{step.icon}</span>
              </div>
              <h3 style={{ ...tokens.typography.titleMedium, marginBottom: tokens.spacing.xs }}>{step.title}</h3>
              <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="step-connector" style={{
                  position: "absolute",
                  right: "-12px",
                  top: "30%",
                  color: tokens.colors.outlineVariant,
                  display: "none"
                }}>
                  <span className="material-icons" style={{ fontSize: "24px" }}>arrow_forward</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .step-connector { display: block !important; }
        }
      `}</style>
    </section>
  );
}
