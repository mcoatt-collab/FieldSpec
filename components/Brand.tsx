import Image from "next/image";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "dash";
}

export default function Brand({
  className = "",
  size = "md",
}: BrandProps) {
  const sizes = {
    sm: 80,
    md: 100,
    lg: 150,
    dash: 112,
  };

  const currentSize = sizes[size];
  const logoSrc = "/logo.svg";

  return (
    <Image
      src={logoSrc}
      alt="FieldSpec Logo"
      width={currentSize}
      height={Math.round(currentSize * (149/734))}
      className={className ? `object-contain ${className}` : "object-contain"}
      style={{ border: "none" }}
    />
  );
}
