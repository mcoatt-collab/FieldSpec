"use client";

import { useState, useEffect, useRef } from "react";
import { tokens } from "@/lib/design-tokens";

interface Project {
  id: string;
  name: string;
}

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

const CATEGORY_OPTIONS = CATEGORIES.filter(c => c.value !== "all" && c.value !== "untagged");

export default function UploadPage() {
  const [projects, setProjects] = useState<Project[]>([]);
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

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchImages();
    }
  }, [selectedProjectId]);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok && data.data) {
        setProjects(data.data);
        if (data.data.length > 0) {
          setSelectedProjectId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchImages() {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`/api/images?projectId=${selectedProjectId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setImages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const file = files[0];
      const fileType = file.type;

      console.log("[Upload] Requesting signed URL for:", file.name, fileType);

      const signedRes = await fetch("/api/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, fileType }),
      });

      const signedData = await signedRes.json();
      console.log("[Upload] Signed URL response:", signedData);

      if (!signedRes.ok || !signedData.data) {
        setError(signedData.error?.message || "Failed to get upload config");
        setUploading(false);
        return;
      }

      const { cloudName, uploadPreset, folder } = signedData.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      if (folder) {
        formData.append("folder", folder);
      }

      console.log("[Upload] Uploading to Cloudinary:", cloudName, "with preset:", uploadPreset);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();
      console.log("[Upload] Cloudinary response:", cloudinaryData);

      if (!cloudinaryRes.ok || cloudinaryData.error) {
        setError(cloudinaryData.error?.message || "Upload failed");
        setUploading(false);
        return;
      }

      const imageUrl = cloudinaryData.secure_url;
      const thumbnailUrl = cloudinaryData.eager?.[0]?.secure_url || imageUrl;

      const saveRes = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          imageUrl,
          thumbnailUrl,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.data) {
        setError(saveData.error?.message || "Failed to save image");
        setUploading(false);
        return;
      }

      setImages([saveData.data, ...images]);
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
      setImages(images.map(img => img.id === imageId ? data.data : img));
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
      setImages(images.map(img => img.id === editingImage.id ? data.data : img));
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

      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      setError("Failed to delete image. Please try again.");
    } finally {
      setDeletingImageId(null);
    }
  }

  const filteredImages = images.filter(img => {
    if (filter === "all") return true;
    if (filter === "untagged") return !img.category || img.category === "general";
    return img.category === filter;
  });

  const getCategoryLabel = (category: string | null) => {
    if (!category || category === "general") return "Untagged";
    const cat = CATEGORY_OPTIONS.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category: string | null) => {
    if (!category || category === "general") return tokens.colors.surfaceVariant;
    return tokens.colors.primaryContainer;
  };

  if (loading) {
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
      }}
    >
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
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                border: `1px solid ${tokens.colors.outline}`,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.onSurface,
                ...tokens.typography.bodyLarge,
                minWidth: "200px",
                boxSizing: "border-box",
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
            style={{
              display: "block",
              padding: tokens.spacing.xl,
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.radius.lg,
              boxShadow: tokens.elevation.level1,
              textAlign: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1,
              border: `2px dashed ${tokens.colors.outline}`,
              marginBottom: tokens.spacing.lg,
            }}
          >
            <p
              style={{
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurfaceVariant,
              }}
            >
              {uploading
                ? "Uploading..."
                : "Click to select images or drag and drop"}
            </p>
          </label>

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
                style={{
                  padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
                  backgroundColor: filter === cat.value ? tokens.colors.primary : tokens.colors.surface,
                  color: filter === cat.value ? tokens.colors.onPrimary : tokens.colors.onSurface,
                  border: `1px solid ${tokens.colors.outline}`,
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
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  style={{
                    borderRadius: tokens.radius.lg,
                    overflow: "hidden",
                    boxShadow: tokens.elevation.level1,
                    backgroundColor: tokens.colors.surface,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={image.thumbnailUrl}
                      alt="Uploaded"
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {image.notes && (
                      <div
                        style={{
                          position: "absolute",
                          top: tokens.spacing.xs,
                          right: tokens.spacing.xs,
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: tokens.colors.tertiary,
                          color: tokens.colors.onTertiary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                        title="Has notes"
                      >
                        📝
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
                      onChange={(e) => handleCategoryChange(image.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                        border: `1px solid ${tokens.colors.outline}`,
                        borderRadius: tokens.radius.sm,
                        backgroundColor: getCategoryColor(image.category),
                        color: tokens.colors.onSurface,
                        ...tokens.typography.labelSmall,
                        boxSizing: "border-box",
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
                      style={{
                        marginTop: tokens.spacing.xs,
                        width: "100%",
                        padding: tokens.spacing.xs,
                        backgroundColor: "transparent",
                        border: `1px solid ${tokens.colors.outline}`,
                        borderRadius: tokens.radius.sm,
                        color: tokens.colors.onSurfaceVariant,
                        cursor: "pointer",
                        ...tokens.typography.labelSmall,
                      }}
                    >
                      {image.notes ? "Edit Note" : "Add Note"}
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deletingImageId === image.id}
                      style={{
                        marginTop: tokens.spacing.xs,
                        width: "100%",
                        padding: tokens.spacing.xs,
                        backgroundColor: tokens.colors.errorContainer,
                        border: "none",
                        borderRadius: tokens.radius.sm,
                        color: tokens.colors.onErrorContainer,
                        cursor: deletingImageId === image.id ? "not-allowed" : "pointer",
                        opacity: deletingImageId === image.id ? 0.7 : 1,
                        ...tokens.typography.labelSmall,
                      }}
                    >
                      {deletingImageId === image.id ? "Deleting..." : "Delete Image"}
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
              onChange={(e) => setEditingImage({ ...editingImage, notes: e.target.value })}
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
                  backgroundColor: saveSuccess ? tokens.colors.tertiary : tokens.colors.primary,
                  color: saveSuccess ? tokens.colors.onTertiary : tokens.colors.onPrimary,
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