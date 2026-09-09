"use client";

import { useEffect, useState } from "react";

export function OfficerBulletList({ items }: { items: string[] }) {
  const [revealed, setRevealed] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setSkipAnimation(true);
      setRevealed(true);
      return;
    }

    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item, index) => (
        <li
          key={item}
          className={`flex items-start gap-2.5 text-sm text-ink-muted transition-all duration-500 ease-out ${
            revealed || skipAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={
            skipAnimation ? undefined : { transitionDelay: `${index * 110}ms` }
          }
        >
          <span
            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
