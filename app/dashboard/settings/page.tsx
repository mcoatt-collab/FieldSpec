"use client";

import { useState, useEffect } from "react";
import { useDashboardUser } from "@/components/dashboard/DashboardUserProvider";
import { tokens } from "@/lib/design-tokens";
import { LoadingScreen } from "@/lib/components/loading";

interface ReportPreferences {
  includeConfidence: boolean;
  includeImages: boolean;
}

export default function SettingsPage() {
  const { user, loading: userLoading, setUser, logout } = useDashboardUser();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [reportAuthor, setReportAuthor] = useState("");
  const [reportCompany, setReportCompany] = useState("");
  const [reportSubtitle, setReportSubtitle] = useState("");
  const [preferences, setPreferences] = useState<ReportPreferences>({
    includeConfidence: true,
    includeImages: true,
  });
  const [initialValues, setInitialValues] = useState({
    name: "",
    companyName: "",
    reportAuthor: "",
    reportCompany: "",
    reportSubtitle: "",
    preferences: { includeConfidence: true, includeImages: true },
  });

  const hasChanges =
    name !== initialValues.name ||
    companyName !== initialValues.companyName ||
    reportAuthor !== initialValues.reportAuthor ||
    reportCompany !== initialValues.reportCompany ||
    reportSubtitle !== initialValues.reportSubtitle ||
    preferences.includeConfidence !== initialValues.preferences.includeConfidence ||
    preferences.includeImages !== initialValues.preferences.includeImages;

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setCompanyName(user.companyName || "");
    setReportAuthor(user.name || "");
    setReportCompany(user.companyName || "");
    setReportSubtitle(user.reportSubtitle || "");
    setPreferences({
      includeConfidence: user.includeConfidence ?? true,
      includeImages: user.includeImages ?? true,
    });
    setInitialValues({
      name: user.name || "",
      companyName: user.companyName || "",
      reportAuthor: user.name || "",
      reportCompany: user.companyName || "",
      reportSubtitle: user.reportSubtitle || "",
      preferences: {
        includeConfidence: user.includeConfidence ?? true,
        includeImages: user.includeImages ?? true,
      },
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges) return;

    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          companyName,
          reportAuthor,
          reportCompany,
          reportSubtitle,
          includeConfidence: preferences.includeConfidence,
          includeImages: preferences.includeImages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to save settings");
        setSaving(false);
        return;
      }

      setUser(data.data);
      setInitialValues({
        name,
        companyName,
        reportAuthor,
        reportCompany,
        reportSubtitle,
        preferences,
      });
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
  }

  if (userLoading) {
    return <LoadingScreen message="Loading settings..." />;
  }

  return (
    <div style={{ maxWidth: "1200px", padding: `0 ${tokens.spacing.md}` }}>
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
        .toggle-switch {
          position: relative;
          width: 52px;
          height: 28px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${tokens.colors.surfaceContainer};
          border-radius: 28px;
          border: 1px solid ${tokens.colors.outline};
          transition: 0.2s;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: ${tokens.colors.onSurfaceVariant};
          border-radius: 50%;
          transition: 0.2s;
        }
        .toggle-switch input:checked + .toggle-slider {
          background-color: ${tokens.colors.primaryContainer};
          border-color: ${tokens.colors.primary};
        }
        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(24px);
          background-color: ${tokens.colors.primary};
        }
        .settings-section {
          margin-bottom: ${tokens.spacing.xl};
        }
        .section-title {
          margin-bottom: ${tokens.spacing.md};
          padding-bottom: ${tokens.spacing.sm};
          border-bottom: 1px solid ${tokens.colors.outlineVariant};
        }
      `}</style>
      <div style={{ marginBottom: tokens.spacing.xl }}>
        <div className="animate-content">
          <h2 style={{ ...tokens.typography.headlineMedium, color: tokens.colors.onSurface }}>
            Settings
          </h2>
          <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.xs }}>
            Configure your profile and report preferences
          </p>
        </div>
      </div>

      <div
        style={{
          padding: tokens.spacing.xl,
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          border: `1px solid ${tokens.colors.outlineVariant}`,
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="settings-section">
            <h3 className="section-title" style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface }}>
              Profile
            </h3>
            <div style={{ display: "grid", gap: tokens.spacing.md }}>
              <div>
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

              <div>
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: tokens.spacing.xs,
                    ...tokens.typography.labelMedium,
                    color: tokens.colors.onSurfaceVariant,
                  }}
                >
                  Company <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
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
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title" style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface }}>
              Report Identity
            </h3>
            <div style={{ display: "grid", gap: tokens.spacing.md }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: tokens.spacing.xs,
                    ...tokens.typography.labelMedium,
                    color: tokens.colors.onSurface,
                  }}
                >
                  Report Author
                </label>
                <input
                  type="text"
                  value={reportAuthor}
                  onChange={(e) => setReportAuthor(e.target.value)}
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: tokens.spacing.xs,
                    ...tokens.typography.labelMedium,
                    color: tokens.colors.onSurfaceVariant,
                  }}
                >
                  Company on Report <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={reportCompany}
                  onChange={(e) => setReportCompany(e.target.value)}
                  placeholder="Uses profile company if empty"
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: tokens.spacing.xs,
                    ...tokens.typography.labelMedium,
                    color: tokens.colors.onSurfaceVariant,
                  }}
                >
                  Report Subtitle <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={reportSubtitle}
                  onChange={(e) => setReportSubtitle(e.target.value)}
                  placeholder="e.g., Professional Land Surveying Services"
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
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title" style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface }}>
              Report Preferences
            </h3>
            <div style={{ display: "grid", gap: tokens.spacing.md }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: tokens.spacing.md, backgroundColor: tokens.colors.surfaceContainer, borderRadius: tokens.radius.md }}>
                <div>
                  <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurface, margin: 0 }}>
                    Include Confidence Scores
                  </p>
                  <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, margin: 0 }}>
                    Show AI confidence percentage in reports
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.includeConfidence}
                    onChange={(e) => setPreferences({ ...preferences, includeConfidence: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: tokens.spacing.md, backgroundColor: tokens.colors.surfaceContainer, borderRadius: tokens.radius.md }}>
                <div>
                  <p style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurface, margin: 0 }}>
                    Include Images in Export
                  </p>
                  <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, margin: 0 }}>
                    Embed images in PDF report export
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.includeImages}
                    onChange={(e) => setPreferences({ ...preferences, includeImages: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title" style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface }}>
              Account
            </h3>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                backgroundColor: "transparent",
                color: tokens.colors.error,
                border: `1px solid ${tokens.colors.error}`,
                borderRadius: tokens.radius.md,
                cursor: "pointer",
                ...tokens.typography.labelLarge,
              }}
            >
              Logout
            </button>
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