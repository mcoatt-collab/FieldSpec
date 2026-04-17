interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  return (
    <div
      className={`animate-pulse bg-neutral-200 ${variants[variant]} ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 bg-white rounded-lg border border-neutral-200">
      <Skeleton variant="rectangular" className="h-32 w-full mb-3" />
      <Skeleton variant="text" className="w-3/4 mb-2" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
