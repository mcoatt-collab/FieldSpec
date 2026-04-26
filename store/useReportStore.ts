import { create } from "zustand";

interface AIGenerateJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  type: "caption" | "summary" | "full_report";
  result?: unknown;
  error?: string;
}

interface ReportState {
  currentReport: Record<string, unknown> | null;
  aiJobs: AIGenerateJob[];
  isGenerating: boolean;
  generationProgress: number;
  error: string | null;
  
  setCurrentReport: (report: Record<string, unknown> | null) => void;
  addAIJob: (job: AIGenerateJob) => void;
  updateAIJob: (id: string, updates: Partial<AIGenerateJob>) => void;
  removeAIJob: (id: string) => void;
  setGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  currentReport: null,
  aiJobs: [],
  isGenerating: false,
  generationProgress: 0,
  error: null,

  setCurrentReport: (report) => set({ currentReport: report }),

  addAIJob: (job) =>
    set((state) => ({
      aiJobs: [...state.aiJobs, job],
    })),

  updateAIJob: (id, updates) =>
    set((state) => ({
      aiJobs: state.aiJobs.map((j) =>
        j.id === id ? { ...j, ...updates } : j
      ),
    })),

  removeAIJob: (id) =>
    set((state) => ({
      aiJobs: state.aiJobs.filter((j) => j.id !== id),
    })),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setGenerationProgress: (generationProgress) => set({ generationProgress }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      currentReport: null,
      aiJobs: [],
      isGenerating: false,
      generationProgress: 0,
      error: null,
    }),
}));
