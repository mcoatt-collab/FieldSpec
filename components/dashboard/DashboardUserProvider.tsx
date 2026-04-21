"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export interface DashboardUser {
  id?: string;
  name: string;
  email: string;
  companyName?: string | null;
  createdAt?: string;
}

interface DashboardUserContextValue {
  user: DashboardUser | null;
  loading: boolean;
  setUser: (user: DashboardUser | null) => void;
  refreshUser: () => Promise<void>;
}

const DashboardUserContext = createContext<DashboardUserContextValue | null>(
  null
);

export function DashboardUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");

      if (res.ok) {
        const data = await res.json();
        setUser(data.data ?? null);
        return;
      }

      if (res.status === 401 || res.status === 404) {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard user:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refreshUser,
    }),
    [loading, refreshUser, user]
  );

  return (
    <DashboardUserContext.Provider value={value}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  const context = useContext(DashboardUserContext);

  if (!context) {
    throw new Error(
      "useDashboardUser must be used within a DashboardUserProvider"
    );
  }

  return context;
}
