"use client";

import { useCallback } from "react";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
}

export default function DropZone({
  onFilesSelected,
  accept = "image/*",
  multiple = true,
  maxSize = 10 * 1024 * 1024,
  className = "",
}: DropZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files).filter((file) => {
        if (file.size > maxSize) {
          alert(`${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
          return false;
        }
        return true;
      });

      onFilesSelected(files);
    },
    [onFilesSelected, maxSize]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`
        relative flex flex-col items-center justify-center p-8
        border-2 border-dashed border-neutral-300 rounded-lg
        bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer
        ${className}
      `}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="text-center">
        <svg
          className="w-12 h-12 mx-auto text-neutral-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-neutral-600 mb-1">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-neutral-500">
          PNG, JPG, JPEG up to {maxSize / 1024 / 1024}MB
        </p>
      </div>
    </div>
  );
}
