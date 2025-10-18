"use client";

import { useMemo } from "react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/cn";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const iconContent = useMemo(() => (isDark ? "🌙" : "☀️"), [isDark]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "btn-secondary group inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "theme-toggle-ring",
      )}
      aria-label={`Activate ${isDark ? "light" : "dark"} mode`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "theme-toggle-orb inline-flex h-6 w-6 items-center justify-center rounded-full text-base shadow-sm transition-transform duration-500",
          isDark ? "bg-white text-slate-900 rotate-180" : "bg-slate-900 text-yellow-300 rotate-0",
          "group-hover:scale-105",
        )}
      >
        {iconContent}
      </span>
      <span className="text-hero-muted">
        {isDark ? "Dark" : "Light"} mode
      </span>
    </button>
  );
};

export default ThemeToggle;
