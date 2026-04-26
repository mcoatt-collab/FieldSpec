"use client";

import { tokens } from "@/lib/design-tokens";
import { useState } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = "folder_open", title, description, actionLabel, onAction }: EmptyStateProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: tokens.spacing.lg,
        width: "100%",
        padding: tokens.spacing.xl,
        borderRadius: tokens.radius.lg,
        border: `1px dashed ${tokens.colors.outlineVariant}`,
        backgroundColor: tokens.colors.surface,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "80px",
          height: "80px",
          borderRadius: tokens.radius.pill,
          backgroundColor: tokens.colors.surfaceContainer,
          color: tokens.colors.onSurfaceVariant,
        }}
      >
        <span className="material-icons" style={{ fontSize: "40px" }}>{icon}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.xs,
        }}
      >
        <h3
          style={{
            color: tokens.colors.onSurface,
            fontFamily: tokens.typography.titleMedium.fontFamily,
            fontSize: tokens.typography.titleMedium.fontSize,
            fontWeight: tokens.typography.titleMedium.fontWeight,
            lineHeight: tokens.typography.titleMedium.lineHeight,
            letterSpacing: tokens.typography.titleMedium.letterSpacing,
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            style={{
              color: tokens.colors.onSurfaceVariant,
              fontFamily: tokens.typography.bodyMedium.fontFamily,
              fontSize: tokens.typography.bodyMedium.fontSize,
              fontWeight: tokens.typography.bodyMedium.fontWeight,
              lineHeight: tokens.typography.bodyMedium.lineHeight,
              letterSpacing: tokens.typography.bodyMedium.letterSpacing,
            }}
          >
            {description}
          </p>
        )}

        {onAction && actionLabel && (
          <button
            onClick={onAction}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              marginTop: tokens.spacing.sm,
              paddingInline: tokens.spacing.lg,
              paddingBlock: tokens.spacing.sm,
              borderRadius: tokens.radius.md,
              border: "none",
              backgroundColor: isHovered ? tokens.colors.primaryContainer : tokens.colors.primary,
              color: isHovered ? tokens.colors.onPrimaryContainer : tokens.colors.onPrimary,
              cursor: "pointer",
              fontFamily: tokens.typography.labelLarge.fontFamily,
              fontSize: tokens.typography.labelLarge.fontSize,
              fontWeight: tokens.typography.labelLarge.fontWeight,
              lineHeight: tokens.typography.labelLarge.lineHeight,
              letterSpacing: tokens.typography.labelLarge.letterSpacing,
              transition: "all 0.2s ease",
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
