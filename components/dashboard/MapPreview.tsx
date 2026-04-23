"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

export function MapPreview() {
  const router = useRouter();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
          <span className="material-icons" style={{ fontSize: tokens.typography.titleMedium.fontSize, color: tokens.colors.tertiary }}>
            map
          </span>
          <span
            style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.labelLarge.fontSize, fontWeight: tokens.typography.labelLarge.fontWeight }}
          >
            Map Overview
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard/map")}
          style={{
            backgroundColor: "transparent",
            color: tokens.colors.primary,
            border: "none",
            cursor: "pointer",
            fontSize: tokens.typography.labelMedium.fontSize,
            fontWeight: tokens.typography.labelMedium.fontWeight,
          }}
        >
          Open Full Map
        </button>
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
        <div
          style={{ 
            height: "192px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            position: "relative",
            overflow: "hidden",
            backgroundColor: tokens.colors.surfaceVariant,
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.2 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.spacing.sm, textAlign: "center", paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md, paddingTop: tokens.spacing.lg, paddingBottom: tokens.spacing.lg }}>
            <span
              className="material-icons"
              style={{ fontSize: "32px", color: tokens.colors.onSurfaceVariant }}
            >
              location_on
            </span>
            <p
              style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.bodyMedium.fontSize }}
            >
              Map visualization for projects with GPS-tagged images
            </p>
            <p
              style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.bodySmall.fontSize }}
            >
              Upload images with GPS data to see them on the map
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}