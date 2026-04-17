"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

interface IdleLogoutProviderProps {
  children: React.ReactNode;
}

// Configuration
const IDLE_TIMEOUT = 28 * 60 * 1000; // 28 minutes to warning
const WARNING_TIMEOUT = 2 * 60 * 1000; // 2 minutes to logout
// For testing:
// const IDLE_TIMEOUT = 10 * 1000; 
// const WARNING_TIMEOUT = 10 * 1000;

export default function IdleLogoutProvider({ children }: IdleLogoutProviderProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(WARNING_TIMEOUT / 1000);
  const router = useRouter();

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      router.prefetch("/login");
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  }, [router]);

  const resetTimers = useCallback(() => {
    // Clear all existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    setShowWarning(false);
    setRemainingTime(WARNING_TIMEOUT / 1000);

    // Set wait for idle timer
    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      
      // Start countdown
      setRemainingTime(WARNING_TIMEOUT / 1000);
      countdownTimerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set ultimate logout timer
      warningTimerRef.current = setTimeout(() => {
        handleLogout();
      }, WARNING_TIMEOUT);

    }, IDLE_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    // Events to track
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    
    // Function to handle reset on activity
    const onActivity = () => {
      if (!showWarning) {
        resetTimers();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, onActivity);
    });

    // Start initial timer
    resetTimers();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, onActivity);
      });
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [resetTimers, showWarning]);

  const stayLoggedIn = () => {
    resetTimers();
  };

  return (
    <>
      {children}
      
      {showWarning && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: tokens.spacing.md,
          }}
        >
          <div
            style={{
              backgroundColor: tokens.colors.surfaceContainerHigh,
              padding: tokens.spacing.xl,
              borderRadius: tokens.radius.lg,
              boxShadow: tokens.elevation.level3,
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                ...tokens.typography.headlineSmall,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}
            >
              Session timeout
            </h2>
            <p
              style={{
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurfaceVariant,
                marginBottom: tokens.spacing.xl,
              }}
            >
              You've been inactive for a while. For your security, you will be logged out in{" "}
              <strong style={{ color: tokens.colors.primary }}>{remainingTime}</strong> seconds.
            </p>
            <div
              style={{
                display: "flex",
                gap: tokens.spacing.md,
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  borderRadius: tokens.radius.pill,
                  backgroundColor: "transparent",
                  color: tokens.colors.error,
                  border: `1px solid ${tokens.colors.outline}`,
                  cursor: "pointer",
                  ...tokens.typography.labelLarge,
                }}
              >
                Log Out Now
              </button>
              <button
                onClick={stayLoggedIn}
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  borderRadius: tokens.radius.pill,
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                  border: "none",
                  cursor: "pointer",
                  ...tokens.typography.labelLarge,
                }}
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
