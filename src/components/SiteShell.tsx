"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transparent = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Next.js's client-side router doesn't reliably auto-scroll to a URL
  // fragment on cross-page navigation, especially when the target section
  // lives inside a client component that mounts a beat after first paint.
  // Handle it ourselves so links like "/#recruitment-schedule" always land.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header transparent={transparent} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
