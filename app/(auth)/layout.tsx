"use client";

import Link from "next/link";
import Brand from "@/components/Brand";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-md" style={{ backgroundColor: "var(--color-section-bg)" }}>
      <div className="mb-lg">
        <Link href="/" className="no-underline text-primary">
          <Brand size="lg" />
        </Link>
      </div>
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
