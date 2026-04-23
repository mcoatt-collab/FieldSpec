"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

export function EmptyState() {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.outlineVariant,
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: tokens.radius.xl,
        padding: tokens.spacing.xl,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: tokens.spacing.md,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tokens.colors.surfaceVariant,
        }}
      >
        <span
          className="material-icons"
          style={{ fontSize: "40px", color: tokens.colors.onSurfaceVariant }}
        >
          folder_open
        </span>
      </div>

      <h3
        style={{ 
          color: tokens.colors.onSurface, 
          fontSize: tokens.typography.titleLarge.fontSize,
          fontWeight: tokens.typography.titleLarge.fontWeight,
          marginBottom: tokens.spacing.sm,
        }}
      >
        No projects yet
      </h3>

      <p
        style={{ 
          color: tokens.colors.onSurfaceVariant, 
          fontSize: tokens.typography.bodyMedium.fontSize,
          marginBottom: tokens.spacing.lg,
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Create your first project to start generating AI reports from your drone images.
      </p>

      <button
        onClick={() => router.push("/dashboard/projects?new=true")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: tokens.spacing.sm,
          paddingLeft: tokens.spacing.lg,
          paddingRight: tokens.spacing.lg,
          paddingTop: tokens.spacing.sm,
          paddingBottom: tokens.spacing.sm,
          borderRadius: tokens.radius.pill,
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.onPrimary,
          border: "none",
          fontSize: tokens.typography.labelLarge.fontSize,
          fontWeight: tokens.typography.labelLarge.fontWeight,
          cursor: "pointer",
        }}
      >
        <span className="material-icons" style={{ fontSize: tokens.typography.titleMedium.fontSize }}>
          add
        </span>
        Create First Project
      </button>
    </div>
  );
}
