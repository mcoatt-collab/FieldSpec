import { create } from "zustand";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  error?: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
}

interface UploadState {
  files: UploadFile[];
  isUploading: boolean;
  currentProjectId: string | null;
  
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: UploadFile["status"], error?: string) => void;
  setCloudinaryResult: (id: string, url: string, publicId: string) => void;
  setCurrentProjectId: (projectId: string | null) => void;
  clearFiles: () => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  isUploading: false,
  currentProjectId: null,

  addFiles: (newFiles) =>
    set((state) => ({
      files: [
        ...state.files,
        ...newFiles.map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "pending" as const,
        })),
      ],
    })),

  removeFile: (id) =>
    set((state) => {
      const file = state.files.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return {
        files: state.files.filter((f) => f.id !== id),
      };
    }),

  updateFileProgress: (id, progress) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, progress } : f
      ),
    })),

  updateFileStatus: (id, status, error) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status, error } : f
      ),
    })),

  setCloudinaryResult: (id, url, publicId) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, cloudinaryUrl: url, cloudinaryPublicId: publicId } : f
      ),
    })),

  setCurrentProjectId: (projectId) =>
    set({ currentProjectId: projectId }),

  clearFiles: () =>
    set((state) => {
      state.files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      return { files: [] };
    }),

  reset: () =>
    set((state) => {
      state.files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      return { files: [], isUploading: false, currentProjectId: null };
    }),
}));
