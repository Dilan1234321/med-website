"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { content, formatDate } from "@/lib/content";

type Event = (typeof content)["events"]["upcoming"][number];

export function RecruitmentBand({ events }: { events: Event[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#12203a] py-16 text-[#f4ecd8] md:py-20"
    >
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-10 top-1/2 h-56 w-56 -translate-y-1/2 opacity-[0.12] md:h-72 md:w-72"
        aria-hidden
      >
        <circle cx="100" cy="100" r="92" fill="none" stroke="#d4b96a" strokeWidth="2" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#d4b96a" strokeWidth="1" />
        <path d="M100 12 L108 100 L100 188 L92 100 Z" fill="#d4b96a" />
        <path d="M12 100 L100 92 L188 100 L100 108 Z" fill="#d4b96a" opacity="0.6" />
      </svg>

      <div className="container-page relative w-full">
        <div
          className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#d4b96a]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v10m0 0c-3.5 0-6-2-6-2m6 2c3.5 0 6-2 6-2M6 11h12" strokeLinecap="round" />
          </svg>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.28em] text-[#d4b96a]">
            Fall &apos;26 Recruitment Schedule
          </p>
          <h2 className="heading-display mt-3 text-[clamp(1.9rem,5vw,3rem)] text-[#f4ecd8]">
            Set sail into recruitment!
          </h2>
        </div>

        <div className="relative mx-auto mt-12 max-w-xl md:max-w-2xl">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-[#d4b96a]/30 md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />
          <ol className="space-y-8">
            {events.map((event, i) => (
              <li
                key={event.id}
                className={`relative pl-8 transition-all duration-700 ease-out md:pl-0 ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
              >
                <span
                  className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#d4b96a] bg-[#12203a] md:left-1/2 md:-translate-x-1/2"
                  aria-hidden
                />
                <div className="md:mx-auto md:w-fit md:max-w-md md:text-center">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#d4b96a]">
                    {formatDate(event.date)}
                  </span>
                  <p className="mt-1 font-display text-lg font-semibold text-[#f4ecd8]">
                    {event.title}
                  </p>
                  <p className="mt-1 font-mono text-[0.7rem] tracking-wide text-[#f4ecd8]/70">
                    {event.time}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div
          className={`mt-10 flex justify-center transition-all duration-700 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: inView ? "550ms" : "0ms" }}
        >
          <Link href="/membership" className="btn btn-gold">
            See the full schedule →
          </Link>
        </div>
      </div>
    </section>
  );
}
