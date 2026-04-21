"use client";

import { useEffect, useState } from "react";
import { tokens } from "@/lib/design-tokens";
import { ActiveJobsPanel } from "@/components/dashboard/ActiveJobsPanel";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { RecentProjectsTable } from "@/components/dashboard/RecentProjectsTable";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { InsightPreviewCard } from "@/components/dashboard/InsightPreviewCard";
import { MapPreview } from "@/components/dashboard/MapPreview";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  mockJobs,
  mockProjects,
  mockInsight,
  mockStats,
  type Job,
  type Project,
  type Insight,
  type Stats,
} from "@/components/dashboard/mockData";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    imagesProcessed: 0,
    reportsGenerated: 0,
    reportsInProgress: 0,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const json = await res.json();
          const projectsData = json.data || [];

          const totalProjects = projectsData.length;
          const totalImages = projectsData.reduce(
            (sum: number, p: any) => sum + (p.photoCount || 0),
            0
          );
          const reportsGenerated = projectsData.filter(
            (p: any) => p.status === "exported"
          ).length;
          const reportsInProgress = projectsData.filter(
            (p: any) => p.status === "report_generated"
          ).length;

          setStats({
            totalProjects,
            imagesProcessed: totalImages,
            reportsGenerated,
            reportsInProgress,
          });

          const mappedProjects: Project[] = projectsData.slice(0, 5).map((p: any) => ({
            id: p.id,
            name: p.name,
            imageCount: p.photoCount || 0,
            status: p.status || "draft",
            createdAt: new Date(p.createdAt),
            clientName: p.clientName,
          }));

          setProjects(mappedProjects);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  useEffect(() => {
    setJobs(mockJobs);
    setInsight(mockInsight);
  }, []);

  const hasProjects = projects.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-[1200px] px-md">
        <div className="mb-xl">
          <div
            className="h-8 w-32 rounded mb-xs animate-pulse"
            style={{ backgroundColor: tokens.colors.surfaceVariant }}
          />
          <div
            className="h-5 w-64 rounded animate-pulse"
            style={{ backgroundColor: tokens.colors.surfaceVariant }}
          />
        </div>
        <div className="grid grid-cols-4 gap-md mb-lg">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl animate-pulse"
              style={{ backgroundColor: tokens.colors.surfaceVariant }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] px-md">
      <div className="mb-xl">
        <h2
          className="text-headline-small mb-xs"
          style={{ color: tokens.colors.onSurface }}
        >
          Dashboard
        </h2>
        <p
          className="text-body-medium"
          style={{ color: tokens.colors.onSurfaceVariant }}
        >
          Overview of your projects and recent activity
        </p>
      </div>

      <div
        className="flex flex-col"
        style={{ gap: tokens.spacing.lg }}
      >
        {jobs.length > 0 && (
          <section style={{ marginBottom: tokens.spacing.lg }}>
            <ActiveJobsPanel jobs={jobs} />
          </section>
        )}

        <section style={{ marginBottom: tokens.spacing.lg }}>
          <QuickActionsPanel />
        </section>

        <section style={{ marginBottom: tokens.spacing.lg }}>
          <RecentProjectsTable projects={projects} />
        </section>

        <section style={{ marginBottom: tokens.spacing.lg }}>
          <StatsCards stats={stats} />
        </section>

        {!hasProjects ? (
          <section style={{ marginBottom: tokens.spacing.lg }}>
            <EmptyState />
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: tokens.spacing.lg }}>
            {insight && (
              <section>
                <InsightPreviewCard insight={insight} />
              </section>
            )}
            <section>
              <MapPreview />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}