"use client";

import { useState } from "react";
import { useUIStore } from "@/store";

interface TopBarProps {
  title: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, actions }: TopBarProps) {
  const { toasts, removeToast } = useUIStore();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-white border-l-4
              animate-slide-in
              ${toast.type === "success" ? "border-green-500" : ""}
              ${toast.type === "error" ? "border-red-500" : ""}
              ${toast.type === "warning" ? "border-yellow-500" : ""}
              ${toast.type === "info" ? "border-blue-500" : ""}
            `}
          >
            <span className="text-sm text-neutral-700">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </header>
  );
}
