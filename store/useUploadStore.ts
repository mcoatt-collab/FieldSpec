import { create } from "zustand";

export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
}

interface UploadState {
  uploadQueue: UploadItem[];
  isUploading: boolean;
  addItems: (items: UploadItem[]) => void;
  updateItemProgress: (id: string, progress: number, status?: UploadItem["status"]) => void;
  removeItem: (id: string) => void;
  clearCompleted: () => void;
  setIsUploading: (isUploading: boolean) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploadQueue: [],
  isUploading: false,
  addItems: (items) =>
    set((state) => ({ uploadQueue: [...items, ...state.uploadQueue] })),
  updateItemProgress: (id, progress, status) =>
    set((state) => ({
      uploadQueue: state.uploadQueue.map((item) =>
        item.id === id ? { ...item, progress, ...(status && { status }) } : item
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      uploadQueue: state.uploadQueue.filter((item) => item.id !== id),
    })),
  clearCompleted: () =>
    set((state) => ({
      uploadQueue: state.uploadQueue.filter((item) => item.status !== "completed"),
    })),
  setIsUploading: (isUploading) => set({ isUploading }),
}));
