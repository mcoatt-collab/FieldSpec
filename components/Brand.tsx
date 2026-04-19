"use client";

import Image from "next/image";
import { tokens } from "@/lib/design-tokens";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "blue" | "white";
}

export default function Brand({ className = "", size = "md", variant = "blue" }: BrandProps) {
  const sizes = {
    sm: { icon: 24, font: "text-title-large" },
    md: { icon: 32, font: "text-headline-small" },
    lg: { icon: 48, font: "text-headline-medium" },
  };

  const current = sizes[size] || sizes.md;
  const logoSrc = variant === "white" ? "/logo-white-icon.png" : "/logo.png";
  const textColor = variant === "white" ? tokens.colors.onPrimary : tokens.colors.primary;

  return (
    <div className={`flex items-center gap-sm ${className}`}>
      <img
        src={logoSrc}
        alt="FieldSpec Logo"
        width={current.icon}
        height={current.icon}
        className="object-contain"
        style={{ border: "none" }}
      />
      <span 
        className={`${current.font} tracking-tight font-sans font-bold`}
        style={{ 
          fontFamily: "var(--sys-typescale-headline-small-fontfamily), sans-serif",
          fontWeight: 600,
          color: textColor
        }}
      >
        FieldSpec
      </span>
    </div>
  );
}
