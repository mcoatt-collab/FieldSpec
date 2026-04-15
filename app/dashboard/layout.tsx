"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Brand from "@/components/Brand";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/dashboard/projects", label: "Projects", icon: "⬢" },
  { href: "/dashboard/upload", label: "Upload", icon: "⬆" },
  { href: "/dashboard/report", label: "Report", icon: "⬇" },
  { href: "/dashboard/map", label: "Map", icon: "⬟" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 flex flex-col bg-surface border-r border-outline-variant">
        <div className="p-lg border-b border-outline-variant">
          <Brand size="md" />
        </div>

        <nav className="flex-1 flex flex-col p-md gap-xs">
          {navItems.map((item) => {
            const isActive = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-md p-md rounded-md no-underline transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-transparent text-on-surface hover:bg-surface-variant"
                }`}
              >
                <span className="text-[18px]">{item.icon}</span>
                <span className="text-inherit text-label-large">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-md border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-md p-md rounded-md bg-transparent border-none cursor-pointer text-error transition-colors hover:bg-error-container/20"
          >
            <span className="text-[18px]">↪</span>
            <span className="text-inherit text-label-large">
              Logout
            </span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-surface">
        {children}
      </main>
    </div>
  );
}