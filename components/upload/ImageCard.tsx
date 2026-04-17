"use client";

import ProgressBar from "../ui/ProgressBar";

interface ImageCardProps {
  file: {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: "pending" | "uploading" | "processing" | "complete" | "error";
    error?: string;
    cloudinaryUrl?: string;
  };
  onRemove: () => void;
  className?: string;
}

export default function ImageCard({ file, onRemove, className = "" }: ImageCardProps) {
  const statusColors = {
    pending: "bg-neutral-500",
    uploading: "bg-blue-500",
    processing: "bg-yellow-500",
    complete: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className={`relative group bg-white rounded-lg border border-neutral-200 overflow-hidden ${className}`}>
      <div className="aspect-square relative">
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-full h-full object-cover"
        />
        
        {file.status !== "complete" && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2">
            <p className="text-white text-xs mb-2 capitalize">{file.status}</p>
            <div className="w-full">
              <ProgressBar value={file.progress} size="sm" />
            </div>
          </div>
        )}

        {file.status === "complete" && (
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors.complete}`}>
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Uploaded
            </span>
          </div>
        )}

        {file.status === "error" && file.error && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2">
            <p className="text-red-400 text-xs text-center">{file.error}</p>
          </div>
        )}
      </div>

      <div className="p-2">
        <p className="text-xs text-neutral-600 truncate" title={file.file.name}>
          {file.file.name}
        </p>
        <p className="text-xs text-neutral-400">
          {(file.file.size / 1024).toFixed(1)} KB
        </p>
      </div>

      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove image"
      >
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
