"use client";

import dynamic from "next/dynamic";

const MapPageClient = dynamic(
  () => import("@/components/dashboard/MapPageClient"),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: "24px", maxWidth: "1200px" }}>
        <div
          style={{
            padding: "48px",
            textAlign: "center",
            color: "var(--sys-surface-roles-on-surface-variant)",
          }}
        >
          Loading map...
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  return <MapPageClient />;
}
