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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 w-full overflow-x-hidden"
      style={{ backgroundColor: "var(--color-section-bg)" }}
    >
      <div className="mb-md">
        <Link href="/" className="no-underline text-primary">
          <Brand size="lg" />
        </Link>
      </div>
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <ThemeToggle />
      </div>
      <main className="w-full flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
