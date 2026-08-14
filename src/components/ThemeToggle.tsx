"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-secondary !min-h-9 !px-3 !text-[0.7rem]"
      aria-label={`Switch to ${next} mode`}
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
