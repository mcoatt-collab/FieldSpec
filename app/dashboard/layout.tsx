"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Brand from "@/components/Brand";
import { tokens } from "@/lib/design-tokens";
import "./layout.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/dashboard/projects", label: "Projects", icon: "folder" },
  { href: "/dashboard/upload", label: "Upload", icon: "upload" },
  { href: "/dashboard/report", label: "Report", icon: "description" },
  { href: "/dashboard/map", label: "Map", icon: "map" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.data?.name) {
            setUserName(data.data.name);
          }
        } else if (res.status === 401 || res.status === 404) {
          // Stale session or user deleted from db
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Light Overlay - covers entire screen when modal is open */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 40,
          }}
          onClick={() => {
            setShowDropdown(false);
            setShowLogoutModal(false);
          }}
        />
      )}

      {/* Header with Avatar */}
      <header
        className="flex items-center justify-between py-[12px] dash-header-padding"
        style={{
          backgroundColor: tokens.colors.surfaceContainerLow,
          borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className="dash-hamburger items-center justify-center rounded-full transition-colors"
            onClick={() => setShowMobileNav(true)}
            aria-label="Open navigation menu"
            style={{
              background: "transparent",
              border: "none",
              color: tokens.colors.onSurface,
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <span className="material-icons" style={{ fontSize: "24px" }}>menu</span>
          </button>
          <Brand size="md" />
        </div>
        
        <div className="relative inline-flex" ref={dropdownRef}>
          {/* Material 3 Avatar Button */}
          <button
            ref={avatarButtonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: tokens.colors.primaryContainer,
              color: tokens.colors.onPrimaryContainer,
              border: "none",
              cursor: "pointer",
              ...tokens.typography.labelLarge,
            }}
            aria-label="Account menu"
          >
            {getInitials(userName)}
          </button>

          {/* Dropdown Menu - Material 3 Style */}
          {showDropdown && (
            <div
              className="absolute right-0 top-full mt-sm rounded-2xl overflow-hidden"
              style={{
                right: 0,
                backgroundColor: tokens.colors.surfaceContainerHigh,
                boxShadow: tokens.elevation.level2,
                minWidth: "200px",
                zIndex: 100,
              }}
            >
              {/* User Info Section */}
              <div
                className="px-md py-md"
                style={{
                  borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
                }}
              >
                <p
                  className="truncate"
                  style={{
                    ...tokens.typography.labelLarge,
                    color: tokens.colors.onSurface,
                  }}
                >
                  {userName}
                </p>
                <p
                  className="truncate"
                  style={{
                    ...tokens.typography.labelSmall,
                    color: tokens.colors.onSurfaceVariant,
                  }}
                >
                  Signed in
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-sm">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowLogoutModal(true);
                  }}
                  className="flex items-center gap-md w-full px-md py-sm text-left transition-colors"
                  style={{
                    color: tokens.colors.error,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    ...tokens.typography.labelLarge,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      tokens.colors.errorContainer;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span
                    className="material-icons"
                    style={{ fontSize: "20px" }}
                  >
                    logout
                  </span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden dash-main-padding">
        <aside
          className="dash-sidebar flex-shrink-0 flex-col"
          style={{
            width: "calc(280px)",
            backgroundColor: tokens.colors.surfaceContainerLow,
            borderRight: `1px solid ${tokens.colors.outlineVariant}`,
          }}
        >
          <nav className="flex-1 flex flex-col p-sm gap-xs mt-md">
            {navItems.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-md no-underline transition-all duration-200 ${
                    isActive
                      ? "bg-secondary-container text-on-secondary-container"
                      : "text-on-surface-variant hover:bg-secondary-container/50"
                  }`}
                  style={{
                    ...tokens.typography.labelLarge,
                    padding: "12px",
                    gap: "calc(0.25rem * 3)",
                    fontSize: "16px",
                  }}
                >
                  <span className="material-icons" style={{ fontSize: "20px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main
          className="flex-1 overflow-y-auto"
          style={{ 
            backgroundColor: tokens.colors.surface,
            padding: "8px",
            marginTop: "16px"
          }}
        >
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMobileNav && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100, // Higher than header
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => setShowMobileNav(false)}
          />

          {/* Drawer Content */}
          <aside
            className="flex flex-col"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "calc(280px)",
              backgroundColor: tokens.colors.surfaceContainerLow,
              boxShadow: tokens.elevation.level2,
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{
                padding: "12px 18px",
                borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
              }}
            >
              <Brand size="md" />
              <button
                onClick={() => setShowMobileNav(false)}
                className="flex items-center justify-center rounded-full transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  color: tokens.colors.onSurfaceVariant,
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <span className="material-icons" style={{ fontSize: "24px" }}>close</span>
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col p-sm gap-xs mt-md overflow-y-auto">
              {navItems.map((item) => {
                const isActive = item.href === pathname;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileNav(false)}
                    className={`flex items-center rounded-md no-underline transition-all duration-200 ${
                      isActive
                        ? "bg-secondary-container text-on-secondary-container"
                        : "text-on-surface-variant hover:bg-secondary-container/50"
                    }`}
                    style={{
                      ...tokens.typography.labelLarge,
                      padding: "12px",
                      gap: "calc(0.25rem * 3)",
                      fontSize: "16px",
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: "20px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Logout Confirmation Modal - Centered */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          {/* Modal Backdrop */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Modal Content */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              backgroundColor: tokens.colors.surfaceContainerHigh,
              boxShadow: tokens.elevation.level3,
              width: "100%",
              maxWidth: "320px",
              margin: tokens.spacing.lg,
            }}
          >
            <div className="p-lg">
              <h2
                style={{
                  ...tokens.typography.headlineSmall,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.sm,
                }}
              >
                Confirm Logout
              </h2>
              <p
                style={{
                  ...tokens.typography.bodyMedium,
                  color: tokens.colors.onSurfaceVariant,
                  marginBottom: tokens.spacing.lg,
                }}
              >
                Are you sure you want to logout of your account?
              </p>

              <div className="flex justify-end gap-sm">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-md py-sm rounded-pill text-label-large transition-colors"
                  style={{
                    backgroundColor: tokens.colors.surfaceContainerLow,
                    color: tokens.colors.primary,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-md py-sm rounded-pill text-label-large transition-colors"
                  style={{
                    backgroundColor: tokens.colors.error,
                    color: tokens.colors.onError,
                    border: "none",
                    cursor: isLoggingOut ? "not-allowed" : "pointer",
                    opacity: isLoggingOut ? 0.7 : 1,
                  }}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
