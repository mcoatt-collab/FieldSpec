"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import { Features, HowItWorks, ProblemSolution } from "@/components/marketing/Sections";
import Brand from "@/components/Brand";
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
      
      <ProblemSolution />
      
      <Features />
      
      <HowItWorks />

      <footer style={{
        backgroundColor: "#0f172a",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
      }}>
        <style>{`
          .footer-link { color: rgba(255, 255, 255, 0.6); text-decoration: none; transition: color 0.3s ease; }
          .footer-link:hover { color: #FFFFFF !important; }
          .social-footer-icon { color: rgba(255, 255, 255, 0.6); transition: color 0.3s ease; font-size: 20px; }
          .social-footer-icon:hover { color: #FFFFFF !important; }
        `}</style>
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: tokens.spacing.xl,
        }}>
          {/* Brand Column */}
          <div>
            <Brand size="md" variant="white" />
            <p style={{ ...tokens.typography.bodySmall, color: "rgba(255, 255, 255, 0.6)", marginTop: tokens.spacing.md }}>
              AI-powered field analysis for agriculture, construction, and infrastructure.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 style={{ ...tokens.typography.labelLarge, color: "#FFFFFF", marginBottom: tokens.spacing.md }}>
              Product
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#features" className="footer-link" style={tokens.typography.bodySmall}>Features</a>
              <a href="#how-it-works" className="footer-link" style={tokens.typography.bodySmall}>How It Works</a>
              <a href="#use-cases" className="footer-link" style={tokens.typography.bodySmall}>Use Cases</a>
              <Link href="/signup" className="footer-link" style={tokens.typography.bodySmall}>Get Started</Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 style={{ ...tokens.typography.labelLarge, color: "#FFFFFF", marginBottom: tokens.spacing.md }}>
              Company
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>About</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Blog</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Careers</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Contact</a>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h4 style={{ ...tokens.typography.labelLarge, color: "#FFFFFF", marginBottom: tokens.spacing.md }}>
              Legal
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Privacy Policy</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Terms of Service</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Cookie Policy</a>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: "1200px",
          margin: `${tokens.spacing.xl} auto 0`,
          paddingTop: tokens.spacing.lg,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: tokens.spacing.md,
        }}>
          <p style={{ ...tokens.typography.bodySmall, color: "rgba(255, 255, 255, 0.6)" }}>
            &copy; {new Date().getFullYear()} FieldSpec. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: tokens.spacing.md }}>
            <a href="#" className="social-footer-icon" aria-label="Twitter">𝕏</a>
            <a href="#" className="social-footer-icon" aria-label="LinkedIn">in</a>
            <a href="#" className="social-footer-icon" aria-label="GitHub">⌘</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
