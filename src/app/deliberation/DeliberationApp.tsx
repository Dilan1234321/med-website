"use client";

import { useEffect, useMemo, useState } from "react";
import type { Candidate, ConsensusPoint, DecisionStatus } from "./types";

const STORAGE_KEY = "deliberation-state-v1";
const DISCUSSION_TIMER_SECONDS = 150; // 2.5 min per candidate in the discussion queue
const TARGET_TOTAL_SECONDS = 2 * 60 * 60; // 2-hour chapter target
const MAX_FINALISTS = 12;

type Stage = "rapid" | "rapid-done" | "discussion" | "final";

type HistoryEntry = { candidateId: string; previousStatus: DecisionStatus; previousStage: Stage };

type PersistedState = {
  decisions: Record<string, DecisionStatus>;
  rapidIndex: number;
  discussionQueue: string[];
  discussIndex: number;
  discussionSecondsLeft: number;
  stage: Stage;
  finalists: string[];
  elapsedSeconds: number;
  timerRunning: boolean;
  history: HistoryEntry[];
};

function initialState(candidates: Candidate[]): PersistedState {
  const decisions: Record<string, DecisionStatus> = {};
  candidates.forEach((c) => {
    decisions[c.id] = c.status;
  });
  return {
    decisions,
    rapidIndex: 0,
    discussionQueue: [],
    discussIndex: 0,
    discussionSecondsLeft: DISCUSSION_TIMER_SECONDS,
    stage: "rapid",
    finalists: [],
    elapsedSeconds: 0,
    timerRunning: false,
    history: [],
  };
}

function loadState(candidates: Candidate[]): PersistedState {
  if (typeof window === "undefined") return initialState(candidates);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState(candidates);
    const parsed = JSON.parse(raw) as PersistedState;
    const decisions: Record<string, DecisionStatus> = {};
    candidates.forEach((c) => {
      decisions[c.id] = parsed.decisions?.[c.id] ?? c.status;
    });
    return { ...initialState(candidates), ...parsed, decisions };
  } catch {
    return initialState(candidates);
  }
}

function strongestPoint(points: ConsensusPoint[]): ConsensusPoint | null {
  if (!points.length) return null;
  return [...points].sort((a, b) => b.sourceCount - a.sourceCount)[0];
}

function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function formatWallClock(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

const STATUS_STYLES: Record<DecisionStatus, { label: string; dot: string; text: string; bg: string }> = {
  unreviewed: { label: "Unreviewed", dot: "bg-white/30", text: "text-white/70", bg: "bg-white/10" },
  advance: { label: "Advance", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-100" },
  discuss: { label: "Discuss", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-100" },
  hold: { label: "Hold", dot: "bg-amber-300", text: "text-amber-700", bg: "bg-amber-100" },
  release: { label: "Release", dot: "bg-red-400", text: "text-red-700", bg: "bg-red-100" },
};

function Avatar({
  name,
  photo,
  size = 56,
  className = "",
}: {
  name: string;
  photo: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--maroon)] bg-cover bg-center font-display font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: photo ? `url('${photo}')` : undefined,
        fontSize: Math.round(size * 0.4),
      }}
    >
      {!photo && name.charAt(0).toUpperCase()}
    </div>
  );
}

function DecisionButtons({ onDecide }: { onDecide: (status: DecisionStatus) => void }) {
  const base = "flex-1 rounded-xl py-5 text-lg font-bold uppercase tracking-wide transition active:scale-[0.98]";
  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" onClick={() => onDecide("advance")} className={`${base} bg-emerald-600 text-white hover:bg-emerald-700`}>
        Advance <span className="ml-1 opacity-70">A</span>
      </button>
      <button type="button" onClick={() => onDecide("discuss")} className={`${base} bg-amber-500 text-white hover:bg-amber-600`}>
        Discuss <span className="ml-1 opacity-70">D</span>
      </button>
      <button type="button" onClick={() => onDecide("hold")} className={`${base} bg-amber-300 text-amber-950 hover:bg-amber-400`}>
        Hold <span className="ml-1 opacity-70">H</span>
      </button>
      <button type="button" onClick={() => onDecide("release")} className={`${base} bg-red-400 text-white hover:bg-red-500`}>
        Release <span className="ml-1 opacity-70">R</span>
      </button>
    </div>
  );
}

/** A consensus point's attribution: a plain name when only one brother said
 *  it, or a clickable count that reveals who when more than one did. Never
 *  says "X only" - that reads as singling someone out for a lone opinion. */
function AttributionTag({ point, colorClass }: { point: ConsensusPoint; colorClass: string }) {
  const [open, setOpen] = useState(false);
  if (point.sourceCount <= 1) {
    return <span className={`text-sm font-medium sm:text-base lg:text-lg ${colorClass}`}>{point.brothers[0]}</span>;
  }
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`rounded-full border px-3 py-1 text-sm font-bold sm:text-base ${colorClass} border-current/30 hover:bg-current/10`}
      >
        {point.sourceCount} brothers
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 min-w-[200px] rounded-xl border border-[color:var(--folder-cream-shadow)] bg-white p-3 text-left shadow-xl">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Reported by</p>
          <p className="text-base text-slate-800 sm:text-lg">{point.brothers.join(", ")}</p>
        </div>
      )}
    </span>
  );
}

function ConsensusCard({ candidate, onViewNotes }: { candidate: Candidate; onViewNotes: () => void }) {
  const top = strongestPoint(candidate.strengths);
  const lowEvidence = candidate.sourceCount <= 1;

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-6 lg:p-8"
      style={{ backgroundColor: "var(--folder-cream)", borderColor: "var(--folder-cream-shadow)" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex items-center gap-4 lg:gap-5">
          <Avatar name={candidate.name} photo={candidate.photo} size={64} className="lg:!h-24 lg:!w-24" />
          <div>
            <h1 className="font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl lg:text-5xl">{candidate.name}</h1>
            <p className="mt-1 text-base text-slate-600 sm:text-lg lg:text-2xl">
              {candidate.year}, {candidate.major}, {candidate.careerPath}
            </p>
          </div>
        </div>
        <span className="whitespace-nowrap self-start rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 sm:px-4 sm:py-2 sm:text-lg">
          Notes from {candidate.sourceCount} {candidate.sourceCount === 1 ? "brother" : "brothers"}
        </span>
      </div>

      {lowEvidence && (
        <div className="mt-4 rounded-lg border border-amber-400 bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-900 sm:text-lg">
          Limited evidence. Decide with caution or send to Hold for more notes.
        </div>
      )}

      <div className="mt-4 grid flex-1 grid-cols-1 gap-6 overflow-y-auto lg:mt-6 lg:grid-cols-2 lg:gap-8 lg:overflow-hidden">
        <div className="flex flex-col gap-5 lg:gap-6 lg:overflow-y-auto lg:pr-2">
          <section>
            <h2 className="text-lg font-bold text-emerald-700 sm:text-xl lg:text-2xl">Strengths</h2>
            {candidate.strengths.length === 0 ? (
              <p className="mt-2 text-base text-slate-400 sm:text-xl">None noted.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-3">
                {candidate.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-base leading-snug text-slate-800 sm:text-lg lg:text-xl">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500 sm:mt-2.5 sm:h-2.5 sm:w-2.5" aria-hidden />
                    <span className="flex flex-wrap items-center gap-2">
                      {s.text}
                      <AttributionTag point={s} colorClass="text-emerald-700" />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold text-red-700 sm:text-xl lg:text-2xl">Concerns</h2>
            {candidate.concerns.length === 0 ? (
              <p className="mt-2 text-base text-slate-400 sm:text-xl">None noted.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-3">
                {candidate.concerns.map((c, i) => (
                  <li key={i} className="flex gap-3 text-base leading-snug text-slate-800 sm:text-lg lg:text-xl">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500 sm:mt-2.5 sm:h-2.5 sm:w-2.5" aria-hidden />
                    <span className="flex flex-wrap items-center gap-2">
                      {c.text}
                      <AttributionTag point={c} colorClass="text-red-700" />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {candidate.mixedFeedback.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-700 sm:text-xl lg:text-2xl">Mixed feedback</h2>
              <ul className="mt-2 flex flex-col gap-3">
                {candidate.mixedFeedback.map((m, i) => (
                  <li key={i} className="text-base leading-snug text-slate-800 sm:text-lg lg:text-xl">
                    <p className="font-semibold text-slate-600">{m.topic}</p>
                    {m.observations.map((o, j) => (
                      <p key={j} className="mt-1">
                        <span className="font-semibold">{o.brother}:</span> {o.text}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-5 lg:gap-6 lg:overflow-y-auto lg:pr-2">
          <section>
            <h2 className="text-lg font-bold text-slate-700 sm:text-xl lg:text-2xl">Facts and experience</h2>
            {candidate.facts.length === 0 ? (
              <p className="mt-2 text-base text-slate-400 sm:text-xl">None noted.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {candidate.facts.map((f, i) => (
                  <li key={i} className="flex gap-3 text-base leading-snug text-slate-700 sm:text-lg lg:text-xl">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-400 sm:mt-2.5 sm:h-2.5 sm:w-2.5" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {top && (
            <section>
              <h2 className="text-lg font-bold text-emerald-700 sm:text-xl lg:text-2xl">Strongest point</h2>
              <ul className="mt-2 flex flex-col gap-2">
                <li className="flex gap-3 text-base leading-snug text-slate-800 sm:text-lg lg:text-xl">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500 sm:mt-2.5 sm:h-2.5 sm:w-2.5" aria-hidden />
                  {top.text}
                </li>
              </ul>
            </section>
          )}

          <button
            type="button"
            onClick={onViewNotes}
            className="mt-auto self-start rounded-lg border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-600 hover:text-slate-900 sm:px-5 sm:py-2.5 sm:text-lg"
          >
            View all raw notes ({candidate.notes.length})
          </button>
        </div>
      </div>
    </div>
  );
}

function NotesModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-8" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-slate-900">Raw notes for {candidate.name}</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">
            Close (Esc)
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {candidate.notes.length === 0 ? (
            <p className="text-sm text-slate-400">No raw notes recorded.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {candidate.notes.map((n, i) => (
                <li key={i} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="mb-1 font-semibold text-slate-900">{n.brother}</p>
                  <p>{n.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function PathwayBar({
  candidates,
  onSelectPathway,
}: {
  candidates: Candidate[];
  onSelectPathway: (pathway: string) => void;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    candidates.forEach((c) => {
      const key = c.careerPath || "Unspecified";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [candidates]);

  return (
    <div className="flex items-center gap-2 overflow-x-auto lg:flex-wrap lg:overflow-visible">
      {counts.map(([pathway, count]) => (
        <button
          key={pathway}
          type="button"
          onClick={() => onSelectPathway(pathway)}
          className="shrink-0 whitespace-nowrap rounded-full border border-white/25 px-3 py-1 text-sm font-semibold text-white/85 transition hover:border-white hover:bg-white/10 hover:text-white"
        >
          {pathway} <span className="text-white">{count}</span>
        </button>
      ))}
    </div>
  );
}

function PathwayBrowseModal({
  pathway,
  candidates,
  onClose,
  onOpenCandidate,
}: {
  pathway: string;
  candidates: Candidate[];
  onClose: () => void;
  onOpenCandidate: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-8" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            {pathway} <span className="text-slate-400">({candidates.length})</span>
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">
            Close (Esc)
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            {candidates.map((c) => {
              const style = STATUS_STYLES[c.status];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onOpenCandidate(c.id)}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-slate-400"
                >
                  <Avatar name={c.name} photo={c.photo} size={44} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-sm text-slate-500">
                      {c.year}, {c.major}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${style.bg} ${style.text}`}>{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateDetailModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 sm:p-8" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">
            Close (Esc)
          </button>
        </div>
        <div className="h-[75vh]">
          <ConsensusCard candidate={candidate} onViewNotes={() => {}} />
        </div>
      </div>
    </div>
  );
}

export function DeliberationApp({ initialCandidates }: { initialCandidates: Candidate[] }) {
  const candidates = initialCandidates;
  const byId = useMemo(() => new Map(candidates.map((c) => [c.id, c])), [candidates]);

  const [state, setState] = useState<PersistedState>(() => initialState(candidates));
  const [hydrated, setHydrated] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [browsePathway, setBrowsePathway] = useState<string | null>(null);
  const [browseCandidateId, setBrowseCandidateId] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState(candidates));
    setHydrated(true);
    setNowMs(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!state.timerRunning) return;
    const id = setInterval(() => {
      setNowMs(Date.now());
      setState((prev) => {
        if (!prev.timerRunning) return prev;
        const next: PersistedState = { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 };
        if (next.stage === "discussion" && next.discussionSecondsLeft > 0) {
          next.discussionSecondsLeft -= 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.timerRunning]);

  const rapidOrder = useMemo(() => candidates.map((c) => c.id), [candidates]);
  const currentRapidId = rapidOrder[state.rapidIndex];
  const currentDiscussId = state.discussionQueue[state.discussIndex];

  const candidatesWithLiveStatus = useMemo(
    () => candidates.map((c) => ({ ...c, status: state.decisions[c.id] ?? c.status })),
    [candidates, state.decisions],
  );

  const reviewedCount = candidates.filter((c) => state.decisions[c.id] !== "unreviewed").length;
  const remainingCount = candidates.length - reviewedCount;
  const avgSecondsPerCandidate = reviewedCount > 0 ? state.elapsedSeconds / reviewedCount : 0;
  const projectedRemainingSeconds = avgSecondsPerCandidate * remainingCount;
  const projectedTotalSeconds = state.elapsedSeconds + projectedRemainingSeconds;
  const onPace = projectedTotalSeconds <= TARGET_TOTAL_SECONDS || reviewedCount === 0;
  const projectedFinishClock = formatWallClock(new Date((nowMs ?? 0) + projectedRemainingSeconds * 1000));

  function recordDecision(candidateId: string, status: DecisionStatus, stageAtDecision: Stage) {
    setState((prev) => {
      const previousStatus = prev.decisions[candidateId];
      const history = [...prev.history, { candidateId, previousStatus, previousStage: stageAtDecision }];
      return { ...prev, decisions: { ...prev.decisions, [candidateId]: status }, history, timerRunning: true };
    });
  }

  function advanceRapid() {
    setState((prev) => {
      const nextIndex = prev.rapidIndex + 1;
      if (nextIndex >= rapidOrder.length) {
        return { ...prev, rapidIndex: nextIndex, stage: "rapid-done" };
      }
      return { ...prev, rapidIndex: nextIndex };
    });
  }

  function decideRapid(status: DecisionStatus) {
    if (!currentRapidId) return;
    recordDecision(currentRapidId, status, "rapid");
    advanceRapid();
  }

  function navRapid(delta: number) {
    setState((prev) => ({ ...prev, rapidIndex: Math.min(Math.max(prev.rapidIndex + delta, 0), rapidOrder.length - 1) }));
  }

  function beginDiscussion() {
    setState((prev) => {
      const queue = candidates.filter((c) => prev.decisions[c.id] === "discuss" || prev.decisions[c.id] === "hold").map((c) => c.id);
      return { ...prev, stage: "discussion", discussionQueue: queue, discussIndex: 0, discussionSecondsLeft: DISCUSSION_TIMER_SECONDS };
    });
  }

  function advanceDiscussion() {
    setState((prev) => ({ ...prev, discussIndex: prev.discussIndex + 1, discussionSecondsLeft: DISCUSSION_TIMER_SECONDS }));
  }

  function decideDiscussion(status: DecisionStatus) {
    if (!currentDiscussId) return;
    recordDecision(currentDiscussId, status, "discussion");
    advanceDiscussion();
  }

  function navDiscussion(delta: number) {
    setState((prev) => ({
      ...prev,
      discussIndex: Math.min(Math.max(prev.discussIndex + delta, 0), Math.max(prev.discussionQueue.length - 1, 0)),
      discussionSecondsLeft: DISCUSSION_TIMER_SECONDS,
    }));
  }

  function goToFinal() {
    setState((prev) => ({ ...prev, stage: "final", timerRunning: false }));
  }

  function undo() {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const last = prev.history[prev.history.length - 1];
      const history = prev.history.slice(0, -1);
      const decisions = { ...prev.decisions, [last.candidateId]: last.previousStatus };
      if (last.previousStage === "rapid" && prev.stage === "rapid") {
        const idx = rapidOrder.indexOf(last.candidateId);
        return { ...prev, decisions, history, rapidIndex: idx === -1 ? prev.rapidIndex : idx };
      }
      if (last.previousStage === "discussion" && prev.stage === "discussion") {
        const idx = prev.discussionQueue.indexOf(last.candidateId);
        return { ...prev, decisions, history, discussIndex: idx === -1 ? prev.discussIndex : idx, discussionSecondsLeft: DISCUSSION_TIMER_SECONDS };
      }
      return { ...prev, decisions, history };
    });
  }

  function toggleFinalist(id: string) {
    setState((prev) => {
      const already = prev.finalists.includes(id);
      if (already) return { ...prev, finalists: prev.finalists.filter((f) => f !== id) };
      if (prev.finalists.length >= MAX_FINALISTS) return prev;
      return { ...prev, finalists: [...prev.finalists, id] };
    });
  }

  function toggleTimer() {
    setState((prev) => ({ ...prev, timerRunning: !prev.timerRunning }));
  }

  function resetAll() {
    if (!confirm("Reset all decisions, timers, and selections? This can't be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState(candidates));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (notesOpen || browsePathway || browseCandidateId) {
        if (e.key === "Escape") {
          setNotesOpen(false);
          setBrowsePathway(null);
          setBrowseCandidateId(null);
        }
        return;
      }
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === " ") {
        e.preventDefault();
        toggleTimer();
        return;
      }
      if (state.stage === "rapid") {
        if (e.key === "ArrowRight") navRapid(1);
        else if (e.key === "ArrowLeft") navRapid(-1);
        else if (e.key.toLowerCase() === "a") decideRapid("advance");
        else if (e.key.toLowerCase() === "d") decideRapid("discuss");
        else if (e.key.toLowerCase() === "h") decideRapid("hold");
        else if (e.key.toLowerCase() === "r") decideRapid("release");
      } else if (state.stage === "discussion") {
        if (e.key === "ArrowRight") navDiscussion(1);
        else if (e.key === "ArrowLeft") navDiscussion(-1);
        else if (e.key.toLowerCase() === "a") decideDiscussion("advance");
        else if (e.key.toLowerCase() === "d") decideDiscussion("discuss");
        else if (e.key.toLowerCase() === "h") decideDiscussion("hold");
        else if (e.key.toLowerCase() === "r") decideDiscussion("release");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stage, state.rapidIndex, state.discussIndex, state.discussionQueue, notesOpen, browsePathway, browseCandidateId]);

  if (!hydrated) {
    return <div className="min-h-screen" style={{ backgroundColor: "var(--maroon-pattern-base)" }} />;
  }

  const currentCandidate =
    state.stage === "rapid" ? (currentRapidId ? byId.get(currentRapidId) : undefined) : state.stage === "discussion" ? (currentDiscussId ? byId.get(currentDiscussId) : undefined) : undefined;

  return (
    <div className="pattern-maroon flex min-h-screen flex-col text-white lg:h-screen">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4 lg:justify-start">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold sm:text-xl">Deliberation</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/70">
              {state.stage === "rapid" && "Rapid Review"}
              {state.stage === "rapid-done" && "Rapid Review Complete"}
              {state.stage === "discussion" && "Discussion Queue"}
              {state.stage === "final" && "Final Selection"}
            </span>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <button type="button" onClick={undo} disabled={state.history.length === 0} className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30">
              Undo
            </button>
            <button type="button" onClick={resetAll} className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/60 hover:border-red-300 hover:text-red-300">
              Reset
            </button>
          </div>
        </div>
        <PathwayBar candidates={candidatesWithLiveStatus} onSelectPathway={setBrowsePathway} />
        <div className="hidden items-center gap-2 lg:flex">
          <button type="button" onClick={undo} disabled={state.history.length === 0} className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30">
            Undo
          </button>
          <button type="button" onClick={resetAll} className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/60 hover:border-red-300 hover:text-red-300">
            Reset
          </button>
        </div>
      </div>

      {state.stage === "rapid" && currentCandidate && (
        <RapidOrDiscussionStage
          candidate={currentCandidate}
          index={state.rapidIndex}
          total={rapidOrder.length}
          status={state.decisions[currentCandidate.id]}
          onDecide={decideRapid}
          onNav={navRapid}
          onViewNotes={() => setNotesOpen(true)}
          queueList={candidates.map((c) => ({ id: c.id, name: c.name, status: state.decisions[c.id] }))}
          activeId={currentCandidate.id}
          discussionSecondsLeft={null}
        />
      )}

      {state.stage === "rapid-done" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <h1 className="font-display text-4xl font-semibold">Rapid review complete</h1>
          <p className="max-w-md text-white/70">
            {candidates.filter((c) => state.decisions[c.id] === "discuss" || state.decisions[c.id] === "hold").length} candidate(s) flagged for
            discussion. Everyone else has a preliminary decision.
          </p>
          <button type="button" onClick={beginDiscussion} className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white hover:bg-emerald-700">
            Begin Discussion Queue
          </button>
        </div>
      )}

      {state.stage === "discussion" && (
        <>
          {currentDiscussId && currentCandidate ? (
            <RapidOrDiscussionStage
              candidate={currentCandidate}
              index={state.discussIndex}
              total={state.discussionQueue.length}
              status={state.decisions[currentCandidate.id]}
              onDecide={decideDiscussion}
              onNav={navDiscussion}
              onViewNotes={() => setNotesOpen(true)}
              queueList={state.discussionQueue.map((id) => ({ id, name: byId.get(id)?.name ?? id, status: state.decisions[id] }))}
              activeId={currentDiscussId}
              discussionSecondsLeft={state.discussionSecondsLeft}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <h1 className="font-display text-4xl font-semibold">Discussion queue resolved</h1>
              <p className="max-w-md text-white/70">Every flagged candidate has a decision. Ready to compare finalists.</p>
              <button type="button" onClick={goToFinal} className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white hover:bg-emerald-700">
                Go to Final Selection
              </button>
            </div>
          )}
          {state.discussionQueue.length > 0 && (
            <div className="border-t border-white/10 px-6 py-2 text-center">
              <button type="button" onClick={goToFinal} className="text-xs font-bold uppercase tracking-wide text-white/40 hover:text-white">
                Skip to Final Selection
              </button>
            </div>
          )}
        </>
      )}

      {state.stage === "final" && (
        <FinalSelectionScreen
          candidates={candidates.filter((c) => state.decisions[c.id] === "advance")}
          finalists={state.finalists}
          onToggle={toggleFinalist}
        />
      )}

      {state.stage !== "final" && (
        <BottomProgressBar
          reviewedCount={reviewedCount}
          remainingCount={remainingCount}
          elapsedSeconds={state.elapsedSeconds}
          projectedFinishClock={projectedFinishClock}
          onPace={onPace}
          timerRunning={state.timerRunning}
          onToggleTimer={toggleTimer}
        />
      )}

      {notesOpen && currentCandidate && <NotesModal candidate={currentCandidate} onClose={() => setNotesOpen(false)} />}
      {browsePathway && (
        <PathwayBrowseModal
          pathway={browsePathway}
          candidates={candidatesWithLiveStatus.filter((c) => (c.careerPath || "Unspecified") === browsePathway)}
          onClose={() => setBrowsePathway(null)}
          onOpenCandidate={(id) => setBrowseCandidateId(id)}
        />
      )}
      {browseCandidateId && byId.get(browseCandidateId) && (
        <CandidateDetailModal candidate={byId.get(browseCandidateId)!} onClose={() => setBrowseCandidateId(null)} />
      )}
    </div>
  );
}

function RapidOrDiscussionStage({
  candidate,
  index,
  total,
  status,
  onDecide,
  onNav,
  onViewNotes,
  queueList,
  activeId,
  discussionSecondsLeft,
}: {
  candidate: Candidate;
  index: number;
  total: number;
  status: DecisionStatus;
  onDecide: (status: DecisionStatus) => void;
  onNav: (delta: number) => void;
  onViewNotes: () => void;
  queueList: { id: string; name: string; status: DecisionStatus }[];
  activeId: string;
  discussionSecondsLeft: number | null;
}) {
  return (
    <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[260px_1fr_300px] lg:overflow-hidden">
      <div
        className="order-3 flex max-h-48 flex-col overflow-hidden rounded-2xl border lg:order-1 lg:max-h-none"
        style={{ backgroundColor: "var(--folder-cream)", borderColor: "var(--folder-cream-shadow)" }}
      >
        <div className="border-b px-4 py-3" style={{ borderColor: "var(--folder-cream-shadow)" }}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Candidate {index + 1} of {total}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {queueList.map((item) => {
            const style = STATUS_STYLES[item.status];
            const active = item.id === activeId;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2 border-b px-4 py-2.5 text-sm ${active ? "bg-[color:var(--maroon)] text-white" : "text-slate-700"}`}
                style={{ borderColor: "var(--folder-cream-shadow)" }}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${active ? "bg-white" : style.dot}`} />
                <span className="truncate">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:min-h-0">
        <ConsensusCard candidate={candidate} onViewNotes={onViewNotes} />
      </div>

      <div className="order-2 flex flex-col gap-4 lg:order-3">
        {discussionSecondsLeft != null && (
          <div
            className="rounded-2xl border p-4 text-center"
            style={{
              backgroundColor: discussionSecondsLeft <= 30 ? "#fee2e2" : "var(--folder-cream)",
              borderColor: discussionSecondsLeft <= 30 ? "#fca5a5" : "var(--folder-cream-shadow)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Discussion time</p>
            <p className={`mt-1 font-display text-4xl font-semibold ${discussionSecondsLeft <= 30 ? "text-red-600" : "text-slate-900"}`}>
              {formatClock(discussionSecondsLeft)}
            </p>
            {discussionSecondsLeft === 0 && <p className="mt-1 text-xs font-bold text-red-600">Time&apos;s up. Decide now.</p>}
          </div>
        )}

        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--folder-cream)", borderColor: "var(--folder-cream-shadow)" }}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current status</p>
          <div className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${STATUS_STYLES[status].bg} ${STATUS_STYLES[status].text}`}>
            <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[status].dot}`} />
            {STATUS_STYLES[status].label}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border p-4" style={{ backgroundColor: "var(--folder-cream)", borderColor: "var(--folder-cream-shadow)" }}>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Decision</p>
          <DecisionButtons onDecide={onDecide} />
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => onNav(-1)} className="flex-1 rounded-lg border border-white/25 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            Prev
          </button>
          <button type="button" onClick={() => onNav(1)} className="flex-1 rounded-lg border border-white/25 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomProgressBar({
  reviewedCount,
  remainingCount,
  elapsedSeconds,
  projectedFinishClock,
  onPace,
  timerRunning,
  onToggleTimer,
}: {
  reviewedCount: number;
  remainingCount: number;
  elapsedSeconds: number;
  projectedFinishClock: string;
  onPace: boolean;
  timerRunning: boolean;
  onToggleTimer: () => void;
}) {
  const total = reviewedCount + remainingCount;
  const pct = total > 0 ? Math.round((reviewedCount / total) * 100) : 0;
  return (
    <div className="border-t border-white/10 px-4 py-3 sm:px-6">
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs text-white/70 sm:text-sm">
        <span>
          <strong className="text-white">{reviewedCount}</strong> reviewed, <strong className="text-white">{remainingCount}</strong> remaining
        </span>
        <span>
          Elapsed <strong className="text-white">{formatClock(elapsedSeconds)}</strong>
        </span>
        <span>
          Projected finish <strong className={onPace ? "text-emerald-300" : "text-red-300"}>{projectedFinishClock}</strong>{" "}
          {onPace ? "(on pace)" : "(behind pace)"}
        </span>
        <button
          type="button"
          onClick={onToggleTimer}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white ${timerRunning ? "bg-white/15 hover:bg-white/25" : "bg-emerald-600 hover:bg-emerald-700"}`}
        >
          {timerRunning ? "Pause (Space)" : "Start (Space)"}
        </button>
      </div>
    </div>
  );
}

function FinalSelectionScreen({
  candidates,
  finalists,
  onToggle,
}: {
  candidates: Candidate[];
  finalists: string[];
  onToggle: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function exportDecisions() {
    const lines = [
      `Final Selection (${new Date().toLocaleDateString()})`,
      `${finalists.length} of ${Math.min(candidates.length, 12)} selected`,
      "",
      ...candidates
        .filter((c) => finalists.includes(c.id))
        .map((c) => `Selected: ${c.name} (${c.year}, ${c.major}, ${c.careerPath})`),
      "",
      "Advanced but not selected:",
      ...candidates.filter((c) => !finalists.includes(c.id)).map((c) => `  ${c.name}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard API unavailable; the list is still on screen
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Final Selection</h1>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-4 py-2 text-sm font-bold ${finalists.length === MAX_FINALISTS ? "bg-emerald-400 text-emerald-950" : "bg-white/15 text-white"}`}>
            {finalists.length} of {MAX_FINALISTS} selected
          </span>
          <button type="button" onClick={exportDecisions} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-white/90">
            {copied ? "Copied" : "Export decisions"}
          </button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <p className="text-white/60">No candidates were marked Advance.</p>
      ) : (
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            {candidates.map((c) => {
              const top = strongestPoint(c.strengths);
              const concern = strongestPoint(c.concerns);
              const selected = finalists.includes(c.id);
              const disableSelect = !selected && finalists.length >= MAX_FINALISTS;
              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-4"
                  style={{
                    backgroundColor: selected ? "#d1fae5" : "var(--folder-cream)",
                    borderColor: selected ? "#6ee7b7" : "var(--folder-cream-shadow)",
                  }}
                >
                  <div className="flex items-center gap-3 sm:contents">
                    <Avatar name={c.name} photo={c.photo} size={52} />
                    <div className="w-full sm:w-48 sm:shrink-0">
                      <p className="font-display text-lg font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">
                        {c.year}, {c.careerPath}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-emerald-700">Strongest:</span> {top ? top.text : "None noted"}
                    </p>
                    <p className="mt-0.5">
                      <span className="font-semibold text-red-600">Concern:</span> {concern ? concern.text : "None noted"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:contents">
                    <span className="text-center text-xs font-semibold text-slate-500 sm:w-28 sm:shrink-0">
                      {c.sourceCount} {c.sourceCount === 1 ? "source" : "sources"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggle(c.id)}
                      disabled={disableSelect}
                      className={`rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40 sm:w-28 sm:shrink-0 ${
                        selected ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {selected ? "Remove" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
