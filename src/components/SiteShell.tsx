"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transparent = pathname === "/";

  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header transparent={transparent} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ThemeToggle />
    </ThemeProvider>
  );
}
