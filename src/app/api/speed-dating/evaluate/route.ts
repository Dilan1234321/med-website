import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getContentFile, updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { hasBrotherSession } from "@/lib/brother/require-session";

export const runtime = "nodejs";

const PATH = "content/speed-dating-evaluations.json";
const MAX_RETRIES = 4;

const SCORE_FIELDS = [
  "overallScore",
  "conversationScore",
  "professionalismScore",
  "driveScore",
  "chapterFitScore",
] as const;

export type SpeedDatingEvaluation = {
  evaluationId: string;
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
  createdAt: string;
  updatedAt: string;
};

type Body = {
  candidateId?: number;
  brotherName?: string;
  eventId?: number;
  talkAgain?: string | null;
  notes?: string;
} & Partial<Record<(typeof SCORE_FIELDS)[number], number | null>>;

function sameEvaluation(a: SpeedDatingEvaluation, key: { candidateId: number; brotherName: string; eventId: number }) {
  return (
    a.candidateId === key.candidateId &&
    a.brotherName === key.brotherName &&
    a.eventId === key.eventId
  );
}

// Upserts one evaluation, keyed on (candidateId, brotherName, eventId) rather
// than a client-picked id — this one key does triple duty: autosave and the
// final "Done" both land on the same row instead of creating drafts, editing
// an existing evaluation naturally overwrites instead of duplicating, and the
// duplicate-prevention check ("you already rated this PNM") is answered by
// just scanning data the client already has loaded. Retries on GitHub's
// optimistic-lock 409 since multiple brothers rate concurrently during a
// live event, same as /api/rush's append-with-retry.
export async function POST(request: Request) {
  if (!(await hasBrotherSession())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { candidateId, brotherName, eventId } = body;
  if (candidateId == null || !brotherName?.trim() || eventId == null) {
    return NextResponse.json({ error: "candidateId, brotherName, and eventId are required" }, { status: 400 });
  }

  const key = { candidateId, brotherName: brotherName.trim(), eventId };
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let list: SpeedDatingEvaluation[] = [];
    let sha = "";
    try {
      const file = await getContentFile<SpeedDatingEvaluation[]>(PATH);
      list = file.data;
      sha = file.sha;
    } catch {
      // File doesn't exist yet — first evaluation ever.
    }

    const idx = list.findIndex((row) => sameEvaluation(row, key));
    let saved: SpeedDatingEvaluation;
    let updated: SpeedDatingEvaluation[];

    if (idx === -1) {
      saved = {
        evaluationId: randomUUID(),
        candidateId: key.candidateId,
        brotherName: key.brotherName,
        eventId: key.eventId,
        talkAgain: body.talkAgain ?? null,
        notes: body.notes ?? "",
        overallScore: null,
        conversationScore: null,
        professionalismScore: null,
        driveScore: null,
        chapterFitScore: null,
        createdAt: now,
        updatedAt: now,
      };
      SCORE_FIELDS.forEach((f) => {
        saved[f] = body[f] ?? null;
      });
      updated = [...list, saved];
    } else {
      saved = { ...list[idx] };
      SCORE_FIELDS.forEach((f) => {
        if (body[f] !== undefined) saved[f] = body[f] ?? null;
      });
      if (body.talkAgain !== undefined) saved.talkAgain = body.talkAgain;
      if (body.notes !== undefined) saved.notes = body.notes;
      saved.updatedAt = now;
      updated = list.slice();
      updated[idx] = saved;
    }

    try {
      await updateContentFile(
        PATH,
        updated,
        sha,
        `content: ${idx === -1 ? "add" : "update"} speed dating evaluation`,
      );
      return NextResponse.json({ evaluation: saved, created: idx === -1 });
    } catch (error) {
      if (error instanceof ContentConflictError && attempt < MAX_RETRIES - 1) {
        continue; // someone else's evaluation landed first — re-read and retry
      }
      console.error("Speed dating evaluation failed to save:", error);
      return NextResponse.json({ error: "Save failed. Try again." }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "Save failed after retries. Try again." }, { status: 502 });
}
