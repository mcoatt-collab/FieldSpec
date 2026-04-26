"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import { LoadingScreen } from "@/lib/components/loading";
import { EmptyState } from "@/components/dashboard/EmptyState";

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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (showForm) {
      fetchClients();
    }
  }, [showForm]);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok && data.data) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchClients() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (res.ok && data.data) {
        setClients(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, clientId: clientId || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || `Failed to create project (${res.status})`);
        setCreating(false);
        return;
      }

      setProjects([data.data, ...projects]);
      setName("");
      setClientId("");
      setShowForm(false);
      setCreating(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setCreating(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        padding: `0 ${tokens.spacing.md}`,
      }}
    >
      <style>{`
        .animate-content {
          animation: slideUpFade 0.4s ease-out forwards;
        }
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-select {
          transition: all 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px !important;
          max-width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .custom-select {
            font-size: 14px !important;
            height: 44px;
          }
          .form-actions {
            flex-direction: column;
          }
          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
      <div
        className="animate-content"
        style={{
          marginBottom: tokens.spacing.xl,
        }}
      >
        <div>
          <h2
            style={{
              ...tokens.typography.headlineMedium,
              color: tokens.colors.onSurface,
            }}
          >
            Projects
          </h2>
          <p
            style={{
              ...tokens.typography.bodyMedium,
              color: tokens.colors.onSurfaceVariant,
              marginTop: tokens.spacing.xs,
            }}
          >
            Manage your field inspection projects
          </p>
        </div>
      </div>

      {showForm && (
        <div
          className="animate-content"
          style={{
            marginBottom: tokens.spacing.lg,
            padding: tokens.spacing.lg,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
            border: `1px solid ${tokens.colors.outlineVariant}`,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: tokens.spacing.md }}>
              <label
                style={{
                  display: "block",
                  marginBottom: tokens.spacing.xs,
                  ...tokens.typography.labelMedium,
                  color: tokens.colors.onSurface,
                }}
              >
                Project Name <span style={{ color: tokens.colors.primary }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: tokens.spacing.md,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.onSurface,
                  ...tokens.typography.bodyLarge,
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = tokens.colors.primary)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = tokens.colors.outlineVariant)
                }
              />
            </div>

            <div style={{ marginBottom: tokens.spacing.md }}>
              <label
                style={{
                  display: "block",
                  marginBottom: tokens.spacing.xs,
                  ...tokens.typography.labelMedium,
                  color: tokens.colors.onSurfaceVariant,
                }}
              >
                Link to Client{" "}
                <span style={{ color: tokens.colors.onSurfaceVariant }}>
                  (optional)
                </span>
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="custom-select"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: tokens.spacing.md,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.onSurface,
                  ...tokens.typography.bodyLarge,
                  transition: "border-color 0.2s ease",
                  cursor: "pointer",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = tokens.colors.primary)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = tokens.colors.outlineVariant)
                }
              >
                <option value="">No client linked</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                    {client.company ? ` (${client.company})` : ""}
                  </option>
                ))}
              </select>
              <p
                style={{
                  ...tokens.typography.bodySmall,
                  color: tokens.colors.onSurfaceVariant,
                  marginTop: tokens.spacing.xs,
                }}
              >
                To create a project for a new client,{" "}
                <a
                  href="/dashboard/clients"
                  style={{
                    color: tokens.colors.primary,
                    textDecoration: "underline",
                  }}
                >
                  create the client first
                </a>
                .
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: tokens.spacing.md,
                  marginBottom: tokens.spacing.md,
                  backgroundColor: tokens.colors.errorContainer,
                  color: tokens.colors.onErrorContainer,
                  borderRadius: tokens.radius.md,
                  ...tokens.typography.bodySmall,
                }}
              >
                {error}
              </div>
            )}

            <div
              className="form-actions"
              style={{ display: "flex", gap: tokens.spacing.md }}
            >
              <button
                type="submit"
                disabled={creating}
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                  border: "none",
                  borderRadius: tokens.radius.md,
                  cursor: creating ? "not-allowed" : "pointer",
                  opacity: creating ? 0.7 : 1,
                  ...tokens.typography.labelLarge,
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  !creating && (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setClientId("");
                  setError("");
                }}
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  backgroundColor: "transparent",
                  color: tokens.colors.onSurface,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  borderRadius: tokens.radius.md,
                  cursor: "pointer",
                  ...tokens.typography.labelLarge,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    tokens.colors.surfaceContainerLow)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingScreen message="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon="folder"
          title="No projects yet"
          description="Create your first project to get started"
          actionLabel="Create Project"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: tokens.spacing.md,
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              style={{
                padding: tokens.spacing.lg,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.elevation.level1,
                border: `1px solid ${tokens.colors.outlineVariant}`,
                animation: `slideUpFade 0.4s ease-out forwards ${index * 0.05}s`,
                opacity: 0,
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = tokens.elevation.level2;
                e.currentTarget.style.borderColor = tokens.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = tokens.elevation.level1;
                e.currentTarget.style.borderColor = tokens.colors.outlineVariant;
              }}
            >
              <h3
                style={{
                  ...tokens.typography.titleMedium,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.xs,
                }}
              >
                {project.name}
              </h3>
              <p
                style={{
                  ...tokens.typography.bodySmall,
                  color: tokens.colors.onSurfaceVariant,
                }}
              >
                {project.photoCount} photos &middot; Created{" "}
                {formatDate(project.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}