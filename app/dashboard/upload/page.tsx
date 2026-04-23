"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { tokens } from "@/lib/design-tokens";
import { useProjectsStore } from "@/store/useProjectsStore";

interface ImageType {
  id: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  notes: string | null;
  createdAt: string;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
  { value: "untagged", label: "Untagged" },
];

const CATEGORY_OPTIONS = CATEGORIES.filter(
  (c) => c.value !== "all" && c.value !== "untagged",
);

export default function UploadPage() {
  const { projects, loading: projectsLoading, fetchProjects } = useProjectsStore();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialProjectLoadedRef = useRef(false);

  const fetchImages = useCallback(async (projectId: string) => {
    try {
      const res = await fetch(`/api/images?projectId=${projectId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setImages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    await fetchProjects();
    setLoading(false);
  }, [fetchProjects]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      const firstProjectId = projects[0].id;
      initialProjectLoadedRef.current = true;
      setSelectedProjectId(firstProjectId);
      void fetchImages(firstProjectId);
    }
  }, [projects, selectedProjectId, fetchImages]);

  useEffect(() => {
    if (!selectedProjectId) return;

    if (initialProjectLoadedRef.current) {
      initialProjectLoadedRef.current = false;
      return;
    }

    void fetchImages(selectedProjectId);
  }, [selectedProjectId, fetchImages]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", selectedProjectId);

      const uploadRes = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const saveData = await uploadRes.json();

      if (!uploadRes.ok || !saveData.data) {
        setError(saveData.error?.message || "Upload failed");
        return;
      }

      setImages((currentImages) => [saveData.data, ...currentImages]);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleCategoryChange(imageId: string, category: string) {
    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (!res.ok) {
        setError("Failed to update category");
        return;
      }

      const data = await res.json();
      setImages((currentImages) =>
        currentImages.map((img) => (img.id === imageId ? data.data : img))
      );
    } catch (err) {
      setError("Failed to update category");
    }
  }

  async function handleSaveNotes() {
    if (!editingImage) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/images/${editingImage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editingImage.notes || "" }),
      });

      if (!res.ok) {
        setError("Failed to save notes");
        setSaving(false);
        return;
      }

      const data = await res.json();
      setImages((currentImages) =>
        currentImages.map((img) =>
          img.id === editingImage.id ? data.data : img,
        ),
      );
      setSaveSuccess(true);
      setTimeout(() => {
        setEditingImage(null);
        setSaveSuccess(false);
      }, 1000);
    } catch (err) {
      setError("Failed to save notes");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeletingImageId(imageId);
    setError("");

    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || "Failed to delete image");
        return;
      }

      setImages((currentImages) =>
        currentImages.filter((img) => img.id !== imageId),
      );
    } catch (err) {
      setError("Failed to delete image. Please try again.");
    } finally {
      setDeletingImageId(null);
    }
  }

  const filteredImages = images.filter((img) => {
    if (filter === "all") return true;
    if (filter === "untagged")
      return !img.category || img.category === "general";
    return img.category === filter;
  });

  const getCategoryLabel = (category: string | null) => {
    if (!category || category === "general") return "Untagged";
    const cat = CATEGORY_OPTIONS.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category: string | null) => {
    if (!category || category === "general")
      return tokens.colors.surfaceVariant;
    return tokens.colors.primaryContainer;
  };

  if (loading || projectsLoading) {
    return (
      <div
        style={{
          maxWidth: "1200px",
        }}
      >
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
    <div
      style={{
        maxWidth: "1200px",
        padding: `0 ${tokens.spacing.md}`,
      }}
    >
      <style>{`
        .custom-select {
          transition: all 0.2s ease;
          max-width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .custom-select {
            font-size: 14px !important;
            padding-right: 28px !important;
            height: 44px;
          }
          .project-select-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .project-select-container select {
            width: 100% !important;
          }
        }
        .custom-select:hover {
          background-color: ${tokens.colors.surfaceContainerLow} !important;
          border-color: ${tokens.colors.outline} !important;
        }
        .filter-btn {
          transition: all 0.2s ease;
        }
        .filter-btn:hover {
          background-color: ${tokens.colors.primaryContainer} !important;
          color: ${tokens.colors.onPrimaryContainer} !important;
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
          Upload & Manage
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          Upload and organize field inspection images
        </p>
      </div>

      {projects.length === 0 ? (
        <div
          className="animate-content"
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
            No projects. Create a project first to upload images.
          </p>
        </div>
      ) : (
        <>
          <div
            className="animate-content project-select-container"
            style={{
              marginBottom: tokens.spacing.lg,
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.md,
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                ...tokens.typography.labelLarge,
                color: tokens.colors.onSurface,
              }}
            >
              Project:
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="custom-select"
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.xl} ${tokens.spacing.sm} ${tokens.spacing.sm}`,
                border: `1px solid ${tokens.colors.outlineVariant}`,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.onSurface,
                ...tokens.typography.bodyLarge,
                boxSizing: "border-box",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `right ${tokens.spacing.sm} center`,
                backgroundSize: "16px",
                cursor: "pointer",
              }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: "none" }}
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            className="animate-content"
            style={{
              display: "block",
              padding: `${tokens.spacing.xxl} ${tokens.spacing.xl}`,
              backgroundColor: "var(--ref-primary-primary95)",
              borderRadius: tokens.radius.lg,
              textAlign: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.6 : 1,
              border: `2px dashed var(--ref-neutral-variant-neutral-variant90)`,
              marginBottom: tokens.spacing.xl,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!uploading) {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor =
                  "var(--ref-primary-primary90)";
                (e.currentTarget as HTMLLabelElement).style.borderColor =
                  "var(--ref-primary-primary80)";
              }
            }}
            onMouseLeave={(e) => {
              if (!uploading) {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor =
                  "var(--ref-primary-primary95)";
                (e.currentTarget as HTMLLabelElement).style.borderColor =
                  "var(--ref-neutral-variant-neutral-variant90)";
              }
            }}
          >
            {/* Upload Icon */}
            <svg
              style={{
                width: "48px",
                height: "48px",
                marginBottom: tokens.spacing.md,
                fill: "var(--ref-primary-primary40)",
              }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>

            {/* Main Text */}
            <p
              style={{
                ...tokens.typography.titleLarge,
                color: "var(--ref-primary-primary40)",
                margin: 0,
                marginBottom: tokens.spacing.xs,
              }}
            >
              {uploading ? "Optimizing & uploading..." : "Drop your image here, or browse"}
            </p>

            {/* Support Text */}
            <p
              style={{
                ...tokens.typography.bodySmall,
                color: "var(--ref-neutral-variant-neutral-variant40)",
                opacity: 0.8,
                margin: 0,
              }}
            >
              Supports: PNG, JPG, JPEG, WEBP. Large images are optimized automatically.
            </p>
          </label>

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

          <div
            className="animate-content"
            style={{
              marginBottom: tokens.spacing.lg,
              display: "flex",
              gap: tokens.spacing.sm,
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={filter === cat.value ? "" : "filter-btn"}
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                  backgroundColor:
                    filter === cat.value
                      ? tokens.colors.primary
                      : tokens.colors.surface,
                  color:
                    filter === cat.value
                      ? tokens.colors.onPrimary
                      : tokens.colors.onSurface,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  borderRadius: tokens.radius.md,
                  cursor: "pointer",
                  ...tokens.typography.labelMedium,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filteredImages.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: tokens.spacing.md,
              }}
            >
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  style={{
                    borderRadius: tokens.radius.lg,
                    overflow: "hidden",
                    backgroundColor: tokens.colors.surface,
                    border: `1px solid ${tokens.colors.outlineVariant}`,
                    transition: "all 0.2s ease",
                    animation: `slideUpFade 0.4s ease-out forwards ${index * 0.05}s`,
                    opacity: 0,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={image.thumbnailUrl}
                      alt="Uploaded"
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {/* Delete Icon - Top Left */}
                    <button
                      className="delete-icon-btn"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deletingImageId === image.id}
                      style={{
                        position: "absolute",
                        top: tokens.spacing.xs,
                        left: tokens.spacing.xs,
                        width: "32px",
                        height: "32px",
                        borderRadius: tokens.radius.sm,
                        zIndex: 10,
                      }}
                      title="Delete image"
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: "18px" }}
                      >
                        {deletingImageId === image.id
                          ? "hourglass_empty"
                          : "delete"}
                      </span>
                    </button>

                    {image.notes && (
                      <div
                        style={{
                          position: "absolute",
                          top: tokens.spacing.xs,
                          right: tokens.spacing.xs,
                          width: "32px",
                          height: "32px",
                          borderRadius: tokens.radius.sm,
                          backgroundColor: tokens.colors.tertiary,
                          color: tokens.colors.onTertiary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        title="Has notes"
                      >
                        <span
                          className="material-icons"
                          style={{ fontSize: "18px" }}
                        >
                          sticky_note_2
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: tokens.spacing.sm,
                    }}
                  >
                    <select
                      value={image.category || "general"}
                      onChange={(e) =>
                        handleCategoryChange(image.id, e.target.value)
                      }
                      className="custom-select"
                      style={{
                        width: "100%",
                        padding: `${tokens.spacing.sm} ${tokens.spacing.xl} ${tokens.spacing.sm} ${tokens.spacing.sm}`,
                        border: `1px solid ${tokens.colors.outlineVariant}`,
                        borderRadius: tokens.radius.sm,
                        backgroundColor: getCategoryColor(image.category),
                        color: tokens.colors.onSurface,
                        ...tokens.typography.labelSmall,
                        boxSizing: "border-box",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `right ${tokens.spacing.sm} center`,
                        backgroundSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setEditingImage(image)}
                      className="action-btn"
                      style={{
                        marginTop: tokens.spacing.xs,
                        width: "100%",
                        padding: tokens.spacing.xs,
                        backgroundColor: "transparent",
                        border: `1px solid ${tokens.colors.outlineVariant}`,
                        borderRadius: tokens.radius.sm,
                        color: tokens.colors.onSurfaceVariant,
                        cursor: "pointer",
                        ...tokens.typography.labelSmall,
                      }}
                    >
                      {image.notes ? "Edit Note" : "Add Note"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: tokens.spacing.xl,
                textAlign: "center",
                backgroundColor: tokens.colors.surfaceVariant,
                borderRadius: tokens.radius.lg,
              }}
            >
              <p
                style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                }}
              >
                No images found for this filter.
              </p>
            </div>
          )}
        </>
      )}

      {editingImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditingImage(null)}
        >
          <div
            style={{
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.radius.lg,
              padding: tokens.spacing.xl,
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                ...tokens.typography.titleLarge,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}
            >
              {editingImage.notes ? "Edit Note" : "Add Note"}
            </h3>
            <textarea
              value={editingImage.notes || ""}
              onChange={(e) =>
                setEditingImage({ ...editingImage, notes: e.target.value })
              }
              placeholder="Add notes about this image..."
              maxLength={500}
              style={{
                width: "100%",
                height: "120px",
                padding: tokens.spacing.md,
                border: `1px solid ${tokens.colors.outline}`,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.onSurface,
                ...tokens.typography.bodyMedium,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
            <p
              style={{
                ...tokens.typography.labelSmall,
                color: tokens.colors.onSurfaceVariant,
                marginTop: tokens.spacing.xs,
                textAlign: "right",
              }}
            >
              {(editingImage.notes || "").length}/500
            </p>
            {error && (
              <div
                style={{
                  padding: tokens.spacing.sm,
                  marginBottom: tokens.spacing.sm,
                  backgroundColor: tokens.colors.errorContainer,
                  color: tokens.colors.onErrorContainer,
                  borderRadius: tokens.radius.sm,
                  ...tokens.typography.bodySmall,
                }}
              >
                {error}
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: tokens.spacing.md,
                marginTop: tokens.spacing.md,
              }}
            >
              <button
                onClick={() => setEditingImage(null)}
                style={{
                  flex: 1,
                  padding: tokens.spacing.md,
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.onSurface,
                  border: `1px solid ${tokens.colors.outline}`,
                  borderRadius: tokens.radius.md,
                  cursor: "pointer",
                  ...tokens.typography.labelLarge,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: tokens.spacing.md,
                  backgroundColor: saveSuccess
                    ? tokens.colors.tertiary
                    : tokens.colors.primary,
                  color: saveSuccess
                    ? tokens.colors.onTertiary
                    : tokens.colors.onPrimary,
                  border: "none",
                  borderRadius: tokens.radius.md,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  ...tokens.typography.labelLarge,
                }}
              >
                {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
