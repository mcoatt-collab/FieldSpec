"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkCategorize: (category: string) => void;
  onBulkReprocess: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
];

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkCategorize,
  onBulkReprocess,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-20 bg-primary-container text-on-primary-container px-md py-sm rounded-md shadow-level2 flex items-center gap-md animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-sm border-r border-on-primary-container/20 pr-md">
        <button 
          onClick={onClearSelection}
          className="p-1 hover:bg-on-primary-container/10 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* w-4 h-4 (16px) for utility icons */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-label-large font-bold">{selectedCount} Selected</span> {/* label-large (14px) for count, consistent */}
      </div>

      <div className="flex items-center gap-md">
        <div className="flex items-center gap-xs">
          <span className="text-body-small opacity-80">Categorize:</span> {/* body-small (12px) for labels, consistent */}
          <select 
            onChange={(e) => e.target.value && onBulkCategorize(e.target.value)}
            value=""
            className="bg-surface text-on-surface rounded border border-outline-variant outline-none focus:border-primary"
            style={{
              fontSize: tokens.typography.bodySmall.fontSize, // Use body-small (12px) for select text
              fontWeight: tokens.typography.bodySmall.fontWeight,
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              borderRadius: tokens.radius.sm,
              borderWidth: "1px",
            }}
          >
            <option value="" disabled>Select...</option>
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={onBulkReprocess}
          className="flex items-center gap-xs text-body-small hover:bg-on-primary-container/10 px-sm py-1 rounded transition-colors"
          style={{
            fontSize: tokens.typography.bodySmall.fontSize, // Use body-small (12px) for button text
            fontWeight: tokens.typography.bodySmall.fontWeight,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            borderRadius: tokens.radius.sm,
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* w-4 h-4 (16px) for action icons */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reprocess
        </button>

        <button 
          onClick={onBulkDelete}
          className="flex items-center gap-xs text-body-small text-error hover:bg-error/10 px-sm py-1 rounded transition-colors"
          style={{
            fontSize: tokens.typography.bodySmall.fontSize, // Use body-small (12px) for button text
            fontWeight: tokens.typography.bodySmall.fontWeight,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            borderRadius: tokens.radius.sm,
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* w-4 h-4 (16px) for action icons */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
