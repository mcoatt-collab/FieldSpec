"use client";

import React, { useState } from "react";
import { tokens } from "@/lib/design-tokens";


interface UploadZoneProps {
  onUpload: (files: FileList) => void;
  isUploading: boolean;
}

export function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() =>
        !isUploading && document.getElementById("file-upload")?.click()
      }
      style={{
        display: "flex",
        minHeight: `calc(${tokens.spacing.xxl} * 3)`,
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.spacing.xl,
        borderRadius: tokens.radius.lg,
        border: `1px dashed ${isDragging ? tokens.colors.primary : tokens.colors.outlineVariant}`,
        backgroundColor: isDragging
          ? "color-mix(in srgb, var(--sys-primary) 8%, transparent)"
          : tokens.colors.surface,
        cursor: isUploading ? "not-allowed" : "pointer",
        opacity: isUploading ? "0.64" : "1",
        transition:
          "background-color 160ms ease, border-color 160ms ease, opacity 160ms ease",
      }}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        style={{ display: "none" }}
        onChange={(e) => e.target.files && onUpload(e.target.files)}
        disabled={isUploading}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: tokens.spacing.sm,
          textAlign: "center",
        }}
      >
        <span className="material-icons"
          style={{
            color: tokens.colors.onSurface,
            fontSize: `calc(${tokens.spacing.xxl} - ${tokens.spacing.sm})`,
          }}
        >
          cloud_upload
        </span>

        <div
          style={{
            color: tokens.colors.onSurface,
            fontFamily: tokens.typography.titleLarge.fontFamily,
            fontSize: tokens.typography.titleLarge.fontSize,
            fontWeight: tokens.typography.titleLarge.fontWeight,
            lineHeight: tokens.typography.titleLarge.lineHeight,
            letterSpacing: tokens.typography.titleLarge.letterSpacing,
          }}
        >
          {isUploading ? "Uploading images..." : "Drop your images here, or browse"}
        </div>

        <p
          style={{
            color: tokens.colors.onSurfaceVariant,
            fontFamily: tokens.typography.bodyMedium.fontFamily,
            fontSize: tokens.typography.bodyMedium.fontSize,
            fontWeight: tokens.typography.bodyMedium.fontWeight,
            lineHeight: tokens.typography.bodyMedium.lineHeight,
            letterSpacing: tokens.typography.bodyMedium.letterSpacing,
          }}
        >
          Supports: PNG, JPG, JPEG, WEBP, HEIC, HEIF
        </p>

        <p
          style={{
            color: tokens.colors.onSurfaceVariant,
            fontFamily: tokens.typography.bodySmall.fontFamily,
            fontSize: tokens.typography.bodySmall.fontSize,
            fontWeight: tokens.typography.bodySmall.fontWeight,
            lineHeight: tokens.typography.bodySmall.lineHeight,
            letterSpacing: tokens.typography.bodySmall.letterSpacing,
          }}
        >
          Large images are optimized automatically.
        </p>
      </div>
    </div>
  );
}
