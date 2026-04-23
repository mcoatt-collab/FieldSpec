"use client";

import React, { useCallback, useState } from "react";
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
      className={`relative border-2 border-dashed rounded-lg p-xxl text-center transition-all duration-200 cursor-pointer
        ${isDragging ? "bg-primary/10 border-primary" : "bg-primary-container/20 border-outline-variant hover:bg-primary-container/30 hover:border-primary/50"}
        ${isUploading ? "opacity-60 cursor-not-allowed" : ""}
      `}
      onClick={() => !isUploading && document.getElementById("file-upload")?.click()}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onUpload(e.target.files)}
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center">
        <svg
          className={`w-10 h-10 mb-md fill-primary`} /* Changed from w-12 h-12 to w-10 h-10 */
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>

        <h3 className="text-title-large text-primary mb-xs"> {/* Kept title-large, consistent with other component titles */}
          {isUploading ? "Uploading Batch..." : "Drop your images here, or browse"}
        </h3>
        
        <p className="text-body-small text-on-surface-variant opacity-80"> {/* Kept body-small */}
          Supports: PNG, JPG, JPEG, WEBP. Handling batches up to 500 images.
        </p>
      </div>
    </div>
  );
}
