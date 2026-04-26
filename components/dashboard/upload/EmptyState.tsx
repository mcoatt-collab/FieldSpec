"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";


interface EmptyStateProps {
  type: "no_images" | "no_results";
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const isNoImages = type === "no_images";
  const iconName = isNoImages ? "inbox" : "search_off";
  const title = isNoImages ? "Upload images to get started" : "No images found";
  const description = isNoImages
    ? "Drag and drop your images here or click to browse."
    : "Try adjusting your filters or search.";
  const actionLabel = isNoImages ? "Upload Images" : "Clear Filters";

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
        <span className="material-icons" style={{ fontSize: "40px" }}>{iconName}</span>
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

        {onAction && (
          <button
            onClick={onAction}
            style={{
              marginTop: tokens.spacing.sm,
              paddingInline: tokens.spacing.lg,
              paddingBlock: tokens.spacing.sm,
              borderRadius: tokens.radius.md,
              border: `1px solid ${tokens.colors.outline}`,
              backgroundColor: tokens.colors.surface,
              color: tokens.colors.onSurface,
              cursor: "pointer",
              fontFamily: tokens.typography.labelLarge.fontFamily,
              fontSize: tokens.typography.labelLarge.fontSize,
              fontWeight: tokens.typography.labelLarge.fontWeight,
              lineHeight: tokens.typography.labelLarge.lineHeight,
              letterSpacing: tokens.typography.labelLarge.letterSpacing,
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
