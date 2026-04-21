"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import type { Job } from "./mockData";

interface ActiveJobsPanelProps {
  jobs: Job[];
}

export function ActiveJobsPanel({ jobs }: ActiveJobsPanelProps) {
  const router = useRouter();

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-sm mb-xs">
        <span className="material-icons" style={{ fontSize: "20px", color: tokens.colors.primary }}>
          sync
        </span>
        <span
          className="text-label-large"
          style={{ color: tokens.colors.onSurface }}
        >
          Active Processing
        </span>
      </div>

      <div 
        className="grid grid-cols-2 rounded-xl overflow-hidden border"
        style={{ 
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.outlineVariant,
        }}
      >
        <div className="flex flex-col items-start justify-center p-lg border-r"
          style={{ borderColor: tokens.colors.outlineVariant }}
        >
          <div className="mb-md p-sm rounded-lg" style={{ backgroundColor: tokens.colors.surfaceContainerLow }}>
            <span className="material-icons" style={{ fontSize: "48px", color: tokens.colors.surfaceContainerHigh }}>
              table_chart
            </span>
          </div>
          <p 
            className="text-body-medium text-left max-w-[280px] mb-md"
            style={{ color: tokens.colors.onSurfaceVariant }}
          >
            Monitor your active AI processing queue to track job progress in real-time.
          </p>
          <button 
            onClick={() => router.push("/dashboard/projects")}
            className="text-label-large font-medium hover:underline cursor-pointer border-none bg-transparent"
            style={{ color: tokens.colors.primary }}
          >
            View all projects
          </button>
        </div>

        <div className="flex flex-col p-xl min-h-[250px]">
          <div className="flex justify-between items-center mb-sm px-sm">
            <span className="text-label-small" style={{ color: tokens.colors.outline }}>Activity</span>
            <span className="text-label-small" style={{ color: tokens.colors.outline }}>Status</span>
          </div>
          
          <div className="flex flex-col overflow-y-auto max-h-[180px] pr-sm">
            {jobs.map((job, index) => (
              <div 
                key={job.id}
                className={`flex items-center justify-between py-sm px-sm group hover:bg-black/5 transition-colors duration-200 cursor-pointer ${index !== jobs.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: tokens.colors.outlineVariant }}
                onClick={() => router.push(`/dashboard/projects?job=${job.id}`)}
              >
                <div className="flex items-center gap-sm">
                  <span className="material-icons" style={{ 
                    fontSize: "16px", 
                    color: job.status === "processing" ? tokens.colors.primary : tokens.colors.outline 
                  }}>
                    {job.type === "full_report" ? "description" : "auto_awesome"}
                  </span>
                  <span className="text-body-medium truncate max-w-[180px]" style={{ color: tokens.colors.onSurface }}>
                    {job.projectName}
                  </span>
                </div>
                
                <div className="flex items-center gap-sm">
                  <span className="text-label-medium" style={{ 
                    color: job.status === "processing" ? tokens.colors.onSurface : tokens.colors.onSurfaceVariant 
                  }}>
                    {job.status === "processing" ? `${job.progress}%` : 
                     job.status === "completed" ? "Done" : 
                     job.status === "pending" ? "Queued" : "Failed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}