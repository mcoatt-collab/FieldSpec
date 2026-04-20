import Image from "next/image";
import { tokens } from "@/lib/design-tokens";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "blue" | "white";
}

export default function Brand({
  className = "",
  size = "md",
  variant = "blue",
}: BrandProps) {
const sizes = {
    sm: { img: 32, text: tokens.typography.titleMedium },
    md: { img: 40, text: tokens.typography.titleLarge },
    lg: { img: 64, text: tokens.typography.headlineMedium },
  };

  const currentSize = sizes[size];
  const logoSrc = variant === "white" ? "/logo-white-icon.png" : "/logo.png";
  const textColor = variant === "white" ? tokens.colors.onPrimary : tokens.colors.primary;

  return (
    <div className={`flex items-center gap-xs ${className}`}>
      <Image
        src={logoSrc}
        alt="FieldSpec Logo"
        width={currentSize.img}
        height={currentSize.img}
        className="object-contain"
        style={{ border: "none" }}
      />
      <span style={{ ...currentSize.text, color: textColor, fontWeight: 600 }}>
        FieldSpec
      </span>
    </div>
  );
}
