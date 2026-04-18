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

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "var(--sys-surface-roles-surface)",
    }}>
      {children}
    </div>
  );
}
