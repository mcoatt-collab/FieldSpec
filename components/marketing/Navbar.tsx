"use client";

import Link from "next/link";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";

interface NavbarProps {
  onPrefetch: (path: string) => void;
}

export default function Navbar({ onPrefetch }: NavbarProps) {
  return (
    <nav style={{
      padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
      borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: tokens.colors.surface,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <style>{`
        .nav-link:hover { color: ${tokens.colors.primary} !important; }
        .nav-link { text-decoration: none; transition: color 0.3s ease; }
        .btn-primary:hover { background-color: ${tokens.colors.primaryContainer} !important; color: ${tokens.colors.onPrimaryContainer} !important; }
        .btn-primary { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; }
        .btn-outline:hover { background-color: ${tokens.colors.surfaceVariant} !important; }
        .btn-outline { text-decoration: none; transition: background-color 0.3s ease; }
        .btn-text:hover { color: ${tokens.colors.primary} !important; }
        .btn-text { text-decoration: none; transition: color 0.3s ease; }
        .social-icon { color: ${tokens.colors.onSurfaceVariant}; transition: color 0.3s ease; }
        .social-icon:hover { color: ${tokens.colors.primary} !important; }
        .desktop-nav { display: flex; align-items: center; margin-left: auto; }
        .hamburger-menu { display: flex; flex-direction: column; justify-content: space-around; width: 30px; height: 24px; background: transparent; border: none; cursor: pointer; padding: 0; z-index: 101; }
        .hamburger-menu span { width: 100%; height: 3px; background: ${tokens.colors.onSurface}; border-radius: 2px; transition: all 0.3s ease; }
        .hamburger-menu span:nth-child(1) { transform-origin: 0% 0%; }
        .hamburger-menu span:nth-child(2) { opacity: 1; }
        .hamburger-menu span:nth-child(3) { transform-origin: 0% 100%; }
        #menu-toggle:checked ~ .hamburger-menu span:nth-child(1) { transform: rotate(45deg) translate(1px, -1px); }
        #menu-toggle:checked ~ .hamburger-menu span:nth-child(2) { opacity: 0; }
        #menu-toggle:checked ~ .hamburger-menu span:nth-child(3) { transform: rotate(-45deg) translate(1px, 1px); }
        .dropdown-menu { position: absolute; top: 100%; left: 0; width: 100%; background: ${tokens.colors.surface}; border-bottom: 1px solid ${tokens.colors.outlineVariant}; box-shadow: 0 8px 16px rgba(0,0,0,0.1); padding: ${tokens.spacing.lg}; display: flex; flex-direction: column; gap: ${tokens.spacing.md}; z-index: 99; opacity: 0; visibility: hidden; max-height: 0; overflow: hidden; transition: opacity 0.3s ease, visibility 0.3s ease, max-height 0.3s ease; }
        #menu-toggle:checked ~ .dropdown-menu { opacity: 1; visibility: visible; max-height: 500px; }
        .dropdown-link { color: ${tokens.colors.onSurfaceVariant}; text-decoration: none; padding: ${tokens.spacing.sm} 0; transition: color 0.3s ease; }
        .dropdown-link:hover { color: ${tokens.colors.primary} !important; }
        .dropdown-actions { display: flex; flex-direction: column; gap: ${tokens.spacing.sm}; margin-top: ${tokens.spacing.md}; }
        .dropdown-actions .btn-text, .dropdown-actions .btn-primary { width: 100%; text-align: center; }
        @media (max-width: 768px) { .desktop-nav { display: none; } }
        @media (min-width: 769px) { .hamburger-menu, .dropdown-menu { display: none; } }
      `}</style>
      <Link href="/" className="no-underline">
        <Brand size="md" />
      </Link>
      
      {/* Desktop Navigation */}
      <div className="desktop-nav">
        <Link href="#features" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant, marginRight: tokens.spacing.lg }}>
          Features
        </Link>
        <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant, marginRight: tokens.spacing.lg }}>
          How It Works
        </Link>
        <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurfaceVariant, marginRight: tokens.spacing.lg }}>
          Use Cases
        </Link>
        <Link 
          href="/login" 
          className="btn-text" 
          onMouseEnter={() => onPrefetch("/login")}
          onTouchStart={() => onPrefetch("/login")}
          style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface, marginRight: tokens.spacing.md }}
        >
          Log In
        </Link>
        <Link 
          href="/signup" 
          className="btn-primary" 
          onMouseEnter={() => onPrefetch("/signup")}
          onTouchStart={() => onPrefetch("/signup")}
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.onPrimary,
            textDecoration: "none",
            borderRadius: tokens.radius.md,
            ...tokens.typography.labelLarge,
          }}
        >
          Get Started
        </Link>
      </div>

      <input type="checkbox" id="menu-toggle" style={{ display: "none" }} />
      <label htmlFor="menu-toggle" className="hamburger-menu" style={{ marginLeft: "auto" }}>
        <span></span>
        <span></span>
        <span></span>
      </label>

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
            onMouseEnter={() => onPrefetch("/login")}
            onTouchStart={() => onPrefetch("/login")}
            style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface }}
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="btn-primary" 
            onMouseEnter={() => onPrefetch("/signup")}
            onTouchStart={() => onPrefetch("/signup")}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.onPrimary,
              textDecoration: "none",
              borderRadius: tokens.radius.md,
              ...tokens.typography.labelLarge,
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
