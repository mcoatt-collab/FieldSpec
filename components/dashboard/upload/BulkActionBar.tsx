"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

interface BulkActionBarProps {
  totalCount: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkCategorize: (category: string) => void;
  onBulkReprocess: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
];

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: tokens.spacing.sm,
        paddingInline: tokens.spacing.md,
        paddingBlock: tokens.spacing.sm,
        borderRadius: tokens.radius.sm,
        border: `1px solid ${tokens.colors.outline}`,
        backgroundColor: tokens.colors.surface,
        color: tokens.colors.onSurface,
        opacity: disabled ? "0.48" : "1",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: tokens.typography.labelLarge.fontFamily,
        fontSize: tokens.typography.labelLarge.fontSize,
        fontWeight: tokens.typography.labelLarge.fontWeight,
        lineHeight: tokens.typography.labelLarge.lineHeight,
        letterSpacing: tokens.typography.labelLarge.letterSpacing,
      }}
    >
      {children}
    </button>
  );
}

export function BulkActionBar({
  totalCount,
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkCategorize,
  onBulkReprocess,
}: BulkActionBarProps) {
  if (totalCount === 0) return null;

  const hasSelection = selectedCount > 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
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
          gap: tokens.spacing.md,
        }}
      >
        <button
          onClick={onToggleSelectAll}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: tokens.spacing.sm,
            border: "none",
            backgroundColor: "transparent",
            color: tokens.colors.onSurface,
            cursor: "pointer",
            fontFamily: tokens.typography.bodyLarge.fontFamily,
            fontSize: tokens.typography.bodyLarge.fontSize,
            fontWeight: tokens.typography.bodyLarge.fontWeight,
            lineHeight: tokens.typography.bodyLarge.lineHeight,
            letterSpacing: tokens.typography.bodyLarge.letterSpacing,
          }}
        >
          {allSelected ? (
            <CheckBoxOutlinedIcon style={{ color: tokens.colors.primary }} />
          ) : (
            <CheckBoxOutlineBlankOutlinedIcon
              style={{ color: tokens.colors.onSurfaceVariant }}
            />
          )}
          <span>Select All</span>
        </button>

        <span
          style={{
            width: "1px",
            alignSelf: "stretch",
            backgroundColor: tokens.colors.outlineVariant,
          }}
        />

        <span
          style={{
            color: tokens.colors.onSurface,
            fontFamily: tokens.typography.bodyLarge.fontFamily,
            fontSize: tokens.typography.bodyLarge.fontSize,
            fontWeight: tokens.typography.bodyLarge.fontWeight,
            lineHeight: tokens.typography.bodyLarge.lineHeight,
            letterSpacing: tokens.typography.bodyLarge.letterSpacing,
          }}
        >
          {selectedCount} selected
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: tokens.spacing.sm,
        }}
      >
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: tokens.spacing.sm,
            paddingInline: tokens.spacing.md,
            paddingBlock: tokens.spacing.sm,
            borderRadius: tokens.radius.sm,
            border: `1px solid ${tokens.colors.outline}`,
            backgroundColor: tokens.colors.surface,
            color: tokens.colors.onSurface,
            opacity: hasSelection ? "1" : "0.48",
          }}
        >
          <LocalOfferOutlinedIcon />
          <select
            value=""
            onChange={(e) => e.target.value && onBulkCategorize(e.target.value)}
            disabled={!hasSelection}
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: tokens.colors.onSurface,
              cursor: hasSelection ? "pointer" : "not-allowed",
              fontFamily: tokens.typography.labelLarge.fontFamily,
              fontSize: tokens.typography.labelLarge.fontSize,
              fontWeight: tokens.typography.labelLarge.fontWeight,
              lineHeight: tokens.typography.labelLarge.lineHeight,
              letterSpacing: tokens.typography.labelLarge.letterSpacing,
            }}
          >
            <option value="" disabled>
              Categorize
            </option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <ActionButton disabled={!hasSelection} onClick={onBulkDelete}>
          <DeleteOutlineOutlinedIcon />
          Delete
        </ActionButton>

        <ActionButton disabled={!hasSelection} onClick={onBulkReprocess}>
          <AutorenewOutlinedIcon />
          Reprocess
        </ActionButton>

        <button
          onClick={onClearSelection}
          disabled={!hasSelection}
          aria-label="Clear image selection"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: tokens.spacing.xs,
            border: "none",
            borderRadius: tokens.radius.sm,
            backgroundColor: "transparent",
            color: tokens.colors.onSurface,
            opacity: hasSelection ? "1" : "0.48",
            cursor: hasSelection ? "pointer" : "not-allowed",
          }}
        >
          <CloseOutlinedIcon />
        </button>
      </div>
    </div>
  );
}
