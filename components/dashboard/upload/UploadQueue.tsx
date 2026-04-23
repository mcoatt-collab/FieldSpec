"use client";

import React from "react";

export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "failed";
}

interface UploadQueueProps {
  items: UploadItem[];
}

export function UploadQueue({ items }: UploadQueueProps) {
  if (items.length === 0) return null;

  const uploadingCount = items.filter(i => i.status === "uploading").length;

  return (
    <div className="mt-md bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-level1">
      <div className="bg-surface-container px-md py-sm border-b border-outline-variant flex items-center justify-between">
        <h4 className="text-label-large font-bold text-on-surface">
          Upload Queue {uploadingCount > 0 && <span className="text-primary ml-xs">({uploadingCount} active)</span>}
        </h4>
        <span className="text-body-small text-on-surface-variant">
          {items.length} files total
        </span>
      </div>
      
      <div className="max-height-[240px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="px-md py-sm border-b border-outline-variant last:border-0 flex items-center gap-md">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-xs">
                <span className="text-body-small font-medium truncate text-on-surface">{item.name}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider
                  ${item.status === "completed" ? "text-success" : item.status === "failed" ? "text-error" : "text-primary"}
                `}>
                  {item.status}
                </span>
              </div>
              
              <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 rounded-full
                    ${item.status === "completed" ? "bg-success" : item.status === "failed" ? "bg-error" : "bg-primary"}
                  `}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
            
            {item.status === "completed" && (
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
