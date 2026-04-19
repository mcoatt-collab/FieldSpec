"use client";

import { useState, useEffect, useCallback } from "react";
import { tokens } from "@/lib/design-tokens";

interface User {
  name: string;
  companyName?: string | null;
  email: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [initialValues, setInitialValues] = useState({ name: "", companyName: "" });

  const hasChanges = name !== initialValues.name || companyName !== initialValues.companyName;

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      if (res.ok && data.data) {
        setUser(data.data);
        setName(data.data.name || "");
        setCompanyName(data.data.companyName || "");
        setInitialValues({
          name: data.data.name || "",
          companyName: data.data.companyName || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges) return;

    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to save settings");
        setSaving(false);
        return;
      }

      setInitialValues({ name, companyName });
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
      <div style={{ maxWidth: "600px" }}>
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
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: tokens.spacing.xl }}>
        <h2
          style={{
            ...tokens.typography.headlineMedium,
            color: tokens.colors.onSurface,
          }}
        >
          Settings
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          Configure your account and preferences
        </p>
      </div>

      <div
        style={{
          padding: tokens.spacing.xl,
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
              Name <span style={{ color: tokens.colors.primary }}>*</span>
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
              Company Name <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
              Email <span style={{ color: tokens.colors.onSurfaceVariant }}>(read-only)</span>
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              disabled
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: tokens.spacing.md,
                border: `1px solid ${tokens.colors.outlineVariant}`,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.surfaceVariant,
                color: tokens.colors.onSurfaceVariant,
                ...tokens.typography.bodyLarge,
                cursor: "not-allowed",
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

          {success && (
            <div
              style={{
                padding: tokens.spacing.md,
                marginBottom: tokens.spacing.md,
                backgroundColor: tokens.colors.primaryContainer,
                color: tokens.colors.onPrimaryContainer,
                borderRadius: tokens.radius.md,
                ...tokens.typography.bodySmall,
              }}
            >
              Settings saved successfully
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !hasChanges}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
              backgroundColor: hasChanges ? tokens.colors.primary : tokens.colors.surfaceVariant,
              color: hasChanges ? tokens.colors.onPrimary : tokens.colors.onSurfaceVariant,
              border: "none",
              borderRadius: tokens.radius.md,
              cursor: saving || !hasChanges ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              ...tokens.typography.labelLarge,
              transition: "background-color 0.2s, color 0.2s",
            }}
          >
            {saving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}