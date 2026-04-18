"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import { Features, HowItWorks } from "@/components/marketing/Sections";
import { tokens } from "@/lib/design-tokens";

export default function MarketingPage() {
  const router = useRouter();

  // Proactive background prefetching for core auth routes
  useEffect(() => {
    router.prefetch("/signup");
    router.prefetch("/login");
  }, [router]);

  // Handler for manual prefetching on hover to minimize latency
  const handlePrefetch = useCallback((path: string) => {
    router.prefetch(path);
  }, [router]);

  return (
    <div style={{ backgroundColor: tokens.colors.background }}>
      <Navbar onPrefetch={handlePrefetch} />
      <Hero onPrefetch={handlePrefetch} />
      
      {/* Problem → Solution Section (Directly inline as it is specific and value-heavy) */}
      <section style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: tokens.colors.surface,
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{
             ...tokens.typography.displaySmall,
             color: tokens.colors.primary,
             textAlign: "center",
             marginBottom: tokens.spacing.xl,
          }}>
            From Manual Hassle to Automated Insight
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
            gap: "32px",
          }}>
            <div style={{ padding: tokens.spacing.xl, backgroundColor: tokens.colors.surfaceVariant, borderRadius: tokens.radius.lg }}>
              <h3 style={{ ...tokens.typography.titleLarge, marginBottom: tokens.spacing.md }}>The Problem</h3>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ color: tokens.colors.onSurfaceVariant }}>✕ Slow, inconsistent manual report writing.</li>
                <li style={{ color: tokens.colors.onSurfaceVariant }}>✕ Unstructured drone data and fragmented insights.</li>
              </ul>
            </div>
            <div style={{ padding: tokens.spacing.xl, backgroundColor: tokens.colors.surfaceVariant, borderRadius: tokens.radius.lg }}>
              <h3 style={{ ...tokens.typography.titleLarge, marginBottom: tokens.spacing.md }}>The Solution</h3>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ color: tokens.colors.onSurfaceVariant }}>✓ AI-powered analysis in minutes.</li>
                <li style={{ color: tokens.colors.onSurfaceVariant }}>✓ Professional, structured reports ready for export.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />

      {/* Footer */}
      <footer style={{
        padding: tokens.spacing.xxl,
        backgroundColor: tokens.colors.surface,
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
        textAlign: "center",
      }}>
        <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
          &copy; {new Date().getFullYear()} FieldSpec. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
