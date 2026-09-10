"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const HEADLINE = "Building the future\nof medicine";
const TYPE_SPEED_MS = 42;

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
  // Whether the folder has finished its "slammed onto the table" landing.
  const [hasLanded, setHasLanded] = useState(false);
  // How many characters of HEADLINE are currently revealed by the typewriter.
  const [typedCount, setTypedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [showMed, setShowMed] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion: skip straight to the fully-settled state.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyPreference = (matches: boolean) => {
      setReducedMotion(matches);
      if (matches) {
        setHasLanded(true);
        setTypedCount(HEADLINE.length);
        setTypingDone(true);
        setShowMed(true);
        setShowButton(true);
      }
    };

    applyPreference(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => applyPreference(event.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // The instant the landing animation ends, kick everything else off.
  function handleFolderAnimationEnd(event: React.AnimationEvent<HTMLDivElement>) {
    if (event.animationName === "folder-drop" && !hasLanded) {
      setHasLanded(true);
    }
  }

  // Safety net: the CTA is the whole point of this hero, so it must never
  // be permanently stuck behind a dropped animationend event (backgrounded
  // tabs, browser throttling, etc. can all cause that). If landing hasn't
  // fired shortly after the drop animation should have finished, force it.
  useEffect(() => {
    if (reducedMotion || hasLanded) return;
    const timer = setTimeout(() => setHasLanded(true), 1500);
    return () => clearTimeout(timer);
  }, [reducedMotion, hasLanded]);

  // Typewriter: reveal one more character every tick until the headline is complete.
  useEffect(() => {
    if (!hasLanded || reducedMotion || typingDone) return;

    if (typedCount >= HEADLINE.length) {
      setTypingDone(true);
      return;
    }

    const timer = setTimeout(() => setTypedCount((count) => count + 1), TYPE_SPEED_MS);
    return () => clearTimeout(timer);
  }, [hasLanded, reducedMotion, typedCount, typingDone]);

  // Once typing is done, cascade ΜΕΔ in, then the button shortly after —
  // paced slowly so the reveal reads as a deliberate, natural beat rather
  // than everything popping in immediately after the last keystroke.
  useEffect(() => {
    if (!typingDone || reducedMotion) return;
    const timer = setTimeout(() => setShowMed(true), 450);
    return () => clearTimeout(timer);
  }, [typingDone, reducedMotion]);

  useEffect(() => {
    if (!showMed || reducedMotion) return;
    // Wait for ΜΕΔ's own fade-up (0.6s) to fully settle before the button follows.
    const timer = setTimeout(() => setShowButton(true), 650);
    return () => clearTimeout(timer);
  }, [showMed, reducedMotion]);

  const typedText = HEADLINE.slice(0, typedCount);
  const [line1, line2 = ""] = typedText.split("\n");
  const showCursor = !reducedMotion && hasLanded && !typingDone;

  return (
    <header className="pattern-maroon relative flex h-[100svh] items-center justify-center overflow-hidden">
      <style>{`
        @keyframes folder-drop {
          0% {
            transform: translateY(-160%) scale(1.18) rotate(-9deg);
            opacity: 0;
          }
          50% {
            transform: translateY(4%) scale(1.05) rotate(2deg);
            opacity: 1;
          }
          68% {
            transform: translateY(-3%) scale(0.97) rotate(-1deg);
          }
          84% {
            transform: translateY(1%) scale(1.015) rotate(0.5deg);
          }
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .folder-drop-in {
          animation: folder-drop 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }

        @keyframes folder-impact-shadow {
          0% {
            box-shadow: 0 24px 50px rgba(0, 0, 0, 0.4), 0 0 0 0 rgba(201, 162, 74, 0);
          }
          30% {
            box-shadow: 0 24px 50px rgba(0, 0, 0, 0.4), 0 0 0 22px rgba(201, 162, 74, 0.28);
          }
          100% {
            box-shadow: 0 24px 50px rgba(0, 0, 0, 0.4), 0 0 0 0 rgba(201, 162, 74, 0);
          }
        }

        .folder-impact {
          animation: folder-impact-shadow 0.6s ease-out both;
        }

        @keyframes folder-impact-flash {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.35);
          }
          25% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) scale(1.7);
          }
        }

        .folder-impact-flash {
          animation: folder-impact-flash 0.55s ease-out both;
        }

        @keyframes hero-cursor-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        .hero-cursor {
          animation: hero-cursor-blink 0.9s step-end infinite;
        }

        @keyframes hero-pop-in {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.82);
          }
          65% {
            opacity: 1;
            transform: translateY(0) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .hero-fade-up {
          animation: hero-pop-in 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
      `}</style>

      <div className="relative aspect-[3/4] w-[min(82vw,380px)] md:w-[min(48vw,480px)]">
        {!reducedMotion && hasLanded && (
          <div
            className="folder-impact-flash pointer-events-none absolute -bottom-[6%] left-1/2 h-[16%] w-[70%] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.85), rgba(201,162,74,0.35) 45%, rgba(201,162,74,0) 75%)",
            }}
            aria-hidden
          />
        )}

        <div
          className={[
            "relative flex h-full flex-col items-center justify-center rounded-[10px] px-6 text-center",
            !reducedMotion ? "folder-drop-in" : "",
            !reducedMotion && hasLanded ? "folder-impact" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            backgroundColor: "var(--folder-cream)",
            backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 70%, var(--folder-cream-shadow) 100%)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
          }}
          onAnimationEnd={handleFolderAnimationEnd}
        >
          <p className="min-h-[1.05em] font-display text-[clamp(1.9rem,6vw,3.2rem)] leading-[1.05] text-[color:var(--maroon-pattern-base)]">
            {line1}
            {showCursor && line2 === "" ? (
              <span className="hero-cursor" aria-hidden>
                |
              </span>
            ) : null}
          </p>
          <p className="min-h-[1.05em] font-display text-[clamp(1.9rem,6vw,3.2rem)] leading-[1.05] text-[color:var(--maroon-pattern-base)]">
            {line2}
            {showCursor && line2 !== "" ? (
              <span className="hero-cursor" aria-hidden>
                |
              </span>
            ) : null}
          </p>

          {showMed && (
            <p
              className={reducedMotion ? "mt-4 text-2xl font-bold tracking-wide text-[#8a3b3b]" : "hero-fade-up mt-4 text-2xl font-bold tracking-wide text-[#8a3b3b]"}
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              ΜΕΔ
            </p>
          )}

          {showButton && (
            <div className={reducedMotion ? "mt-7 flex justify-center" : "hero-fade-up mt-7 flex justify-center"}>
              <Link
                href="/membership#register"
                className="register-glow inline-flex min-h-12 items-center justify-center rounded-xl bg-[color:var(--maroon)] px-8 text-sm font-bold tracking-wide text-white shadow-[0_10px_24px_rgba(28,7,7,0.3)] transition hover:bg-[color:var(--maroon-rich)]"
              >
                Register for Recruitment
              </Link>
            </div>
          )}

          <div
            className="absolute -right-2 top-1/3 h-16 w-4 rounded-l-md"
            style={{ backgroundColor: "var(--folder-cream)" }}
            aria-hidden
          />
        </div>

        <Paperclip />
      </div>
    </header>
  );
}
