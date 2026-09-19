"use client";

import { useEffect, useMemo, useState } from "react";
import type { Candidate } from "./types";

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
    const datasetChanged = touchedIds.length > 0 && !touchedIds.some((id) => known.has(id));
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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
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
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-400">
            {candidate.sourceCount} {candidate.sourceCount === 1 ? "source" : "sources"}
          </p>

          <section className="mb-5">
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

          <section className="mb-5">
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
            <section className="mb-5">
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
            <section>
              <h3 className="text-base font-bold text-slate-700">What brothers said</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {candidate.notes.map((n, i) => (
                  <li key={i} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="mb-1 font-semibold text-slate-900">{n.brother}</p>
                    <p className="whitespace-pre-line">{n.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
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
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-amber-500 shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ↺
      </button>
      <button
        type="button"
        onClick={onRelease}
        disabled={disabled}
        aria-label="Release"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-red-500 shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 sm:h-[4.5rem] sm:w-[4.5rem]"
      >
        &times;
      </button>
      <button
        type="button"
        onClick={onAdvance}
        disabled={disabled}
        aria-label="Advance"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-emerald-500 shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 sm:h-[4.5rem] sm:w-[4.5rem]"
      >
        ♥
      </button>
      <button
        type="button"
        onClick={onFavorite}
        disabled={disabled}
        aria-label="Favorite"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[color:var(--gold)] shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ★
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
      <h1 className="font-display text-3xl font-bold text-white">Final list</h1>
      <p className="mt-1 text-white/70">
        {sorted.length} candidate{sorted.length === 1 ? "" : "s"} made it through. Starred names are favorites.
      </p>
      <button
        type="button"
        onClick={copySummary}
        className="mt-4 self-start rounded-lg border border-white/25 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white/85 transition hover:bg-white/10"
      >
        Copy list
      </button>

      {sorted.length === 0 ? (
        <p className="mt-8 text-white/60">Nobody advanced through both rounds.</p>
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
      <h3 className={`mb-2 text-xs font-bold uppercase tracking-wide ${color}`}>
        {title} ({items.length})
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-white/40">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onOpenDetail(c.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-white/85 transition hover:bg-white/10"
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
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-80 max-w-[85vw] transform flex-col overflow-y-auto border-l border-white/10 bg-[color:var(--maroon-deep)] px-5 py-5 transition-transform duration-300 lg:static lg:z-0 lg:w-72 lg:shrink-0 lg:translate-x-0 lg:border-l lg:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Lists</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lists"
            className="rounded-lg px-2 py-1 text-xl text-white/60 hover:bg-white/10 lg:hidden"
          >
            &times;
          </button>
        </div>
        <TallySection title="Favorited" color="text-[color:var(--gold)]" items={favorited} emptyText="No favorites yet." onOpenDetail={onOpenDetail} />
        <TallySection title="Accepted" color="text-emerald-400" items={accepted} emptyText="No one accepted yet." onOpenDetail={onOpenDetail} />
        <TallySection title="Rejected" color="text-red-400" items={rejected} emptyText="No one rejected yet." onOpenDetail={onOpenDetail} />
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
          const round2Queue = round1Queue.filter((id) => round1[id] === "advance");
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

  const finalists = useMemo(
    () => state.round2Queue.filter((id) => state.round2[id] === "advance").map((id) => byId.get(id)).filter(Boolean) as Candidate[],
    [state.round2Queue, state.round2, byId],
  );

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
    <div className="pattern-maroon flex min-h-screen text-white lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4 sm:px-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold">Final Decisions</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/70">{stageLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            {state.stage !== "results" && (
              <span className="text-sm text-white/60">
                {Math.min(currentIndex + 1, stageTotal)} / {stageTotal}
              </span>
            )}
            <button
              type="button"
              onClick={() => setListsOpen(true)}
              className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/70 hover:bg-white/10 lg:hidden"
            >
              Lists
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/60 hover:border-red-300 hover:text-red-300"
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
              onAdvance={() => setExternalExit((prev) => prev ?? { verdict: "advance", favorite: false })}
              onFavorite={() => setExternalExit((prev) => prev ?? { verdict: "advance", favorite: true })}
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
    </div>
  );
}
