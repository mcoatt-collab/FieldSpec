"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";

import { StatusBadge, StatusType } from "./StatusBadge";

interface UploadImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  notes: string | null;
  createdAt?: string;
  status?: StatusType;
}

interface ImageCardProps {
  image: UploadImage;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onCategoryChange: (id: string, category: string) => void;
  onEditNote: (image: UploadImage) => void;
  onDelete: (id: string) => void;
  onReprocess: (id: string) => void;
}

const CATEGORY_OPTIONS = [
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
];

function ActionIconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.spacing.xs,
        borderRadius: tokens.radius.sm,
        border: `1px solid ${tokens.colors.outlineVariant}`,
        backgroundColor: tokens.colors.surface,
        color: tokens.colors.onSurface,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function ImageCard({
  image,
  isSelected,
  onSelect,
  onCategoryChange,
  onEditNote,
  onDelete,
  onReprocess,
}: ImageCardProps) {
  const status = image.status ?? "completed";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: tokens.radius.lg,
        border: `1px solid ${isSelected ? tokens.colors.primary : tokens.colors.outlineVariant}`,
        backgroundColor: tokens.colors.surface,
        boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        padding: tokens.spacing.sm,
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          borderRadius: tokens.radius.md,
          overflow: "hidden",
          backgroundColor: tokens.colors.surfaceContainer,
        }}
      >
        <button
          onClick={() => onSelect(image.id, !isSelected)}
          aria-label={isSelected ? "Deselect image" : "Select image"}
          style={{
            position: "absolute",
            top: tokens.spacing.sm,
            left: tokens.spacing.sm,
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tokens.colors.surfaceContainerHigh,
            color: isSelected ? tokens.colors.primary : tokens.colors.onSurface,
            cursor: "pointer",
            borderRadius: tokens.radius.sm,
            padding: tokens.spacing.xs,
          }}
        >
          {isSelected ? (
            <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>check_box</span>
          ) : (
            <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>check_box_outline_blank</span>
          )}
        </button>

        <div
          style={{
            position: "absolute",
            top: tokens.spacing.sm,
            right: tokens.spacing.sm,
            zIndex: 1,
          }}
        >
          <StatusBadge status={status} />
        </div>

        <img
          src={image.thumbnailUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: tokens.spacing.sm,
            display: "flex",
            justifyContent: "space-between",
            paddingInline: tokens.spacing.sm,
          }}
        >
          <ActionIconButton
            title="View full image"
            onClick={() => window.open(image.url, "_blank")}
          >
            <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>visibility</span>
          </ActionIconButton>
          <ActionIconButton
            title="Delete image"
            onClick={() => onDelete(image.id)}
          >
            <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>delete_outline</span>
          </ActionIconButton>
          <ActionIconButton
            title="Reprocess image"
            onClick={() => onReprocess(image.id)}
          >
            <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>autorenew</span>
          </ActionIconButton>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.sm,
          padding: tokens.spacing.sm,
        }}
      >
        <label
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <select
            value={image.category || "general"}
            onChange={(e) => onCategoryChange(image.id, e.target.value)}
            style={{
              width: "100%",
              appearance: "none",
              paddingInline: tokens.spacing.sm,
              paddingBlock: tokens.spacing.sm,
              paddingRight: tokens.spacing.xl,
              borderRadius: tokens.radius.sm,
              border: `1px solid ${tokens.colors.outline}`,
              backgroundColor: tokens.colors.surface,
              color: tokens.colors.onSurface,
              cursor: "pointer",
              outline: "none",
              fontFamily: tokens.typography.bodyMedium.fontFamily,
              fontSize: tokens.typography.bodyMedium.fontSize,
              fontWeight: tokens.typography.bodyMedium.fontWeight,
              lineHeight: tokens.typography.bodyMedium.lineHeight,
              letterSpacing: tokens.typography.bodyMedium.letterSpacing,
            }}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="material-icons"
            style={{
              position: "absolute",
              right: tokens.spacing.sm,
              pointerEvents: "none",
              color: tokens.colors.onSurfaceVariant,
              fontSize: tokens.typography.labelLarge.lineHeight,
            }}
          >
            keyboard_arrow_down
          </span>
        </label>

        <button
          onClick={() => onEditNote(image)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: tokens.spacing.sm,
            border: "none",
            backgroundColor: "transparent",
            color: tokens.colors.onSurfaceVariant,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: tokens.typography.bodyMedium.fontFamily,
            fontSize: tokens.typography.bodyMedium.fontSize,
            fontWeight: tokens.typography.bodyMedium.fontWeight,
            lineHeight: tokens.typography.bodyMedium.lineHeight,
            letterSpacing: tokens.typography.bodyMedium.letterSpacing,
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {image.notes || "Add Note"}
          </span>
          <span className="material-icons" style={{ fontSize: tokens.typography.labelLarge.lineHeight }}>chat_bubble_outline</span>
        </button>
      </div>
    </div>
  );
}
