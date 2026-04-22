"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

interface Client {
  id: string;
  name: string;
  company: string | null;
  contactInfo: string | null;
  projectCount: number;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", company: "", contactInfo: "" });
  const router = useRouter();

  useEffect(() => {
    void fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (res.ok && data.data) {
        setClients(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to create client");
        setCreating(false);
        return;
      }

      setFormData({ name: "", company: "", contactInfo: "" });
      setShowCreateForm(false);
      void fetchClients();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function handleDeleteClick(client: Client) {
    setClientToDelete(client);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!clientToDelete) return;

    setDeletingClientId(clientToDelete.id);
    setError("");

    try {
      const res = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || "Failed to delete client");
        setShowDeleteModal(false);
        setClientToDelete(null);
        return;
      }

      setClients((currentClients) =>
        currentClients.filter((c) => c.id !== clientToDelete.id)
      );
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (err) {
      setError("Failed to delete client. Please try again.");
    } finally {
      setDeletingClientId(null);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "1200px" }}>
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

  return (
    <div style={{ maxWidth: "1200px" }}>
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
        .action-btn {
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          background-color: ${tokens.colors.surfaceVariant} !important;
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
        .animate-content {
          animation: slideUpFade 0.4s ease-out forwards;
        }
        .client-card {
          transition: all 0.2s ease;
        }
        .client-card:hover {
          box-shadow: ${tokens.elevation.level2} !important;
        }
      `}</style>

      <div
        className="animate-content"
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
          Clients
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          Manage your clients and their projects
        </p>
      </div>

      <div
        className="animate-content"
        style={{
          marginBottom: tokens.spacing.lg,
        }}
      >
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.onPrimary,
            border: "none",
            borderRadius: tokens.radius.md,
            cursor: "pointer",
            ...tokens.typography.labelLarge,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              tokens.colors.primaryContainer;
            e.currentTarget.style.color = tokens.colors.onPrimaryContainer;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.primary;
            e.currentTarget.style.color = tokens.colors.onPrimary;
          }}
        >
          Create Client
        </button>
      </div>

      {error && (
        <div
          className="animate-content"
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

      {showCreateForm && (
        <div
          className="animate-content"
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
            marginBottom: tokens.spacing.lg,
          }}
        >
          <h3
            style={{
              ...tokens.typography.titleMedium,
              color: tokens.colors.onSurface,
              marginBottom: tokens.spacing.lg,
            }}
          >
            Create New Client
          </h3>
          <form onSubmit={handleCreateClient}>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Client or company name"
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

            <div style={{ display: "flex", gap: tokens.spacing.md }}>
              <button
                type="submit"
                disabled={creating}
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  backgroundColor: creating
                    ? tokens.colors.surfaceVariant
                    : tokens.colors.primary,
                  color: creating
                    ? tokens.colors.onSurfaceVariant
                    : tokens.colors.onPrimary,
                  border: "none",
                  borderRadius: tokens.radius.md,
                  cursor: creating ? "not-allowed" : "pointer",
                  opacity: creating ? 0.7 : 1,
                  ...tokens.typography.labelLarge,
                }}
              >
                {creating ? "Creating..." : "Create Client"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ name: "", company: "", contactInfo: "" });
                  setError("");
                }}
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  backgroundColor: "transparent",
                  color: tokens.colors.onSurfaceVariant,
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

      {clients.length === 0 && !showCreateForm ? (
        <div
          className="animate-content"
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...tokens.typography.bodyLarge,
              color: tokens.colors.onSurfaceVariant,
              marginBottom: tokens.spacing.md,
            }}
          >
            No clients yet
          </p>
          <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
            Create your first client to start organizing your projects.
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
          {clients.map((client, index) => (
            <div
              key={client.id}
              className="client-card"
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              style={{
                padding: tokens.spacing.lg,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.elevation.level1,
                cursor: "pointer",
                position: "relative",
                animation: `slideUpFade 0.4s ease-out forwards ${index * 0.05}s`,
                opacity: 0,
              }}
            >
              <div style={{ position: "relative" }}>
                <button
                  className="delete-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(client);
                  }}
                  disabled={deletingClientId === client.id}
                  style={{
                    position: "absolute",
                    bottom: tokens.spacing.xs,
                    right: tokens.spacing.xs,
                    width: "32px",
                    height: "32px",
                    borderRadius: tokens.radius.sm,
                    zIndex: 10,
                  }}
                  title="Delete client"
                >
                  <span
                    className="material-icons"
                    style={{ fontSize: "18px" }}
                  >
                    {deletingClientId === client.id
                      ? "hourglass_empty"
                      : "delete"}
                  </span>
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: tokens.spacing.sm,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        ...tokens.typography.titleMedium,
                        color: tokens.colors.onSurface,
                        marginBottom: tokens.spacing.xs,
                      }}
                    >
                      {client.name}
                    </h3>
                    {client.company && (
                      <p
                        style={{
                          ...tokens.typography.bodySmall,
                          color: tokens.colors.onSurfaceVariant,
                        }}
                      >
                        {client.company}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                      backgroundColor: tokens.colors.primaryContainer,
                      color: tokens.colors.onPrimaryContainer,
                      borderRadius: tokens.radius.pill,
                      ...tokens.typography.labelSmall,
                    }}
                  >
                    {client.projectCount}{" "}
                    {client.projectCount === 1 ? "project" : "projects"}
                  </span>
                </div>
                {client.contactInfo && (
                  <p
                    style={{
                      ...tokens.typography.bodySmall,
                      color: tokens.colors.onSurfaceVariant,
                      marginTop: tokens.spacing.sm,
                    }}
                  >
                    {client.contactInfo}
                  </p>
                )}
                <p
                  style={{
                    ...tokens.typography.labelSmall,
                    color: tokens.colors.onSurfaceVariant,
                    marginTop: tokens.spacing.md,
                  }}
                >
                  Created {new Date(client.createdAt).toLocaleDateString()}
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
                Delete Client
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  marginBottom: tokens.spacing.lg,
                }}
              >
                Are you sure you want to delete {clientToDelete?.name}? This action
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
                  disabled={!!deletingClientId}
                  className="px-md py-sm rounded-pill text-label-large transition-colors"
                  style={{
                    backgroundColor: tokens.colors.error,
                    color: tokens.colors.onError,
                    border: "none",
                    cursor: deletingClientId ? "not-allowed" : "pointer",
                    opacity: deletingClientId ? 0.7 : 1,
                  }}
                >
                  {deletingClientId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}