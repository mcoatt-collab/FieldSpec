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
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", company: "", contactInfo: "" });
  const router = useRouter();

  useEffect(() => {
    fetchClients();
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
      fetchClients();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "1200px" }}>
        <div style={{ padding: tokens.spacing.xl, textAlign: "center", color: tokens.colors.onSurfaceVariant, ...tokens.typography.bodyLarge }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: tokens.spacing.xl, flexWrap: "wrap", gap: tokens.spacing.md }}>
        <div>
          <h2 style={{ ...tokens.typography.headlineMedium, color: tokens.colors.onSurface }}>
            Clients
          </h2>
          <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.xs }}>
            Manage your clients and their projects
          </p>
        </div>
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
          }}
        >
          Create Client
        </button>
      </div>

      {error && (
        <div style={{ padding: tokens.spacing.md, marginBottom: tokens.spacing.md, backgroundColor: tokens.colors.errorContainer, color: tokens.colors.onErrorContainer, borderRadius: tokens.radius.md, ...tokens.typography.bodySmall }}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <div style={{ padding: tokens.spacing.xl, backgroundColor: tokens.colors.surface, borderRadius: tokens.radius.lg, boxShadow: tokens.elevation.level1, marginBottom: tokens.spacing.lg }}>
          <h3 style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface, marginBottom: tokens.spacing.lg }}>
            Create New Client
          </h3>
          <form onSubmit={handleCreateClient}>
            <div style={{ marginBottom: tokens.spacing.md }}>
              <label style={{ display: "block", marginBottom: tokens.spacing.xs, ...tokens.typography.labelMedium, color: tokens.colors.onSurface }}>
                Name <span style={{ color: tokens.colors.primary }}>*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Client or company name"
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
              <label style={{ display: "block", marginBottom: tokens.spacing.xs, ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                Company <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
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
              <label style={{ display: "block", marginBottom: tokens.spacing.xs, ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                Contact Info <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
              </label>
              <input
                type="text"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Email or phone"
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
                  backgroundColor: creating ? tokens.colors.surfaceVariant : tokens.colors.primary,
                  color: creating ? tokens.colors.onSurfaceVariant : tokens.colors.onPrimary,
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
        <div style={{ padding: tokens.spacing.xl, backgroundColor: tokens.colors.surface, borderRadius: tokens.radius.lg, textAlign: "center" }}>
          <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant, marginBottom: tokens.spacing.md }}>
            No clients yet
          </p>
          <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
            Create your first client to start organizing your projects.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: tokens.spacing.md }}>
          {clients.map(client => (
            <div
              key={client.id}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              style={{
                padding: tokens.spacing.lg,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.elevation.level1,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = tokens.elevation.level2;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = tokens.elevation.level1;
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: tokens.spacing.sm }}>
                <div>
                  <h3 style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface, marginBottom: tokens.spacing.xs }}>
                    {client.name}
                  </h3>
                  {client.company && (
                    <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>
                      {client.company}
                    </p>
                  )}
                </div>
                <span style={{
                  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                  backgroundColor: tokens.colors.primaryContainer,
                  color: tokens.colors.onPrimaryContainer,
                  borderRadius: tokens.radius.pill,
                  ...tokens.typography.labelSmall,
                }}>
                  {client.projectCount} {client.projectCount === 1 ? "project" : "projects"}
                </span>
              </div>
              {client.contactInfo && (
                <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.sm }}>
                  {client.contactInfo}
                </p>
              )}
              <p style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.md }}>
                Created {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
