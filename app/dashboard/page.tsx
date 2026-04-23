"use client";

import { useEffect, useState } from "react";
import { tokens } from "@/lib/design-tokens";
import { ActiveJobsPanel } from "@/components/dashboard/ActiveJobsPanel";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { RecentProjectsSection } from "@/components/dashboard/RecentProjectsSection";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { InsightPreviewCard } from "@/components/dashboard/InsightPreviewCard";
import { MapPreview } from "@/components/dashboard/MapPreview";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useProjectsStore } from "@/store/useProjectsStore";
import {
  mockJobs,
  mockInsight,
  type Job,
  type Project,
  type Insight,
  type Stats,
} from "@/components/dashboard/mockData";

export default function DashboardPage() {
  const { projects, loading: projectsLoading, fetchProjects } = useProjectsStore();
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    imagesProcessed: 0,
    reportsGenerated: 0,
    reportsInProgress: 0,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [insight, setInsight] = useState<Insight | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) {
      const totalProjects = projects.length;
      const totalImages = projects.reduce(
        (sum: number, p: any) => sum + (p.photoCount || 0),
        0
      );
      const reportsGenerated = projects.filter(
        (p: any) => p.status === "exported"
      ).length;
      const reportsInProgress = projects.filter(
        (p: any) => p.status === "report_generated"
      ).length;

      setStats({
        totalProjects,
        imagesProcessed: totalImages,
        reportsGenerated,
        reportsInProgress,
      });
    }
  }, [projects]);

  useEffect(() => {
    setJobs(mockJobs);
    setInsight(mockInsight);
  }, []);

  const hasProjects = projects.length > 0;

  if (projectsLoading && projects.length === 0) {
    return (
      <div style={{ maxWidth: "1200px", paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md }}>
        <div style={{ marginBottom: tokens.spacing.xl }}>
          <div
            style={{ 
              height: "32px", 
              width: "128px", 
              borderRadius: tokens.radius.sm, 
              marginBottom: tokens.spacing.xs,
              backgroundColor: tokens.colors.surfaceVariant,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            }}
          />
          <div
            style={{ 
              height: "20px", 
              width: "256px", 
              borderRadius: tokens.radius.sm, 
              backgroundColor: tokens.colors.surfaceVariant,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{ 
                height: "96px", 
                borderRadius: tokens.radius.xl, 
                backgroundColor: tokens.colors.surfaceVariant,
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const mappedProjects: Project[] = projects.slice(0, 5).map((p: any) => ({
    id: p.id,
    name: p.name,
    imageCount: p.photoCount || 0,
    status: p.status || "draft",
    createdAt: new Date(p.createdAt),
    clientName: p.clientName,
  }));

  return (
    <div style={{ maxWidth: "1200px", paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md }}>
      <div style={{ marginBottom: tokens.spacing.xl }}>
        <h2
          style={{ 
            color: tokens.colors.onSurface, 
            fontSize: tokens.typography.headlineSmall.fontSize,
            fontWeight: tokens.typography.headlineSmall.fontWeight,
            marginBottom: tokens.spacing.xs,
          }}
        >
          Dashboard
        </h2>
        <p
          style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.bodyMedium.fontSize }}
        >
          Overview of your projects and recent activity
        </p>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.lg }}
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
          <RecentProjectsSection projects={mappedProjects} />
        </section>

        <section style={{ marginBottom: tokens.spacing.lg }}>
          <StatsCards stats={stats} />
        </section>

        {!hasProjects ? (
          <section style={{ marginBottom: tokens.spacing.lg }}>
            <EmptyState />
          </section>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(1, minmax(0, 1fr))", gap: tokens.spacing.lg }}>
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