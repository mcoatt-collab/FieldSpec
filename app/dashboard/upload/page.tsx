"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useProjectsStore } from "@/store/useProjectsStore";
import { UploadZone } from "@/components/dashboard/upload/UploadZone";
import { UploadQueue, UploadItem } from "@/components/dashboard/upload/UploadQueue";
import { FilterBar } from "@/components/dashboard/upload/FilterBar";
import { BulkActionBar } from "@/components/dashboard/upload/BulkActionBar";
import { ImageCard } from "@/components/dashboard/upload/ImageCard";
import { EmptyState } from "@/components/dashboard/upload/EmptyState";
import { StatusType } from "@/components/dashboard/upload/StatusBadge";

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
  const { projects, loading: projectsLoading, fetchProjects } = useProjectsStore();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtering & Sorting State
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Selection State
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  
  // Upload State
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Modal State
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    if (!selectedProjectId) return;
    
    setIsUploading(true);
    setError("");
    
    const newItems: UploadItem[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      progress: 0,
      status: "uploading"
    }));
    
    setUploadQueue(prev => [...newItems, ...prev]);

    // Upload files sequentially for progress tracking simulation
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const itemId = newItems[i].id;
      
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", selectedProjectId);

        // Mock progress update
        const progressInterval = setInterval(() => {
          setUploadQueue(prev => prev.map(item => 
            item.id === itemId && item.progress < 90 
              ? { ...item, progress: item.progress + 10 } 
              : item
          ));
        }, 200);

        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        const data = await res.json();

        if (res.ok && data.data) {
          setUploadQueue(prev => prev.map(item => 
            item.id === itemId ? { ...item, progress: 100, status: "completed" } : item
          ));
          setImages(prev => [data.data, ...prev]);
        } else {
          setUploadQueue(prev => prev.map(item => 
            item.id === itemId ? { ...item, status: "failed" } : item
          ));
        }
      } catch (err) {
        setUploadQueue(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: "failed" } : item
        ));
      }
    }
    
    setIsUploading(false);
  };

  const handleSelectImage = (id: string, selected: boolean) => {
    setSelectedImageIds(prev => {
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
      setSelectedImageIds(new Set(filteredAndSortedImages.map(img => img.id)));
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
        setImages(prev => prev.map(img => img.id === imageId ? data.data : img));
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
        setImages(prev => prev.map(img => img.id === editingImage.id ? data.data : img));
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
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== imageId));
        setSelectedImageIds(prev => {
          const next = new Set(prev);
          next.delete(imageId);
          return next;
        });
      }
    } catch (err) {
      setError("Failed to delete image");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedImageIds.size} images?`)) return;
    // Sequential delete for simplicity in this mock, ideally a bulk API endpoint
    for (const id of Array.from(selectedImageIds)) {
      await handleDeleteImage(id);
    }
    setSelectedImageIds(new Set());
  };

  const handleBulkCategorize = async (category: string) => {
    for (const id of Array.from(selectedImageIds)) {
      await handleCategoryChange(id, category);
    }
    setSelectedImageIds(new Set());
  };

  const handleReprocess = (id: string) => {
    // Mock reprocessing state
    setImages(prev => prev.map(img => img.id === id ? { ...img, status: "processing" as StatusType } : img));
    setTimeout(() => {
      setImages(prev => prev.map(img => img.id === id ? { ...img, status: "completed" as StatusType } : img));
    }, 3000);
  };

  const filteredAndSortedImages = useMemo(() => {
    return images
      .filter(img => {
        const matchesCategory = categoryFilter === "all" 
          ? true 
          : categoryFilter === "untagged" 
            ? (!img.category || img.category === "general")
            : img.category === categoryFilter;
        
        const status = img.status || "completed";
        const matchesStatus = statusFilter === "all" ? true : status === statusFilter;
        
        return matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [images, categoryFilter, statusFilter, sortOrder]);

  if (loading || projectsLoading) {
    return <div className="p-xl text-center text-on-surface-variant">Loading Workspace...</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-md pb-xxl">
      {/* Header */}
      <div className="mb-xl">
        <h1
                  style={{
                    color: tokens.colors.onSurface,
                    fontSize: tokens.typography.headlineSmall.fontSize, // Changed from headlineMedium
                    fontWeight: tokens.typography.headlineSmall.fontWeight, // Changed from headlineMedium
                    marginBottom: tokens.spacing.xs,
                  }}
                >
                  Upload & Workflow
                </h1>
                <p
                  style={{ 
                    color: tokens.colors.onSurfaceVariant, 
                    fontSize: tokens.typography.bodyMedium.fontSize, // Consistent with dashboard
                    marginTop: tokens.spacing.xs,
                  }}
                  >
                  Manage large batches of images and AI processing status.
                  </p>          }}
        >
          Manage large batches of images and AI processing status.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState type="no_images" onAction={() => window.location.href = "/dashboard/projects"} />
      ) : (
        <div className="space-y-lg">
          {/* Project Selection */}
          <div className="flex items-center gap-md bg-surface-container/50 p-sm rounded-lg border border-outline-variant">
            <label className="text-label-large font-bold text-on-surface px-sm">Active Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-surface border border-outline-variant rounded-md px-md py-1.5 text-body-large outline-none focus:border-primary min-w-[240px]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            {/* Left Column: Upload & Queue */}
            <div className="lg:col-span-1 space-y-md">
              <UploadZone onUpload={handleUpload} isUploading={isUploading} />
              <UploadQueue items={uploadQueue} />
            </div>

            {/* Right Column: Management Grid */}
            <div className="lg:col-span-2 space-y-md">
              <FilterBar 
                category={categoryFilter} setCategory={setCategoryFilter}
                status={statusFilter} setStatus={setStatusFilter}
                sort={sortOrder} setSort={setSortOrder}
              />

              <div className="flex items-center justify-between min-h-[40px]">
                <div className="flex items-center gap-md">
                  <button 
                    onClick={handleSelectAll}
                    className="text-label-medium text-primary hover:underline font-bold"
                  >
                    {selectedImageIds.size === filteredAndSortedImages.length && filteredAndSortedImages.length > 0 
                      ? "Deselect All" 
                      : "Select All"
                    }
                  </button>
                  <span className="text-body-small text-on-surface-variant">
                    Showing {filteredAndSortedImages.length} images
                  </span>
                </div>
                
                <BulkActionBar 
                  selectedCount={selectedImageIds.size}
                  onClearSelection={() => setSelectedImageIds(new Set())}
                  onBulkDelete={handleBulkDelete}
                  onBulkCategorize={handleBulkCategorize}
                  onBulkReprocess={() => selectedImageIds.forEach(id => handleReprocess(id))}
                />
              </div>

              {filteredAndSortedImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-md">
                  {filteredAndSortedImages.map((image) => (
                    <ImageCard 
                      key={image.id}
                      image={image}
                      isSelected={selectedImageIds.has(image.id)}
                      onSelect={handleSelectImage}
                      onCategoryChange={handleCategoryChange}
                      onEditNote={setEditingImage}
                      onDelete={handleDeleteImage}
                      onReprocess={handleReprocess}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  type={images.length === 0 ? "no_images" : "no_results"} 
                  onAction={() => {
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-md" onClick={() => setEditingImage(null)}>
          <div className="bg-surface w-full max-w-md rounded-xl shadow-level4 p-xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-headline-small text-on-surface">Image Notes</h3>
              <button onClick={() => setEditingImage(null)} className="p-1 hover:bg-surface-variant rounded-full">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden mb-lg bg-surface-container">
              <img src={editingImage.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <textarea
              value={editingImage.notes || ""}
              onChange={(e) => setEditingImage({ ...editingImage, notes: e.target.value })}
              placeholder="Add observation details or AI corrections..."
              className="w-full h-32 bg-surface-container-low border border-outline rounded-lg p-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              autoFocus
            />
            
            <div className="flex justify-end gap-md mt-xl">
              <button 
                onClick={() => setEditingImage(null)}
                className="px-lg py-2 text-on-surface font-bold hover:bg-surface-variant rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNotes}
                disabled={saving}
                className={`px-lg py-2 rounded-md font-bold text-on-primary shadow-level1 transition-all
                  ${saveSuccess ? "bg-success" : "bg-primary hover:shadow-level2"}
                `}
              >
                {saving ? "Saving..." : saveSuccess ? "Saved ✓" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-lg right-lg bg-error text-on-error px-lg py-md rounded-lg shadow-level3 flex items-center gap-md animate-in slide-in-from-right">
          <span>{error}</span>
          <button onClick={() => setError("")} className="hover:bg-white/20 p-1 rounded">✕</button>
        </div>
      )}
    </div>
  );
}
