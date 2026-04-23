"use client";

import { useReportState } from "@/hooks/useReportState";
import { tokens } from "@/lib/design-tokens";
import { ReportProjectSelector } from "@/components/dashboard/report/ReportProjectSelector";
import { ReportJobStatus } from "@/components/dashboard/report/ReportJobStatus";
import { ReportEditor } from "@/components/dashboard/report/ReportEditor";
import { ReportExporter } from "@/components/dashboard/report/ReportExporter";

export default function ReportPage() {
  const { state, actions } = useReportState();

  if (state.loading) {
    return (
      <div style={{ padding: tokens.spacing.xl, textAlign: "center", color: tokens.colors.onSurfaceVariant }}>
        <p style={tokens.typography.bodyLarge}>Loading projects...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: tokens.spacing.xl, maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: tokens.spacing.xl }}>
        <h1 style={{ ...tokens.typography.headlineMedium, color: tokens.colors.onSurface, marginBottom: tokens.spacing.xs }}>
          Analysis Reports
        </h1>
        <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant }}>
          Generate and manage professional survey reports
        </p>
      </header>

      <ReportProjectSelector
        projects={state.projects}
        selectedProjectId={state.selectedProjectId}
        onProjectChange={actions.setSelectedProjectId}
        projectStats={state.projectStats}
      />

      {state.error && (
        <div
          style={{
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.lg,
            backgroundColor: tokens.colors.errorContainer,
            color: tokens.colors.onErrorContainer,
            borderRadius: tokens.radius.md,
            ...tokens.typography.bodyMedium,
          }}
        >
          {state.error}
        </div>
      )}

      <ReportJobStatus
        jobStatus={state.jobStatus}
        generating={state.generating}
        existingJobId={state.existingJobId}
        onGenerate={actions.handleGenerateReport}
        onCancel={actions.handleCancelJob}
        cancelling={state.cancelling}
        projectStats={state.projectStats}
      />

      {state.reportLoading ? (
        <div style={{ padding: tokens.spacing.xl, textAlign: "center", color: tokens.colors.onSurfaceVariant }}>
          <p style={tokens.typography.bodyMedium}>Loading report data...</p>
        </div>
      ) : (
        <>
          {state.editedReport && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "sticky",
                  top: tokens.spacing.md,
                  zIndex: 10,
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: tokens.spacing.md,
                  pointerEvents: "none",
                }}
              >
                <div style={{ pointerEvents: "auto", display: "flex", gap: tokens.spacing.sm }}>
                  {state.hasUnsavedChanges && (
                    <span
                      style={{
                        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                        backgroundColor: tokens.colors.tertiaryContainer,
                        color: tokens.colors.onTertiaryContainer,
                        borderRadius: tokens.radius.pill,
                        ...tokens.typography.labelMedium,
                        boxShadow: tokens.elevation.level1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Unsaved changes
                    </span>
                  )}
                  <button
                    onClick={actions.handleSaveReport}
                    disabled={state.saveState === "saving" || !state.hasUnsavedChanges}
                    style={{
                      padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
                      backgroundColor: state.saveState === "saving" || !state.hasUnsavedChanges
                        ? tokens.colors.surfaceVariant
                        : tokens.colors.primary,
                      color: state.saveState === "saving" || !state.hasUnsavedChanges
                        ? tokens.colors.onSurfaceVariant
                        : tokens.colors.onPrimary,
                      border: "none",
                      borderRadius: tokens.radius.pill,
                      cursor: state.saveState === "saving" || !state.hasUnsavedChanges ? "not-allowed" : "pointer",
                      ...tokens.typography.labelLarge,
                      boxShadow: tokens.elevation.level2,
                    }}
                  >
                    {state.saveState === "saving" ? "Saving..." : state.saveState === "saved" ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>

              {state.saveError && (
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
                  {state.saveError}
                </div>
              )}

              <ReportExporter
                selectedProjectId={state.selectedProjectId}
                editedReport={state.editedReport}
                exportedFileUrl={state.exportedFileUrl}
                exportState={state.exportState}
                exportError={state.exportError}
                onExport={actions.handleExport}
              />

              <ReportEditor
                report={state.report}
                editedReport={state.editedReport}
                editedSections={state.editedSections}
                userProfile={state.userProfile}
                updateReportTitle={actions.updateReportTitle}
                updateSectionSummary={actions.updateSectionSummary}
                updateSectionRecommendations={actions.updateSectionRecommendations}
                updateImageCaption={actions.updateImageCaption}
                updateImageFinding={actions.updateImageFinding}
                updateImageRecommendation={actions.updateImageRecommendation}
                toggleHideImage={actions.toggleHideImage}
              />
            </div>
          )}

          {!state.editedReport && !state.reportLoading && !state.generating && state.selectedProjectId && (
            <div
              style={{
                padding: tokens.spacing.xl,
                textAlign: "center",
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                border: `2px dashed ${tokens.colors.outlineVariant}`,
              }}
            >
              <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, marginBottom: tokens.spacing.md }}>
                No report found for this project.
              </p>
              <button
                onClick={actions.handleGenerateReport}
                disabled={!state.projectStats || state.projectStats.total === 0}
                style={{
                  padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                  border: "none",
                  borderRadius: tokens.radius.md,
                  cursor: "pointer",
                  ...tokens.typography.labelLarge,
                }}
              >
                Generate First Report
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
