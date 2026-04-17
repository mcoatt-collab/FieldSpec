import { create } from "zustand";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface UIState {
  sidebarOpen: boolean;
  toasts: Toast[];
  modalOpen: string | null;
  isLoading: boolean;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  setModalOpen: (modalId: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toasts: [],
  modalOpen: null,
  isLoading: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setModalOpen: (modalOpen) => set({ modalOpen }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      sidebarOpen: true,
      toasts: [],
      modalOpen: null,
      isLoading: false,
    }),
}));
