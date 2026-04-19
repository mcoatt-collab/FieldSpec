"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, images: 0, reports: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const json = await res.json();
          const projects = json.data || [];
          
          const totalProjects = projects.length;
          const totalImages = projects.reduce((sum: number, p: any) => sum + (p.photoCount || 0), 0);
          
          setStats(s => ({ ...s, projects: totalProjects, images: totalImages }));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-[1200px]">
      <div className="mb-xl">
        <h2 className="text-on-surface text-headline-small mb-xs ">
          Dashboard
        </h2>
        <p className="text-on-surface-variant mt-xs text-body-medium">
          Overview of your projects and recent activity
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-lg">
        <div className="p-md mb-md bg-surface rounded-md border border-outline-variant">
          <p className="text-on-surface-variant text-title-small">
            Total Projects
          </p>
          <p className="text-on-surface mt-md text-title-large">
            {stats.projects}
          </p>
        </div>

        <div className="p-md mb-md bg-surface rounded-md          border border-outline-variant">
          <p className="text-on-surface-variant text-title-small">
            Total Images
          </p>
          <p className="text-on-surface mt-md text-title-large">
            {stats.images}
          </p>
        </div>

        <div className="p-md mb-md bg-surface rounded-md          border border-outline-variant">
          <p className="text-on-surface-variant text-title-small">
            Reports Generated
          </p>
          <p className="text-on-surface mt-md text-title-large">
            {stats.reports}
          </p>
        </div>
      </div>
    </div>
  );
}