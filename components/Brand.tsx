import Image from "next/image";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Brand({ className = "", size = "md" }: BrandProps) {
  const sizes = {
    sm: { img: 32, text: "text-title-medium" },
    md: { img: 40, text: "text-title-large" },
    lg: { img: 64, text: "text-headline-medium" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-xs ${className}`}>
      <div className="relative flex-shrink-0">
        <Image
          src="/logo.png"
          alt="FieldSpec Logo"
          width={currentSize.img}
          height={currentSize.img}
          className="object-contain"
        />
      </div>
      <span className={`text-primary font-bold ${currentSize.text}`}>
        FieldSpec
      </span>
    </div>
  );
}
