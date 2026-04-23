"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";
import { StatusBadge, StatusType } from "./StatusBadge";

interface ImageCardProps {
  image: {
    id: string;
    url: string;
    thumbnailUrl: string;
    category: string;
    notes: string | null;
    status?: StatusType;
  };
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onCategoryChange: (id: string, category: string) => void;
  onEditNote: (image: any) => void;
  onDelete: (id: string) => void;
  onReprocess: (id: string) => void;
}

const CATEGORY_OPTIONS = [
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
];

export function ImageCard({
  image,
  isSelected,
  onSelect,
  onCategoryChange,
  onEditNote,
  onDelete,
  onReprocess,
}: ImageCardProps) {
  const status = image.status || (Math.random() > 0.8 ? "processing" : "completed");

  return (
    <div className={`group relative bg-surface border rounded-lg overflow-hidden transition-all duration-200 
      ${isSelected ? "border-primary ring-1 ring-primary" : "border-outline-variant hover:border-primary/50"}
    `}>
      {/* Checkbox */}
      <div className={`absolute top-xs right-xs z-10 transition-opacity 
        ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}>
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={(e) => onSelect(image.id, e.target.checked)}
          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
        />
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        <img 
          src={image.thumbnailUrl} 
          alt="" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-xs left-xs">
          <StatusBadge status={status} />
        </div>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-md">
          <button 
            onClick={() => window.open(image.url, '_blank')}
            className="p-2 bg-surface rounded-full text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
            title="View full image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* w-5 h-5 for main hover icons */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button 
            onClick={() => onReprocess(image.id)}
            className="p-2 bg-surface rounded-full text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
            title="Reprocess AI"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* w-5 h-5 */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(image.id)}
            className="p-2 bg-surface rounded-full text-on-surface hover:bg-error hover:text-on-error transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* w-5 h-5 */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-sm space-y-xs">
        <select 
          value={image.category || "general"}
          onChange={(e) => onCategoryChange(image.id, e.target.value)}
          className="w-full bg-surface-container text-on-surface rounded border border-outline-variant outline-none focus:border-primary appearance-none cursor-pointer"
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.xl} ${tokens.spacing.sm} ${tokens.spacing.sm}`,
            fontSize: tokens.typography.labelSmall.fontSize, // Changed from text-[11px] to labelSmall (11px)
            fontWeight: tokens.typography.labelSmall.fontWeight,
            borderWidth: "1px",
            borderRadius: tokens.radius.sm,
          }}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button 
          onClick={() => onEditNote(image)}
          className="w-full text-left px-xs py-1 rounded border border-transparent hover:border-outline-variant text-on-surface-variant flex items-center justify-between"
          style={{
            fontSize: tokens.typography.labelSmall.fontSize, // Changed from text-[11px] to labelSmall (11px)
            fontWeight: tokens.typography.labelSmall.fontWeight,
            padding: `${tokens.spacing.xs} ${tokens.spacing.xs}`,
            borderRadius: tokens.radius.sm,
          }}
        >
          <span className="truncate">{image.notes || "Add notes..."}</span>
          <svg className="w-3 h-3 flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* w-3 h-3 */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
