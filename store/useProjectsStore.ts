import { create } from "zustand";

interface Project {
  id: string;
  name: string;
  status: string;
  photoCount: number;
  createdAt: string;
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;

  lastFetched: number | null;
  fetchProjects: () => Promise<void>;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  invalidate: () => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchProjects: async () => {
    const { lastFetched } = get();
    // Skip if fetched within last 30 seconds
    if (lastFetched && Date.now() - lastFetched < 30_000) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok && data.data) {
        set({ projects: data.data, loading: false, lastFetched: Date.now() });
      } else {
        set({ error: data.error?.message || "Failed to fetch projects", loading: false });
      }
    } catch (err) {
      set({ error: "Failed to fetch projects", loading: false });
    }
  },

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  invalidate: () => set({ lastFetched: null }),
}));
