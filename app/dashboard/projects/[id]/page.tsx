"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

interface Project {
  id: string;
  name: string;
  status: string;
  location: string | null;
  photoCount: number;
  mapSnapshotUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  useEffect(() => {
    void fetchProject();
  }, [projectId]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setProject(data.data);
      } else if (res.status === 404) {
        setError("Project not found");
      } else {
        setError("Failed to load project");
      }
    } catch (err) {
      console.error("Failed to fetch project:", err);
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: tokens.spacing.lg, maxWidth: "800px" }}>
        <div
          style={{
            padding: tokens.spacing.xl,
            textAlign: "center",
            color: tokens.colors.onSurfaceVariant,
            ...tokens.typography.bodyLarge,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ padding: tokens.spacing.lg, maxWidth: "800px" }}>
        <div
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.errorContainer,
            borderRadius: tokens.radius.lg,
            textAlign: "center",
          }}
        >
          <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onErrorContainer }}>
            {error || "Project not found"}
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/projects")}
          style={{
            marginTop: tokens.spacing.lg,
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.onPrimary,
            border: "none",
            borderRadius: tokens.radius.md,
            cursor: "pointer",
            ...tokens.typography.labelLarge,
          }}
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: tokens.spacing.lg, maxWidth: "800px" }}>
      <button
        onClick={() => router.push("/dashboard/projects")}
        style={{
          marginBottom: tokens.spacing.lg,
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          backgroundColor: "transparent",
          color: tokens.colors.primary,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.xs,
          ...tokens.typography.labelMedium,
        }}
      >
        <span className="material-icons" style={{ fontSize: "18px" }}>
          arrow_back
        </span>
        Back to Projects
      </button>

      <div
        style={{
          marginBottom: tokens.spacing.xl,
        }}
      >
        <h2
          style={{
            ...tokens.typography.headlineMedium,
            color: tokens.colors.onSurface,
          }}
        >
          {project.name}
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          {project.photoCount} photos
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: tokens.spacing.xl,
          marginBottom: tokens.spacing.xl,
        }}
      >
        <div
          style={{
            padding: tokens.spacing.lg,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
            flex: 1,
          }}
        >
          <label
            style={{
              ...tokens.typography.labelSmall,
              color: tokens.colors.onSurfaceVariant,
              display: "block",
              marginBottom: tokens.spacing.xs,
            }}
          >
            Status
          </label>
          <span
            style={{
              padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
              backgroundColor:
                project.status === "completed"
                  ? tokens.colors.tertiaryContainer
                  : tokens.colors.surfaceVariant,
              color:
                project.status === "completed"
                  ? tokens.colors.onTertiaryContainer
                  : tokens.colors.onSurfaceVariant,
              borderRadius: tokens.radius.pill,
              ...tokens.typography.labelMedium,
            }}
          >
            {project.status}
          </span>
        </div>
        <div
          style={{
            padding: tokens.spacing.lg,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
            flex: 1,
          }}
        >
          <label
            style={{
              ...tokens.typography.labelSmall,
              color: tokens.colors.onSurfaceVariant,
              display: "block",
              marginBottom: tokens.spacing.xs,
            }}
          >
            Created
          </label>
          <p
            style={{
              ...tokens.typography.bodyMedium,
              color: tokens.colors.onSurface,
            }}
          >
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        {project.location && (
          <div
            style={{
              padding: tokens.spacing.lg,
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.radius.lg,
              boxShadow: tokens.elevation.level1,
              flex: 1,
            }}
          >
            <label
              style={{
                ...tokens.typography.labelSmall,
                color: tokens.colors.onSurfaceVariant,
                display: "block",
                marginBottom: tokens.spacing.xs,
              }}
            >
              Location
            </label>
            <p
              style={{
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurface,
              }}
            >
              {project.location}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: tokens.spacing.xl }}>
        <h3
          style={{
            ...tokens.typography.titleLarge,
            color: tokens.colors.onSurface,
            marginBottom: tokens.spacing.lg,
          }}
        >
          Quick Actions
        </h3>
        <div
          style={{
            display: "flex",
            gap: tokens.spacing.md,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => router.push("/dashboard/upload")}
            style={{
              padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
              backgroundColor: tokens.colors.primaryContainer,
              color: tokens.colors.onPrimaryContainer,
              border: "none",
              borderRadius: tokens.radius.md,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              ...tokens.typography.labelLarge,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.primary;
              e.currentTarget.style.color = tokens.colors.onPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.primaryContainer;
              e.currentTarget.style.color = tokens.colors.onPrimaryContainer;
            }}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              upload
            </span>
            Upload Images
          </button>
          <button
            onClick={() => router.push("/dashboard/map")}
            style={{
              padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
              backgroundColor: tokens.colors.surfaceVariant,
              color: tokens.colors.onSurfaceVariant,
              border: "none",
              borderRadius: tokens.radius.md,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              ...tokens.typography.labelLarge,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.secondaryContainer;
              e.currentTarget.style.color = tokens.colors.onSecondaryContainer;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.surfaceVariant;
              e.currentTarget.style.color = tokens.colors.onSurfaceVariant;
            }}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              map
            </span>
            View Map
          </button>
          <button
            onClick={() => router.push("/dashboard/report")}
            style={{
              padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
              backgroundColor: tokens.colors.surfaceVariant,
              color: tokens.colors.onSurfaceVariant,
              border: "none",
              borderRadius: tokens.radius.md,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              ...tokens.typography.labelLarge,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.secondaryContainer;
              e.currentTarget.style.color = tokens.colors.onSecondaryContainer;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.surfaceVariant;
              e.currentTarget.style.color = tokens.colors.onSurfaceVariant;
            }}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              description
            </span>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}