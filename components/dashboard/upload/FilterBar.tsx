"use client";

import React from "react";
import { tokens } from "@/lib/design-tokens";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
  { value: "untagged", label: "Untagged" },
];

const STATUSES = [
  { value: "all", label: "All Status" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

interface FilterBarProps {
  category: string;
  setCategory: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
}

export function FilterBar({
  category,
  setCategory,
  status,
  setStatus,
  sort,
  setSort,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-md py-md border-b border-outline-variant">
      <div className="flex flex-col gap-xs">
        <label className="text-label-small font-bold uppercase text-on-surface-variant tracking-wider"> {/* Changed from text-[10px] to text-label-small */}
          Category
        </label>
        <div className="flex flex-wrap gap-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-sm py-1 rounded-md border transition-all
                ${category === cat.value 
                  ? "bg-primary text-on-primary border-primary" 
                  : "bg-surface text-on-surface border-outline-variant hover:border-primary/50"}
              `}
              style={{
                fontSize: tokens.typography.bodySmall.fontSize, // Use body-small (12px) for button text
                fontWeight: tokens.typography.bodySmall.fontWeight,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-md ml-auto">
        <div className="flex flex-col gap-xs">
          <label className="text-label-small font-bold uppercase text-on-surface-variant tracking-wider"> {/* Changed from text-[10px] to text-label-small */}
            Processing Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-surface border border-outline-variant rounded-md px-sm py-1 outline-none focus:border-primary"
            style={{
              fontSize: tokens.typography.bodySmall.fontSize, // Use body-small (12px) for select text
              fontWeight: tokens.typography.bodySmall.fontWeight,
            }}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="text-label-small font-bold uppercase text-on-surface-variant tracking-wider"> {/* Changed from text-[10px] to text-label-small */}
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-surface border border-outline-variant rounded-md px-sm py-1 outline-none focus:border-primary"
            style={{
              fontSize: tokens.typography.bodySmall.fontSize, // Use body-small (12px) for select text
              fontWeight: tokens.typography.bodySmall.fontWeight,
            }}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
