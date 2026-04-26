"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";


const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
  { value: "untagged", label: "Untagged" },
];

const STATUSES = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

interface FilterBarProps {
  category: string;
  setCategory: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  query: string;
  setQuery: (val: string) => void;
}

function renderFilterButton(
  value: string,
  label: string,
  activeValue: string,
  onClick: (value: string) => void,
) {
  const isActive = activeValue === value;

  return (
    <button
      key={value}
      onClick={() => onClick(value)}
      style={{
        paddingInline: tokens.spacing.md,
        paddingBlock: tokens.spacing.sm,
        borderRadius: tokens.radius.sm,
        border: `1px solid ${isActive ? tokens.colors.primary : tokens.colors.outlineVariant}`,
        backgroundColor: isActive
          ? "color-mix(in srgb, var(--sys-primary) 12%, transparent)"
          : tokens.colors.surface,
        color: isActive ? tokens.colors.primary : tokens.colors.onSurface,
        cursor: "pointer",
        fontFamily: tokens.typography.labelLarge.fontFamily,
        fontSize: tokens.typography.labelLarge.fontSize,
        fontWeight: tokens.typography.labelLarge.fontWeight,
        lineHeight: tokens.typography.labelLarge.lineHeight,
        letterSpacing: tokens.typography.labelLarge.letterSpacing,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function renderLabel(text: string) {
  return (
    <span
      style={{
        color: tokens.colors.onSurface,
        fontFamily: tokens.typography.titleSmall.fontFamily,
        fontSize: tokens.typography.titleSmall.fontSize,
        fontWeight: tokens.typography.titleSmall.fontWeight,
        lineHeight: tokens.typography.titleSmall.lineHeight,
        letterSpacing: tokens.typography.titleSmall.letterSpacing,
      }}
    >
      {text}
    </span>
  );
}

export function FilterBar({
  category,
  setCategory,
  status,
  setStatus,
  sort,
  setSort,
  query,
  setQuery,
}: FilterBarProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
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
          flexDirection: "column",
          gap: tokens.spacing.sm,
        }}
      >
        {renderLabel("Categories")}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: tokens.spacing.sm,
          }}
        >
          {CATEGORIES.map((item) =>
            renderFilterButton(item.value, item.label, category, setCategory),
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.sm,
        }}
      >
        {renderLabel("Status")}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: tokens.spacing.sm,
          }}
        >
          {STATUSES.map((item) =>
            renderFilterButton(item.value, item.label, status, setStatus),
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.sm,
        }}
      >
        {renderLabel("Sort")}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: tokens.spacing.sm,
          }}
        >
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              minWidth: "fit-content",
              paddingInline: tokens.spacing.md,
              paddingBlock: tokens.spacing.sm,
              borderRadius: tokens.radius.sm,
              border: `1px solid ${tokens.colors.outlineVariant}`,
              backgroundColor: tokens.colors.surface,
              color: tokens.colors.onSurface,
              outline: "none",
              fontFamily: tokens.typography.labelLarge.fontFamily,
              fontSize: tokens.typography.labelLarge.fontSize,
              fontWeight: tokens.typography.labelLarge.fontWeight,
              lineHeight: tokens.typography.labelLarge.lineHeight,
              letterSpacing: tokens.typography.labelLarge.letterSpacing,
            }}
          >
            {SORTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label
            style={{
              display: "flex",
              flex: 1,
              minWidth: "min(100%, 16rem)",
              alignItems: "center",
              gap: tokens.spacing.sm,
              paddingInline: tokens.spacing.md,
              borderRadius: tokens.radius.sm,
              border: `1px solid ${tokens.colors.outlineVariant}`,
              backgroundColor: tokens.colors.surface,
            }}
          >
            <span className="material-icons" style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.labelLarge.lineHeight }}>search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search images..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: tokens.colors.onSurface,
                fontFamily: tokens.typography.bodyMedium.fontFamily,
                fontSize: tokens.typography.bodyMedium.fontSize,
                fontWeight: tokens.typography.bodyMedium.fontWeight,
                lineHeight: tokens.typography.bodyMedium.lineHeight,
                letterSpacing: tokens.typography.bodyMedium.letterSpacing,
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
