"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { tokens } from "@/lib/design-tokens";
import { LoadingScreen } from "@/lib/components/loading";

const fetcher = (url: string) => fetch(url).then((res) => res.json()).then(data => data.data);

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
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const router = useRouter();

  const { data: projects = [], error: projectsError, isLoading: projectsLoading, mutate: mutateProjects } = useSWR<Project[]>("/api/projects", fetcher);
  const { data: clients = [], error: clientsError } = useSWR<Client[]>(showForm ? "/api/clients" : null, fetcher);

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

      await mutateProjects([data.data, ...projects], false);
      setName("");
      setClientId("");
      setShowForm(false);
      setCreating(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setCreating(false);
    }
  }

  function handleDeleteClick(project: Project) {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!projectToDelete) return;

    setDeletingProjectId(projectToDelete.id);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || "Failed to delete project");
        setShowDeleteModal(false);
        setProjectToDelete(null);
        return;
      }

      await mutateProjects(projects.filter((p) => p.id !== projectToDelete.id), false);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      setError("Failed to delete project. Please try again.");
    } finally {
      setDeletingProjectId(null);
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
        .custom-input {
          transition: all 0.2s ease;
        }
        .custom-input:hover {
          border-color: ${tokens.colors.primary} !important;
        }
        .custom-input:focus {
          outline: none;
          border-color: ${tokens.colors.primary} !important;
        }
        .custom-select:hover {
          border-color: ${tokens.colors.primary} !important;
        }
        .custom-select:focus {
          outline: none;
          border-color: ${tokens.colors.primary} !important;
        }
        .delete-icon-btn {
          opacity: 0.5;
          background-color: rgba(255, 255, 255, 0.9);
          color: ${tokens.colors.onSurfaceVariant};
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        .delete-icon-btn:hover {
          opacity: 1;
          background-color: ${tokens.colors.error} !important;
          color: ${tokens.colors.onError} !important;
          transform: scale(1.1);
        }
        .delete-icon-btn:active {
          transform: scale(0.95);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        <div className="animate-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h2
              style={{
                ...tokens.typography.headlineSmall,
                color: tokens.colors.onSurface,
                margin: 0,
              }}
            >
              Projects
            </h2>
            <p
              style={{
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurfaceVariant,
                margin: 0,
              }}
            >
              Manage your field inspection projects
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.xs,
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.onPrimary,
              border: "none",
              borderRadius: tokens.radius.md,
              cursor: "pointer",
              ...tokens.typography.labelMedium,
            }}
          >
            <span className="material-icons" style={{ fontSize: "18px" }}>add</span>
             Create Project
          </button>
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
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${tokens.colors.primary}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.outlineVariant;
                  e.currentTarget.style.boxShadow = "none";
                }}
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
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: tokens.spacing.md,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.onSurface,
                  ...tokens.typography.bodyLarge,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${tokens.colors.primary}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.outlineVariant;
                  e.currentTarget.style.boxShadow = "none";
                }}
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
                  display: "flex",
                  alignItems: "center",
                  gap: tokens.spacing.sm,
                  padding: tokens.spacing.md,
                  marginBottom: tokens.spacing.md,
                  backgroundColor: tokens.colors.errorContainer,
                  color: tokens.colors.onErrorContainer,
                  borderRadius: tokens.radius.md,
                  ...tokens.typography.bodySmall,
                }}
              >
                <span className="material-icons" style={{ fontSize: "18px" }}>error</span>
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

{projectsLoading ? (
        <LoadingScreen message="Loading projects..." />
      ) : projectsError ? (
        <div style={{ padding: tokens.spacing.xl, textAlign: "center", color: tokens.colors.error }}>
          Failed to load projects.
        </div>
      ) : projects.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: tokens.spacing.md,
            padding: tokens.spacing.xxl,
            borderRadius: tokens.radius.lg,
            border: `1px solid ${tokens.colors.outlineVariant}`,
            backgroundColor: tokens.colors.surface,
            textAlign: "center",
          }}
        >
          <span className="material-icons"
            style={{
              color: tokens.colors.onSurfaceVariant,
              fontSize: "48px",
            }}
          >
            folder_off
          </span>
          <div>
            <p
              style={{
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.xs,
              }}
            >
              No projects yet
            </p>
            <p
              style={{
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurfaceVariant,
              }}
            >
              Create your first project to get started
            </p>
          </div>
         
        </div>
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
                border: `1px solid ${tokens.colors.outlineVariant}`,
                transition: "all 0.2s ease",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.primary;
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.outlineVariant;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ position: "relative" }}>
                <button
                  className="delete-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(project);
                  }}
                  disabled={deletingProjectId === project.id}
                  style={{
                    position: "absolute",
                    bottom: tokens.spacing.xs,
                    right: tokens.spacing.xs,
                    width: "32px",
                    height: "32px",
                    borderRadius: tokens.radius.sm,
                    zIndex: 10,
                  }}
                  title="Delete project"
                >
                  {deletingProjectId === project.id ? (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          border: `2px solid transparent`,
                          borderTop: `2px solid ${tokens.colors.primary}`,
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    </div>
                  ) : (
                    <span
                      className="material-icons"
                      style={{ fontSize: "18px" }}
                    >
                      delete
                    </span>
                  )}
                </button>

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
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => setShowDeleteModal(false)}
          />

          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              backgroundColor: tokens.colors.surface,
              boxShadow: tokens.elevation.level3,
              width: "100%",
              maxWidth: "320px",
              margin: tokens.spacing.lg,
              position: "relative",
            }}
          >
            <div className="p-lg">
              <h2
                style={{
                  ...tokens.typography.headlineSmall,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.sm,
                }}
              >
                Delete Project
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  marginBottom: tokens.spacing.lg,
                }}
              >
                Are you sure you want to delete {projectToDelete?.name}? This action
                cannot be undone.
              </p>

              <div className="flex justify-end gap-sm">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-md py-sm rounded-pill text-label-large transition-colors"
                  style={{
                    backgroundColor: tokens.colors.surface,
                    color: tokens.colors.primary,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={!!deletingProjectId}
                  className="px-md py-sm rounded-pill text-label-large transition-colors"
                  style={{
                    backgroundColor: tokens.colors.error,
                    color: tokens.colors.onError,
                    border: "none",
                    cursor: deletingProjectId ? "not-allowed" : "pointer",
                    opacity: deletingProjectId ? 0.7 : 1,
                  }}
                >
                  {deletingProjectId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}