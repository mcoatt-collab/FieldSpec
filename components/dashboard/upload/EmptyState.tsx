"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";

interface EmptyStateProps {
  type: "no_images" | "no_results";
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-xxl text-center bg-surface-container/30 border border-outline-variant border-dashed rounded-lg">
      <div className="w-8 h-8 bg-surface-container rounded-full flex items-center justify-center mb-md"> {/* Icon container size matches dashboard EmptyState w-8 h-8 */}
        <svg className="w-5 h-5 text-on-surface-variant opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Icon size adjusted to w-5 h-5 */}
          {type === "no_images" ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          )}
        </svg>
      </div>
      
      <h3 className="text-title-large text-on-surface mb-xs"> {/* title-large (22px) is consistent with other component titles */}
        {type === "no_images" ? "Upload images to get started" : "No images found"}
      </h3>
      
      <p className="text-body-medium text-on-surface-variant mb-lg max-w-xs"> {/* body-medium (14px) is consistent */}
        {type === "no_images" 
          ? "Your project is currently empty. Start by uploading drone survey images for AI analysis." 
          : "No images match your current filter settings. Try clearing filters to see all images."
        }
      </p>

      {onAction && (
        <button 
          onClick={onAction}
          className="bg-primary text-on-primary px-lg py-sm rounded-md font-bold hover:shadow-level2 transition-all"
          style={{ fontSize: tokens.typography.labelLarge.fontSize }} // labelLarge (14px) for CTA buttons
        >
          {type === "no_images" ? "Upload Images" : "Clear All Filters"}
        </button>
      )}
    </div>
  );
}
