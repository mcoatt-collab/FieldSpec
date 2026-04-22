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
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", company: "", contactInfo: "" });
  const [initialValues, setInitialValues] = useState({ name: "", company: "", contactInfo: "" });
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const hasChanges =
    formData.name !== initialValues.name ||
    formData.company !== initialValues.company ||
    formData.contactInfo !== initialValues.contactInfo;

  useEffect(() => {
    void fetchClient();
  }, [clientId]);

  async function fetchClient() {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setClient(data.data);
        setFormData({
          name: data.data.name || "",
          company: data.data.company || "",
          contactInfo: data.data.contactInfo || "",
        });
        setInitialValues({
          name: data.data.name || "",
          company: data.data.company || "",
          contactInfo: data.data.contactInfo || "",
        });
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges) return;

    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to save client");
        setSaving(false);
        return;
      }

      setClient(data.data);
      setInitialValues({
        name: data.data.name || "",
        company: data.data.company || "",
        contactInfo: data.data.contactInfo || "",
      });
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSaving(false);
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

  if (error || !client) {
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
    <div style={{ padding: tokens.spacing.lg, maxWidth: "800px" }}>
      <style>{`
        .custom-input {
          transition: all 0.2s ease;
        }
        .custom-input:hover {
          border-color: ${tokens.colors.outline} !important;
        }
        .custom-input:focus {
          outline: none;
          border-color: ${tokens.colors.primary} !important;
        }
      `}</style>

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
        <span className="material-icons" style={{ fontSize: "18px" }}>
          arrow_back
        </span>
        Back to Clients
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
          Client Details
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          View and edit client information
        </p>
      </div>

      <div
        style={{
          padding: tokens.spacing.xl,
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.elevation.level1,
          marginBottom: tokens.spacing.xl,
        }}
      >
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: tokens.spacing.md }}>
            <label
              style={{
                display: "block",
                marginBottom: tokens.spacing.xs,
                ...tokens.typography.labelMedium,
                color: tokens.colors.onSurface,
              }}
            >
              Name <span style={{ color: tokens.colors.primary }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="custom-input"
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
              Company{" "}
              <span style={{ color: tokens.colors.onSurfaceVariant }}>
                (optional)
              </span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Company name"
              className="custom-input"
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

          <div style={{ marginBottom: tokens.spacing.lg }}>
            <label
              style={{
                display: "block",
                marginBottom: tokens.spacing.xs,
                ...tokens.typography.labelMedium,
                color: tokens.colors.onSurfaceVariant,
              }}
            >
              Contact Info{" "}
              <span style={{ color: tokens.colors.onSurfaceVariant }}>
                (optional)
              </span>
            </label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              placeholder="Email or phone"
              className="custom-input"
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

          <div style={{ display: "flex", gap: tokens.spacing.md, alignItems: "center" }}>
            <button
              type="submit"
              disabled={saving || !hasChanges}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                backgroundColor: success
                  ? tokens.colors.tertiary
                  : saving
                  ? tokens.colors.surfaceVariant
                  : hasChanges
                  ? tokens.colors.primary
                  : tokens.colors.surfaceVariant,
                color: success
                  ? tokens.colors.onTertiary
                  : saving
                  ? tokens.colors.onSurfaceVariant
                  : hasChanges
                  ? tokens.colors.onPrimary
                  : tokens.colors.onSurfaceVariant,
                border: "none",
                borderRadius: tokens.radius.md,
                cursor: saving || !hasChanges ? "not-allowed" : "pointer",
                opacity: saving || !hasChanges ? 0.7 : 1,
                ...tokens.typography.labelLarge,
              }}
            >
              {saving
                ? "Saving..."
                : success
                ? "Saved!"
                : "Save Changes"}
            </button>
            {success && (
              <span
                style={{
                  color: tokens.colors.tertiary,
                  ...tokens.typography.bodySmall,
                }}
              >
                Client updated successfully
              </span>
            )}
          </div>
        </form>
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
            Created
          </label>
          <p
            style={{
              ...tokens.typography.bodyMedium,
              color: tokens.colors.onSurface,
            }}
          >
            {new Date(client.createdAt).toLocaleDateString()}
          </p>
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
            Projects
          </label>
          <p
            style={{
              ...tokens.typography.headlineSmall,
              color: tokens.colors.onSurface,
            }}
          >
            {client.projects.length}
          </p>
        </div>
      </div>

      <div>
        <h3
          style={{
            ...tokens.typography.titleLarge,
            color: tokens.colors.onSurface,
            marginBottom: tokens.spacing.lg,
          }}
        >
          Projects
        </h3>

        {client.projects.length === 0 ? (
          <div
            style={{
              padding: tokens.spacing.xl,
              backgroundColor: tokens.colors.surfaceVariant,
              borderRadius: tokens.radius.lg,
              textAlign: "center",
            }}
          >
            <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
              No projects linked to this client yet.
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
            {client.projects.map((project) => (
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: tokens.spacing.sm,
                  }}
                >
                  <h4
                    style={{
                      ...tokens.typography.titleMedium,
                      color: tokens.colors.onSurface,
                    }}
                  >
                    {project.name}
                  </h4>
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
                      ...tokens.typography.labelSmall,
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: tokens.spacing.lg }}>
                  <div>
                    <label
                      style={{
                        ...tokens.typography.labelSmall,
                        color: tokens.colors.onSurfaceVariant,
                      }}
                    >
                      Photos
                    </label>
                    <p
                      style={{
                        ...tokens.typography.bodyMedium,
                        color: tokens.colors.onSurface,
                      }}
                    >
                      {project.photoCount}
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        ...tokens.typography.labelSmall,
                        color: tokens.colors.onSurfaceVariant,
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}