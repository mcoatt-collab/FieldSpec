"use client";

import Link from "next/link";
import { tokens } from "@/lib/design-tokens";

interface HeroProps {
  onPrefetch: (path: string) => void;
}

export default function Hero({ onPrefetch }: HeroProps) {
  return (
    <section className="hero-section" style={{
      position: "relative",
      overflow: "hidden",
      height: "100vh",
      minHeight: "768px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      textAlign: "center",
    }}>
      {/* Video Background */}
      <div className="hero-video-container">
        <iframe
          className="hero-video"
          src="https://streamable.com/e/lbw4qo?autoplay=1&loop=1&muted=1"
          title="Promotional video background"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          loading="eager"
          aria-hidden="true"
          sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
        />
      </div>
      {/* Image Background for Mobile */}
      <div className="hero-image-container">
        <img
          className="hero-image"
          src="https://i.postimg.cc/fLq17NNx/agriculture-healthy-food-(1).jpg"
          alt="Drone surveying healthy crops"
          loading="eager"
        />
      </div>
      {/* Light gradient overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
        zIndex: 1,
      }} />
      
      {/* Content */}
      <div className="hero-content" style={{
        position: "relative",
        zIndex: 2,
        maxWidth: "1200px",
        width: "100%",
        padding: "0 24px",
        marginTop: "-10vh",
      }}>
        <h1 className="hero-title" style={{
          fontFamily: tokens.typography.displayLarge.fontFamily,
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 500,
          color: "var(--ref-neutral-neutral100)",
          marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
          lineHeight: 1.1,
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}>
          Turn Drone Images into<br />
          <span style={{ color: tokens.colors.primary }}>Professional Reports in Minutes</span>
        </h1>
        <p className="hero-subcopy" style={{
          fontFamily: tokens.typography.bodyLarge.fontFamily,
          fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.9)",
          maxWidth: "800px",
          margin: "0 auto",
          marginBottom: "clamp(2rem, 5vw, 3rem)",
          lineHeight: 1.6,
          textShadow: "0 1px 5px rgba(0,0,0,0.2)",
        }}>
          Upload your drone images. Let AI analyze them. Export structured reports ready for stakeholders. No manual work required.
        </p>
        <div className="hero-buttons" style={{
          display: "flex",
          gap: "clamp(1rem, 2vw, 1.5rem)",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          <Link 
            href="/signup" 
            className="hero-primary-btn"
            onMouseEnter={() => onPrefetch("/signup")}
            onTouchStart={() => onPrefetch("/signup")}
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="hero-outline-btn"
            onMouseEnter={() => onPrefetch("/login")}
            onTouchStart={() => onPrefetch("/login")}
          >
            Log In
          </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
          .hero-video-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; background-color: #000000; }
          .hero-video { position: absolute; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; transform: translate(-50%, -50%) scale(1.1); object-fit: cover; object-position: center center; background-color: #000000; border: none; margin: 0; padding: 0; opacity: 1; pointer-events: none; }
          .hero-image-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; background-color: #000000; display: none; }
          .hero-image { position: absolute; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; transform: translate(-50%, -50%) scale(1.1); object-fit: cover; object-position: center center; opacity: 1; }
          .hero-primary-btn { padding: clamp(1rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem); background-color: var(--sys-primary); color: var(--ref-neutral-neutral100); text-decoration: none; border-radius: var(--sys-radius-md); font-family: var(--sys-typescale-label-large-fontfamily); font-size: clamp(1rem, 1.5vw, 1.25rem); font-weight: 600; border: none; cursor: pointer; transition: background-color 0.2s; box-shadow: 0 4px 12px rgba(49, 95, 155, 0.3); display: inline-block; }
          .hero-primary-btn:hover { background-color: var(--ref-primary-primary30); }
          .hero-outline-btn { padding: clamp(1rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem); background-color: transparent; color: var(--ref-neutral-neutral100); text-decoration: none; border-radius: var(--sys-radius-md); font-family: var(--sys-typescale-label-large-fontfamily); font-size: clamp(1rem, 1.5vw, 1.25rem); font-weight: 600; border: 2px solid rgba(255,255,255,0.8); cursor: pointer; transition: all 0.2s; display: inline-block; }
          .hero-outline-btn:hover { background-color: rgba(255,255,255,0.1); border-color: var(--ref-neutral-neutral100); }
          @media (max-width: 768px) {
            .hero-section { min-height: 600px; }
            .hero-content { margin-top: -5vh; padding: 0 20px; }
            .hero-buttons { flex-direction: column; align-items: center; }
            .hero-buttons .hero-primary-btn, .hero-buttons .hero-outline-btn { width: 100%; max-width: 300px; text-align: center; }
            .hero-video-container { display: none; }
            .hero-image-container { display: block; }
          }
      `}} />
    </section>
  );
}
