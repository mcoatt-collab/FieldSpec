"use client";

import React from "react";

export type StatusType = "pending" | "processing" | "completed" | "failed";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "processing":
        return "bg-warning/20 text-warning border-warning/30";
      case "completed":
        return "bg-success/20 text-success border-success/30";
      case "failed":
        return "bg-error/20 text-error border-error/30";
      case "pending":
      default:
        return "bg-surface-variant text-on-surface-variant border-outline-variant";
    }
  };

  const getStatusLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
}
