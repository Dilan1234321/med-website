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

const links = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Recruitment" },
  { href: "/events", label: "Events" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
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
          <span className="font-display text-sm font-bold tracking-[0.18em] text-white sm:text-base">
            ΜΕΔ
          </span>
        </Link>

        <nav className="hidden lg:block" aria-label="Primary">
          <div className="nav-glass relative flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            {links.slice(0, 2).map((item) => (
              <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
            ))}

            <div
              className="relative"
              onMouseEnter={() => setFamilyOpen(true)}
              onMouseLeave={() => setFamilyOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-[0.8rem] font-medium tracking-wide text-white/80 transition hover:text-white ${
                  familyActive ? "text-white" : ""
                }`}
                aria-expanded={familyOpen}
                aria-haspopup="true"
              >
                The Family
                <span
                  className={`text-[0.65rem] text-gold transition ${familyOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ▾
                </span>
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
                        className="block px-5 py-3 text-center font-display text-[0.75rem] font-bold uppercase tracking-[0.16em] text-white/90 transition hover:bg-white/5 hover:text-gold"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {links.slice(2).map((item) => (
              <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/membership#register"
            className="btn btn-primary !min-h-10 !px-4 !text-[0.68rem] max-[380px]:hidden"
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

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[70] bg-[color:var(--nav-dark)] transition lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-6 px-6 pt-16">
          {links.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-white"
            >
              {item.label}
            </Link>
          ))}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
            The Family
          </p>
          {familyLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-xl font-bold uppercase tracking-[0.14em] text-white/90"
            >
              {item.label}
            </Link>
          ))}
          {links.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/calendar"
            onClick={() => setOpen(false)}
            className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-white"
          >
            Calendar
          </Link>
          <Link
            href="/membership#register"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-4"
          >
            Register for Rush
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  item,
  active,
}: {
  item: { href: string; label: string };
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`rounded-full px-5 py-3 text-[0.8rem] font-medium tracking-wide transition hover:text-white ${
        active ? "text-white" : "text-white/80"
      }`}
    >
      {item.label}
    </Link>
  );
}
