"use client";

import { tokens } from "@/lib/design-tokens";
import type { Stats } from "./mockData";
import { useState } from "react";

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const statItems = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: "folder",
      color: tokens.colors.primary,
    },
    {
      label: "Images Processed",
      value: stats.imagesProcessed,
      icon: "photo_library",
      color: tokens.colors.secondary,
    },
    {
      label: "Reports Generated",
      value: stats.reportsGenerated,
      icon: "description",
      color: "#37953c",
    },
    {
      label: "In Progress",
      value: stats.reportsInProgress,
      icon: "sync",
      color: tokens.colors.tertiary,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        <span className="material-icons" style={{ fontSize: tokens.typography.titleMedium.fontSize, color: tokens.colors.primary }}>
          analytics
        </span>
        <span
          style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.labelLarge.fontSize, fontWeight: tokens.typography.labelLarge.fontWeight }}
        >
          Overview
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: tokens.spacing.md }}>
        {statItems.map((item, index) => (
          <div
            key={item.label}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              backgroundColor: hoveredIndex === index ? tokens.colors.surfaceContainerLow : tokens.colors.surface,
              borderColor: tokens.colors.outlineVariant,
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: tokens.radius.xl,
              padding: tokens.spacing.md,
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing.sm }}>
              <span
                className="material-icons"
                style={{ fontSize: tokens.typography.titleMedium.fontSize, color: item.color }}
              >
                {item.icon}
              </span>
            </div>
            <p
              style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.bodyMedium.fontSize }}
            >
              {item.label}
            </p>
            <p
              style={{ 
                color: tokens.colors.onSurface, 
                fontSize: tokens.typography.headlineSmall.fontSize, 
                fontWeight: tokens.typography.headlineSmall.fontWeight,
                marginTop: tokens.spacing.xs,
              }}
            >
              {item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}