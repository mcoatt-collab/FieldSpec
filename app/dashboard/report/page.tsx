"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { tokens } from "@/lib/design-tokens";

interface UserProfile {
  name: string;
  companyName: string | null;
  email: string;
}

interface Project {
  id: string;
  name: string;
  photoCount: number;
}

interface ProjectStats {
  total: number;
  untagged: number;
  withNotes: number;
}

interface ReportImageEntry {
  imageId: string;
  imageUrl: string;
  caption: string;
  finding: string;
  recommendation: string;
  confidenceScore: number;
}

interface ReportSection {
  category: string;
  summary: string;
  recommendations: string;
  images: ReportImageEntry[];
}

interface StructuredReport {
  title: string;
  projectId: string;
  projectName: string;
  projectLocation: string | null;
  generatedAt: string;
  totalImages: number;
  sections: ReportSection[];
}

interface StoredReport {
  id: string;
  title: string;
  status: string;
  content: StructuredReport;
  exportedFileUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditedSection {
  summary: boolean;
  recommendations: boolean;
  imageCaption: Record<string, boolean>;
  imageFinding: Record<string, boolean>;
  imageRecommendation: Record<string, boolean>;
  hiddenImages: Set<string>;
}

type SaveState = "idle" | "saving" | "saved" | "error";
type ExportState = "idle" | "loading" | "generating" | "success" | "error";

const CATEGORY_LABELS: Record<string, string> = {
  crop_health: "Crop Health",
  erosion: "Erosion",
  damage: "Damage",
  irrigation: "Irrigation",
  general: "General",
};

const JOB_POLL_INTERVAL = 3000;

export default function ReportPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [report, setReport] = useState<StoredReport | null>(null);
  const [editedReport, setEditedReport] = useState<StructuredReport | null>(null);
  const [editedSections, setEditedSections] = useState<Map<string, EditedSection>>(new Map());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [existingJobId, setExistingJobId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [jobStatus, setJobStatus] = useState<{
    status: string;
    progress: number;
    progressMessage: string;
    errorMessage: string | null;
  } | null>(null);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [exportError, setExportError] = useState("");
  const [exportedFileUrl, setExportedFileUrl] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectStats();
      fetchReport();
      checkExistingJob();
    }
  }, [selectedProjectId]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok && data.data) {
        setProjects(data.data);
        if (data.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjectStats() {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`/api/images?projectId=${selectedProjectId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        const images = data.data;
        const untagged = images.filter(
          (img: { category: string | null }) => !img.category || img.category === "general"
        ).length;
        const withNotes = images.filter((img: { notes: string | null }) => img.notes).length;
        setProjectStats({
          total: images.length,
          untagged,
          withNotes,
        });
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  }

  async function fetchUserProfile() {
    try {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      if (res.ok && data.data) {
        setUserProfile(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }

  async function fetchReport() {
    if (!selectedProjectId) return;
    setReportLoading(true);
    setSaveState("idle");
    setSaveError("");
    setExportState("idle");
    setExportError("");
    try {
      const res = await fetch(`/api/reports/${selectedProjectId}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data.data);
        setEditedReport(data.data.content);
        setExportedFileUrl(data.data.exportedFileUrl || null);
        initializeEditedSections(data.data.content);
      } else {
        setReport(null);
        setEditedReport(null);
        setExportedFileUrl(null);
      }
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setReport(null);
      setEditedReport(null);
      setExportedFileUrl(null);
    } finally {
      setReportLoading(false);
    }
  }

  function initializeEditedSections(content: StructuredReport) {
    const sections = new Map<string, EditedSection>();
    for (const section of content.sections) {
      sections.set(section.category, {
        summary: false,
        recommendations: false,
        imageCaption: {},
        imageFinding: {},
        imageRecommendation: {},
        hiddenImages: new Set(),
      });
      for (const img of section.images) {
        sections.get(section.category)!.imageCaption[img.imageId] = false;
        sections.get(section.category)!.imageFinding[img.imageId] = false;
        sections.get(section.category)!.imageRecommendation[img.imageId] = false;
      }
    }
    setEditedSections(sections);
  }

  async function checkExistingJob() {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`/api/ai/job/${selectedProjectId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setExistingJobId(data.data.id);
        setCurrentJobId(data.data.id);
        setJobStatus({
          status: data.data.status,
          progress: data.data.progress,
          progressMessage: "",
          errorMessage: null,
        });
        if (data.data.status === "pending" || data.data.status === "processing") {
          startPolling(data.data.id);
        }
      } else {
        setExistingJobId(null);
        setCurrentJobId(null);
        setJobStatus(null);
      }
    } catch (err) {
      setExistingJobId(null);
    }
  }

  async function handleCancelJob() {
    if (!selectedProjectId || !existingJobId) return;
    setCancelling(true);
    setError("");
    try {
      const res = await fetch("/api/ai/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to cancel job");
      } else {
        if (pollRef.current) clearInterval(pollRef.current);
        setExistingJobId(null);
        setCurrentJobId(null);
        setJobStatus(null);
        setGenerating(false);
      }
    } catch (err) {
      setError("Failed to cancel job");
    } finally {
      setCancelling(false);
    }
  }

  async function handleGenerateReport() {
    if (!selectedProjectId) return;

    setGenerating(true);
    setError("");
    setJobStatus(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || "Failed to generate report");
        setGenerating(false);
        return;
      }

      if (data.data.jobId && data.data.status === "queued") {
        setJobStatus({
          status: "queued",
          progress: 0,
          progressMessage: data.data.message || "Report queued for processing",
          errorMessage: null,
        });
        const jobId = data.data.jobId;
        setCurrentJobId(jobId);
        setExistingJobId(jobId);
        startPolling(jobId);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setError("Failed to read response");
        setGenerating(false);
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonData = JSON.parse(line.slice(6));

              if (jsonData.error) {
                setError(jsonData.error);
                setGenerating(false);
                return;
              }

              if (jsonData.done) {
                if (jsonData.report) {
                  setReport({
                    id: selectedProjectId,
                    title: jsonData.report.title,
                    content: jsonData.report,
                    status: "completed",
                    createdAt: jsonData.report.generatedAt,
                    updatedAt: jsonData.report.generatedAt,
                  });
                  setEditedReport(jsonData.report);
                }
                setGenerating(false);
                setJobStatus({ status: "completed", progress: 100, progressMessage: "Report generated", errorMessage: null });
              } else if (jsonData.progress !== undefined) {
                setJobStatus({
                  status: "processing",
                  progress: jsonData.progress,
                  progressMessage: jsonData.message || "Processing...",
                  errorMessage: null,
                });
              }
            } catch (e) {
              console.error("Failed to parse SSE message:", e);
            }
          }
        }
      }
    } catch (err) {
      setError("Failed to generate report");
      setGenerating(false);
    }
  }

  function startPolling(jobId: string) {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/ai/status/${jobId}`);
        const data = await res.json();

        if (res.ok && data.data) {
          setJobStatus({
            status: data.data.status,
            progress: data.data.progress,
            progressMessage: data.data.progressMessage,
            errorMessage: data.data.errorMessage,
          });

          if (data.data.status === "completed" || data.data.status === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            setGenerating(false);
            if (data.data.status === "completed") {
              fetchReport();
            }
          }
        }
      } catch (err) {
        console.error("Failed to poll job status:", err);
      }
    }, JOB_POLL_INTERVAL);
  }

  async function handleSaveReport() {
    if (!selectedProjectId || !editedReport) return;

    setSaveState("saving");
    setSaveError("");

    try {
      const res = await fetch(`/api/reports/${selectedProjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: report?.title,
          content: editedReport,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to save report");
      }

      const data = await res.json();
      setReport(data.data);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
      setSaveState("error");
    }
  }

async function handleExport() {
  if (!selectedProjectId || !editedReport) return;

  setExportState("loading");
  setExportError("");

  try {
    const res = await fetch("/api/report/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: selectedProjectId }),
    });

    console.log("Export API response status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.log("Export API error response:", text);
      const data = JSON.parse(text);
      throw new Error(data.error?.message || "Failed to fetch report HTML");
    }

    const html = await res.text();
    console.log("Got HTML, length:", html.length);

    setExportState("generating");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const html2pdf = (await import("html2pdf.js")).default;

    const pdfBlob = await html2pdf()
      .set({
        margin: 10,
        filename: `${editedReport.title.replace(/[^a-z0-9]/gi, "_")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .outputPdf("blob");

    document.body.removeChild(container);

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${editedReport.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportedFileUrl("");
    setExportState("success");
  } catch (err) {
    console.error("Export error:", err);
    setExportError(err instanceof Error ? err.message : "Export failed");
    setExportState("error");
  }
}

  const hasUnsavedChanges = useCallback(() => {
    if (!editedSections.size) return false;
    for (const section of editedSections.values()) {
      if (section.summary || section.recommendations) return true;
      for (const isEdited of Object.values(section.imageCaption)) {
        if (isEdited) return true;
      }
      for (const isEdited of Object.values(section.imageFinding)) {
        if (isEdited) return true;
      }
      for (const isEdited of Object.values(section.imageRecommendation)) {
        if (isEdited) return true;
      }
      if (section.hiddenImages.size > 0) return true;
    }
    return false;
  }, [editedSections]);

  function updateReportTitle(newTitle: string) {
    if (!editedReport) return;
    setEditedReport({ ...editedReport, title: newTitle });
  }

  function updateSectionSummary(category: string, value: string) {
    if (!editedReport) return;
    const newSections = editedReport.sections.map(s =>
      s.category === category ? { ...s, summary: value } : s
    );
    setEditedReport({ ...editedReport, sections: newSections });
    markSectionEdited(category, "summary");
  }

  function updateSectionRecommendations(category: string, value: string) {
    if (!editedReport) return;
    const newSections = editedReport.sections.map(s =>
      s.category === category ? { ...s, recommendations: value } : s
    );
    setEditedReport({ ...editedReport, sections: newSections });
    markSectionEdited(category, "recommendations");
  }

  function updateImageCaption(category: string, imageId: string, value: string) {
    if (!editedReport) return;
    const newSections = editedReport.sections.map(s => {
      if (s.category !== category) return s;
      return {
        ...s,
        images: s.images.map(img =>
          img.imageId === imageId ? { ...img, caption: value } : img
        ),
      };
    });
    setEditedReport({ ...editedReport, sections: newSections });
    markImageEdited(category, imageId, "caption");
  }

  function updateImageFinding(category: string, imageId: string, value: string) {
    if (!editedReport) return;
    const newSections = editedReport.sections.map(s => {
      if (s.category !== category) return s;
      return {
        ...s,
        images: s.images.map(img =>
          img.imageId === imageId ? { ...img, finding: value } : img
        ),
      };
    });
    setEditedReport({ ...editedReport, sections: newSections });
    markImageEdited(category, imageId, "finding");
  }

  function updateImageRecommendation(category: string, imageId: string, value: string) {
    if (!editedReport) return;
    const newSections = editedReport.sections.map(s => {
      if (s.category !== category) return s;
      return {
        ...s,
        images: s.images.map(img =>
          img.imageId === imageId ? { ...img, recommendation: value } : img
        ),
      };
    });
    setEditedReport({ ...editedReport, sections: newSections });
    markImageEdited(category, imageId, "recommendation");
  }

  function markSectionEdited(category: string, field: "summary" | "recommendations") {
    setEditedSections(prev => {
      const updated = new Map(prev);
      const section = updated.get(category);
      if (section) {
        updated.set(category, { ...section, [field]: true });
      }
      return updated;
    });
  }

  function markImageEdited(category: string, imageId: string, field: "caption" | "finding" | "recommendation") {
    setEditedSections(prev => {
      const updated = new Map(prev);
      const section = updated.get(category);
      if (section) {
        const fieldKey = `image${field.charAt(0).toUpperCase()}${field.slice(1)}` as keyof EditedSection;
        const fieldMap = section[fieldKey] as Record<string, boolean>;
        (section[fieldKey] as Record<string, boolean>)[imageId] = true;
        updated.set(category, { ...section });
      }
      return updated;
    });
  }

  function toggleHideImage(category: string, imageId: string) {
    setEditedSections(prev => {
      const updated = new Map(prev);
      const section = updated.get(category);
      if (section) {
        const newHidden = new Set(section.hiddenImages);
        if (newHidden.has(imageId)) {
          newHidden.delete(imageId);
        } else {
          newHidden.add(imageId);
        }
        updated.set(category, { ...section, hiddenImages: newHidden });
      }
      return updated;
    });
  }

  const getStatusColor = () => {
    if (!jobStatus) return tokens.colors.primary;
    if (jobStatus.status === "completed") return tokens.colors.tertiary;
    if (jobStatus.status === "failed") return tokens.colors.error;
    return tokens.colors.primary;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.7) return tokens.colors.tertiary;
    if (score >= 0.4) return tokens.colors.secondary;
    return tokens.colors.error;
  };

  const formatConfidence = (score: number) => {
    return `${Math.round(score * 100)}% confidence`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isTitleEdited = editedReport && report && editedReport.title !== report.content.title;
  const unsavedChanges = hasUnsavedChanges();

  if (loading) {
    return (
      <div style={{ maxWidth: "1200px" }}>
        <div
          style={{
            padding: tokens.spacing.xl,
            textAlign: "center",
            color: tokens.colors.onSurfaceVariant,
            ...tokens.typography.bodyLarge,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: tokens.spacing.xl }}>
        <h2
          style={{
            ...tokens.typography.headlineMedium,
            color: tokens.colors.onSurface,
          }}
        >
          Report Generation
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          Generate, edit, and review AI-powered analysis reports
        </p>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            textAlign: "center",
          }}
        >
          <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant }}>
            No projects available. Create a project first.
          </p>
        </div>
      ) : (
        <>
          <div
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
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                border: `1px solid ${tokens.colors.outline}`,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.onSurface,
                ...tokens.typography.bodyLarge,
                minWidth: "200px",
                boxSizing: "border-box",
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
              style={{
                marginBottom: tokens.spacing.lg,
                padding: tokens.spacing.lg,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
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

          {error && (
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
              {error}
            </div>
          )}

          {jobStatus ? (
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
                    onClick={handleCancelJob}
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
                    onClick={handleGenerateReport}
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
          ) : (
            <div style={{ marginBottom: tokens.spacing.lg }}>
              <button
                onClick={handleGenerateReport}
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
          )}

          {reportLoading ? (
            <div
              style={{
                padding: tokens.spacing.xl,
                textAlign: "center",
                color: tokens.colors.onSurfaceVariant,
                ...tokens.typography.bodyMedium,
              }}
            >
              Loading report...
            </div>
          ) : editedReport ? (
            <div>
              <div
                style={{
                  marginBottom: tokens.spacing.md,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: tokens.spacing.md,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
                  {unsavedChanges && (
                    <span
                      style={{
                        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                        backgroundColor: tokens.colors.tertiaryContainer,
                        color: tokens.colors.onTertiaryContainer,
                        borderRadius: tokens.radius.sm,
                        ...tokens.typography.labelSmall,
                      }}
                    >
                      Unsaved changes
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSaveReport}
                  disabled={!unsavedChanges || saveState === "saving"}
                  style={{
                    padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                    backgroundColor: unsavedChanges ? tokens.colors.primary : tokens.colors.surfaceVariant,
                    color: unsavedChanges ? tokens.colors.onPrimary : tokens.colors.onSurfaceVariant,
                    border: "none",
                    borderRadius: tokens.radius.md,
                    cursor: unsavedChanges && saveState !== "saving" ? "pointer" : "not-allowed",
                    opacity: saveState === "saving" ? 0.7 : 1,
                    ...tokens.typography.labelLarge,
                    display: "flex",
                    alignItems: "center",
                    gap: tokens.spacing.sm,
                  }}
                >
                  {saveState === "saving" && "Saving..."}
                  {saveState === "saved" && "Saved!"}
                  {saveState === "error" && "Retry Save"}
                  {saveState === "idle" && (unsavedChanges ? "Save Changes" : "Saved")}
                </button>
              </div>

              {saveState === "error" && saveError && (
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
                  {saveError}
                </div>
              )}

              <div
                style={{
                  marginBottom: tokens.spacing.lg,
                  padding: tokens.spacing.lg,
                  backgroundColor: tokens.colors.surfaceVariant,
                  borderRadius: tokens.radius.lg,
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
                        ...tokens.typography.labelLarge,
                        display: "flex",
                        alignItems: "center",
                        gap: tokens.spacing.xs,
                      }}
                    >
                      View Exported PDF
                    </a>
                  )}
                  <button
                    onClick={handleExport}
                    disabled={exportState === "loading" || exportState === "generating"}
                    style={{
                      padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                      backgroundColor: exportState === "loading" || exportState === "generating"
                        ? tokens.colors.surfaceVariant
                        : tokens.colors.secondary,
                      color: exportState === "loading" || exportState === "generating"
                        ? tokens.colors.onSurfaceVariant
                        : tokens.colors.onSecondary,
                      border: "none",
                      borderRadius: tokens.radius.md,
                      cursor: exportState === "loading" || exportState === "generating"
                        ? "not-allowed"
                        : "pointer",
                      opacity: exportState === "generating" ? 0.7 : 1,
                      ...tokens.typography.labelLarge,
                      display: "flex",
                      alignItems: "center",
                      gap: tokens.spacing.sm,
                    }}
                  >
                    {exportState === "loading" && "Preparing..."}
                    {exportState === "generating" && "Generating PDF..."}
                    {exportState === "success" && "Export Complete!"}
                    {exportState === "error" && "Export Failed"}
                    {exportState === "idle" && (exportedFileUrl ? "Export Again" : "Export PDF")}
                  </button>
                </div>
              </div>

              {exportState === "error" && exportError && (
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

              <ReportEditor
                report={report}
                editedReport={editedReport}
                editedSections={editedSections}
                userProfile={userProfile}
                formatDate={formatDate}
                getConfidenceColor={getConfidenceColor}
                formatConfidence={formatConfidence}
                updateReportTitle={updateReportTitle}
                updateSectionSummary={updateSectionSummary}
                updateSectionRecommendations={updateSectionRecommendations}
                updateImageCaption={updateImageCaption}
                updateImageFinding={updateImageFinding}
                updateImageRecommendation={updateImageRecommendation}
                toggleHideImage={toggleHideImage}
              />
            </div>
          ) : (
            <div
              style={{
                padding: tokens.spacing.xl,
                backgroundColor: tokens.colors.surfaceVariant,
                borderRadius: tokens.radius.lg,
                textAlign: "center",
              }}
            >
              <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant }}>
                No report generated yet. Upload images and run AI generation to create a report.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ReportEditorProps {
  report: StoredReport | null;
  editedReport: StructuredReport;
  editedSections: Map<string, EditedSection>;
  userProfile: UserProfile | null;
  formatDate: (date: string) => string;
  getConfidenceColor: (score: number) => string;
  formatConfidence: (score: number) => string;
  updateReportTitle: (title: string) => void;
  updateSectionSummary: (category: string, value: string) => void;
  updateSectionRecommendations: (category: string, value: string) => void;
  updateImageCaption: (category: string, imageId: string, value: string) => void;
  updateImageFinding: (category: string, imageId: string, value: string) => void;
  updateImageRecommendation: (category: string, imageId: string, value: string) => void;
  toggleHideImage: (category: string, imageId: string) => void;
}

function ReportEditor({
  report,
  editedReport,
  editedSections,
  userProfile,
  formatDate,
  getConfidenceColor,
  formatConfidence,
  updateReportTitle,
  updateSectionSummary,
  updateSectionRecommendations,
  updateImageCaption,
  updateImageFinding,
  updateImageRecommendation,
  toggleHideImage,
}: ReportEditorProps) {
  const content = editedReport;
  const originalContent = report?.content;

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
