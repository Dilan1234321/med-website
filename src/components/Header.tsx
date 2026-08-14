"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Crest } from "./Crest";
import { ThemeToggle } from "./ThemeToggle";
import { primaryNav } from "@/lib/content";

const compactNav = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Membership" },
  { href: "/events", label: "Events" },
  { href: "/leadership", label: "Board" },
  { href: "/family", label: "Family" },
  { href: "/donate", label: "Donate" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink no-underline"
          aria-label="Mu Epsilon Delta home"
          onClick={closeMenu}
        >
          <Crest className="h-9 w-9 text-accent" />
          <span className="font-serif text-lg tracking-wide md:text-xl">
            ΜΕΔ
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Primary"
        >
          {compactNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[0.75rem] font-medium uppercase tracking-[0.12em] no-underline transition-colors ${
                  active ? "text-accent" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link
            href="/membership#register"
            className="btn btn-primary !min-h-9 !px-3 !text-[0.68rem]"
            onClick={closeMenu}
          >
            Register to Rush
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-1">
              <span
                className={`h-px w-full bg-ink transition ${open ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-full bg-ink transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-full bg-ink transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-line bg-bg lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav
          className="container-page flex max-h-[70vh] flex-col gap-1 overflow-y-auto py-4"
          aria-label="Mobile"
        >
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-1 py-2.5 font-serif text-xl text-ink no-underline"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/calendar"
            className="px-1 py-2.5 font-serif text-xl text-ink no-underline"
            onClick={closeMenu}
          >
            Calendar
          </Link>
          <div className="mt-3 sm:hidden">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
