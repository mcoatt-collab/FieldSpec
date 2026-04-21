"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

export function MapPreview() {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between gap-sm mb-md">
        <div className="flex items-center gap-sm">
          <span className="material-icons" style={{ fontSize: "20px", color: tokens.colors.tertiary }}>
            map
          </span>
          <span
            className="text-label-large"
            style={{ color: tokens.colors.onSurface }}
          >
            Map Overview
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard/map")}
          className="text-label-medium transition-colors cursor-pointer"
          style={{
            backgroundColor: "transparent",
            color: tokens.colors.primary,
            border: "none",
          }}
        >
          Open Full Map
        </button>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.outlineVariant,
        }}
      >
        <div
          className="h-48 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: tokens.colors.surfaceVariant }}
        >
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-sm text-center px-md py-lg">
            <span
              className="material-icons"
              style={{ fontSize: "32px", color: tokens.colors.onSurfaceVariant }}
            >
              location_on
            </span>
            <p
              className="text-body-medium"
              style={{ color: tokens.colors.onSurfaceVariant }}
            >
              Map visualization for projects with GPS-tagged images
            </p>
            <p
              className="text-body-small"
              style={{ color: tokens.colors.onSurfaceVariant }}
            >
              Upload images with GPS data to see them on the map
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}