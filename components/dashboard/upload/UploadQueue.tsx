"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";


export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
}

interface UploadQueueProps {
  items: UploadItem[];
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
}

const STATUS_COLORS: Record<UploadItem["status"], string> = {
  pending: tokens.colors.onSurfaceVariant,
  uploading: tokens.colors.primary,
  completed: "var(--ref-key-success-key-color)",
  failed: tokens.colors.error,
};

const PROGRESS_COLORS: Record<UploadItem["status"], string> = {
  pending: tokens.colors.outlineVariant,
  uploading: tokens.colors.primary,
  completed: "var(--ref-key-success-key-color)",
  failed: tokens.colors.error,
};

export function UploadQueue({
  items,
  onRemoveItem,
  onClearCompleted,
}: UploadQueueProps) {
  if (items.length === 0) return null;

  const uploadingCount = items.filter((item) => item.status === "uploading").length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.md,
        padding: tokens.spacing.md,
        borderRadius: tokens.radius.lg,
        border: `1px solid ${tokens.colors.outlineVariant}`,
        backgroundColor: tokens.colors.surface,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: tokens.spacing.sm,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: tokens.spacing.xs,
            color: tokens.colors.onSurface,
          }}
        >
          <span
            style={{
              fontFamily: tokens.typography.titleMedium.fontFamily,
              fontSize: tokens.typography.titleMedium.fontSize,
              fontWeight: tokens.typography.titleMedium.fontWeight,
              lineHeight: tokens.typography.titleMedium.lineHeight,
              letterSpacing: tokens.typography.titleMedium.letterSpacing,
            }}
          >
            Upload Queue
          </span>
          <span
            style={{
              color: tokens.colors.onSurfaceVariant,
              fontFamily: tokens.typography.bodyMedium.fontFamily,
              fontSize: tokens.typography.bodyMedium.fontSize,
              fontWeight: tokens.typography.bodyMedium.fontWeight,
              lineHeight: tokens.typography.bodyMedium.lineHeight,
              letterSpacing: tokens.typography.bodyMedium.letterSpacing,
            }}
          >
            ({uploadingCount} / {items.length} uploading)
          </span>
        </div>

        <button
          onClick={onClearCompleted}
          style={{
            border: "none",
            background: "transparent",
            color: tokens.colors.primary,
            cursor: "pointer",
            fontFamily: tokens.typography.labelLarge.fontFamily,
            fontSize: tokens.typography.labelLarge.fontSize,
            fontWeight: tokens.typography.labelLarge.fontWeight,
            lineHeight: tokens.typography.labelLarge.lineHeight,
            letterSpacing: tokens.typography.labelLarge.letterSpacing,
          }}
        >
          Clear Completed
        </button>
      </div>

      <div
        style={{
          display: "flex",
          maxHeight: `calc(${tokens.spacing.xxl} * 3)`,
          flexDirection: "column",
          overflowY: "auto",
          borderRadius: tokens.radius.md,
          border: `1px solid ${tokens.colors.outlineVariant}`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "auto minmax(0, 1fr) auto auto auto",
              alignItems: "center",
              gap: tokens.spacing.md,
              paddingInline: tokens.spacing.md,
              paddingBlock: tokens.spacing.sm,
              borderTop:
                index === 0 ? "none" : `1px solid ${tokens.colors.outlineVariant}`,
              backgroundColor: tokens.colors.surface,
            }}
          >
            <span className="material-icons"
              style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.labelLarge.lineHeight }}
            >
              broken_image
            </span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr)",
                gap: tokens.spacing.xs,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: tokens.colors.onSurface,
                  fontFamily: tokens.typography.bodyMedium.fontFamily,
                  fontSize: tokens.typography.bodyMedium.fontSize,
                  fontWeight: tokens.typography.bodyMedium.fontWeight,
                  lineHeight: tokens.typography.bodyMedium.lineHeight,
                  letterSpacing: tokens.typography.bodyMedium.letterSpacing,
                }}
              >
                {item.name}
              </span>

              <div
                style={{
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: tokens.radius.pill,
                  backgroundColor: tokens.colors.surfaceContainer,
                }}
              >
                <div
                  style={{
                    height: tokens.spacing.sm,
                    width: `${item.progress}%`,
                    borderRadius: tokens.radius.pill,
                    backgroundColor: PROGRESS_COLORS[item.status],
                    transition: "width 160ms ease",
                  }}
                />
              </div>
            </div>

            <span
              style={{
                color: tokens.colors.onSurface,
                fontFamily: tokens.typography.labelLarge.fontFamily,
                fontSize: tokens.typography.labelLarge.fontSize,
                fontWeight: tokens.typography.labelLarge.fontWeight,
                lineHeight: tokens.typography.labelLarge.lineHeight,
                letterSpacing: tokens.typography.labelLarge.letterSpacing,
              }}
            >
              {item.progress}%
            </span>

            <span
              style={{
                color: STATUS_COLORS[item.status],
                fontFamily: tokens.typography.labelLarge.fontFamily,
                fontSize: tokens.typography.labelLarge.fontSize,
                fontWeight: tokens.typography.labelLarge.fontWeight,
                lineHeight: tokens.typography.labelLarge.lineHeight,
                letterSpacing: tokens.typography.labelLarge.letterSpacing,
                whiteSpace: "nowrap",
              }}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>

            <button
              onClick={() => onRemoveItem(item.id)}
              aria-label={`Remove ${item.name} from upload queue`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: tokens.spacing.xs,
                border: "none",
                borderRadius: tokens.radius.sm,
                backgroundColor: "transparent",
                color:
                  item.status === "completed"
                    ? "var(--ref-key-success-key-color)"
                    : tokens.colors.onSurface,
                cursor: "pointer",
              }}
            >
              {item.status === "completed" ? (
                <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>check_circle</span>
              ) : (
                <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>close</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
