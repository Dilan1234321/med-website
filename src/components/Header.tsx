"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Crest } from "./Crest";

const familyLinks = [
  { href: "/leadership", label: "Officers" },
  { href: "/family", label: "The Brothers" },
  { href: "/alumni", label: "Alumni" },
];

export function Header({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overHero = transparent && !scrolled && !open;
  const familyActive = familyLinks.some(
    (l) => pathname === l.href || pathname.startsWith(`${l.href}/`),
  );

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
        overHero
          ? "bg-transparent"
          : "border-b border-white/10 bg-[color:var(--nav-dark)] backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1280px] items-center justify-between gap-4 px-5 md:h-[5.25rem] md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 text-white"
          onClick={() => setOpen(false)}
        >
          <Crest className="h-11 w-11 text-gold md:h-12 md:w-12" title="Mu Epsilon Delta" />
          <span className="hidden h-8 w-px bg-white/35 sm:block" aria-hidden />
          <span className="font-display text-base font-semibold tracking-tight text-white sm:text-base">
            ΜΕΔ
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          <Link
            href="/membership"
            className={`text-base font-bold tracking-tight transition hover:text-white ${
              pathname.startsWith("/membership") ? "text-white" : "text-white/85"
            }`}
          >
            Recruitment
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setFamilyOpen(true)}
            onMouseLeave={() => setFamilyOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 text-base font-bold tracking-tight transition hover:text-white ${
                familyActive ? "text-white" : "text-white/85"
              }`}
              aria-expanded={familyOpen}
              aria-haspopup="true"
            >
              The Family
              <svg
                viewBox="0 0 12 8"
                className={`h-2.5 w-3.5 text-gold transition-transform duration-200 ${familyOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              className={`absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 pt-3 transition ${
                familyOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <ul className="overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--maroon)]/95 py-2 shadow-xl backdrop-blur-xl">
                {familyLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-5 py-3 text-center font-display text-[0.75rem] font-bold tracking-tight text-white/90 transition hover:bg-white/5 hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/events"
            className={`text-base font-bold tracking-tight transition hover:text-white ${
              pathname.startsWith("/events") ? "text-white" : "text-white/85"
            }`}
          >
            Events
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/membership#register"
            className="btn btn-gold !min-h-10 !px-4 !text-[0.72rem] max-[380px]:hidden"
          >
            Register for Rush
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-0.5 w-7 rounded bg-gold transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-7 rounded bg-gold transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-7 rounded bg-gold transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[70] bg-[color:var(--maroon)] transition-opacity duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-evenly px-6 py-24">
          <Link
            href="/membership"
            onClick={() => setOpen(false)}
            className="font-display text-3xl font-bold tracking-tight text-white transition hover:text-gold"
          >
            Recruitment
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            The Family
          </p>
          {familyLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-bold tracking-tight text-white/90 transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/events"
            onClick={() => setOpen(false)}
            className="font-display text-3xl font-bold tracking-tight text-white transition hover:text-gold"
          >
            Events
          </Link>
          <Link
            href="/membership#register"
            onClick={() => setOpen(false)}
            className="btn btn-gold mt-4"
          >
            Register for Rush
          </Link>
        </nav>
      </div>
    </>
  );
}
