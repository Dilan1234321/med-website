"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Paperclip() {
  return (
    <svg
      viewBox="0 0 40 90"
      className="absolute -top-8 left-10 h-16 w-auto -rotate-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] md:-top-10 md:h-20"
      aria-hidden
    >
      <path
        d="M20 4 C29 4 36 11 36 20 L36 62 C36 74 27 83 15 83 C6 83 0 76 0 68 L0 26 C0 20 5 15 11 15 C17 15 22 20 22 26 L22 60"
        fill="none"
        stroke="#c7ccd4"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M20 4 C29 4 36 11 36 20 L36 62 C36 74 27 83 15 83 C6 83 0 76 0 68 L0 26 C0 20 5 15 11 15 C17 15 22 20 22 26 L22 60"
        fill="none"
        stroke="#9aa0aa"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FolderHero() {
  const wrapRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0,
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const p = Math.min(Math.max(progress, 0), 1);
  const coverProgress = Math.min(p / 0.7, 1);
  const coverAngle = -coverProgress * 108;
  const contentOpacity = Math.min(Math.max((p - 0.25) / 0.4, 0), 1);
  const contentLift = (1 - contentOpacity) * 24;
  const scrollHintOpacity = Math.max(1 - p * 6, 0);

  return (
    <header ref={wrapRef} className="relative h-[220vh]">
      <div className="pattern-maroon sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div
          className="relative aspect-[3/4] w-[min(82vw,380px)] md:w-[min(48vw,480px)]"
          style={{ perspective: "1800px" }}
        >
          {/* Folder inside — a quiet texture visible once the cover swings open */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end rounded-[10px] px-6 pb-10 text-center shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
            style={{ backgroundColor: "var(--folder-cream)" }}
          >
            <div
              className="transition-transform duration-300 ease-out"
              style={{ opacity: contentOpacity, transform: `translateY(${contentLift}px)` }}
            >
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-[#8a3b3b]/70">
                Scholarship · Service · Mentorship
              </p>
            </div>
          </div>

          {/* Folder front cover — the headline lives here, always visible */}
          <div
            className="absolute inset-0 flex origin-top flex-col items-center justify-center rounded-[10px] px-6 text-center"
            style={{
              backgroundColor: "var(--folder-cream)",
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 70%, var(--folder-cream-shadow) 100%)",
              transform: `rotateX(${coverAngle}deg)`,
              transformStyle: "preserve-3d",
              boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
            }}
          >
            <p className="font-display text-[clamp(1.9rem,6vw,3.2rem)] italic leading-[1.05] text-[color:var(--maroon-pattern-base)]">
              The Future of
            </p>
            <p className="font-display text-[clamp(1.9rem,6vw,3.2rem)] italic leading-[1.05] text-[color:var(--maroon-pattern-base)]">
              Medicine
            </p>
            <p className="mt-4 font-mono text-[0.7rem] font-bold tracking-[0.32em] text-[#8a3b3b] md:text-sm">
              MU EPSILON DELTA
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/membership#register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[color:var(--maroon)] px-8 text-sm font-bold tracking-wide text-white shadow-[0_10px_24px_rgba(28,7,7,0.3)] transition hover:bg-[color:var(--maroon-rich)]"
              >
                Register for Recruitment
              </Link>
            </div>
            <div
              className="absolute -right-2 top-1/3 h-16 w-4 rounded-l-md"
              style={{ backgroundColor: "var(--folder-cream)" }}
              aria-hidden
            />
          </div>

          <Paperclip />
        </div>

        <p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/70 transition-opacity"
          style={{ opacity: scrollHintOpacity }}
        >
          Scroll to open ↓
        </p>
      </div>
    </header>
  );
}
