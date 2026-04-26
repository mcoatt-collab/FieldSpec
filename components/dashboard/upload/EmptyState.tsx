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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.lg,
        width: "100%",
        padding: tokens.spacing.xl,
        borderRadius: tokens.radius.lg,
        border: `1px dashed ${tokens.colors.outlineVariant}`,
        backgroundColor: tokens.colors.surface,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: tokens.spacing.md,
          borderRadius: tokens.radius.pill,
          backgroundColor: tokens.colors.surfaceContainer,
          color: tokens.colors.onSurfaceVariant,
        }}
      >
        <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>{iconName}</span>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
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
          {isNoImages ? "Upload images to get started" : "No images found"}
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
          {isNoImages
            ? "Drag and drop your images here or click to browse."
            : "Try adjusting your filters or search."}
        </p>

        {onAction && (
          <div>
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
              {isNoImages ? "Upload Images" : "Clear Filters"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
