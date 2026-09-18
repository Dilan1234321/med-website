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
    // Merge decisions so newly-added candidates (dataset swapped out between
    // sessions) still get a valid default instead of undefined.
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
  unreviewed: { label: "Unreviewed", dot: "bg-slate-300", text: "text-slate-500", bg: "bg-slate-100" },
  advance: { label: "Advance", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  discuss: { label: "Discuss", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  hold: { label: "Hold", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  release: { label: "Release", dot: "bg-red-400", text: "text-red-600", bg: "bg-red-50" },
};

function DecisionButtons({
  onDecide,
  size = "lg",
}: {
  onDecide: (status: DecisionStatus) => void;
  size?: "lg" | "sm";
}) {
  const base =
    size === "lg"
      ? "flex-1 rounded-xl py-5 text-lg font-bold uppercase tracking-wide transition active:scale-[0.98]"
      : "rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wide transition";
  return (
    <div className={size === "lg" ? "grid grid-cols-2 gap-3" : "flex gap-2"}>
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

function ConsensusCard({ candidate, onViewNotes }: { candidate: Candidate; onViewNotes: () => void }) {
  const top = strongestPoint(candidate.strengths);
  const lowEvidence = candidate.sourceCount <= 1;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-slate-900">{candidate.name}</h1>
          <p className="mt-1 text-lg text-slate-500">
            {candidate.year} · {candidate.major} · {candidate.careerPath}
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
          Notes from {candidate.sourceCount} {candidate.sourceCount === 1 ? "brother" : "brothers"}
        </span>
      </div>

      {lowEvidence && (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
          ⚠ Limited evidence — decide with caution or send to Hold for more notes.
        </div>
      )}

      <div className="mt-6 grid flex-1 grid-cols-2 gap-6 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Consensus strengths</h2>
            {candidate.strengths.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">None noted.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {candidate.strengths.map((s, i) => (
                  <li key={i} className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-slate-800">
                    {s.text}
                    <span className="ml-2 text-xs font-semibold text-emerald-700">
                      {s.sourceCount > 1 ? `— ${s.sourceCount} brothers` : `— ${s.brothers[0]} only`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-600">Consensus concerns</h2>
            {candidate.concerns.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">None noted.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {candidate.concerns.map((c, i) => (
                  <li key={i} className="rounded-lg bg-red-50 px-3 py-2 text-sm text-slate-800">
                    {c.text}
                    <span className="ml-2 text-xs font-semibold text-red-600">
                      {c.sourceCount > 1 ? `— ${c.sourceCount} brothers` : `— ${c.brothers[0]} only`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {candidate.mixedFeedback.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Mixed / conflicting feedback</h2>
              <ul className="mt-2 flex flex-col gap-2">
                {candidate.mixedFeedback.map((m, i) => (
                  <li key={i} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800">
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

        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Facts &amp; experience</h2>
            {candidate.facts.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">None noted.</p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {candidate.facts.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </section>

          {top && (
            <section className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Strongest point</h2>
              <p className="mt-1 text-sm text-slate-800">{top.text}</p>
            </section>
          )}

          <button
            type="button"
            onClick={onViewNotes}
            className="mt-auto self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-slate-900">Raw notes — {candidate.name}</h2>
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

export function DeliberationApp({ initialCandidates }: { initialCandidates: Candidate[] }) {
  const candidates = initialCandidates;
  const byId = useMemo(() => new Map(candidates.map((c) => [c.id, c])), [candidates]);

  const [state, setState] = useState<PersistedState>(() => initialState(candidates));
  const [hydrated, setHydrated] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  // Wall-clock "now", refreshed once per timer tick rather than read directly
  // via Date.now() during render - components must stay pure, so the impure
  // clock read lives in the effect/interval below and only its result flows
  // into a render-safe piece of state.
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    // localStorage isn't available during server render, so state hydrates
    // one tick after mount - the `!hydrated` placeholder below covers that
    // gap instead of risking a hydration mismatch.
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

  // Global elapsed timer, ticks once per second while running.
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
    setState((prev) => {
      const nextIndex = prev.discussIndex + 1;
      return { ...prev, discussIndex: nextIndex, discussionSecondsLeft: DISCUSSION_TIMER_SECONDS };
    });
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

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (notesOpen) {
        if (e.key === "Escape") setNotesOpen(false);
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
  }, [state.stage, state.rapidIndex, state.discussIndex, state.discussionQueue, notesOpen]);

  if (!hydrated) {
    return <div className="min-h-screen bg-white" />;
  }

  const currentCandidate =
    state.stage === "rapid" ? (currentRapidId ? byId.get(currentRapidId) : undefined) : state.stage === "discussion" ? (currentDiscussId ? byId.get(currentDiscussId) : undefined) : undefined;

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      {/* Top strip */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-semibold">Deliberation</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            {state.stage === "rapid" && "Rapid Review"}
            {state.stage === "rapid-done" && "Rapid Review Complete"}
            {state.stage === "discussion" && "Discussion Queue"}
            {state.stage === "final" && "Final Selection"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={undo} disabled={state.history.length === 0} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
            Undo
          </button>
          <button type="button" onClick={resetAll} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 hover:border-red-300 hover:text-red-600">
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
          <h1 className="font-display text-4xl font-semibold text-slate-900">Rapid review complete</h1>
          <p className="max-w-md text-slate-500">
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
              <h1 className="font-display text-4xl font-semibold text-slate-900">Discussion queue resolved</h1>
              <p className="max-w-md text-slate-500">Every flagged candidate has a decision. Ready to compare finalists.</p>
              <button type="button" onClick={goToFinal} className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white hover:bg-emerald-700">
                Go to Final Selection
              </button>
            </div>
          )}
          {state.discussionQueue.length > 0 && (
            <div className="border-t border-slate-200 bg-white px-6 py-2 text-center">
              <button type="button" onClick={goToFinal} className="text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-slate-700">
                Skip to Final Selection →
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
    <div className="grid flex-1 grid-cols-[260px_1fr_300px] gap-4 overflow-hidden p-4">
      {/* Left: queue */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
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
                className={`flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 text-sm ${active ? "bg-slate-900 text-white" : "text-slate-700"}`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${active ? "bg-white" : style.dot}`} />
                <span className="truncate">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center: consensus card */}
      <ConsensusCardWithNav candidate={candidate} onViewNotes={onViewNotes} onNav={onNav} />

      {/* Right: controls */}
      <div className="flex flex-col gap-4">
        {discussionSecondsLeft != null && (
          <div className={`rounded-2xl border p-4 text-center ${discussionSecondsLeft <= 30 ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Discussion time</p>
            <p className={`mt-1 font-display text-4xl font-semibold ${discussionSecondsLeft <= 30 ? "text-red-600" : "text-slate-900"}`}>
              {formatClock(discussionSecondsLeft)}
            </p>
            {discussionSecondsLeft === 0 && <p className="mt-1 text-xs font-bold text-red-600">Time&apos;s up — decide now</p>}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Current status</p>
          <div className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${STATUS_STYLES[status].bg} ${STATUS_STYLES[status].text}`}>
            <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[status].dot}`} />
            {STATUS_STYLES[status].label}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Decision</p>
          <DecisionButtons onDecide={onDecide} />
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => onNav(-1)} className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            ← Prev
          </button>
          <button type="button" onClick={() => onNav(1)} className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsensusCardWithNav({ candidate, onViewNotes }: { candidate: Candidate; onViewNotes: () => void; onNav: (delta: number) => void }) {
  return <ConsensusCard candidate={candidate} onViewNotes={onViewNotes} />;
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
    <div className="border-t border-slate-200 bg-white px-6 py-3">
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span>
          <strong className="text-slate-900">{reviewedCount}</strong> reviewed · <strong className="text-slate-900">{remainingCount}</strong> remaining
        </span>
        <span>
          Elapsed <strong className="text-slate-900">{formatClock(elapsedSeconds)}</strong>
        </span>
        <span>
          Projected finish <strong className={onPace ? "text-emerald-700" : "text-red-600"}>{projectedFinishClock}</strong>{" "}
          {onPace ? "· on pace" : "· behind pace"}
        </span>
        <button
          type="button"
          onClick={onToggleTimer}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white ${timerRunning ? "bg-slate-700 hover:bg-slate-800" : "bg-emerald-600 hover:bg-emerald-700"}`}
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
      `Final Selection — ${new Date().toLocaleDateString()}`,
      `${finalists.length} of ${Math.min(candidates.length, 12)} selected`,
      "",
      ...candidates
        .filter((c) => finalists.includes(c.id))
        .map((c) => `✓ ${c.name} — ${c.year}, ${c.major} (${c.careerPath})`),
      "",
      "Advanced but not selected:",
      ...candidates.filter((c) => !finalists.includes(c.id)).map((c) => `  ${c.name}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard API unavailable — silently no-op, the list is still on screen
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Final Selection</h1>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-4 py-2 text-sm font-bold ${finalists.length === MAX_FINALISTS ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {finalists.length} of {MAX_FINALISTS} selected
          </span>
          <button type="button" onClick={exportDecisions} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">
            {copied ? "Copied ✓" : "Export decisions"}
          </button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <p className="text-slate-400">No candidates were marked Advance.</p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {candidates.map((c) => {
              const top = strongestPoint(c.strengths);
              const concern = strongestPoint(c.concerns);
              const selected = finalists.includes(c.id);
              const disableSelect = !selected && finalists.length >= MAX_FINALISTS;
              return (
                <div key={c.id} className={`flex items-center gap-4 rounded-xl border p-4 ${selected ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                  <div className="w-48 shrink-0">
                    <p className="font-display text-lg font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      {c.year} · {c.careerPath}
                    </p>
                  </div>
                  <div className="flex-1 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-emerald-700">Strongest:</span> {top ? top.text : "—"}
                    </p>
                    <p className="mt-0.5">
                      <span className="font-semibold text-red-600">Concern:</span> {concern ? concern.text : "None noted"}
                    </p>
                  </div>
                  <span className="w-28 shrink-0 text-center text-xs font-semibold text-slate-500">
                    {c.sourceCount} {c.sourceCount === 1 ? "source" : "sources"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggle(c.id)}
                    disabled={disableSelect}
                    className={`w-28 shrink-0 rounded-lg py-2 text-sm font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40 ${
                      selected ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {selected ? "Remove" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
