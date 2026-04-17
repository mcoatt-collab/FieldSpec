"use client";

import ImageCard from "./ImageCard";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  error?: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
}

interface ImageGridProps {
  files: UploadFile[];
  onRemove: (id: string) => void;
  className?: string;
}

export default function ImageGrid({ files, onRemove, className = "" }: ImageGridProps) {
  if (files.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
      {files.map((file) => (
        <ImageCard
          key={file.id}
          file={file}
          onRemove={() => onRemove(file.id)}
        />
      ))}
    </div>
  );
}
