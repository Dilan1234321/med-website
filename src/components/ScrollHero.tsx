"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";

export function ScrollHero() {
  const wrapRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const { site } = content;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

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
  const secondY = (1 - p) * 100;
  const blur = p * 8;
  const text1Opacity = Math.max(1 - p * 1.6, 0);
  const text2Opacity = Math.min(Math.max((p - 0.35) / 0.4, 0), 1);

  return (
    <header ref={wrapRef} className="relative h-[160vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-tampa-1.jpg')" }}
          role="img"
          aria-label="Tampa Bay skyline"
        />
        <div
          className="absolute inset-0 z-[2] rounded-t-[20px] bg-cover bg-center shadow-[0_-20px_40px_rgba(0,0,0,0.35)]"
          style={{
            backgroundImage: "url('/images/hero-1.jpg')",
            transform: `translateY(${secondY}%)`,
            filter: "brightness(0.92)",
          }}
          role="img"
          aria-label="University campus architecture"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `linear-gradient(to bottom, rgba(28,7,7,0.15) 0%, rgba(28,7,7,${0.45 + p * 0.4}) 100%)`,
            backdropFilter: `blur(${blur}px)`,
          }}
        />

        <div className="absolute inset-0 z-[3] text-white">
          <div
            className="absolute left-1/2 top-[46%] w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 text-center transition-opacity"
            style={{ opacity: text1Opacity }}
          >
            <p className="font-mono text-[0.7rem] tracking-[0.2em] text-gold-soft uppercase md:text-xs">
              {site.university}
            </p>
            <div className="accent-line" />
            <h1 className="heading-display text-[clamp(2.75rem,9vw,5.5rem)] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
              Mu Epsilon Delta
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[clamp(0.95rem,2vw,1.1rem)] font-medium leading-relaxed text-white/88">
              Pre-health professional fraternity · Scholarship, service &amp;
              mentorship
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/membership#register" className="btn btn-gold">
                Register for Rush
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Explore chapter
              </Link>
            </div>
          </div>

          <div
            className="absolute left-1/2 top-[46%] w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              opacity: text2Opacity,
              pointerEvents: text2Opacity > 0.5 ? "auto" : "none",
            }}
          >
            <h2 className="heading-display text-[clamp(2rem,6vw,3.5rem)] text-white">
              Where Spartans practice their art
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/88 md:text-lg">
              {site.tagline}
            </p>
          </div>

          <p
            className="absolute bottom-6 left-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/85 md:bottom-8 md:left-8 md:text-xs"
            style={{ opacity: text1Opacity }}
          >
            UT Chapter
          </p>
          <p
            className="absolute bottom-6 right-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/85 md:bottom-8 md:right-8 md:text-xs"
            style={{ opacity: text1Opacity }}
          >
            Tampa, FL
          </p>
        </div>
      </div>
    </header>
  );
}
