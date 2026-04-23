"use client";

import { tokens } from "@/lib/design-tokens";
import { ProjectStats } from "@/hooks/useReportState";

interface ReportJobStatusProps {
  jobStatus: {
    status: string;
    progress: number;
    progressMessage: string;
    errorMessage: string | null;
  } | null;
  generating: boolean;
  existingJobId: string | null;
  onGenerate: () => void;
  onCancel: () => void;
  cancelling: boolean;
  projectStats: ProjectStats | null;
}

export function ReportJobStatus({
  jobStatus,
  generating,
  existingJobId,
  onGenerate,
  onCancel,
  cancelling,
  projectStats,
}: ReportJobStatusProps) {
  const getStatusColor = () => {
    if (!jobStatus) return tokens.colors.primary;
    if (jobStatus.status === "completed") return tokens.colors.tertiary;
    if (jobStatus.status === "failed") return tokens.colors.error;
    return tokens.colors.primary;
  };

  if (jobStatus) {
    return (
      <div
        style={{
          padding: tokens.spacing.xl,
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          marginBottom: tokens.spacing.lg,
        }}
      >
        <div style={{ marginBottom: tokens.spacing.md }}>
          <span
            style={{
              ...tokens.typography.labelLarge,
              color: getStatusColor(),
              textTransform: "capitalize",
            }}
          >
            {jobStatus.status === "completed" ? "Report Generated" : jobStatus.status === "failed" ? "Generation Failed" : "Generating..."}
          </span>
        </div>

        <div
          style={{
            height: "8px",
            backgroundColor: tokens.colors.surfaceVariant,
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: tokens.spacing.md,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${jobStatus.progress}%`,
              backgroundColor: jobStatus.status === "completed" ? tokens.colors.tertiary : jobStatus.status === "failed" ? tokens.colors.error : tokens.colors.primary,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
          {jobStatus.progressMessage}
        </p>

        {(jobStatus.status === "pending" || jobStatus.status === "processing") && existingJobId && (
          <div style={{ marginTop: tokens.spacing.md }}>
            <button
              onClick={onCancel}
              disabled={cancelling}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                backgroundColor: tokens.colors.errorContainer,
                color: tokens.colors.onErrorContainer,
                border: "none",
                borderRadius: tokens.radius.md,
                cursor: cancelling ? "not-allowed" : "pointer",
                opacity: cancelling ? 0.7 : 1,
                ...tokens.typography.labelLarge,
              }}
            >
              {cancelling ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        )}

        {jobStatus.status === "failed" && (
          <div style={{ marginTop: tokens.spacing.md }}>
            <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.error, marginBottom: tokens.spacing.sm }}>
              {jobStatus.errorMessage || "An error occurred during generation"}
            </p>
            <button
              onClick={onGenerate}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.onPrimary,
                border: "none",
                borderRadius: tokens.radius.md,
                cursor: "pointer",
                ...tokens.typography.labelLarge,
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <button
        onClick={onGenerate}
        disabled={generating || !projectStats || projectStats.total === 0}
        style={{
          padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
          backgroundColor: generating || !projectStats || projectStats.total === 0 ? tokens.colors.surfaceVariant : tokens.colors.primary,
          color: generating || !projectStats || projectStats.total === 0 ? tokens.colors.onSurfaceVariant : tokens.colors.onPrimary,
          border: "none",
          borderRadius: tokens.radius.md,
          cursor: generating || !projectStats || projectStats.total === 0 ? "not-allowed" : "pointer",
          opacity: generating ? 0.7 : 1,
          ...tokens.typography.labelLarge,
        }}
      >
        {generating ? "Starting..." : "Generate Report"}
      </button>
    </div>
  );
}
