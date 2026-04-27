"use client";

import { tokens } from "@/lib/design-tokens";
import {
  StructuredReport,
  ExportState,
} from "@/hooks/useReportState";

interface ReportExporterProps {
  selectedProjectId: string;
  editedReport: StructuredReport;
  exportedFileUrl: string | null;
  exportState: ExportState;
  exportError: string;
  onExport: () => void;
}

export function ReportExporter({
  selectedProjectId,
  editedReport,
  exportedFileUrl,
  exportState,
  exportError,
  onExport,
}: ReportExporterProps) {
  return (
    <>
      <div
        style={{
          marginBottom: tokens.spacing.lg,
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          border: `1px solid ${tokens.colors.outlineVariant}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: tokens.spacing.md,
        }}
      >
        <div>
          <h4
            style={{
              ...tokens.typography.titleMedium,
              color: tokens.colors.onSurface,
              marginBottom: tokens.spacing.xs,
            }}
          >
            Export Report
          </h4>
          <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>
            Download as PDF or access previously exported file
          </p>
        </div>
        <div style={{ display: "flex", gap: tokens.spacing.md, alignItems: "center" }}>
          {exportedFileUrl && (
            <a
              href={exportedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: tokens.colors.tertiaryContainer,
                color: tokens.colors.onTertiaryContainer,
                border: "none",
                borderRadius: tokens.radius.md,
                cursor: "pointer",
                textDecoration: "none",
                ...tokens.typography.labelMedium,
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.xs,
              }}
            >
              <span className="material-icons" style={{ fontSize: "18px" }}>visibility</span>
              View PDF
            </a>
          )}
          <button
            onClick={onExport}
            disabled={exportState === "loading" || exportState === "generating"}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              backgroundColor: exportState === "loading" || exportState === "generating"
                ? tokens.colors.surfaceVariant
                : tokens.colors.primary,
              color: exportState === "loading" || exportState === "generating"
                ? tokens.colors.onSurfaceVariant
                : tokens.colors.onPrimary,
              border: "none",
              borderRadius: tokens.radius.md,
              cursor: exportState === "loading" || exportState === "generating"
                ? "not-allowed"
                : "pointer",
              opacity: exportState === "generating" ? 0.7 : 1,
              ...tokens.typography.labelMedium,
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.xs,
            }}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>
              {exportState === "loading" || exportState === "generating" ? "sync" : exportState === "success" ? "check" : "download"}
            </span>
            {exportState === "loading" && "Preparing..."}
            {exportState === "generating" && "Generating PDF..."}
            {exportState === "success" && "Export Complete!"}
            {exportState === "error" && "Export Failed"}
            {exportState === "idle" && (exportedFileUrl ? "Export Again" : "Export PDF")}
          </button>
        </div>
      </div>

      {exportError && (
        <div
          style={{
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.md,
            backgroundColor: tokens.colors.errorContainer,
            color: tokens.colors.onErrorContainer,
            borderRadius: tokens.radius.md,
            ...tokens.typography.bodySmall,
          }}
        >
          {exportError}
        </div>
      )}

      {exportState === "success" && !exportError && (
        <div
          style={{
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.md,
            backgroundColor: tokens.colors.tertiaryContainer,
            color: tokens.colors.onTertiaryContainer,
            borderRadius: tokens.radius.md,
            ...tokens.typography.bodyMedium,
          }}
        >
          PDF exported successfully!{exportedFileUrl ? " You can access it from the link above." : " Your download should start automatically."}
        </div>
      )}
    </>
  );
}
