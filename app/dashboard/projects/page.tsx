"use client";

import { useState, useEffect } from "react";
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
        maxWidth: "1000px",
      }}
    >
      <div
        style={{
          marginBottom: tokens.spacing.xl,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.onPrimary,
              border: "none",
              borderRadius: tokens.radius.md,
              cursor: "pointer",
              ...tokens.typography.labelLarge,
            }}
          >
            Create Project
          </button>
        )}
      </div>

      {showForm && (
        <div
          style={{
            marginBottom: tokens.spacing.lg,
            padding: tokens.spacing.lg,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
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
                  border: `1px solid ${tokens.colors.outline}`,
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.onSurface,
                  ...tokens.typography.bodyLarge,
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
                Link to Client <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: tokens.spacing.md,
                  border: `1px solid ${tokens.colors.outline}`,
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.onSurface,
                  ...tokens.typography.bodyLarge,
                }}
              >
                <option value="">No client linked</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}{client.company ? ` (${client.company})` : ""}
                  </option>
                ))}
              </select>
              <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.xs }}>
                To create a project for a new client,{" "}
                <a href="/dashboard/clients" style={{ color: tokens.colors.primary, textDecoration: "underline" }}>
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

            <div style={{ display: "flex", gap: tokens.spacing.md }}>
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
                }}
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
                  border: `1px solid ${tokens.colors.outline}`,
                  borderRadius: tokens.radius.md,
                  cursor: "pointer",
                  ...tokens.typography.labelLarge,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div
          style={{
            padding: tokens.spacing.xl,
            textAlign: "center",
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
          }}
        >
          Loading...
        </div>
      ) : projects.length === 0 ? (
        <div
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...tokens.typography.bodyLarge,
              color: tokens.colors.onSurfaceVariant,
            }}
          >
            No projects yet. Create your first project to get started.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: tokens.spacing.md,
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                padding: tokens.spacing.lg,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.elevation.level1,
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