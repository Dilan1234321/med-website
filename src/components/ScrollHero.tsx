"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function ScrollHero() {
  const wrapRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

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
          style={{ backgroundImage: "url('/images/hero-1.jpg')" }}
          role="img"
          aria-label="University campus architecture"
        />
        <div
          className="absolute inset-0 z-[2] rounded-t-[20px] bg-cover bg-center shadow-[0_-20px_40px_rgba(0,0,0,0.35)]"
          style={{
            backgroundImage: "url('/images/hero-2.jpg')",
            transform: `translateY(${secondY}%)`,
            filter: "brightness(0.9)",
          }}
          role="img"
          aria-label="Campus landmark at dusk"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(58,9,15,${0.2 + p * 0.45}) 100%)`,
            backdropFilter: `blur(${blur}px)`,
          }}
        />

        <div className="absolute inset-0 z-[3] text-white">
          <div
            className="absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 text-center transition-opacity"
            style={{ opacity: text1Opacity }}
          >
            <p className="text-[clamp(0.7rem,3vw,1.1rem)] font-bold uppercase tracking-[0.35em]">
              National Pre-Health Fraternity
            </p>
            <div className="accent-line" />
            <h1 className="font-display text-[clamp(2rem,8vw,4.5rem)] font-bold leading-tight tracking-[0.12em] drop-shadow-[2px_2px_20px_rgba(0,0,0,0.8)]">
              Mu Epsilon Delta
            </h1>
            <p className="mt-4 text-[clamp(0.65rem,2.2vw,0.95rem)] font-semibold uppercase tracking-[0.28em]">
              Scholarship · Service · Mentorship · Professional Development
            </p>
            <Link href="/membership#register" className="btn btn-primary mt-10">
              Register for Rush
            </Link>
          </div>

          <div
            className="absolute left-1/2 top-1/2 w-[90%] max-w-3xl -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              opacity: text2Opacity,
              pointerEvents: text2Opacity > 0.5 ? "auto" : "none",
            }}
          >
            <h2 className="font-display text-[clamp(1.5rem,5.5vw,3.2rem)] font-bold uppercase tracking-[0.14em] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
              Where brothers practice their art
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[clamp(0.7rem,2vw,1rem)] font-light uppercase leading-relaxed tracking-[0.08em] text-white/90">
              A professional medical fraternity preparing members for healthcare
              careers through structured scholarship, clinical exposure, and
              lifelong mentorship.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
