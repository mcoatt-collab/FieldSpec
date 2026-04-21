"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import type { Insight } from "./mockData";

interface InsightPreviewCardProps {
  insight: Insight | null;
}

export function InsightPreviewCard({ insight }: InsightPreviewCardProps) {
  const router = useRouter();

  if (!insight) {
    return null;
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "#37953c";
    if (score >= 60) return "#c47f08";
    return tokens.colors.error;
  };

  return (
    <div>
      <div className="flex items-center gap-sm mb-md">
        <span className="material-icons" style={{ fontSize: "20px", color: "#37953c" }}>
          auto_awesome
        </span>
        <span
          className="text-label-large"
          style={{ color: tokens.colors.onSurface }}
        >
          Recent AI Insight
        </span>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.outlineVariant,
        }}
      >
        <div className="p-xl">
          <div className="flex gap-md mb-md">
            <div
              className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
              style={{
                backgroundColor: tokens.colors.surfaceVariant,
              }}
            >
              <img
                src={insight.imageUrl}
                alt="Insight preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-label-medium mb-xs"
                style={{ color: tokens.colors.onSurfaceVariant }}
              >
                {insight.projectName}
              </p>
              <p
                className="text-body-medium line-clamp-2"
                style={{ color: tokens.colors.onSurface }}
              >
                {insight.caption}
              </p>
            </div>
          </div>

          <div
            className="p-sm rounded-lg mb-md"
            style={{ backgroundColor: tokens.colors.surfaceVariant }}
          >
            <p
              className="text-label-small mb-xs"
              style={{ color: tokens.colors.onSurfaceVariant }}
            >
              Finding
            </p>
            <p
              className="text-body-medium line-clamp-2"
              style={{ color: tokens.colors.onSurface }}
            >
              {insight.finding}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span
                className="text-label-medium"
                style={{ color: tokens.colors.onSurfaceVariant }}
              >
                Confidence:
              </span>
              <span
                className="px-sm py-xs rounded-pill text-label-small font-medium"
                style={{
                  backgroundColor: `${getConfidenceColor(insight.confidenceScore)}20`,
                  color: getConfidenceColor(insight.confidenceScore),
                }}
              >
                {insight.confidenceScore}%
              </span>
            </div>

            <button
              onClick={() => router.push(`/dashboard/report?project=${insight.projectId}`)}
              className="flex items-center gap-xs px-sm py-xs rounded-md text-label-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: "transparent",
                color: tokens.colors.primary,
                border: "none",
              }}
            >
              View Report
              <span className="material-icons" style={{ fontSize: "16px" }}>
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}