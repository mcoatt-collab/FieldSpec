"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import { useState } from "react";

const actions = [
  {
    id: "create-project",
    label: "Create Project",
    icon: "add_circle",
    href: "/dashboard/projects?new=true",
    primary: true,
  },
  {
    id: "upload-images",
    label: "Upload Images",
    icon: "cloud_upload",
    href: "/dashboard/upload",
    primary: false,
  },
  {
    id: "generate-report",
    label: "Generate Report",
    icon: "description",
    href: "/dashboard/report",
    primary: false,
  },
];

export function QuickActionsPanel() {
  const router = useRouter();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        <span className="material-icons" style={{ fontSize: tokens.typography.titleMedium.fontSize, color: tokens.colors.tertiary }}>
          flash_on
        </span>
        <span
          style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.labelLarge.fontSize, fontWeight: tokens.typography.labelLarge.fontWeight }}
        >
          Quick Actions
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacing.md }}>
        {actions.map((action, index) => {
          const isPrimary = action.primary;
          const isHovered = hoveredIdx === index;
          const baseBg = isPrimary ? tokens.colors.primaryContainer : tokens.colors.surfaceVariant;
          const baseColor = isPrimary ? tokens.colors.onPrimaryContainer : tokens.colors.onSurfaceVariant;
          const hoverBg = isPrimary ? tokens.colors.primary : tokens.colors.primaryContainer;
          const hoverColor = isPrimary ? tokens.colors.onPrimary : tokens.colors.onPrimaryContainer;

          return (
          <button
            key={action.id}
            onClick={() => handleClick(action.href)}
            onMouseEnter={() => setHoveredIdx(index)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              paddingTop: "12px",
              paddingBottom: "12px",
              paddingLeft: "12px",
              
              paddingRight: tokens.spacing.md,
              borderRadius: tokens.radius.lg,
              backgroundColor: isHovered ? hoverBg : baseBg,
              color: isHovered ? hoverColor : baseColor,
              border: "1px solid",
              borderColor: "transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <span
              className="material-icons"
              style={{
                fontSize: tokens.typography.labelLarge.lineHeight,
                color: isHovered ? hoverColor : (isPrimary ? tokens.colors.onPrimaryContainer : tokens.colors.onSurfaceVariant),
              }}
            >
              {action.icon}
            </span>
            <span
              style={{
                color: isHovered ? hoverColor : (isPrimary ? tokens.colors.onPrimaryContainer : tokens.colors.onSurfaceVariant),
                fontSize: tokens.typography.labelLarge.fontSize,
                fontWeight: tokens.typography.labelLarge.fontWeight,
                lineHeight: tokens.typography.labelLarge.lineHeight,
                letterSpacing: tokens.typography.labelLarge.letterSpacing,
              }}
            >
              {action.label}
            </span>
          </button>
          );
        })}
      </div>
    </div>
  );
}