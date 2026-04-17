"use client";

import { tokens } from "@/lib/design-tokens";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  circle?: boolean;
}

export default function Skeleton({
  className = "",
  width,
  height,
  borderRadius = tokens.radius.sm,
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-root ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width || "100%",
        height: typeof height === "number" ? `${height}px` : height || "20px",
        borderRadius: circle ? "50%" : borderRadius,
        backgroundColor: tokens.colors.surfaceVariant,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="skeleton-shimmer" />
      <style jsx>{`
        .skeleton-root {
          display: inline-block;
        }
        .skeleton-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
