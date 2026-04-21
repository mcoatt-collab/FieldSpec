"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

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

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div>
      <div className="flex items-center gap-sm mb-md">
        <span className="material-icons" style={{ fontSize: "20px", color: tokens.colors.tertiary }}>
          flash_on
        </span>
        <span
          className="text-label-large"
          style={{ color: tokens.colors.onSurface }}
        >
          Quick Actions
        </span>
      </div>

      <div className="flex flex-wrap gap-md">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action.href)}
            className="inline-flex items-center gap-md px-lg py-md rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02]"
            style={{
              backgroundColor: action.primary
                ? tokens.colors.primaryContainer
                : tokens.colors.surfaceVariant,
              color: action.primary
                ? tokens.colors.onPrimaryContainer
                : tokens.colors.onSurfaceVariant,
              border: "none",
            }}
          >
            <span
              className="material-icons"
              style={{
                fontSize: "28px",
                color: action.primary
                  ? tokens.colors.onPrimaryContainer
                  : tokens.colors.onSurfaceVariant,
              }}
            >
              {action.icon}
            </span>
            <span
              className="text-label-medium"
              style={{
                color: action.primary
                  ? tokens.colors.onPrimaryContainer
                  : tokens.colors.onSurfaceVariant,
              }}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}