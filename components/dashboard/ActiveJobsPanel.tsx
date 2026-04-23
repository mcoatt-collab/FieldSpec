"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import type { Job } from "./mockData";

interface ActiveJobsPanelProps {
  jobs: Job[];
}

export function ActiveJobsPanel({ jobs }: ActiveJobsPanelProps) {
  const router = useRouter();

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
        <span className="material-icons" style={{ fontSize: tokens.typography.titleMedium.fontSize, color: tokens.colors.primary }}>
          sync
        </span>
        <span
          style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.labelLarge.fontSize, fontWeight: tokens.typography.labelLarge.fontWeight }}
        >
          Active Processing
        </span>
      </div>

      <div 
        style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.outlineVariant,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: tokens.radius.xl,
          overflow: "hidden",
        }}
      >
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "flex-start", 
          justifyContent: "center", 
          padding: tokens.spacing.lg,
          borderRightWidth: "1px",
          borderRightStyle: "solid",
          borderRightColor: tokens.colors.outlineVariant,
        }}>
          <div style={{ marginBottom: tokens.spacing.md, padding: tokens.spacing.sm, backgroundColor: tokens.colors.surfaceContainerLow, borderRadius: tokens.radius.md }}>
            <span className="material-icons" style={{ fontSize: "48px", color: tokens.colors.surfaceContainerHigh }}>
              table_chart
            </span>
          </div>
          <p 
            style={{ 
              color: tokens.colors.onSurfaceVariant, 
              fontSize: tokens.typography.bodyMedium.fontSize,
              textAlign: "left",
              maxWidth: "280px",
              marginBottom: tokens.spacing.md,
            }}
          >
            Monitor your active AI processing queue to track job progress in real-time.
          </p>
          <button 
            onClick={() => router.push("/dashboard/projects")}
            style={{ 
              color: tokens.colors.primary, 
              fontSize: tokens.typography.labelLarge.fontSize,
              fontWeight: "500",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textDecoration: "underline",
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.xs,
            }}
          >
            View all projects
            <span className="material-icons" style={{ fontSize: tokens.typography.bodyMedium.fontSize }}>
              arrow_forward
            </span>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: tokens.spacing.lg, minHeight: "250px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: tokens.spacing.xs, paddingRight: tokens.spacing.sm }}>
            <span style={{ color: tokens.colors.outline, 
            fontWeight: tokens.typography.labelLarge.fontWeight,
            fontSize: tokens.typography.labelLarge.fontSize }}>Activity</span>
            <span style={{ color: tokens.colors.outline, 
            fontWeight: tokens.typography.labelLarge.fontWeight,  
            fontSize: tokens.typography.labelLarge.fontSize }}>Status</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "180px", paddingRight: tokens.spacing.sm }}>
            {jobs.map((job, index) => (
              <div 
                key={job.id}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  paddingTop: tokens.spacing.sm, 
                  paddingBottom: tokens.spacing.sm,
                  paddingLeft: tokens.spacing.sm,
                  paddingRight: tokens.spacing.sm,
                  cursor: "pointer",
                  borderBottomWidth: index !== jobs.length - 1 ? "1px" : "0",
                  borderBottomStyle: "solid",
                  borderBottomColor: tokens.colors.outlineVariant,
                }}
                onClick={() => router.push(`/dashboard/projects?job=${job.id}`)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
                  <span className="material-icons" style={{ 
                    fontSize: tokens.typography.bodyMedium.fontSize, 
                    color: job.status === "processing" ? tokens.colors.primary : tokens.colors.outline 
                  }}>
                    {job.type === "full_report" ? "description" : "auto_awesome"}
                  </span>
                  <span style={{ 
                    color: tokens.colors.onSurface, 
                    fontSize: tokens.typography.bodyMedium.fontSize,
                    maxWidth: "180px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {job.projectName}
                  </span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
                  <span style={{ 
                    color: job.status === "processing" ? tokens.colors.onSurface : tokens.colors.onSurfaceVariant,
                    fontSize: tokens.typography.labelMedium.fontSize,
                  }}>
                    {job.status === "processing" ? `${job.progress}%` : 
                     job.status === "completed" ? "Done" : 
                     job.status === "pending" ? "Queued" : "Failed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}