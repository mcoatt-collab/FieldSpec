"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

export function EmptyState() {
  const router = useRouter();

  return (
    <div
      className="rounded-xl border p-xl text-center"
      style={{
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.outlineVariant,
      }}
    >
      <div
        className="w-20 h-20 mx-auto mb-md rounded-full flex items-center justify-center"
        style={{ backgroundColor: tokens.colors.surfaceVariant }}
      >
        <span
          className="material-icons"
          style={{ fontSize: "40px", color: tokens.colors.onSurfaceVariant }}
        >
          folder_open
        </span>
      </div>

      <h3
        className="text-title-large mb-sm"
        style={{ color: tokens.colors.onSurface }}
      >
        No projects yet
      </h3>

      <p
        className="text-body-medium mb-lg max-w-md mx-auto"
        style={{ color: tokens.colors.onSurfaceVariant }}
      >
        Create your first project to start generating AI reports from your drone images.
      </p>

      <button
        onClick={() => router.push("/dashboard/projects?new=true")}
        className="inline-flex items-center gap-sm px-lg py-sm rounded-pill text-label-large transition-all duration-200 hover:scale-105 cursor-pointer"
        style={{
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.onPrimary,
          border: "none",
        }}
      >
        <span className="material-icons" style={{ fontSize: "20px" }}>
          add
        </span>
        Create First Project
      </button>
    </div>
  );
}
