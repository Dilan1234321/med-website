"use client";

import { useEffect, useState } from "react";
import { Caduceus } from "./Caduceus";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#pillars", label: "Pillars" },
  { href: "#history", label: "History" },
  { href: "#chapters", label: "Chapters" },
  { href: "#join", label: "Join" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-maroon-deep/95 backdrop-blur-md shadow-[0_8px_32px_rgba(26,15,16,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-ivory"
          onClick={() => setOpen(false)}
        >
          <Caduceus className="h-8 w-6 text-gold transition-transform duration-500 group-hover:scale-105 md:h-9 md:w-7" />
          <span className="font-display text-xl tracking-[0.08em] md:text-2xl">
            ΜΕΔ
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-ivory/75 transition-colors hover:text-gold-bright"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            className="border border-gold/60 bg-gold/10 px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-gold-bright transition-colors hover:bg-gold hover:text-maroon-deep"
          >
            Become a Brother
          </a>
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center text-ivory md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-maroon-deep/98 transition-opacity duration-400 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-8"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl tracking-wide text-ivory transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
