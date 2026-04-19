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
          gap: 6px;
          padding: 7px 14px;
          border-radius: 20px;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          font-family: inherit;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-left: 8px;
        }
        .theme-toggle-btn:hover {
          border-color: #31579b;
          background: #EEF4FB;
          color: #31579b;
          transform: translateY(-1px);
        }
        .theme-toggle-icon {
          font-size: 15px;
          line-height: 1;
        }
      `}</style>
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        <span className="material-symbols-outlined theme-toggle-icon">
          {isLight ? "dark_mode" : "light_mode"}
        </span>
        {isLight ? "Dark" : "Light"}
      </button>
    </>
  );
}
