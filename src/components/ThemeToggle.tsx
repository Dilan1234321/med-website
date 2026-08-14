"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-7 right-7 z-[90] flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/30 bg-[color:var(--maroon)]/90 text-gold shadow-[0_5px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition hover:scale-110 hover:rotate-12 hover:bg-gold hover:text-maroon-deep md:bottom-8 md:right-8 md:h-[60px] md:w-[60px]"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title="Toggle dark mode"
    >
      <span className="text-xl" aria-hidden>
        {theme === "light" ? "☾" : "☀"}
      </span>
    </button>
  );
}
