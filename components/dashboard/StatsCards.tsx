"use client";

import { tokens } from "@/lib/design-tokens";
import type { Stats } from "./mockData";

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
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
      <div className="flex items-center gap-sm mb-md">
        <span className="material-icons" style={{ fontSize: "20px", color: tokens.colors.primary }}>
          analytics
        </span>
        <span
          className="text-label-large"
          style={{ color: tokens.colors.onSurface }}
        >
          Overview
        </span>
      </div>

      <div className="flex flex-wrap gap-md">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex-1 min-w-[180px] rounded-xl border p-md transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.outlineVariant,
            }}
          >
            <div className="flex items-center justify-between mb-sm">
              <span
                className="material-icons"
                style={{ fontSize: "20px", color: item.color }}
              >
                {item.icon}
              </span>
            </div>
            <p
              className="text-body-medium"
              style={{ color: tokens.colors.onSurfaceVariant }}
            >
              {item.label}
            </p>
            <p
              className="text-headline-small mt-xs"
              style={{ color: tokens.colors.onSurface }}
            >
              {item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}