"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import { Project, ProjectStats } from "@/hooks/useReportState";
import { EmptyState } from "@/components/dashboard/EmptyState";

interface ReportProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
  projectStats: ProjectStats | null;
}

export function ReportProjectSelector({
  projects,
  selectedProjectId,
  onProjectChange,
  projectStats,
}: ReportProjectSelectorProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <EmptyState
        icon="description"
        title="No projects available"
        description="Create a project first to generate reports"
        actionLabel="Create Project"
        onAction={() => router.push("/dashboard/projects")}
      />
    );
  }

  return (
    <>
      <div
        className="animate-content"
        style={{
          marginBottom: tokens.spacing.lg,
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.md,
          flexWrap: "wrap",
        }}
      >
        <label style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface }}>
          Project:
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => onProjectChange(e.target.value)}
          className="custom-select"
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.xl} ${tokens.spacing.sm} ${tokens.spacing.sm}`,
            border: `1px solid ${tokens.colors.outlineVariant}`,
            borderRadius: tokens.radius.md,
            backgroundColor: tokens.colors.surface,
            color: tokens.colors.onSurface,
            ...tokens.typography.bodyLarge,
            minWidth: "200px",
            boxSizing: "border-box",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `right ${tokens.spacing.sm} center`,
            backgroundSize: "16px",
            cursor: "pointer",
          }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {projectStats && (
        <div
          className="animate-content"
          style={{
            marginBottom: tokens.spacing.lg,
            padding: tokens.spacing.lg,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            border: `1px solid ${tokens.colors.outlineVariant}`,
          }}
        >
          <h3
            style={{
              ...tokens.typography.titleMedium,
              color: tokens.colors.onSurface,
              marginBottom: tokens.spacing.md,
            }}
          >
            Project Status
          </h3>
          <div style={{ display: "flex", gap: tokens.spacing.xl, flexWrap: "wrap" }}>
            <div>
              <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                Total Images
              </p>
              <p style={{ ...tokens.typography.headlineSmall, color: tokens.colors.onSurface }}>
                {projectStats.total}
              </p>
            </div>
            <div>
              <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                Untagged
              </p>
              <p
                style={{
                  ...tokens.typography.headlineSmall,
                  color: projectStats.untagged > 0 ? tokens.colors.error : tokens.colors.onSurface,
                }}
              >
                {projectStats.untagged}
              </p>
            </div>
            <div>
              <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                With Notes
              </p>
              <p style={{ ...tokens.typography.headlineSmall, color: tokens.colors.onSurface }}>
                {projectStats.withNotes}
              </p>
            </div>
          </div>

          {projectStats.total === 0 && (
            <div
              style={{
                marginTop: tokens.spacing.md,
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.errorContainer,
                borderRadius: tokens.radius.md,
              }}
            >
              <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onErrorContainer }}>
                No images in this project. Upload images first to generate a report.
              </p>
            </div>
          )}

          {projectStats.untagged > 0 && projectStats.total > 0 && (
            <div
              style={{
                marginTop: tokens.spacing.md,
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.surfaceVariant,
                borderRadius: tokens.radius.md,
              }}
            >
              <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
                {projectStats.untagged} image(s) are untagged. Tagging helps improve report accuracy.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}