"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(true); // default: light (white navbar)

  useEffect(() => {
    // Persist preference in localStorage
    const saved = localStorage.getItem("fieldspec-theme");
    const prefersLight = saved ? saved === "light" : true;
    setIsLight(prefersLight);
    if (prefersLight) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("fieldspec-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("fieldspec-theme", "dark");
    }
  };

  return (
    <>
      <style>{`
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px;
          border-radius: 16px;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          cursor: pointer;
          font-size: 16px;
          color: #475569;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .theme-toggle-btn:hover {
          border-color: #31579b;
          background: #EEF4FB;
          color: #31579b;
        }
      `}</style>
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        <span className="material-symbols-outlined">
          {isLight ? "dark_mode" : "light_mode"}
        </span>
      </button>
    </>
  );
}
