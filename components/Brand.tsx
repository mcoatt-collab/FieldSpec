import Image from "next/image";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "blue" | "white";
}

export default function Brand({ className = "", size = "md", variant = "blue" }: BrandProps) {
  const sizes = {
    sm: { h: 24, w: 147 },
    md: { h: 32, w: 196 },
    lg: { h: 48, w: 295 },
  };

  const currentSize = sizes[size] || sizes.md;
  const logoSrc = variant === "white" ? "/logo-white.png" : "/logo-blue.png";

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="FieldSpec Logo"
        width={currentSize.w}
        height={currentSize.h}
        className="object-contain"
        style={{ border: "none" }}
      />
    </div>
  );
}
