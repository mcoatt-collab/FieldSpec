"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDashboardUser, type DashboardUser } from "@/components/dashboard/DashboardUserProvider";
import { useProjectsStore } from "@/store/useProjectsStore";
import { useRouter } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  photoCount: number;
}

export interface ProjectStats {
  total: number;
  untagged: number;
  withNotes: number;
}

export interface ReportImageEntry {
  imageId: string;
  imageUrl: string;
  caption: string;
  finding: string;
  recommendation: string;
  confidenceScore: number;
}

export interface ReportSection {
  category: string;
  summary: string;
  recommendations: string;
  images: ReportImageEntry[];
}

export interface StructuredReport {
  title: string;
  projectId: string;
  projectName: string;
  projectLocation: string | null;
  generatedAt: string;
  totalImages: number;
  sections: ReportSection[];
}

export interface StoredReport {
  id: string;
  title: string;
  status: string;
  content: StructuredReport;
  exportedFileUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EditedSection {
  summary: boolean;
  recommendations: boolean;
  imageCaption: Record<string, boolean>;
  imageFinding: Record<string, boolean>;
  imageRecommendation: Record<string, boolean>;
  hiddenImages: Set<string>;
}

export type SaveState = "idle" | "saving" | "saved" | "error";
export type ExportState = "idle" | "loading" | "generating" | "success" | "error";

const JOB_POLL_INTERVAL = 3000;

export function useReportState() {
  const { user: userProfile } = useDashboardUser();
  const { projects, loading: projectsLoading, fetchProjects } = useProjectsStore();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [report, setReport] = useState<StoredReport | null>(null);
  const [editedReport, setEditedReport] = useState<StructuredReport | null>(null);
  const [editedSections, setEditedSections] = useState<Map<string, EditedSection>>(new Map());
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
  const initialProjectLoadedRef = useRef(false);

  const loadProjectData = useCallback(async (projectId: string) => {
    setReportLoading(true);
    setSaveState("idle");
    setSaveError("");
    setExportState("idle");
    setExportError("");

    try {
      const [imagesRes, reportRes, jobRes] = await Promise.all([
        fetch(`/api/images?projectId=${projectId}`),
        fetch(`/api/reports/${projectId}`),
        fetch(`/api/ai/job/${projectId}`),
      ]);

      const [imagesData, reportData, jobData] = await Promise.all([
        imagesRes.json(),
        reportRes.json(),
        jobRes.json(),
      ]);

      if (imagesRes.ok && imagesData.data) {
        const images = imagesData.data;
        const untagged = images.filter(
          (img: { category: string | null }) => !img.category || img.category === "general"
        ).length;
        const withNotes = images.filter((img: { notes: string | null }) => img.notes).length;
        setProjectStats({
          total: images.length,
          untagged,
          withNotes,
        });
      } else {
        setProjectStats(null);
      }

      if (reportRes.ok) {
        setReport(reportData.data);
        setEditedReport(reportData.data.content);
        setExportedFileUrl(reportData.data.exportedFileUrl || null);
        initializeEditedSections(reportData.data.content);
      } else {
        setReport(null);
        setEditedReport(null);
        setExportedFileUrl(null);
      }

      if (jobRes.ok && jobData.data) {
        setExistingJobId(jobData.data.id);
        setCurrentJobId(jobData.data.id);
        setJobStatus({
          status: jobData.data.status,
          progress: jobData.data.progress,
          progressMessage: "",
          errorMessage: null,
        });
        if (
          jobData.data.status === "pending" ||
          jobData.data.status === "processing"
        ) {
          startPolling(jobData.data.id);
        }
      } else {
        setExistingJobId(null);
        setCurrentJobId(null);
        setJobStatus(null);
      }
    } catch (err) {
      console.error("Failed to load report data:", err);
      setProjectStats(null);
      setReport(null);
      setEditedReport(null);
      setExportedFileUrl(null);
      setExistingJobId(null);
      setCurrentJobId(null);
      setJobStatus(null);
    } finally {
      setReportLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    await fetchProjects();
    setLoading(false);
  }, [fetchProjects]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      const firstProjectId = projects[0].id;
      initialProjectLoadedRef.current = true;
      setSelectedProjectId(firstProjectId);
      void loadProjectData(firstProjectId);
    }
  }, [projects, selectedProjectId, loadProjectData]);

  useEffect(() => {
    if (!selectedProjectId) return;

    if (initialProjectLoadedRef.current) {
      initialProjectLoadedRef.current = false;
      return;
    }

    void loadProjectData(selectedProjectId);
  }, [selectedProjectId, loadProjectData]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

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

  function startPolling(jobId: string) {
    if (pollRef.current) clearInterval(pollRef.current);
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
              void loadProjectData(selectedProjectId);
            }
          }
        }
      } catch (err) {
        console.error("Failed to poll job status:", err);
      }
    }, JOB_POLL_INTERVAL);
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

      if (!response.ok) {
        let errorMessage = "Failed to generate report";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // Response is not JSON
        }
        setError(`${errorMessage} (${response.status})`);
        setGenerating(false);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        
        if (data.data?.jobId && data.data.status === "queued") {
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
      console.error("Report generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate report");
      setGenerating(false);
    }
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

      if (!res.ok) {
        let errorMsg = "Export failed";
        try {
          const data = await res.json();
          errorMsg = data.error?.message || errorMsg;
        } catch {
          errorMsg = `Export failed (${res.status})`;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.data?.html) {
        setExportState("generating");
        try {
          const html = data.data.html;
          
          const iframe = document.createElement("iframe");
          iframe.style.position = "fixed";
          iframe.style.right = "0";
          iframe.style.bottom = "0";
          iframe.style.width = "0";
          iframe.style.height = "0";
          iframe.style.border = "none";
          iframe.style.visibility = "hidden";
          document.body.appendChild(iframe);
          
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) throw new Error("Failed to access iframe document");
          
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();

          const bodyEl = iframeDoc.body;
          bodyEl.style.backgroundColor = "#ffffff";
          bodyEl.style.color = "#1f2937";
          bodyEl.style.fontFamily = "Arial, sans-serif";
          bodyEl.style.margin = "0";
          bodyEl.style.padding = "0";

          const forceLightMode = iframeDoc.createElement("style");
          forceLightMode.textContent = `
            :root, :root.light, html, body, * {
              background-color: #ffffff !important;
              color: #1f2937 !important;
            }
            .section { background-color: #ffffff !important; border: 1px solid #e5e7eb !important; }
            .summary-box { background-color: #ffffff !important; }
            .recommendations-box pre { background-color: #f8fafc !important; }
            .image-entry { background-color: #f8fafc !important; }
            .meta-grid { background-color: #f8fafc !important; }
            img { background-color: transparent !important; }
          `;
          iframeDoc.head.appendChild(forceLightMode);

          await new Promise(resolve => setTimeout(resolve, 1000));

          const html2pdf = (await import("html2pdf.js")).default;
          const pdfOptions = {
            filename: `${editedReport?.title || "report"}.pdf`,
            margin: 10,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, width: 800, backgroundColor: "#ffffff" },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          };
          
          await html2pdf().set(pdfOptions).from(bodyEl).save();
          document.body.removeChild(iframe);
          setExportState("success");
        } catch (err) {
          console.error("PDF generation error:", err);
          const iframe = document.body.querySelector("iframe[style*='visibility: hidden']") as HTMLIFrameElement;
          if (iframe) document.body.removeChild(iframe);
          throw err;
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed");
      setExportState("error");
    }
  }

  function pollExportStatus(jobId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/report/export/status/${jobId}`);
        const data = await res.json();

        if (res.ok && data.data) {
          if (data.data.status === "completed" && data.data.url) {
            clearInterval(interval);
            setExportedFileUrl(data.data.url);
            setExportState("success");
            window.open(data.data.url, "_blank");
          } else if (data.data.status === "failed") {
            clearInterval(interval);
            setExportError(data.data.error || "PDF generation failed");
            setExportState("error");
          }
        }
      } catch (err) {
        console.error("Failed to poll export status:", err);
      }
    }, 2000);
  }

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

  return {
    state: {
      userProfile,
      projects,
      selectedProjectId,
      projectStats,
      report,
      editedReport,
      editedSections,
      loading: loading || projectsLoading,
      reportLoading,
      generating,
      currentJobId,
      existingJobId,
      cancelling,
      jobStatus,
      error,
      saveState,
      saveError,
      exportState,
      exportError,
      exportedFileUrl,
      hasUnsavedChanges: hasUnsavedChanges(),
    },
    actions: {
      setSelectedProjectId,
      handleCancelJob,
      handleGenerateReport,
      handleSaveReport,
      handleExport,
      updateReportTitle,
      updateSectionSummary,
      updateSectionRecommendations,
      updateImageCaption,
      updateImageFinding,
      updateImageRecommendation,
      toggleHideImage,
      setExportState,
      setExportError,
      setExportedFileUrl,
    },
  };
}
