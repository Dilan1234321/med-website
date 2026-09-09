"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transparent = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin") ?? false;

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
