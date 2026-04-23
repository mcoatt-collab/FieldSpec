import { create } from "zustand";

interface User {
  id?: string;
  name: string;
  email: string;
  companyName?: string | null;
}

interface UserState {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    if (get().user) {
      set({ loading: false });
      return;
    }
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.data ?? null });
      } else {
        set({ user: null });
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user, loading: false }),
  logout: () => set({ user: null, loading: false }),
}));
