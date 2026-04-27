"use client";

import Link from "next/link";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";

interface NavbarProps {
  onPrefetch?: (path: string) => void;
}

export default function Navbar({ onPrefetch }: NavbarProps) {
  return (
    <nav style={{
      backgroundColor: tokens.colors.surface,
      position: "sticky",
      top: 0,
      zIndex: 100,
      width: "100%",
    }}>
      <div style={{
        maxWidth: "1266px",
        margin: "0 auto",
        padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }} className="nav-container">
      <style>{`
        .nav-link:hover { color: ${tokens.colors.onSurface} !important; border-color: ${tokens.colors.onSurface}; }
        .nav-link { text-decoration: none; transition: all 0.3s ease; padding: 0 16px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: calc(3 * ${tokens.spacing.xs}); border: 1.5px solid transparent; font-weight: 600; }
        .signup-btn:hover { background-color: color-mix(in srgb, ${tokens.colors.primary} 85%, white) !important; color: ${tokens.colors.onPrimary} !important; }
        .signup-btn { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; color: ${tokens.colors.onPrimary}; background-color: ${tokens.colors.primary}; }
        .btn-outline:hover { background-color: rgba(0, 0, 0, 0.05) !important; }
        .btn-outline { text-decoration: none; transition: background-color 0.3s ease; }
        .btn-text:hover { background-color: ${tokens.colors.surfaceVariant} !important; color: ${tokens.colors.onSurface} !important; }
        .btn-text { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; color: ${tokens.colors.onSurface} !important; }
        
        .nav-brand-container { flex: 1; display: flex; justify-content: flex-start; align-items: center; }
        .nav-center-container { display: flex; justify-content: center; align-items: center; gap: ${tokens.spacing.xl}; }
        .nav-right-container { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: ${tokens.spacing.md}; }
        .nav-actions { display: flex; align-items: center; gap: 16px; }
        
        .hamburger-menu { display: flex; flex-direction: column; justify-content: space-around; width: 30px; height: 24px; background: transparent; border: none; cursor: pointer; padding: 0; z-index: 101; }
        .hamburger-menu span { width: 100%; height: 3px; background: ${tokens.colors.onSurface}; border-radius: 2px; transition: all 0.3s ease; }
        .hamburger-menu span:nth-child(1) { transform-origin: 0% 0%; }
        .hamburger-menu span:nth-child(2) { opacity: 1; }
        .hamburger-menu span:nth-child(3) { transform-origin: 0% 100%; }
        
        #menu-toggle:checked ~ .nav-right-container .hamburger-menu span:nth-child(1) { transform: rotate(45deg) translate(1px, -1px); }
        #menu-toggle:checked ~ .nav-right-container .hamburger-menu span:nth-child(2) { opacity: 0; }
        #menu-toggle:checked ~ .nav-right-container .hamburger-menu span:nth-child(3) { transform: rotate(-45deg) translate(1px, 1px); }
        
        .dropdown-menu { position: absolute; top: 100%; left: 0; width: 100%; background: ${tokens.colors.surface}; border-bottom: 1px solid ${tokens.colors.outlineVariant}; box-shadow: 0 8px 16px rgba(0,0,0,0.2); padding: ${tokens.spacing.lg}; display: flex; flex-direction: column; gap: ${tokens.spacing.md}; z-index: 99; opacity: 0; visibility: hidden; max-height: 0; overflow: hidden; transition: opacity 0.3s ease, visibility 0.3s ease, max-height 0.3s ease; }
        #menu-toggle:checked ~ .dropdown-menu { opacity: 1; visibility: visible; max-height: 500px; }
        .dropdown-link { color: ${tokens.colors.onSurface}; text-decoration: none; padding: ${tokens.spacing.sm} 0; transition: color 0.3s ease; }
        .dropdown-link:hover { color: ${tokens.colors.primary} !important; }
        .dropdown-actions { display: flex; flex-direction: column; gap: ${tokens.spacing.sm}; margin-top: ${tokens.spacing.md}; }
        .dropdown-actions .btn-text, .dropdown-actions .btn-primary { width: 100%; text-align: center; }
        
        @media (max-width: 768px) { .nav-center-container, .nav-actions { display: none !important; } }
        @media (min-width: 769px) { .hamburger-menu, .dropdown-menu { display: none !important; } }
        @media (max-width: 768px) {
          .nav-container { padding-left: ${tokens.spacing.md} !important; padding-right: ${tokens.spacing.md} !important; }
        }
      `}</style>

      <input type="checkbox" id="menu-toggle" style={{ display: "none" }} />

      <div className="nav-brand-container">
        <Link href="/" className="no-underline">
          <Brand size="lg" />
        </Link>
      </div>
      
      <div className="nav-center-container">
        <Link href="#features" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface }}>
          Features
        </Link>
        <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface }}>
          How It Works
        </Link>
        <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface }}>
          Use Cases
        </Link>
      </div>

      <div className="nav-right-container">
        <div className="nav-actions">
          <Link 
            href="/login" 
            className="btn-text" 
            onMouseEnter={() => onPrefetch && onPrefetch("/login")}
            onTouchStart={() => onPrefetch && onPrefetch("/login")}
            style={{ 
              ...tokens.typography.labelLarge, 
              color: tokens.colors.onSurface,
              backgroundColor: "transparent",
              padding: "0 16px",
              height: "40px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: `calc(3 * ${tokens.spacing.xs})`,
              border: `1.5px solid ${tokens.colors.onSurface}`,
              fontWeight: 600,
            }}
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="btn-primary signup-btn" 
            onMouseEnter={() => onPrefetch && onPrefetch("/signup")}
            onTouchStart={() => onPrefetch && onPrefetch("/signup")}
            style={{
              padding: "0 28px",
              height: "40px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: tokens.colors.primary,
              textDecoration: "none",
              borderRadius:`calc(3 * ${tokens.spacing.xs})`, 
              ...tokens.typography.labelLarge,
              fontWeight: "600",
            }}
          >
            Get Started
          </Link>
        </div>

        <label htmlFor="menu-toggle" className="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
      </div>

      <div className="dropdown-menu">
        <Link href="#features" className="dropdown-link" style={{ ...tokens.typography.labelLarge }}>
          Features
        </Link>
        <Link href="#how-it-works" className="dropdown-link" style={{ ...tokens.typography.labelLarge }}>
          How It Works
        </Link>
        <Link href="#use-cases" className="dropdown-link" style={{ ...tokens.typography.labelLarge }}>
          Use Cases
        </Link>
<div className="dropdown-actions">
          <Link 
            href="/login" 
            className="btn-text" 
            onMouseEnter={() => onPrefetch && onPrefetch("/login")}
            onTouchStart={() => onPrefetch && onPrefetch("/login")}
            style={{ 
              ...tokens.typography.labelLarge, 
              color: tokens.colors.onSurface,
              backgroundColor: "transparent",
              padding: "0 16px",
              height: "40px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: tokens.radius.xl,
              border: `1.5px solid ${tokens.colors.onSurface}`,
              fontWeight: 600,
            }}
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="signup-btn" 
            onMouseEnter={() => onPrefetch && onPrefetch("/signup")}
            onTouchStart={() => onPrefetch && onPrefetch("/signup")}
            style={{
              padding: "0 16px",
              height: "40px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: tokens.colors.primary,
              textDecoration: "none",
              borderRadius: tokens.radius.xl,
              ...tokens.typography.labelLarge,
              fontWeight: "600",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
