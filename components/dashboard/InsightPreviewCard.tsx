"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import type { Insight } from "./mockData";
import { useState } from "react";

interface InsightPreviewCardProps {
  insight: Insight | null;
}

export function InsightPreviewCard({ insight }: InsightPreviewCardProps) {
  const router = useRouter();
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  if (!insight) {
    return null;
  }

  const getConfidenceColor = () => "var(--sys-secondary)";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        <span className="material-icons" style={{ fontSize: tokens.typography.titleMedium.fontSize, color: "var(--sys-secondary)" }}>
          auto_awesome
        </span>
        <span
          style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.labelLarge.fontSize, fontWeight: tokens.typography.labelLarge.fontWeight }}
        >
          Recent AI Insight
        </span>
      </div>

      <div
        style={{
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.outlineVariant,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: tokens.radius.xl,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.spacing.lg, padding: tokens.spacing.lg, alignItems: "start" }}>
          {/* Left split - Findings + Confidence + Button */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "calc(var(--spacing-xxl) * 4 + var(--spacing-xs))" }}>
            {/* Finding box */}
            <div
              style={{ 
                padding: tokens.spacing.sm, 
                borderRadius: tokens.radius.md, 
                backgroundColor: tokens.colors.surfaceVariant,
              }}
            >
              <p
                style={{ 
                  color: tokens.colors.onSurfaceVariant, 
                  fontSize: tokens.typography.labelSmall.fontSize,
                  fontWeight: tokens.typography.labelSmall.fontWeight,
                  marginBottom: tokens.spacing.xs,
                }}
              >
                Finding
              </p>
<p
              style={{ 
                color: tokens.colors.onSurface, 
                fontSize: tokens.typography.bodyMedium.fontSize,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",

              }}
            >
                {insight.finding}
              </p>
            </div>

            {/* Confidence + View Report - merged container */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacing.md }}>
              <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
                <span
                  style={{ 
                    color: "var(--sys-secondary)", 
                    fontSize: tokens.typography.labelMedium.fontSize,
                    fontWeight: tokens.typography.labelMedium.fontWeight,
                  }}
                >
                  Confidence:
                </span>
                <span
                  style={{
                    backgroundColor: "var(--sys-secondary-container)",
                    color: "var(--sys-on-secondary-container)",
                    paddingLeft: tokens.spacing.sm,
                    paddingRight: tokens.spacing.sm,
                    paddingTop: tokens.spacing.xs,
                    paddingBottom: tokens.spacing.xs,
                    borderRadius: tokens.radius.pill,
                    fontSize: tokens.typography.labelSmall.fontSize,
                    fontWeight: "500",
                  }}
                >
                  {insight.confidenceScore}%
                </span>
              </div>

              <button
                onClick={() => router.push(`/dashboard/report?project=${insight.projectId}`)}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: tokens.spacing.xs,
                  paddingLeft: tokens.spacing.md,
                  paddingRight: tokens.spacing.md,
                  paddingTop: tokens.spacing.sm,
                  paddingBottom: tokens.spacing.sm,
                  borderRadius: tokens.radius.md,
                  backgroundColor: isButtonHovered ? tokens.colors.secondaryContainer : tokens.colors.secondary,
                  color: isButtonHovered ? tokens.colors.onSecondaryContainer : tokens.colors.onSecondary,
                  border: "none",
                  cursor: "pointer",
                  fontSize: tokens.typography.labelMedium.fontSize,
                  fontWeight: tokens.typography.labelMedium.fontWeight,
                  transition: "background-color 0.15s ease",
                }}
              >
                View Report
                <span className="material-icons" style={{ fontSize: tokens.typography.bodyMedium.fontSize }}>
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Right split - Image + Description */}
          <div style={{ position: "relative", padding: tokens.spacing.lg, minHeight: "calc(var(--spacing-xxl) * 4 + var(--spacing-xs))",borderRadius: tokens.spacing.md }}>
            {/* Image - fill the split container */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <img
                src={insight.imageUrl}
                alt="Insight preview"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",borderRadius: tokens.spacing.md}}
              />
            </div>

            {/* Project name - top badge overlay */}
            <div
              style={{
                position: "absolute",
                top: tokens.spacing.sm,
                left: tokens.spacing.sm,
                backgroundColor: "var(--sys-surface-roles-surface-container)",
                borderRadius: tokens.radius.md,
                paddingLeft: tokens.spacing.sm,
                paddingRight: tokens.spacing.sm,
                paddingTop: tokens.spacing.xs,
                paddingBottom: tokens.spacing.xs,
              }}
            >
              <span style={{ color: "var(--sys-surface-roles-on-surface)", fontSize: tokens.typography.labelMedium.fontSize, fontWeight: "500" }}>
                {insight.projectName}
              </span>
            </div>

            {/* Caption - bottom badge overlay */}
            <div
              style={{
                position: "absolute",
                bottom: tokens.spacing.sm,
                left: tokens.spacing.sm,
                right: tokens.spacing.sm,
                backgroundColor: "var(--sys-surface-roles-surface-container)",
                borderRadius: tokens.radius.md,
                paddingLeft: tokens.spacing.sm,
                paddingRight: tokens.spacing.sm,
                paddingTop: tokens.spacing.xs,
                paddingBottom: tokens.spacing.xs,
              }}
            >
              <span style={{ color: "var(--sys-surface-roles-on-surface)", fontSize: tokens.typography.bodyMedium.fontSize, fontWeight: tokens.typography.bodyMedium.fontWeight }}>
                {insight.caption}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}