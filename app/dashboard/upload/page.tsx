"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

import { useProjectsStore } from "@/store/useProjectsStore";
import { UploadZone } from "@/components/dashboard/upload/UploadZone";
import {
  UploadQueue,
  UploadItem,
} from "@/components/dashboard/upload/UploadQueue";
import { FilterBar } from "@/components/dashboard/upload/FilterBar";
import { BulkActionBar } from "@/components/dashboard/upload/BulkActionBar";
import { ImageCard } from "@/components/dashboard/upload/ImageCard";
import { StatusType } from "@/components/dashboard/upload/StatusBadge";
import { LoadingScreen } from "@/lib/components/loading";

interface ImageType {
  id: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  notes: string | null;
  createdAt: string;
  status?: StatusType;
}

export default function UploadPage() {
  const router = useRouter();
  const {
    projects,
    loading: projectsLoading,
    fetchProjects,
  } = useProjectsStore();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set(),
  );
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchImages = useCallback(async (projectId: string) => {
    try {
      const res = await fetch(`/api/images?projectId=${projectId}`);
      const data = await res.json();

      if (res.ok && data.data) {
        setImages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
      setError("Failed to load images");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
      setLoading(false);
    };

    loadData();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchImages(selectedProjectId);
      setSelectedImageIds(new Set());
    }
  }, [selectedProjectId, fetchImages]);

  const handleUpload = async (files: FileList) => {
    if (!selectedProjectId) {
      setError("Please create a project first before uploading images.");
      return;
    }

    setIsUploading(true);
    setError("");

    const newItems: UploadItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2, 11),
      name: file.name,
      progress: 0,
      status: "pending",
    }));

    setUploadQueue((prev) => [...newItems, ...prev]);

    for (const item of newItems) {
      setUploadQueue((prev) =>
        prev.map((queueItem) =>
          queueItem.id === item.id
            ? { ...queueItem, status: "uploading" }
            : queueItem,
        ),
      );
    }

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const itemId = newItems[index].id;

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", selectedProjectId);

        const progressInterval = setInterval(() => {
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === itemId && item.progress < 90
                ? { ...item, progress: item.progress + 10, status: "uploading" }
                : item,
            ),
          );
        }, 200);

        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        const data = await res.json();

        if (res.ok && data.data) {
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === itemId
                ? { ...item, progress: 100, status: "completed" }
                : item,
            ),
          );
          setImages((prev) => [data.data, ...prev]);
        } else {
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === itemId ? { ...item, status: "failed" } : item,
            ),
          );
        }
      } catch (err) {
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, status: "failed" } : item,
          ),
        );
      }
    }

    setIsUploading(false);
  };

  const handleRemoveUploadItem = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCompletedUploads = () => {
    setUploadQueue((prev) => prev.filter((item) => item.status !== "completed"));
  };

  const handleSelectImage = (id: string, selected: boolean) => {
    setSelectedImageIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedImageIds.size === filteredAndSortedImages.length) {
      setSelectedImageIds(new Set());
    } else {
      setSelectedImageIds(
        new Set(filteredAndSortedImages.map((image) => image.id)),
      );
    }
  };

  const handleCategoryChange = async (imageId: string, category: string) => {
    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (res.ok) {
        const data = await res.json();
        setImages((prev) =>
          prev.map((image) => (image.id === imageId ? data.data : image)),
        );
      }
    } catch (err) {
      setError("Failed to update category");
    }
  };

  const handleSaveNotes = async () => {
    if (!editingImage) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/images/${editingImage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editingImage.notes || "" }),
      });

      if (res.ok) {
        const data = await res.json();
        setImages((prev) =>
          prev.map((image) =>
            image.id === editingImage.id ? data.data : image,
          ),
        );
        setSaveSuccess(true);

        setTimeout(() => {
          setEditingImage(null);
          setSaveSuccess(false);
        }, 1000);
      }
    } catch (err) {
      setError("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    setDeleteImageId(imageId);
  };

  const confirmDelete = async () => {
    if (!deleteImageId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/images/${deleteImageId}`, { method: "DELETE" });

      if (res.ok) {
        setImages((prev) => prev.filter((image) => image.id !== deleteImageId));
        setSelectedImageIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteImageId);
          return next;
        });
      }
    } catch (err) {
      setError("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setDeleteImageId(null);
    }
  };

  const handleBulkDelete = async () => {
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    setIsDeleting(true);

    for (const id of Array.from(selectedImageIds)) {
      try {
        const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
        if (res.ok) {
          setImages((prev) => prev.filter((image) => image.id !== id));
        }
      } catch (err) {
        setError("Failed to delete some images");
      }
    }

    setSelectedImageIds(new Set());
    setIsDeleting(false);
    setShowBulkDeleteModal(false);
  };

  const handleBulkCategorize = async (category: string) => {
    for (const id of Array.from(selectedImageIds)) {
      await handleCategoryChange(id, category);
    }

    setSelectedImageIds(new Set());
  };

  const handleReprocess = (id: string) => {
    setImages((prev) =>
      prev.map((image) =>
        image.id === id
          ? { ...image, status: "processing" as StatusType }
          : image,
      ),
    );

    setTimeout(() => {
      setImages((prev) =>
        prev.map((image) =>
          image.id === id
            ? { ...image, status: "completed" as StatusType }
            : image,
        ),
      );
    }, 3000);
  };

  const filteredAndSortedImages = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return images
      .filter((image) => {
        const matchesCategory =
          categoryFilter === "all"
            ? true
            : categoryFilter === "untagged"
              ? !image.category || image.category === "general"
              : image.category === categoryFilter;

        const status = image.status || "completed";
        const matchesStatus =
          statusFilter === "all" ? true : status === statusFilter;

        const matchesQuery =
          normalizedQuery.length === 0
            ? true
            : [
                image.id,
                image.category,
                image.notes || "",
                image.createdAt,
              ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);

        return matchesCategory && matchesStatus && matchesQuery;
      })
      .sort((first, second) => {
        const firstDate = new Date(first.createdAt).getTime();
        const secondDate = new Date(second.createdAt).getTime();
        return sortOrder === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [images, categoryFilter, statusFilter, sortOrder, searchQuery]);

  if (loading || projectsLoading) {
    return <LoadingScreen message="Loading images..." />;
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        padding: `0 ${tokens.spacing.md}`,
        paddingBottom: tokens.spacing.xxl,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.lg,
          backgroundColor: tokens.colors.surface,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.lg,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: tokens.spacing.md,
            }}
          >
            <div
              className="animate-content"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <h1
                style={{
                  ...tokens.typography.headlineSmall,
                  color: tokens.colors.onSurface,
                  margin: 0,
                }}
              >
                Upload & Manage
              </h1>

              <p
                style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  margin: 0,
                }}
              >
                Upload and organize field inspection images
              </p>
            </div>
          </div>



          {projects.length === 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: tokens.spacing.md,
              }}
            >
              <div
                style={{
                  padding: tokens.spacing.xl,
                  textAlign: "center",
                  borderRadius: tokens.radius.lg,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  backgroundColor: tokens.colors.surface,
                }}
              >
                <p
                  style={{
                    ...tokens.typography.bodyLarge,
                    color: tokens.colors.onSurfaceVariant,
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  You need to create a project first before uploading images.
                </p>
                <button
                  onClick={() => (window.location.href = "/dashboard/projects")}
                  style={{
                    paddingInline: tokens.spacing.lg,
                    paddingBlock: tokens.spacing.sm,
                    borderRadius: tokens.radius.md,
                    border: "none",
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.onPrimary,
                    cursor: "pointer",
                    fontFamily: tokens.typography.labelLarge.fontFamily,
                    fontSize: tokens.typography.labelLarge.fontSize,
                    fontWeight: tokens.typography.labelLarge.fontWeight,
                    lineHeight: tokens.typography.labelLarge.lineHeight,
                    letterSpacing: tokens.typography.labelLarge.letterSpacing,
                  }}
                >
                  Create Project
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.lg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: tokens.spacing.md,
                }}
              >
                <span
                  style={{
                    color: tokens.colors.onSurface,
                    fontFamily: tokens.typography.titleMedium.fontFamily,
                    fontSize: tokens.typography.titleMedium.fontSize,
                    fontWeight: tokens.typography.titleMedium.fontWeight,
                    lineHeight: tokens.typography.titleMedium.lineHeight,
                    letterSpacing: tokens.typography.titleMedium.letterSpacing,
                  }}
                >
                  Project:
                </span>

                <label
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    minWidth: "min(100%, 20rem)",
                  }}
                >
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    style={{
                      width: "100%",
                      appearance: "none",
                      paddingInline: tokens.spacing.md,
                      paddingBlock: tokens.spacing.sm,
                      paddingRight: tokens.spacing.xl,
                      borderRadius: tokens.radius.md,
                      border: `1px solid ${tokens.colors.outline}`,
                      backgroundColor: tokens.colors.surface,
                      color: tokens.colors.onSurface,
                      cursor: "pointer",
                      outline: "none",
                      fontFamily: tokens.typography.bodyLarge.fontFamily,
                      fontSize: tokens.typography.bodyLarge.fontSize,
                      fontWeight: tokens.typography.bodyLarge.fontWeight,
                      lineHeight: tokens.typography.bodyLarge.lineHeight,
                      letterSpacing: tokens.typography.bodyLarge.letterSpacing,
                    }}
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  <span className="material-icons"
                    style={{
                      position: "absolute",
                      right: tokens.spacing.sm,
                      pointerEvents: "none",
                      color: tokens.colors.onSurfaceVariant,
                      fontSize: tokens.typography.labelLarge.lineHeight,
                    }}
                  >
                    keyboard_arrow_down
                  </span>
                </label>
              </div>



              <FilterBar
                category={categoryFilter}
                setCategory={setCategoryFilter}
                status={statusFilter}
                setStatus={setStatusFilter}
                sort={sortOrder}
                setSort={setSortOrder}
                query={searchQuery}
                setQuery={setSearchQuery}
              />



              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: tokens.spacing.md,
                }}
              >
                <UploadZone onUpload={handleUpload} isUploading={isUploading} />
              </div>

              <UploadQueue
                items={uploadQueue}
                onRemoveItem={handleRemoveUploadItem}
                onClearCompleted={handleClearCompletedUploads}
              />

              <BulkActionBar
                totalCount={filteredAndSortedImages.length}
                selectedCount={selectedImageIds.size}
                allSelected={
                  filteredAndSortedImages.length > 0 &&
                  selectedImageIds.size === filteredAndSortedImages.length
                }
                onToggleSelectAll={handleSelectAll}
                onClearSelection={() => setSelectedImageIds(new Set())}
                onBulkDelete={handleBulkDelete}
                onBulkCategorize={handleBulkCategorize}
                onBulkReprocess={() =>
                  selectedImageIds.forEach((id) => handleReprocess(id))
                }
              />

              {filteredAndSortedImages.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fill, minmax(calc(${tokens.spacing.xxl} * 3), 1fr))`,
                    gap: tokens.spacing.md,
                    padding: tokens.spacing.sm,
                    backgroundColor: tokens.colors.surface,
                  }}
                >
                  {filteredAndSortedImages.map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      isSelected={selectedImageIds.has(image.id)}
                      onSelect={handleSelectImage}
                      onCategoryChange={handleCategoryChange}
                      onEditNote={(selectedImage) =>
                        setEditingImage(selectedImage as ImageType)
                      }
                      onDelete={handleDeleteImage}
                      onReprocess={handleReprocess}
                    />
                  ))}
                </div>
              ) : null}

               {(images.length === 0 || filteredAndSortedImages.length === 0) && (
                <p
                  style={{
                    ...tokens.typography.bodyMedium,
                    color: tokens.colors.onSurfaceVariant,
                    textAlign: "center",
                    padding: tokens.spacing.lg,
                  }}
                >
                  {images.length === 0 ? "No images yet. Upload your first image above." : "No images match your filters."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {editingImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              "color-mix(in srgb, var(--sys-add-on-surface-roles-scrim) 56%, transparent)",
            backdropFilter: `blur(${tokens.spacing.xs})`,
            padding: tokens.spacing.md,
          }}
          onClick={() => setEditingImage(null)}
        >
          <div
            style={{
              backgroundColor: tokens.colors.surface,
              width: "100%",
              maxWidth: "28rem",
              borderRadius: tokens.radius.xl,
              boxShadow: tokens.elevation.level4,
              padding: tokens.spacing.xl,
              animation: "zoomIn 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: tokens.spacing.lg,
              }}
            >
              <h3
                style={{
                  color: tokens.colors.onSurface,
                  fontFamily: tokens.typography.headlineSmall.fontFamily,
                  fontSize: tokens.typography.headlineSmall.fontSize,
                  fontWeight: tokens.typography.headlineSmall.fontWeight,
                  lineHeight: tokens.typography.headlineSmall.lineHeight,
                  letterSpacing: tokens.typography.headlineSmall.letterSpacing,
                }}
              >
                Image Notes
              </h3>

              <button
                onClick={() => setEditingImage(null)}
                style={{
                  padding: tokens.spacing.sm,
                  background: "none",
                  border: "none",
                  borderRadius: tokens.radius.pill,
                  cursor: "pointer",
                  color: tokens.colors.onSurface,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    tokens.colors.surfaceVariant;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="material-icons"
                  style={{ fontSize: tokens.typography.labelLarge.lineHeight }}
                >
                  close
                </span>
              </button>
            </div>

            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 9",
                borderRadius: tokens.radius.lg,
                overflow: "hidden",
                marginBottom: tokens.spacing.lg,
                backgroundColor: tokens.colors.surfaceContainer,
              }}
            >
              <img
                src={editingImage.thumbnailUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <textarea
              value={editingImage.notes || ""}
              onChange={(e) =>
                setEditingImage({ ...editingImage, notes: e.target.value })
              }
              placeholder="Add observation details or AI corrections..."
              style={{
                width: "100%",
                minHeight: `calc(${tokens.spacing.xxl} * 2)`,
                backgroundColor: tokens.colors.surfaceContainerLow,
                border: `1px solid ${tokens.colors.outline}`,
                borderRadius: tokens.radius.lg,
                padding: tokens.spacing.md,
                color: tokens.colors.onSurface,
                outline: "none",
                transition: "all 0.2s ease",
                resize: "none",
                fontFamily: tokens.typography.bodyMedium.fontFamily,
                fontSize: tokens.typography.bodyMedium.fontSize,
                fontWeight: tokens.typography.bodyMedium.fontWeight,
                lineHeight: tokens.typography.bodyMedium.lineHeight,
                letterSpacing: tokens.typography.bodyMedium.letterSpacing,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.primary;
                e.currentTarget.style.boxShadow = `0 0 0 1px ${tokens.colors.primary}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.outline;
                e.currentTarget.style.boxShadow = "none";
              }}
              autoFocus
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: tokens.spacing.md,
                marginTop: tokens.spacing.xl,
              }}
            >
              <button
                onClick={() => setEditingImage(null)}
                style={{
                  paddingInline: tokens.spacing.lg,
                  paddingBlock: tokens.spacing.sm,
                  color: tokens.colors.onSurface,
                  fontFamily: tokens.typography.labelLarge.fontFamily,
                  fontSize: tokens.typography.labelLarge.fontSize,
                  fontWeight: tokens.typography.labelLarge.fontWeight,
                  lineHeight: tokens.typography.labelLarge.lineHeight,
                  letterSpacing: tokens.typography.labelLarge.letterSpacing,
                  background: "none",
                  border: "none",
                  borderRadius: tokens.radius.md,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    tokens.colors.surfaceVariant;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSaveNotes}
                disabled={saving}
                style={{
                  paddingInline: tokens.spacing.lg,
                  paddingBlock: tokens.spacing.sm,
                  borderRadius: tokens.radius.md,
                  fontFamily: tokens.typography.labelLarge.fontFamily,
                  fontSize: tokens.typography.labelLarge.fontSize,
                  fontWeight: tokens.typography.labelLarge.fontWeight,
                  lineHeight: tokens.typography.labelLarge.lineHeight,
                  letterSpacing: tokens.typography.labelLarge.letterSpacing,
                  color: tokens.colors.onPrimary,
                  backgroundColor: saveSuccess
                    ? "var(--ref-key-success-key-color)"
                    : tokens.colors.primary,
                  boxShadow: saveSuccess ? "none" : tokens.elevation.level1,
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!saving && !saveSuccess) {
                    e.currentTarget.style.boxShadow = tokens.elevation.level2;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving && !saveSuccess) {
                    e.currentTarget.style.boxShadow = tokens.elevation.level1;
                  }
                }}
              >
                {saving
                  ? "Saving..."
                  : saveSuccess
                    ? "Saved"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "fixed",
            bottom: tokens.spacing.lg,
            right: tokens.spacing.lg,
            backgroundColor: tokens.colors.error,
            color: tokens.colors.onError,
            paddingInline: tokens.spacing.lg,
            paddingBlock: tokens.spacing.md,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level3,
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.md,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              padding: tokens.spacing.sm,
              borderRadius: tokens.radius.sm,
              fontSize: tokens.typography.titleLarge.fontSize,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--sys-on-error) 16%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span className="material-icons"
              style={{
                fontSize: tokens.typography.labelLarge.lineHeight,
                color: "inherit",
              }}
            >
              close
            </span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteImageId && (
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
            onClick={() => setDeleteImageId(null)}
          />

          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              backgroundColor: tokens.colors.surface,
              boxShadow: tokens.elevation.level3,
              width: "100%",
              maxWidth: "320px",
              margin: tokens.spacing.lg,
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
                Confirm Delete
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  marginBottom: tokens.spacing.lg,
                }}
              >
                Are you sure you want to delete this image?
              </p>

              <div className="flex justify-end gap-sm">
                <button
                  onClick={() => setDeleteImageId(null)}
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
                  disabled={isDeleting}
                  className="px-md py-sm rounded-pill text-label-large transition-colors"
                  style={{
                    backgroundColor: tokens.colors.error,
                    color: tokens.colors.onError,
                    border: "none",
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
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
            onClick={() => setShowBulkDeleteModal(false)}
          />

          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              backgroundColor: tokens.colors.surface,
              boxShadow: tokens.elevation.level3,
              width: "100%",
              maxWidth: "320px",
              margin: tokens.spacing.lg,
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
                Confirm Delete
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  marginBottom: tokens.spacing.lg,
                }}
              >
                Are you sure you want to delete {selectedImageIds.size} image{selectedImageIds.size !== 1 ? "s" : ""}?
              </p>

              <div className="flex justify-end gap-sm">
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
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
                  onClick={confirmBulkDelete}
                  disabled={isDeleting}
                  className="px-md py-sm rounded-pill text-label-large transition-colors"
                  style={{
                    backgroundColor: tokens.colors.error,
                    color: tokens.colors.onError,
                    border: "none",
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
