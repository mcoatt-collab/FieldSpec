"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

interface Project {
  id: string;
  name: string;
  status: string;
  photoCount: number;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  company: string | null;
  contactInfo: string | null;
  createdAt: string;
  updatedAt: string;
  projects: Project[];
}

export default function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  async function fetchClient() {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setClient(data.data);
      } else if (res.status === 404) {
        setError("Client not found");
      } else {
        setError("Failed to load client");
      }
    } catch (err) {
      console.error("Failed to fetch client:", err);
      setError("Failed to load client");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: tokens.spacing.lg, maxWidth: "1200px" }}>
        <div style={{ padding: tokens.spacing.xl, textAlign: "center", color: tokens.colors.onSurfaceVariant, ...tokens.typography.bodyLarge }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div style={{ padding: tokens.spacing.lg, maxWidth: "1200px" }}>
        <div style={{ padding: tokens.spacing.xl, backgroundColor: tokens.colors.errorContainer, borderRadius: tokens.radius.lg, textAlign: "center" }}>
          <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onErrorContainer }}>
            {error || "Client not found"}
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/clients")}
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
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: tokens.spacing.lg, maxWidth: "1200px" }}>
      <button
        onClick={() => router.push("/dashboard/clients")}
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
        ← Back to Clients
      </button>

      <div style={{ marginBottom: tokens.spacing.xl }}>
        <h2 style={{ ...tokens.typography.headlineMedium, color: tokens.colors.onSurface }}>
          {client.name}
        </h2>
        {client.company && (
          <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.xs }}>
            {client.company}
          </p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
        {client.contactInfo && (
          <div style={{ padding: tokens.spacing.lg, backgroundColor: tokens.colors.surface, borderRadius: tokens.radius.lg, boxShadow: tokens.elevation.level1 }}>
            <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant, display: "block", marginBottom: tokens.spacing.xs }}>
              Contact Info
            </label>
            <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>
              {client.contactInfo}
            </p>
          </div>
        )}
        <div style={{ padding: tokens.spacing.lg, backgroundColor: tokens.colors.surface, borderRadius: tokens.radius.lg, boxShadow: tokens.elevation.level1 }}>
          <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant, display: "block", marginBottom: tokens.spacing.xs }}>
            Created
          </label>
          <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>
            {new Date(client.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div style={{ padding: tokens.spacing.lg, backgroundColor: tokens.colors.surface, borderRadius: tokens.radius.lg, boxShadow: tokens.elevation.level1 }}>
          <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant, display: "block", marginBottom: tokens.spacing.xs }}>
            Projects
          </label>
          <p style={{ ...tokens.typography.headlineSmall, color: tokens.colors.onSurface }}>
            {client.projects.length}
          </p>
        </div>
      </div>

      <div>
        <h3 style={{ ...tokens.typography.titleLarge, color: tokens.colors.onSurface, marginBottom: tokens.spacing.lg }}>
          Projects
        </h3>

        {client.projects.length === 0 ? (
          <div style={{ padding: tokens.spacing.xl, backgroundColor: tokens.colors.surfaceVariant, borderRadius: tokens.radius.lg, textAlign: "center" }}>
            <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
              No projects linked to this client yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: tokens.spacing.md }}>
            {client.projects.map(project => (
              <div
                key={project.id}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                style={{
                  padding: tokens.spacing.lg,
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius.lg,
                  boxShadow: tokens.elevation.level1,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  borderLeft: `4px solid ${tokens.colors.primary}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = tokens.elevation.level2;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = tokens.elevation.level1;
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: tokens.spacing.sm }}>
                  <h4 style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface }}>
                    {project.name}
                  </h4>
                  <span style={{
                    padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                    backgroundColor: project.status === "completed" ? tokens.colors.tertiaryContainer : tokens.colors.surfaceVariant,
                    color: project.status === "completed" ? tokens.colors.onTertiaryContainer : tokens.colors.onSurfaceVariant,
                    borderRadius: tokens.radius.pill,
                    ...tokens.typography.labelSmall,
                  }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: tokens.spacing.lg }}>
                  <div>
                    <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant }}>
                      Photos
                    </label>
                    <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>
                      {project.photoCount}
                    </p>
                  </div>
                  <div>
                    <label style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant }}>
                      Created
                    </label>
                    <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurface }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
