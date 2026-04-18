import Image from "next/image";

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
    sm: { img: 32, text: "text-title-medium" },
    md: { img: 40, text: "text-title-large" },
    lg: { img: 64, text: "text-headline-medium" },
  };

  const currentSize = sizes[size];
  const logoSrc = variant === "white" ? "/logo-white.png" : "/logo.png";
  const textColor = variant === "white" ? "text-white" : "text-primary";

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
      <span className={`${textColor} font-bold ${currentSize.text}`}>
        FieldSpec
      </span>
    </div>
  );
}
