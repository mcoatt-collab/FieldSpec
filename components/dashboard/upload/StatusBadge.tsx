"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";

export type StatusType = "pending" | "processing" | "completed" | "failed";

interface StatusBadgeProps {
  status: StatusType;
}

const STATUS_STYLES: Record<
  StatusType,
  {
    backgroundColor: string;
    borderColor: string;
    color: string;
  }
> = {
  pending: {
    backgroundColor: tokens.colors.surfaceContainerHigh,
    borderColor: tokens.colors.outline,
    color: tokens.colors.onSurface,
  },
  processing: {
    backgroundColor: "color-mix(in srgb, var(--ref-key-warning-key-color) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--ref-key-warning-key-color) 48%, transparent)",
    color: "var(--ref-key-warning-key-color)",
  },
  completed: {
    backgroundColor: "color-mix(in srgb, var(--ref-key-success-key-color) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--ref-key-success-key-color) 48%, transparent)",
    color: "var(--ref-key-success-key-color)",
  },
  failed: {
    backgroundColor: "color-mix(in srgb, var(--sys-error) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--sys-error) 48%, transparent)",
    color: tokens.colors.error,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const styles = STATUS_STYLES[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "fit-content",
        paddingInline: tokens.spacing.sm,
        paddingBlock: tokens.spacing.xs,
        borderRadius: tokens.radius.sm,
        border: `1px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: tokens.typography.labelSmall.fontFamily,
        fontSize: tokens.typography.labelSmall.fontSize,
        fontWeight: tokens.typography.labelSmall.fontWeight,
        lineHeight: tokens.typography.labelSmall.lineHeight,
        letterSpacing: tokens.typography.labelSmall.letterSpacing,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
