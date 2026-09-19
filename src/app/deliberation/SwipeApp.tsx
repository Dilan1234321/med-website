"use client";

import { useEffect, useMemo, useState } from "react";
import familyFile from "../../../content/family.json";
import type { Candidate } from "./types";

type FamilyMember = { name: string; photo: string };

function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

const FAMILY: FamilyMember[] = familyFile as FamilyMember[];
const FAMILY_BY_FULL_NAME = new Map(FAMILY.map((m) => [normalizeName(m.name), m]));
const FAMILY_BY_FIRST_NAME = (() => {
  const map = new Map<string, FamilyMember[]>();
  for (const m of FAMILY) {
    const first = normalizeName(m.name.split(" ")[0]);
    map.set(first, [...(map.get(first) ?? []), m]);
  }
  return map;
})();

/** Match a raw note's "brother" label (a full name, a first name only, or
 *  "From their application: ..." for a self-reported note) to a real,
 *  photographed chapter member from content/family.json. Ambiguous first
 *  names (more than one member shares it) and application-note labels
 *  intentionally return no match rather than guess. */
function matchFamilyMember(brotherLabel: string): FamilyMember | null {
  if (brotherLabel.startsWith("From their application:")) return null;
  const full = FAMILY_BY_FULL_NAME.get(normalizeName(brotherLabel));
  if (full) return full;
  const firstNameOnly = normalizeName(brotherLabel.trim().split(/\s+/)[0] ?? "");
  const candidates = FAMILY_BY_FIRST_NAME.get(firstNameOnly);
  if (candidates && candidates.length === 1) return candidates[0];
  return null;
}

const STORAGE_KEY = "final-decisions-v1";
const SWIPE_THRESHOLD = 110;
const TAP_THRESHOLD = 6;

type Stage = "round1" | "round2" | "results";
type Verdict = "advance" | "release";

type HistoryEntry = {
  stage: "round1" | "round2";
  candidateId: string;
  previousVerdict: Verdict | undefined;
  previousFavorite: boolean;
};

type PersistedState = {
  stage: Stage;
  round1: Record<string, Verdict>;
  round2: Record<string, Verdict>;
  favorites: Record<string, boolean>;
  round1Index: number;
  round2Index: number;
  round2Queue: string[];
  history: HistoryEntry[];
};

function initialState(): PersistedState {
  return {
    stage: "round1",
    round1: {},
    round2: {},
    favorites: {},
    round1Index: 0,
    round2Index: 0,
    round2Queue: [],
    history: [],
  };
}

function loadState(candidateIds: string[]): PersistedState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as PersistedState;
    const known = new Set(candidateIds);
    const touchedIds = [...Object.keys(parsed.round1 ?? {}), ...Object.keys(parsed.favorites ?? {})];
    // Any decided/favorited id that's no longer on the roster means the
    // candidate list itself changed (people added or removed) - the old
    // stage/index bookkeeping no longer lines up with the new queue
    // length, so start clean rather than risk an out-of-bounds index.
    const datasetChanged = touchedIds.some((id) => !known.has(id));
    if (datasetChanged) return initialState();
    return { ...initialState(), ...parsed };
  } catch {
    return initialState();
  }
}

function Avatar({ name, photo, className = "" }: { name: string; photo: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-cover bg-center font-display font-semibold text-white ${className}`}
      style={{
        backgroundColor: "var(--maroon)",
        backgroundImage: photo ? `url('${photo}')` : undefined,
      }}
    >
      {!photo && <span className="text-6xl">{name.charAt(0).toUpperCase()}</span>}
    </div>
  );
}

function DetailSheet({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sourceNames = useMemo(() => {
    const names = candidate.notes
      .filter((n) => !n.brother.startsWith("From their application:"))
      .map((n) => matchFamilyMember(n.brother)?.name ?? n.brother);
    return Array.from(new Set(names));
  }, [candidate]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        style={{ animation: "sheetPopIn 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0">
          <Avatar name={candidate.name} photo={candidate.photo} className="h-56 w-full" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-xl font-bold text-white hover:bg-black/60"
          >
            &times;
          </button>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-10">
            <h2 className="font-display text-2xl font-bold text-white">{candidate.name}</h2>
            <p className="text-sm text-white/85">
              {candidate.year}, {candidate.major}, {candidate.careerPath}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4 flex flex-col items-center gap-2" style={{ animation: "fadeInUp 0.35s ease-out 0.05s both" }}>
            <button
              type="button"
              onClick={() => setSourcesOpen((v) => !v)}
              className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 transition hover:bg-slate-200"
            >
              {candidate.sourceCount} {candidate.sourceCount === 1 ? "source" : "sources"}
            </button>
            {sourcesOpen && (
              <div className="flex flex-wrap justify-center gap-2">
                {sourceNames.length === 0 ? (
                  <span className="text-xs text-slate-400">No named sources yet.</span>
                ) : (
                  sourceNames.map((n, i) => (
                    <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {n}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>

          <section className="mb-5" style={{ animation: "fadeInUp 0.35s ease-out 0.1s both" }}>
            <h3 className="text-base font-bold text-emerald-700">Strengths</h3>
            {candidate.strengths.length === 0 ? (
              <p className="mt-1 text-sm text-slate-400">None noted.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1.5">
                {candidate.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug text-slate-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                    {s.text}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mb-5" style={{ animation: "fadeInUp 0.35s ease-out 0.15s both" }}>
            <h3 className="text-base font-bold text-red-700">Concerns</h3>
            {candidate.concerns.length === 0 ? (
              <p className="mt-1 text-sm text-slate-400">None noted.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1.5">
                {candidate.concerns.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug text-slate-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
                    {c.text}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {candidate.facts.length > 0 && (
            <section className="mb-5" style={{ animation: "fadeInUp 0.35s ease-out 0.2s both" }}>
              <h3 className="text-base font-bold text-slate-700">Facts and experience</h3>
              <ul className="mt-2 flex flex-col gap-1.5">
                {candidate.facts.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {candidate.notes.length > 0 && (
            <section style={{ animation: "fadeInUp 0.35s ease-out 0.25s both" }}>
              <h3 className="text-base font-bold text-slate-700">What brothers said</h3>
              <ul className="mt-3 flex flex-col gap-4">
                {candidate.notes.map((n, i) => {
                  const member = matchFamilyMember(n.brother);
                  return (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      {member ? (
                        <Avatar name={member.name} photo={member.photo} className="h-10 w-10 shrink-0 rounded-full" />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 font-semibold text-slate-900">{member ? member.name : n.brother}</p>
                        <p className="whitespace-pre-line">{n.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
      <style>{`
        @keyframes sheetPopIn {
          0% { opacity: 0; transform: scale(0.92) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SwipeCard({
  candidate,
  isTop,
  depth,
  externalExit,
  onDecide,
  onOpenDetail,
}: {
  candidate: Candidate;
  isTop: boolean;
  depth: number;
  externalExit: { verdict: Verdict; favorite: boolean } | null;
  onDecide: (verdict: Verdict, favorite: boolean) => void;
  onOpenDetail: () => void;
}) {
  const [drag, setDrag] = useState<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const [exiting, setExiting] = useState<{ verdict: Verdict; favorite: boolean } | null>(null);

  const dx = drag ? drag.x - drag.startX : 0;
  const dy = drag ? drag.y - drag.startY : 0;
  const rotation = dx * 0.06;

  function onPointerDown(e: React.PointerEvent) {
    if (!isTop || exiting) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDrag({ x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    setDrag({ ...drag, x: e.clientX, y: e.clientY });
  }

  function onPointerUp() {
    if (!drag) return;
    const moved = Math.hypot(dx, dy);
    if (moved < TAP_THRESHOLD) {
      setDrag(null);
      onOpenDetail();
      return;
    }
    if (dx > SWIPE_THRESHOLD) {
      setExiting({ verdict: "advance", favorite: false });
    } else if (dx < -SWIPE_THRESHOLD) {
      setExiting({ verdict: "release", favorite: false });
    } else {
      setDrag(null);
    }
  }

  useEffect(() => {
    if (externalExit && !exiting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrag(null);
      setExiting(externalExit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalExit]);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => onDecide(exiting.verdict, exiting.favorite), 220);
    return () => clearTimeout(t);
  }, [exiting, onDecide]);

  const exitTransform =
    exiting?.verdict === "advance"
      ? "translate(140%, -20px) rotate(24deg)"
      : exiting?.verdict === "release"
        ? "translate(-140%, -20px) rotate(-24deg)"
        : undefined;

  const transform = exitTransform ?? (drag ? `translate(${dx}px, ${dy}px) rotate(${rotation}deg)` : undefined);

  const likeOpacity = exiting?.verdict === "advance" ? 1 : Math.max(0, Math.min(1, dx / SWIPE_THRESHOLD));
  const nopeOpacity = exiting?.verdict === "release" ? 1 : Math.max(0, Math.min(1, -dx / SWIPE_THRESHOLD));

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
      className="absolute inset-0 flex touch-none select-none flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      style={{
        transform: transform ?? `scale(${1 - depth * 0.04}) translateY(${depth * 14}px)`,
        transition: drag ? "none" : "transform 0.25s ease",
        zIndex: 10 - depth,
        cursor: isTop ? "grab" : "default",
      }}
    >
      <Avatar name={candidate.name} photo={candidate.photo} className="h-full w-full" />

      {isTop && (
        <>
          <div
            className="absolute left-6 top-8 rotate-[-18deg] rounded-lg border-4 border-emerald-400 px-4 py-1 text-2xl font-black uppercase tracking-wide text-emerald-400"
            style={{ opacity: likeOpacity }}
          >
            Advance
          </div>
          <div
            className="absolute right-6 top-8 rotate-[18deg] rounded-lg border-4 border-red-500 px-4 py-1 text-2xl font-black uppercase tracking-wide text-red-500"
            style={{ opacity: nopeOpacity }}
          >
            Release
          </div>
        </>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-5 pb-6 pt-16">
        <h2 className="font-display text-3xl font-bold text-white drop-shadow-sm">{candidate.name}</h2>
        <p className="mt-1 text-base text-white/90">
          {candidate.year}, {candidate.major}
        </p>
        <p className="text-sm text-white/70">{candidate.careerPath}</p>
      </div>
    </div>
  );
}

function UndoIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="m11.87 2a10.164 10.164 0 0 0 -5.7 1.752l-1.463-1.458a1 1 0 0 0 -1.707.706v5a1 1 0 0 0 1 1h5a1 1 0 0 0 .707-1.707l-.621-.621a6.126 6.126 0 0 1 8.914 5.328 6.145 6.145 0 0 1 -12.065 1.5 2 2 0 0 0 -3.87 1.01 10.144 10.144 0 0 0 19.935-2.51 10.077 10.077 0 0 0 -10.13-10z" />
    </svg>
  );
}

function HeartbreakIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 -38 512 512" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="m204.789062 285 49.394532-49.394531c5.859375-5.859375 5.859375-15.351563 0-21.210938l-45.789063-45.792969 39.140625-97.851562c1.890625-4.746094 1.242188-10.136719-1.730468-14.296875-25.328126-35.34375-66.371094-56.453125-109.804688-56.453125-79.308594 0-136 61.964844-136 150.6875 0 110.628906 92.28125 166.726562 219.699219 277.164062 6.933593 6.011719 11.535156 11.234376 20.640625 8.4375 4.980468-1.582031 8.773437-5.609374 10.035156-10.679687l16.949219-67.777344c1.289062-5.109375-.222657-10.515625-3.941407-14.238281zm0 0" />
      <path d="m376 0c-26.234375 0-51.695312 7.542969-73.621094 21.824219-2.59375 1.6875-4.585937 4.132812-5.742187 7.003906l-49.367188 123.382813c-2.226562 5.566406-.921875 11.925781 3.324219 16.171874l56.617188 56.617188-49.394532 49.394531c-5.859375 5.859375-5.859375 15.351563 0 21.210938l44.792969 44.796875-15.175781 60.761718c-1.59375 6.34375 1.128906 12.992188 6.710937 16.421876 8.34375 5.105468 14.519531 1.261718 20.992188-4.351563 43.503906-37.632813 77.871093-67.355469 108.25-96.417969 45.351562-43.402344 88.613281-93.574218 88.613281-166.128906 0-88.722656-56.691406-150.6875-136-150.6875zm0 0" />
    </svg>
  );
}

function HeartIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
    </svg>
  );
}

function StarIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 512 512" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="m497.697 242.93c12.975-12.641 17.554-31.194 11.954-48.41-5.59-17.223-20.199-29.54-38.126-32.145l-110.687-16.083c-5.619-.82-10.474-4.347-12.986-9.435l-49.501-100.308c-8.015-16.235-24.244-26.32-42.352-26.32s-34.337 10.085-42.352 26.32c0 .001-49.501 100.307-49.501 100.307-2.512 5.09-7.367 8.617-12.977 9.435l-110.694 16.083c-17.928 2.606-32.537 14.923-38.124 32.137-5.603 17.225-1.024 35.779 11.947 48.416l80.098 78.084c4.063 3.959 5.917 9.662 4.96 15.249l-18.912 110.254c-3.056 17.85 4.143 35.548 18.788 46.186 14.648 10.643 33.708 12.022 49.744 3.599l99.002-52.052c5.022-2.639 11.019-2.638 16.036-.003l99.01 52.055c16.036 8.424 35.096 7.044 49.744-3.599 14.644-10.639 21.844-28.336 18.788-46.186l-18.913-110.249c-.957-5.592.896-11.295 4.962-15.257z" />
    </svg>
  );
}

type FloatingHeart = { id: number; left: number; delay: number; duration: number; size: number; drift: number };

function randomHearts(count: number): FloatingHeart[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 4 + Math.random() * 92,
    delay: Math.random() * 0.35,
    duration: 1.5 + Math.random() * 0.9,
    size: 18 + Math.random() * 22,
    drift: (Math.random() - 0.5) * 80,
  }));
}

function HeartBurst({ hearts }: { hearts: FloatingHeart[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background: "linear-gradient(to top, rgba(16,185,129,0.65), rgba(16,185,129,0.18) 45%, transparent 85%)",
          animation: "heartglow 1.4s ease-out forwards",
        }}
      />
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-0 text-emerald-400"
          style={
            {
              left: `${h.left}%`,
              "--drift": `${h.drift}px`,
              animation: `heartfloat ${h.duration}s ease-out ${h.delay}s forwards`,
            } as React.CSSProperties
          }
        >
          <HeartIcon style={{ width: h.size, height: h.size }} />
        </span>
      ))}
      <style>{`
        @keyframes heartglow {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes heartfloat {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translate(var(--drift), -75vh) scale(1.15); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function AutoBidCelebration({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center px-8 sm:px-16" style={{ backgroundColor: "var(--gold)" }}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-black/10 text-2xl font-bold text-white hover:bg-black/20"
      >
        &times;
      </button>
      <div className="flex items-center gap-5 sm:gap-8">
        <StarIcon className="h-20 w-20 shrink-0 text-white sm:h-32 sm:w-32" />
        <p className="font-display text-4xl font-bold text-white sm:text-6xl">Auto-Bid!</p>
      </div>
    </div>
  );
}

function ActionBar({
  onUndo,
  canUndo,
  onRelease,
  onAdvance,
  onFavorite,
  disabled,
}: {
  onUndo: () => void;
  canUndo: boolean;
  onRelease: () => void;
  onAdvance: () => void;
  onFavorite: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-6 sm:gap-6">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo || disabled}
        aria-label="Undo"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <UndoIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onRelease}
        disabled={disabled}
        aria-label="Release"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 sm:h-[4.5rem] sm:w-[4.5rem]"
      >
        <HeartbreakIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      </button>
      <button
        type="button"
        onClick={onAdvance}
        disabled={disabled}
        aria-label="Advance"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 sm:h-[4.5rem] sm:w-[4.5rem]"
      >
        <HeartIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      </button>
      <button
        type="button"
        onClick={onFavorite}
        disabled={disabled}
        aria-label="Favorite"
        className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
        style={{ backgroundColor: "var(--gold)" }}
      >
        <StarIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function ResultsScreen({
  candidates,
  favorites,
  onOpenDetail,
}: {
  candidates: Candidate[];
  favorites: Record<string, boolean>;
  onOpenDetail: (id: string) => void;
}) {
  const sorted = useMemo(
    () => [...candidates].sort((a, b) => Number(!!favorites[b.id]) - Number(!!favorites[a.id])),
    [candidates, favorites],
  );

  function copySummary() {
    const lines = sorted.map((c) => `${favorites[c.id] ? "* " : ""}${c.name} (${c.year}, ${c.major})`);
    navigator.clipboard.writeText(lines.join("\n"));
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-0">
      <h1 className="font-display text-3xl font-bold text-rose-950">Final list</h1>
      <p className="mt-1 text-rose-900/70">
        {sorted.length} candidate{sorted.length === 1 ? "" : "s"} made it through. Starred names are favorites.
      </p>
      <button
        type="button"
        onClick={copySummary}
        className="mt-4 self-start rounded-lg border border-black/20 px-4 py-2 text-sm font-bold uppercase tracking-wide text-rose-900/85 transition hover:bg-black/10"
      >
        Copy list
      </button>

      {sorted.length === 0 ? (
        <p className="mt-8 text-rose-900/60">Nobody advanced through both rounds.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {sorted.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpenDetail(c.id)}
              className="flex items-center gap-3 rounded-xl p-3 text-left transition hover:brightness-95"
              style={{ backgroundColor: "var(--folder-cream)" }}
            >
              <Avatar name={c.name} photo={c.photo} className="h-12 w-12 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{c.name}</p>
                <p className="truncate text-sm text-slate-600">
                  {c.year}, {c.major}
                </p>
              </div>
              {favorites[c.id] && <span className="shrink-0 text-xl text-[color:var(--gold)]">★</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TallySection({
  title,
  color,
  items,
  emptyText,
  onOpenDetail,
}: {
  title: string;
  color: string;
  items: Candidate[];
  emptyText: string;
  onOpenDetail: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <h3 className={`mb-3 text-center text-2xl font-bold ${color}`}>
        {title} ({items.length})
      </h3>
      {items.length === 0 ? (
        <p className="text-center text-sm text-rose-900/50">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onOpenDetail(c.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-rose-950/90 transition hover:bg-black/10"
              >
                <Avatar name={c.name} photo={c.photo} className="h-7 w-7 shrink-0 rounded-full" />
                <span className="truncate">{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TallyPanel({
  open,
  onClose,
  accepted,
  rejected,
  favorited,
  onOpenDetail,
}: {
  open: boolean;
  onClose: () => void;
  accepted: Candidate[];
  rejected: Candidate[];
  favorited: Candidate[];
  onOpenDetail: (id: string) => void;
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-80 max-w-[85vw] transform flex-col overflow-y-auto px-5 py-6 transition-transform duration-300 lg:static lg:z-0 lg:w-72 lg:shrink-0 lg:translate-x-0 lg:bg-transparent lg:px-6 lg:py-10 lg:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg, #ffd6e8, #ffb3d1)" }}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="font-display text-lg font-semibold text-rose-950">Lists</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lists"
            className="rounded-lg px-2 py-1 text-xl text-rose-900/70 hover:bg-black/10"
          >
            &times;
          </button>
        </div>
        <TallySection title="Auto-Bid" color="text-amber-700" items={favorited} emptyText="No favorites yet." onOpenDetail={onOpenDetail} />
        <TallySection title="Accepted" color="text-emerald-700" items={accepted} emptyText="No one accepted yet." onOpenDetail={onOpenDetail} />
        <TallySection title="Rejected" color="text-red-700" items={rejected} emptyText="No one rejected yet." onOpenDetail={onOpenDetail} />
      </div>
    </>
  );
}

export function SwipeApp({ initialCandidates }: { initialCandidates: Candidate[] }) {
  const candidates = initialCandidates;
  const byId = useMemo(() => new Map(candidates.map((c) => [c.id, c])), [candidates]);
  const candidateIds = useMemo(() => candidates.map((c) => c.id), [candidates]);

  const [state, setState] = useState<PersistedState>(() => initialState());
  const [hydrated, setHydrated] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [externalExit, setExternalExit] = useState<{ verdict: Verdict; favorite: boolean } | null>(null);
  const [listsOpen, setListsOpen] = useState(false);
  const [burst, setBurst] = useState<{ id: number; hearts: FloatingHeart[] } | null>(null);
  const [showAutoBid, setShowAutoBid] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState(candidateIds));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const round1Queue = candidateIds;
  const currentQueue = state.stage === "round2" ? state.round2Queue : round1Queue;
  const currentIndex = state.stage === "round2" ? state.round2Index : state.round1Index;
  const currentId = currentQueue[currentIndex];
  const nextIds = currentQueue.slice(currentIndex + 1, currentIndex + 3);

  function decide(verdict: Verdict, favorite: boolean) {
    if (state.stage === "results" || !currentId) return;
    setState((prev) => {
      const stage = prev.stage as "round1" | "round2";
      const map = stage === "round1" ? prev.round1 : prev.round2;
      const previousVerdict = map[currentId];
      const previousFavorite = !!prev.favorites[currentId];
      const history: HistoryEntry[] = [...prev.history, { stage, candidateId: currentId, previousVerdict, previousFavorite }];
      const nextMap = { ...map, [currentId]: verdict };
      const favorites = favorite ? { ...prev.favorites, [currentId]: true } : prev.favorites;
      const nextIndex = (stage === "round1" ? prev.round1Index : prev.round2Index) + 1;

      if (stage === "round1") {
        const round1 = nextMap;
        if (nextIndex >= round1Queue.length) {
          // A starred (auto-bid) candidate is already final - they never
          // enter round 2, since starring means "they're in," not "give
          // them one more look."
          const round2Queue = round1Queue.filter((id) => round1[id] === "advance" && !favorites[id]);
          return {
            ...prev,
            round1,
            favorites,
            history,
            round1Index: nextIndex,
            round2Queue,
            round2Index: 0,
            stage: round2Queue.length > 0 ? "round2" : "results",
          };
        }
        return { ...prev, round1, favorites, history, round1Index: nextIndex };
      }

      const round2 = nextMap;
      if (nextIndex >= prev.round2Queue.length) {
        return { ...prev, round2, favorites, history, round2Index: nextIndex, stage: "results" };
      }
      return { ...prev, round2, favorites, history, round2Index: nextIndex };
    });
  }

  function undo() {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const last = prev.history[prev.history.length - 1];
      const history = prev.history.slice(0, -1);
      const favorites = { ...prev.favorites };
      if (last.previousFavorite) favorites[last.candidateId] = true;
      else delete favorites[last.candidateId];

      if (last.stage === "round1") {
        const round1 = { ...prev.round1 };
        if (last.previousVerdict === undefined) delete round1[last.candidateId];
        else round1[last.candidateId] = last.previousVerdict;
        // Undoing the last round-1 decision also undoes the round1 -> round2
        // transition it may have triggered (round2 always empties out first,
        // since its history entries are always undone before this one).
        return {
          ...prev,
          round1,
          favorites,
          history,
          round1Index: Math.max(0, prev.round1Index - 1),
          stage: "round1",
          round2: {},
          round2Queue: [],
          round2Index: 0,
        };
      }

      const round2 = { ...prev.round2 };
      if (last.previousVerdict === undefined) delete round2[last.candidateId];
      else round2[last.candidateId] = last.previousVerdict;
      return { ...prev, round2, favorites, history, round2Index: Math.max(0, prev.round2Index - 1), stage: "round2" };
    });
  }

  function resetAll() {
    if (!window.confirm("Reset every decision back to the start? This cannot be undone.")) return;
    setState(initialState());
  }

  const canUndo = state.history.length > 0;
  const currentCandidate = currentId ? byId.get(currentId) : undefined;
  const stageLabel = state.stage === "round1" ? "Round 1" : state.stage === "round2" ? "Round 2" : "Results";
  const stageTotal = currentQueue.length;

  const finalists = useMemo(() => {
    const round2Advances = state.round2Queue.filter((id) => state.round2[id] === "advance");
    // A starred round-1 candidate skipped round 2 entirely (see decide()) -
    // they're final the moment they're starred, so they need adding back in
    // here rather than only coming from the round-2 queue.
    const round1AutoBids = candidateIds.filter((id) => state.favorites[id] && !round2Advances.includes(id));
    return [...round1AutoBids, ...round2Advances].map((id) => byId.get(id)).filter(Boolean) as Candidate[];
  }, [state.round2Queue, state.round2, state.favorites, candidateIds, byId]);

  // A round-2 decision (once made) is the final word on someone who already
  // advanced through round 1; otherwise their round-1 decision stands.
  const { accepted, rejected } = useMemo(() => {
    const accepted: Candidate[] = [];
    const rejected: Candidate[] = [];
    for (const id of candidateIds) {
      const status = state.round2[id] ?? state.round1[id];
      if (!status) continue;
      const candidate = byId.get(id);
      if (!candidate) continue;
      if (status === "advance") accepted.push(candidate);
      else rejected.push(candidate);
    }
    return { accepted, rejected };
  }, [candidateIds, state.round1, state.round2, byId]);

  const favorited = useMemo(
    () => candidateIds.map((id) => (state.favorites[id] ? byId.get(id) : undefined)).filter(Boolean) as Candidate[],
    [candidateIds, state.favorites, byId],
  );

  return (
    <div
      className="flex min-h-screen text-rose-950 lg:flex-row"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #ffe6f1 0%, #ffc2de 55%, #ff9fcb 100%)" }}
    >
      <div className="hidden shrink-0 flex-col items-start gap-4 p-8 lg:flex lg:w-56">
        <span className="font-display text-xl font-semibold">Final Decisions</span>
        <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-900/80">{stageLabel}</span>
        {state.stage !== "results" && (
          <span className="text-sm text-rose-900/70">
            {Math.min(currentIndex + 1, stageTotal)} / {stageTotal}
          </span>
        )}
        <button
          type="button"
          onClick={resetAll}
          className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-rose-900/70 hover:border-red-500 hover:text-red-600"
        >
          Reset
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4 sm:px-0 lg:hidden">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold">Final Decisions</span>
            <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-900/80">{stageLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            {state.stage !== "results" && (
              <span className="text-sm text-rose-900/70">
                {Math.min(currentIndex + 1, stageTotal)} / {stageTotal}
              </span>
            )}
            <button
              type="button"
              onClick={() => setListsOpen(true)}
              className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-rose-900/80 hover:bg-black/10"
            >
              Lists
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-rose-900/70 hover:border-red-500 hover:text-red-600"
            >
              Reset
            </button>
          </div>
        </div>

        {state.stage !== "results" ? (
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-4 sm:px-0">
            {currentCandidate ? (
              <div className="relative mx-auto w-full max-w-sm flex-1" style={{ minHeight: 420 }}>
                {nextIds
                  .map((id) => byId.get(id))
                  .filter(Boolean)
                  .reverse()
                  .map((c, i) => (
                    <SwipeCard
                      key={c!.id}
                      candidate={c!}
                      isTop={false}
                      depth={nextIds.length - i}
                      externalExit={null}
                      onDecide={() => {}}
                      onOpenDetail={() => {}}
                    />
                  ))}
                <SwipeCard
                  key={currentCandidate.id}
                  candidate={currentCandidate}
                  isTop
                  depth={0}
                  externalExit={externalExit}
                  onDecide={(verdict, favorite) => {
                    decide(verdict, favorite);
                    setExternalExit(null);
                  }}
                  onOpenDetail={() => setDetailId(currentCandidate.id)}
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-white/60">All caught up.</div>
            )}

            <ActionBar
              canUndo={canUndo}
              onUndo={undo}
              disabled={!!externalExit}
              onRelease={() => setExternalExit((prev) => prev ?? { verdict: "release", favorite: false })}
              onAdvance={() => {
                setBurst((prev) => ({ id: (prev?.id ?? 0) + 1, hearts: randomHearts(14) }));
                setExternalExit((prev) => prev ?? { verdict: "advance", favorite: false });
              }}
              onFavorite={() => {
                setShowAutoBid(true);
                setExternalExit((prev) => prev ?? { verdict: "advance", favorite: true });
              }}
            />
          </div>
        ) : (
          <ResultsScreen candidates={finalists} favorites={state.favorites} onOpenDetail={(id) => setDetailId(id)} />
        )}
      </div>

      <TallyPanel
        open={listsOpen}
        onClose={() => setListsOpen(false)}
        accepted={accepted}
        rejected={rejected}
        favorited={favorited}
        onOpenDetail={(id) => setDetailId(id)}
      />

      {detailId && byId.get(detailId) && <DetailSheet candidate={byId.get(detailId)!} onClose={() => setDetailId(null)} />}
      {burst && <HeartBurst key={burst.id} hearts={burst.hearts} />}
      {showAutoBid && <AutoBidCelebration onClose={() => setShowAutoBid(false)} />}
    </div>
  );
}
