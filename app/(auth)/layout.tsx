import Link from "next/link";
import Brand from "@/components/Brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-variant p-md">
      <div className="mb-lg">
        <Link href="/" className="no-underline text-primary">
          <Brand size="lg" />
        </Link>
      </div>
      {children}
    </div>
  );
}
