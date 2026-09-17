"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { logoutBrother } from "./actions";
import type { Candidate, FamilyMember, SpeedDatingEventRecord } from "./types";
import type { SpeedDatingEvaluation } from "@/app/api/speed-dating/evaluate/route";

const STORAGE_KEY = "sd_brother_name";
const TABLE_SIZE = 3;
const NOTES_DEBOUNCE_MS = 1000;

type ScoreField = "overallScore" | "conversationScore" | "professionalismScore" | "driveScore" | "chapterFitScore";

const SCALE_FIELDS: { key: ScoreField; label: string }[] = [
  { key: "overallScore", label: "Overall" },
  { key: "conversationScore", label: "Conversation" },
  { key: "professionalismScore", label: "Professionalism" },
  { key: "driveScore", label: "Drive" },
  { key: "chapterFitScore", label: "Chapter fit" },
];

const TALK_AGAIN_OPTIONS: { value: string; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
];

type Draft = {
  candidateId: number;
  brotherName: string;
  eventId: number;
  talkAgain: string | null;
  notes: string;
  overallScore: number | null;
  conversationScore: number | null;
  professionalismScore: number | null;
  driveScore: number | null;
  chapterFitScore: number | null;
};

type TableSlot = { candidate: Candidate; draft: Draft; isExisting: boolean };

function draftFromEvaluation(candidate: Candidate, brotherName: string, eventId: number, existing?: SpeedDatingEvaluation): Draft {
  if (!existing) {
    return {
      candidateId: candidate.id,
      brotherName,
      eventId,
      talkAgain: null,
      notes: "",
      overallScore: null,
      conversationScore: null,
      professionalismScore: null,
      driveScore: null,
      chapterFitScore: null,
    };
  }
  return {
    candidateId: candidate.id,
    brotherName,
    eventId,
    talkAgain: existing.talkAgain,
    notes: existing.notes,
    overallScore: existing.overallScore,
    conversationScore: existing.conversationScore,
    professionalismScore: existing.professionalismScore,
    driveScore: existing.driveScore,
    chapterFitScore: existing.chapterFitScore,
  };
}

function Avatar({ name, photo, size = 46 }: { name: string; photo: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-maroon-rich to-maroon-deep bg-cover bg-center font-display font-semibold text-white"
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

async function saveDraft(draft: Draft): Promise<SpeedDatingEvaluation> {
  const res = await fetch("/api/speed-dating/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Save failed.");
  return data.evaluation as SpeedDatingEvaluation;
}

function TableSlotCard({
  slot,
  hint,
  doneSaving,
  doneError,
  onScore,
  onTalkAgain,
  onNotes,
  onRemove,
  onDone,
}: {
  slot: TableSlot | null;
  hint: boolean;
  doneSaving: boolean;
  doneError: string | null;
  onScore: (field: ScoreField, value: number) => void;
  onTalkAgain: (value: string) => void;
  onNotes: (value: string) => void;
  onRemove: () => void;
  onDone: () => void;
}) {
  if (!slot) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-bg-elevated p-6 text-center text-sm text-ink-muted">
        <span className="font-display text-2xl text-line">+</span>
        Seat a PNM here
      </div>
    );
  }

  const { candidate, draft, isExisting } = slot;

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <Avatar name={candidate.name} photo={candidate.photo} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-tight text-ink">{candidate.name}</p>
          <p className="truncate text-xs text-ink-muted">
            {[candidate.graduationYear, candidate.major].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button type="button" onClick={onRemove} aria-label="Remove from table" className="admin-icon-button">
          ✕
        </button>
      </div>

      {isExisting && <span className="badge w-fit">Already evaluated</span>}

      {SCALE_FIELDS.map((f) => (
        <div key={f.key} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-muted">{f.label}</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onScore(f.key, v)}
                className={`h-8 flex-1 rounded-lg border text-sm font-semibold transition ${
                  draft[f.key] === v
                    ? "border-maroon bg-maroon text-white"
                    : "border-line bg-bg text-ink-muted hover:border-gold"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-ink-muted">Talk again?</label>
        <div className="flex gap-1.5">
          {TALK_AGAIN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onTalkAgain(opt.value)}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                draft.talkAgain === opt.value
                  ? "border-maroon bg-maroon text-white"
                  : "border-line bg-bg text-ink-muted hover:border-gold"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-ink-muted">Notes</label>
        <textarea
          value={draft.notes}
          onChange={(e) => onNotes(e.target.value)}
          placeholder="What stood out?"
          rows={3}
          className="rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </div>

      {doneError && (
        <p role="alert" className="text-xs text-maroon">
          {doneError}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs text-ink-muted transition-opacity ${hint ? "opacity-100" : "opacity-0"}`}>Saved</span>
        <button
          type="button"
          onClick={onDone}
          disabled={doneSaving}
          className="btn btn-primary !min-h-0 !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-60"
        >
          {doneSaving ? "Saving…" : "Done"}
        </button>
      </div>
    </div>
  );
}

function IdentifyScreen({
  eligibleBrothers,
  onIdentified,
}: {
  eligibleBrothers: FamilyMember[];
  onIdentified: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<FamilyMember | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return eligibleBrothers.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, eligibleBrothers]);

  if (eligibleBrothers.length === 0) {
    return (
      <div className="container-page pt-28 md:pt-32 flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">No brothers on file yet</h1>
        <p className="max-w-sm text-sm text-ink-muted">
          Brothers need a photo on the Family page before they can identify themselves here.
        </p>
      </div>
    );
  }

  if (pending) {
    return (
      <div className="container-page pt-28 md:pt-32 flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-6 text-center">
        <Avatar name={pending.name} photo={pending.photo} size={84} />
        <h2 className="font-display text-2xl font-semibold text-ink">Continue as {pending.name}?</h2>
        <div className="flex gap-3">
          <button type="button" className="btn btn-primary" onClick={() => onIdentified(pending.name)}>
            Continue
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setPending(null)}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page pt-28 md:pt-32 flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Who are you?</h1>
      <p className="text-sm text-ink-muted">Search for your name to start Speed Dating.</p>
      <div className="w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your name…"
          className="w-full rounded-full border border-line bg-bg-elevated px-5 py-3.5 text-base text-ink shadow-[var(--shadow)] outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </div>
      {matches.length > 0 && (
        <div className="flex w-full max-w-md flex-col gap-2 text-left">
          {matches.map((b) => (
            <button
              key={b.name}
              type="button"
              onClick={() => setPending(b)}
              className="card flex items-center gap-3 p-3 text-left transition hover:border-gold"
            >
              <Avatar name={b.name} photo={b.photo} />
              <span className="font-semibold text-ink">{b.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SpeedDatingApp({
  family,
  candidates,
  events,
  initialEvaluations,
}: {
  family: FamilyMember[];
  candidates: Candidate[];
  events: SpeedDatingEventRecord[];
  initialEvaluations: SpeedDatingEvaluation[];
}) {
  const activeEvent = useMemo(() => events.find((e) => e.active) ?? events[0] ?? null, [events]);
  const eligibleBrothers = useMemo(() => family.filter((m) => !!m.photo), [family]);
  const eligibleCandidates = useMemo(() => candidates.filter((c) => c.active !== false), [candidates]);

  const [brotherName, setBrotherNameState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && eligibleBrothers.some((b) => b.name === saved)) {
      setBrotherNameState(saved);
    }
    setHydrated(true);
    // Only ever needs to run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function identify(name: string) {
    setBrotherNameState(name);
    localStorage.setItem(STORAGE_KEY, name);
  }

  function changeBrother() {
    setBrotherNameState(null);
    localStorage.removeItem(STORAGE_KEY);
    setSlots(Array(TABLE_SIZE).fill(null));
  }

  const [evaluations, setEvaluations] = useState<SpeedDatingEvaluation[]>(initialEvaluations);
  const evaluationsRef = useRef(evaluations);
  useEffect(() => {
    evaluationsRef.current = evaluations;
  }, [evaluations]);

  function mergeEvaluation(saved: SpeedDatingEvaluation) {
    setEvaluations((prev) => {
      const idx = prev.findIndex((e) => e.evaluationId === saved.evaluationId);
      if (idx === -1) return [...prev, saved];
      const next = prev.slice();
      next[idx] = saved;
      return next;
    });
  }

  function findEvaluation(candidateId: number, name: string): SpeedDatingEvaluation | undefined {
    if (!activeEvent) return undefined;
    return evaluationsRef.current.find(
      (e) => e.candidateId === candidateId && e.brotherName === name && e.eventId === activeEvent.id,
    );
  }

  const [slots, setSlots] = useState<(TableSlot | null)[]>(() => Array(TABLE_SIZE).fill(null));
  const slotsRef = useRef(slots);
  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  // Keyed by candidate id (not array position), since seats can shift
  // position on FIFO eviction — a timer tracked by position would end up
  // firing against whoever now sits in that seat instead of who it was
  // originally scheduled for.
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const [hintIndex, setHintIndex] = useState<number | null>(null);
  function flashHint(index: number) {
    setHintIndex(index);
    setTimeout(() => setHintIndex((cur) => (cur === index ? null : cur)), 1200);
  }

  const [toast, setToast] = useState<string | null>(null);
  function flashToast(message: string) {
    setToast(message);
    setTimeout(() => setToast((cur) => (cur === message ? null : cur)), 3000);
  }

  const [doneSaving, setDoneSaving] = useState<Record<number, boolean>>({});
  const [doneErrors, setDoneErrors] = useState<Record<number, string | null>>({});
  const [clearing, setClearing] = useState(false);

  function applyPatchAndSave(index: number, patch: Partial<Draft>, opts: { debounceNotes?: boolean } = {}) {
    const slot = slotsRef.current[index];
    if (!slot) return;
    const draft: Draft = { ...slot.draft, ...patch };

    setSlots((prev) => {
      const next = prev.slice();
      const cur = next[index];
      if (!cur) return prev;
      next[index] = { ...cur, draft };
      return next;
    });

    const cid = slot.candidate.id;
    const existingTimer = timersRef.current.get(cid);
    if (existingTimer != null) clearTimeout(existingTimer);

    const doSave = () => {
      timersRef.current.delete(cid);
      saveDraft(draft)
        .then((saved) => {
          mergeEvaluation(saved);
          flashHint(index);
        })
        .catch((err) => console.error("Autosave failed", err));
    };

    if (opts.debounceNotes) {
      timersRef.current.set(cid, setTimeout(doSave, NOTES_DEBOUNCE_MS));
    } else {
      doSave();
    }
  }

  /** Best-effort final save for a slot about to be dropped from state (evicted
   *  or explicitly removed), so a debounced notes edit that hasn't fired yet
   *  isn't silently lost. No-ops if nothing is pending. */
  async function flushPendingSave(slot: TableSlot) {
    const cid = slot.candidate.id;
    const timer = timersRef.current.get(cid);
    if (timer == null) return;
    clearTimeout(timer);
    timersRef.current.delete(cid);
    try {
      const saved = await saveDraft(slot.draft);
      mergeEvaluation(saved);
    } catch (err) {
      console.error("Final save before removing slot failed", err);
    }
  }

  /** Unconditional final save, used when leaving a seat via Done or Clear
   *  Table — unlike flushPendingSave, this always sends the current draft
   *  rather than only when an autosave is mid-flight. */
  async function forceSave(slot: TableSlot): Promise<SpeedDatingEvaluation> {
    const cid = slot.candidate.id;
    const timer = timersRef.current.get(cid);
    if (timer != null) {
      clearTimeout(timer);
      timersRef.current.delete(cid);
    }
    const saved = await saveDraft(slot.draft);
    mergeEvaluation(saved);
    return saved;
  }

  function seatAtTable(candidate: Candidate) {
    if (!activeEvent || !brotherName) return;
    if (slotsRef.current.some((s) => s?.candidate.id === candidate.id)) return;

    const existing = findEvaluation(candidate.id, brotherName);
    const newSlot: TableSlot = {
      candidate,
      draft: draftFromEvaluation(candidate, brotherName, activeEvent.id, existing),
      isExisting: !!existing,
    };

    setSlots((prev) => {
      const emptyIndex = prev.findIndex((s) => s === null);
      if (emptyIndex === -1) {
        // Table's full - the longest-seated PNM makes room. Ratings/talk-again
        // already saved instantly; only a notes edit from the last second
        // could still be pending, so flush it against the evicted slot
        // directly (fire-and-forget - no need to block seating the new one).
        const evicted = prev[0];
        if (evicted) void flushPendingSave(evicted);
        return [...prev.slice(1), newSlot];
      }
      const next = prev.slice();
      next[emptyIndex] = newSlot;
      return next;
    });
  }

  async function clearSlot(index: number) {
    const slot = slotsRef.current[index];
    if (!slot) return;
    await flushPendingSave(slot);
    setSlots((prev) => {
      const next = prev.slice();
      next[index] = null;
      return next;
    });
  }

  async function clearTable() {
    setClearing(true);
    try {
      for (const slot of slotsRef.current) {
        if (!slot) continue;
        try {
          await forceSave(slot);
        } catch (err) {
          console.error("Final save before clearing table failed", err);
        }
      }
      setSlots(Array(TABLE_SIZE).fill(null));
      flashToast("Table cleared — ready for the next group.");
    } finally {
      setClearing(false);
    }
  }

  async function handleDone(index: number) {
    const slot = slotsRef.current[index];
    if (!slot) return;
    setDoneErrors((prev) => ({ ...prev, [index]: null }));
    setDoneSaving((prev) => ({ ...prev, [index]: true }));
    try {
      await forceSave(slot);
      setSlots((prev) => {
        const next = prev.slice();
        next[index] = null;
        return next;
      });
      flashToast("Evaluation saved ✓");
    } catch (err) {
      setDoneErrors((prev) => ({ ...prev, [index]: err instanceof Error ? err.message : "Could not save. Try again." }));
    } finally {
      setDoneSaving((prev) => ({ ...prev, [index]: false }));
    }
  }

  const [quickAddQuery, setQuickAddQuery] = useState("");
  const quickAddMatches = useMemo(() => {
    const q = quickAddQuery.trim().toLowerCase();
    if (!q) return [];
    return eligibleCandidates.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [quickAddQuery, eligibleCandidates]);

  const [browseQuery, setBrowseQuery] = useState("");
  const browseResults = useMemo(() => {
    const q = browseQuery.trim().toLowerCase();
    const base = q ? eligibleCandidates.filter((c) => c.name.toLowerCase().includes(q)) : eligibleCandidates;
    return base;
  }, [browseQuery, eligibleCandidates]);

  const completedCount = brotherName
    ? eligibleCandidates.filter((c) => findEvaluation(c.id, brotherName)).length
    : 0;

  if (!hydrated) {
    return <div className="min-h-screen" />;
  }

  if (!brotherName) {
    return <IdentifyScreen eligibleBrothers={eligibleBrothers} onIdentified={identify} />;
  }

  return (
    <div className="container-page pb-20 pt-28 md:pt-32">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg-elevated px-5 py-3">
        <p className="text-sm text-ink-muted">
          Speed Dating as <strong className="font-display text-ink">{brotherName}</strong>
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={changeBrother} className="btn btn-ghost !min-h-0 !py-1.5 !text-xs">
            Change
          </button>
          <form action={logoutBrother}>
            <button type="submit" className="btn btn-ghost !min-h-0 !py-1.5 !text-xs">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {!activeEvent ? (
        <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-muted">
          No Speed Dating event is active right now.
        </p>
      ) : eligibleCandidates.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-muted">
          No PNMs have been added yet — ask an officer to add them under Admin → Speed Dating.
        </p>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">My Table</h2>
            <button
              type="button"
              onClick={clearTable}
              disabled={clearing || !slots.some(Boolean)}
              className="btn btn-ghost !min-h-0 !py-1.5 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
            >
              {clearing ? "Clearing…" : "Clear Table"}
            </button>
          </div>
          <p className="mb-4 text-xs text-ink-muted">
            Seat up to 3 PNMs at once. When they rotate tables, hit Clear Table to free all 3 seats for the next group.
          </p>

          <div className="relative mb-4">
            <input
              type="text"
              value={quickAddQuery}
              onChange={(e) => setQuickAddQuery(e.target.value)}
              placeholder="Quick-add: search a PNM to seat them…"
              className="w-full rounded-full border border-line bg-bg-elevated px-5 py-3 text-sm text-ink shadow-[var(--shadow)] outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
            {quickAddMatches.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5">
                {quickAddMatches.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      seatAtTable(c);
                      setQuickAddQuery("");
                    }}
                    className="card flex items-center gap-3 p-2.5 text-left hover:border-gold"
                  >
                    <Avatar name={c.name} photo={c.photo} size={36} />
                    <span className="text-sm font-medium text-ink">{c.name}</span>
                    {slots.some((s) => s?.candidate.id === c.id) && <span className="badge ml-auto">At table</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot, i) => (
              <TableSlotCard
                key={i}
                slot={slot}
                hint={hintIndex === i}
                doneSaving={!!doneSaving[i]}
                doneError={doneErrors[i] ?? null}
                onScore={(field, value) => applyPatchAndSave(i, { [field]: value })}
                onTalkAgain={(v) => applyPatchAndSave(i, { talkAgain: v })}
                onNotes={(v) => applyPatchAndSave(i, { notes: v }, { debounceNotes: true })}
                onRemove={() => clearSlot(i)}
                onDone={() => handleDone(i)}
              />
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_320px]">
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">Browse all PNMs</h2>
              <input
                type="text"
                value={browseQuery}
                onChange={(e) => setBrowseQuery(e.target.value)}
                placeholder="Search by name…"
                className="mb-3 w-full rounded-full border border-line bg-bg-elevated px-5 py-3 text-sm text-ink shadow-[var(--shadow)] outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
              <div className="flex max-h-[480px] flex-col gap-2 overflow-y-auto pr-1">
                {browseResults.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-muted">
                    No PNMs match that search.
                  </p>
                ) : (
                  browseResults.map((c) => {
                    const done = !!findEvaluation(c.id, brotherName);
                    const atTable = slots.some((s) => s?.candidate.id === c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => seatAtTable(c)}
                        className="card flex items-center gap-3 p-2.5 text-left hover:border-gold"
                      >
                        <Avatar name={c.name} photo={c.photo} size={36} />
                        <span className="flex-1 truncate text-sm font-medium text-ink">{c.name}</span>
                        {done && (
                          <span className="text-sm text-green-700 dark:text-green-400" aria-label="Evaluated">
                            ✓
                          </span>
                        )}
                        {atTable && <span className="badge">At table</span>}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <div>
              <div className="card p-4">
                <p className="section-label mb-2">Your progress</p>
                <p className="font-display text-2xl font-semibold text-ink">
                  {completedCount}
                  <span className="ml-1 text-sm font-normal text-ink-muted">/ {eligibleCandidates.length} evaluated</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-maroon px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
