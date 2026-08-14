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
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
          scrolled || open
            ? "bg-[#3d080f]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(26,15,16,0.35)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5 text-[#f7f2e8]"
            onClick={() => setOpen(false)}
          >
            <Caduceus className="h-8 w-6 text-[#c9a24a] transition-transform duration-500 group-hover:scale-105 md:h-9 md:w-7" />
            <span className="font-display text-xl tracking-[0.08em] md:text-2xl">
              ΜΕΔ
            </span>
          </a>

          <nav
            className="hidden items-center gap-5 md:flex lg:gap-7 xl:gap-8"
            aria-label="Primary"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#f7f2e8]/75 transition-colors hover:text-[#e4c76b] lg:text-[0.8rem] lg:tracking-[0.18em]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#join"
              className="shrink-0 whitespace-nowrap border border-[#c9a24a]/60 bg-[#c9a24a]/10 px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#e4c76b] transition-colors hover:bg-[#c9a24a] hover:text-[#3d080f] lg:px-4 lg:text-[0.75rem] lg:tracking-[0.18em]"
            >
              Become a Brother
            </a>
          </nav>

          <button
            type="button"
            className="relative z-[70] flex h-10 w-10 shrink-0 items-center justify-center text-[#f7f2e8] md:hidden"
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
      </header>

      {/* Mobile menu as sibling overlay so it is never clipped by the header bar */}
      <div
        className={`fixed inset-0 z-[55] md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-[#3d080f] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          className={`relative flex h-full flex-col items-center justify-center gap-5 px-6 pt-16 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Mobile"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="font-display text-3xl tracking-wide text-[#f7f2e8] transition-colors hover:text-[#c9a24a]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="mt-4 border border-[#c9a24a]/60 px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#e4c76b]"
          >
            Become a Brother
          </a>
        </nav>
      </div>
    </>
  );
}
