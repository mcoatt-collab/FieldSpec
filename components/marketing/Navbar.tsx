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
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#31579b",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <style>{`
        .nav-link:hover { color: rgba(255, 255, 255, 0.7) !important; }
        .nav-link { text-decoration: none; transition: color 0.3s ease; }
        .btn-primary:hover { background-color: rgba(255, 255, 255, 0.9) !important; }
        .btn-primary { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; }
        .btn-outline:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
        .btn-outline { text-decoration: none; transition: background-color 0.3s ease; }
        .btn-text:hover { color: rgba(255, 255, 255, 0.7) !important; }
        .btn-text { text-decoration: none; transition: color 0.3s ease; }
        .social-icon { color: rgba(255, 255, 255, 0.8); transition: color 0.3s ease; }
        .social-icon:hover { color: #FFFFFF !important; }
        .desktop-nav { display: flex; align-items: center; justify-content: center; width: 100%; }
        .nav-center { display: flex; align-items: center; gap: ${tokens.spacing.xl}; flex: 1; justify-content: center; }
        .nav-actions { display: flex; align-items: center; gap: ${tokens.spacing.md}; }
        .hamburger-menu { display: flex; flex-direction: column; justify-content: space-around; width: 30px; height: 24px; background: transparent; border: none; cursor: pointer; padding: 0; z-index: 101; }
        .hamburger-menu span { width: 100%; height: 3px; background: #FFFFFF; border-radius: 2px; transition: all 0.3s ease; }
        .hamburger-menu span:nth-child(1) { transform-origin: 0% 0%; }
        .hamburger-menu span:nth-child(2) { opacity: 1; }
        .hamburger-menu span:nth-child(3) { transform-origin: 0% 100%; }
        #menu-toggle:checked ~ .hamburger-menu span:nth-child(1) { transform: rotate(45deg) translate(1px, -1px); }
        #menu-toggle:checked ~ .hamburger-menu span:nth-child(2) { opacity: 0; }
        #menu-toggle:checked ~ .hamburger-menu span:nth-child(3) { transform: rotate(-45deg) translate(1px, 1px); }
        .dropdown-menu { position: absolute; top: 100%; left: 0; width: 100%; background: #31579b; border-bottom: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 16px rgba(0,0,0,0.2); padding: ${tokens.spacing.lg}; display: flex; flex-direction: column; gap: ${tokens.spacing.md}; z-index: 99; opacity: 0; visibility: hidden; max-height: 0; overflow: hidden; transition: opacity 0.3s ease, visibility 0.3s ease, max-height 0.3s ease; }
        #menu-toggle:checked ~ .dropdown-menu { opacity: 1; visibility: visible; max-height: 500px; }
        .dropdown-link { color: #FFFFFF; text-decoration: none; padding: ${tokens.spacing.sm} 0; transition: color 0.3s ease; }
        .dropdown-link:hover { color: rgba(255, 255, 255, 0.7) !important; }
        .dropdown-actions { display: flex; flex-direction: column; gap: ${tokens.spacing.sm}; margin-top: ${tokens.spacing.md}; }
        .dropdown-actions .btn-text, .dropdown-actions .btn-primary { width: 100%; text-align: center; }
        @media (max-width: 768px) { .desktop-nav { display: none; } }
        @media (min-width: 769px) { .hamburger-menu, .dropdown-menu { display: none; } }
      `}</style>
      <Link href="/" className="no-underline">
        <Brand size="md" />
      </Link>
      
      {/* Desktop Navigation - Centered */}
      <div className="desktop-nav">
        <div className="nav-center">
          <Link href="#features" className="nav-link" style={{ ...tokens.typography.labelLarge, color: "#FFFFFF" }}>
            Features
          </Link>
          <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.labelLarge, color: "#FFFFFF" }}>
            How It Works
          </Link>
          <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.labelLarge, color: "#FFFFFF" }}>
            Use Cases
          </Link>
        </div>
        <div className="nav-actions">
          <Link 
            href="/login" 
            className="btn-text" 
            onMouseEnter={() => onPrefetch("/login")}
            onTouchStart={() => onPrefetch("/login")}
            style={{ ...tokens.typography.labelLarge, color: "#FFFFFF" }}
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
              backgroundColor: "#FFFFFF",
              color: "#31579b",
              textDecoration: "none",
              borderRadius: tokens.radius.md,
              ...tokens.typography.labelLarge,
              fontWeight: "600",
            }}
          >
            Get Started
          </Link>
        </div>
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
            style={{ ...tokens.typography.labelLarge, color: "#FFFFFF" }}
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
              backgroundColor: "#FFFFFF",
              color: "#31579b",
              textDecoration: "none",
              borderRadius: tokens.radius.md,
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
