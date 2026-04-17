"use client";

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px]">
      <div className="mb-xl">
        <h2 className="text-on-surface text-headline-small">
          Dashboard
        </h2>
        <p className="text-on-surface-variant mt-xs text-body-medium">
          Overview of your projects and recent activity
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-lg">
        <div className="p-lg bg-surface rounded-lg shadow-level-1">
          <p className="text-on-surface-variant text-label-medium">
            Total Projects
          </p>
          <p className="text-on-surface mt-xs text-display-small">
            0
          </p>
        </div>

        <div className="p-lg bg-surface rounded-lg shadow-level-1">
          <p className="text-on-surface-variant text-label-medium">
            Total Images
          </p>
          <p className="text-on-surface mt-xs text-display-small">
            0
          </p>
        </div>

        <div className="p-lg bg-surface rounded-lg shadow-level-1">
          <p className="text-on-surface-variant text-label-medium">
            Reports Generated
          </p>
          <p className="text-on-surface mt-xs text-display-small">
            0
          </p>
        </div>
      </div>
    </div>
  );
}