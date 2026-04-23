"use client";

import { tokens } from "@/lib/design-tokens";
import {
  StoredReport,
  StructuredReport,
  EditedSection,
} from "@/hooks/useReportState";
import { DashboardUser } from "@/components/dashboard/DashboardUserProvider";

const CATEGORY_LABELS: Record<string, string> = {
  crop_health: "Crop Health",
  erosion: "Erosion",
  damage: "Damage",
  irrigation: "Irrigation",
  general: "General",
};

interface ReportEditorProps {
  report: StoredReport | null;
  editedReport: StructuredReport;
  editedSections: Map<string, EditedSection>;
  userProfile: DashboardUser | null;
  updateReportTitle: (title: string) => void;
  updateSectionSummary: (category: string, value: string) => void;
  updateSectionRecommendations: (category: string, value: string) => void;
  updateImageCaption: (category: string, imageId: string, value: string) => void;
  updateImageFinding: (category: string, imageId: string, value: string) => void;
  updateImageRecommendation: (category: string, imageId: string, value: string) => void;
  toggleHideImage: (category: string, imageId: string) => void;
}

export function ReportEditor({
  report,
  editedReport,
  editedSections,
  userProfile,
  updateReportTitle,
  updateSectionSummary,
  updateSectionRecommendations,
  updateImageCaption,
  updateImageFinding,
  updateImageRecommendation,
  toggleHideImage,
}: ReportEditorProps) {
  const content = editedReport;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.7) return tokens.colors.tertiary;
    if (score >= 0.4) return tokens.colors.secondary;
    return tokens.colors.error;
  };

  const formatConfidence = (score: number) => {
    return `${Math.round(score * 100)}% confidence`;
  };

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radius.lg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: tokens.spacing.xl,
          borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
          backgroundColor: tokens.colors.primaryContainer,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: tokens.spacing.md,
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              value={content.title}
              onChange={(e) => updateReportTitle(e.target.value)}
              style={{
                width: "100%",
                padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                backgroundColor: tokens.colors.surface,
                border: `1px solid ${tokens.colors.outline}`,
                borderRadius: tokens.radius.sm,
                ...tokens.typography.headlineSmall,
                color: tokens.colors.onSurface,
                boxSizing: "border-box",
              }}
            />
            <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onPrimaryContainer, opacity: 0.8, marginTop: tokens.spacing.xs }}>
              Project: {content.projectName}
              {content.projectLocation && ` • ${content.projectLocation}`}
            </p>
            {userProfile && (userProfile.name || userProfile.companyName) && (
              <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onPrimaryContainer, opacity: 0.7, marginTop: tokens.spacing.xs }}>
                Prepared by: {userProfile.name}{userProfile.companyName ? ` - ${userProfile.companyName}` : ""}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...tokens.typography.labelSmall, color: tokens.colors.onPrimaryContainer, opacity: 0.7 }}>
              Generated
            </p>
            <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onPrimaryContainer }}>
              {formatDate(content.generatedAt)}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: tokens.spacing.lg,
            display: "flex",
            gap: tokens.spacing.xl,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onPrimaryContainer, opacity: 0.7 }}>
              Total Images
            </p>
            <p style={{ ...tokens.typography.titleLarge, color: tokens.colors.onPrimaryContainer }}>
              {content.totalImages}
            </p>
          </div>
          <div>
            <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onPrimaryContainer, opacity: 0.7 }}>
              Categories
            </p>
            <p style={{ ...tokens.typography.titleLarge, color: tokens.colors.onPrimaryContainer }}>
              {content.sections.length}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: tokens.spacing.xl }}>
        {content.sections.length === 0 ? (
          <div
            style={{
              padding: tokens.spacing.xl,
              textAlign: "center",
              color: tokens.colors.onSurfaceVariant,
              ...tokens.typography.bodyMedium,
            }}
          >
            No sections available in this report.
          </div>
        ) : (
          content.sections.map((section, sectionIndex) => {
            const sectionEdits = editedSections.get(section.category);
            const visibleImages = section.images.filter(
              img => !sectionEdits?.hiddenImages.has(img.imageId)
            );

            return (
              <div
                key={section.category}
                style={{
                  marginBottom: sectionIndex < content.sections.length - 1 ? tokens.spacing.xl : 0,
                  paddingBottom: sectionIndex < content.sections.length - 1 ? tokens.spacing.xl : 0,
                  borderBottom: sectionIndex < content.sections.length - 1 ? `1px solid ${tokens.colors.outlineVariant}` : "none",
                }}
              >
                <div
                  style={{
                    marginBottom: tokens.spacing.lg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: tokens.spacing.md,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
                    <h4
                      style={{
                        ...tokens.typography.titleLarge,
                        color: tokens.colors.onSurface,
                      }}
                    >
                      {CATEGORY_LABELS[section.category] || section.category}
                    </h4>
                    <span
                      style={{
                        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                        backgroundColor: tokens.colors.primaryContainer,
                        color: tokens.colors.onPrimaryContainer,
                        borderRadius: tokens.radius.pill,
                        ...tokens.typography.labelSmall,
                      }}
                    >
                      {visibleImages.length} {visibleImages.length === 1 ? "image" : "images"}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: tokens.spacing.md }}>
                  <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.xs, marginBottom: tokens.spacing.xs }}>
                    <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.primary }}>
                      Summary
                    </label>
                    {sectionEdits?.summary && (
                      <span
                        style={{
                          padding: `2px ${tokens.spacing.xs}`,
                          backgroundColor: tokens.colors.tertiaryContainer,
                          color: tokens.colors.onTertiaryContainer,
                          borderRadius: tokens.radius.xs,
                          ...tokens.typography.labelSmall,
                          fontSize: "10px",
                        }}
                      >
                        Edited
                      </span>
                    )}
                  </div>
                  <textarea
                    value={section.summary}
                    onChange={(e) => updateSectionSummary(section.category, e.target.value)}
                    rows={2}
                    style={{
                      width: "100%",
                      padding: tokens.spacing.md,
                      backgroundColor: tokens.colors.surfaceVariant,
                      border: `1px solid ${sectionEdits?.summary ? tokens.colors.primary : tokens.colors.outline}`,
                      borderRadius: tokens.radius.md,
                      borderLeft: `3px solid ${tokens.colors.primary}`,
                      ...tokens.typography.bodyMedium,
                      color: tokens.colors.onSurface,
                      boxSizing: "border-box",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ marginBottom: tokens.spacing.lg }}>
                  <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.xs, marginBottom: tokens.spacing.xs }}>
                    <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.tertiary }}>
                      Recommendations
                    </label>
                    {sectionEdits?.recommendations && (
                      <span
                        style={{
                          padding: `2px ${tokens.spacing.xs}`,
                          backgroundColor: tokens.colors.tertiaryContainer,
                          color: tokens.colors.onTertiaryContainer,
                          borderRadius: tokens.radius.xs,
                          ...tokens.typography.labelSmall,
                          fontSize: "10px",
                        }}
                      >
                        Edited
                      </span>
                    )}
                  </div>
                  <textarea
                    value={section.recommendations}
                    onChange={(e) => updateSectionRecommendations(section.category, e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: tokens.spacing.md,
                      backgroundColor: tokens.colors.tertiaryContainer,
                      border: `1px solid ${sectionEdits?.recommendations ? tokens.colors.tertiary : tokens.colors.outline}`,
                      borderRadius: tokens.radius.md,
                      borderLeft: `3px solid ${tokens.colors.tertiary}`,
                      ...tokens.typography.bodyMedium,
                      color: tokens.colors.onTertiaryContainer,
                      boxSizing: "border-box",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: tokens.spacing.md,
                  }}
                >
                  {section.images.map((image) => {
                    const isHidden = sectionEdits?.hiddenImages.has(image.imageId);
                    const isCaptionEdited = sectionEdits?.imageCaption[image.imageId];
                    const isFindingEdited = sectionEdits?.imageFinding[image.imageId];
                    const isRecommendationEdited = sectionEdits?.imageRecommendation[image.imageId];
                    const isEdited = isCaptionEdited || isFindingEdited || isRecommendationEdited;

                    if (isHidden) return null;

                    return (
                      <div
                        key={image.imageId}
                        style={{
                          backgroundColor: tokens.colors.surfaceVariant,
                          borderRadius: tokens.radius.md,
                          overflow: "hidden",
                          border: isEdited ? `2px solid ${tokens.colors.tertiary}` : "none",
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={image.imageUrl}
                            alt={image.caption}
                            style={{
                              width: "100%",
                              height: "180px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            onClick={() => toggleHideImage(section.category, image.imageId)}
                            style={{
                              position: "absolute",
                              top: tokens.spacing.xs,
                              right: tokens.spacing.xs,
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "white",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                            }}
                            title="Remove from report"
                          >
                            ×
                          </button>
                        </div>

                        <div style={{ padding: tokens.spacing.md }}>
                          <div style={{ marginBottom: tokens.spacing.sm }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing.xs }}>
                              <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant }}>
                                Caption
                              </label>
                              {isCaptionEdited && (
                                <span
                                  style={{
                                    padding: `2px ${tokens.spacing.xs}`,
                                    backgroundColor: tokens.colors.tertiaryContainer,
                                    color: tokens.colors.onTertiaryContainer,
                                    borderRadius: tokens.radius.xs,
                                    ...tokens.typography.labelSmall,
                                    fontSize: "10px",
                                  }}
                                >
                                  Edited
                                </span>
                              )}
                            </div>
                            <textarea
                              value={image.caption}
                              onChange={(e) => updateImageCaption(section.category, image.imageId, e.target.value)}
                              rows={2}
                              style={{
                                width: "100%",
                                padding: tokens.spacing.sm,
                                backgroundColor: tokens.colors.surface,
                                border: `1px solid ${isCaptionEdited ? tokens.colors.tertiary : tokens.colors.outline}`,
                                borderRadius: tokens.radius.sm,
                                ...tokens.typography.bodyMedium,
                                color: tokens.colors.onSurface,
                                boxSizing: "border-box",
                                resize: "vertical",
                                fontFamily: "inherit",
                              }}
                            />
                          </div>

                          <div style={{ marginBottom: tokens.spacing.sm }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing.xs }}>
                              <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant }}>
                                Finding
                              </label>
                              {isFindingEdited && (
                                <span
                                  style={{
                                    padding: `2px ${tokens.spacing.xs}`,
                                    backgroundColor: tokens.colors.tertiaryContainer,
                                    color: tokens.colors.onTertiaryContainer,
                                    borderRadius: tokens.radius.xs,
                                    ...tokens.typography.labelSmall,
                                    fontSize: "10px",
                                  }}
                                >
                                  Edited
                                </span>
                              )}
                            </div>
                            <textarea
                              value={image.finding}
                              onChange={(e) => updateImageFinding(section.category, image.imageId, e.target.value)}
                              rows={2}
                              style={{
                                width: "100%",
                                padding: tokens.spacing.sm,
                                backgroundColor: tokens.colors.surface,
                                border: `1px solid ${isFindingEdited ? tokens.colors.tertiary : tokens.colors.outline}`,
                                borderRadius: tokens.radius.sm,
                                ...tokens.typography.bodySmall,
                                color: tokens.colors.onSurface,
                                boxSizing: "border-box",
                                resize: "vertical",
                                fontFamily: "inherit",
                              }}
                            />
                          </div>

                          <div style={{ marginBottom: tokens.spacing.sm }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing.xs }}>
                              <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant }}>
                                Recommendation
                              </label>
                              {isRecommendationEdited && (
                                <span
                                  style={{
                                    padding: `2px ${tokens.spacing.xs}`,
                                    backgroundColor: tokens.colors.tertiaryContainer,
                                    color: tokens.colors.onTertiaryContainer,
                                    borderRadius: tokens.radius.xs,
                                    ...tokens.typography.labelSmall,
                                    fontSize: "10px",
                                  }}
                                >
                                  Edited
                                </span>
                              )}
                            </div>
                            <textarea
                              value={image.recommendation}
                              onChange={(e) => updateImageRecommendation(section.category, image.imageId, e.target.value)}
                              rows={2}
                              style={{
                                width: "100%",
                                padding: tokens.spacing.sm,
                                backgroundColor: tokens.colors.surface,
                                border: `1px solid ${isRecommendationEdited ? tokens.colors.tertiary : tokens.colors.outline}`,
                                borderRadius: tokens.radius.sm,
                                ...tokens.typography.bodySmall,
                                color: tokens.colors.onSurface,
                                boxSizing: "border-box",
                                resize: "vertical",
                                fontFamily: "inherit",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: tokens.spacing.xs,
                            }}
                          >
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: getConfidenceColor(image.confidenceScore),
                              }}
                            />
                            <span
                              style={{
                                ...tokens.typography.labelSmall,
                                color: getConfidenceColor(image.confidenceScore),
                              }}
                            >
                              AI Generated • {formatConfidence(image.confidenceScore)}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop: tokens.spacing.xs,
                              padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                              backgroundColor: tokens.colors.surface,
                              borderRadius: tokens.radius.sm,
                              ...tokens.typography.labelSmall,
                              color: tokens.colors.onSurfaceVariant,
                            }}
                          >
                            Source: Image {image.imageId.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          padding: tokens.spacing.md,
          borderTop: `1px solid ${tokens.colors.outlineVariant}`,
          backgroundColor: tokens.colors.surfaceVariant,
          textAlign: "center",
        }}
      >
        <p style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant, opacity: 0.7 }}>
          AI-generated report • May require human review • Changes are highlighted in tertiary color
        </p>
      </div>
    </div>
  );
}
