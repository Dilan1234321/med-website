"use server";

import { updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { requireSession } from "@/lib/admin/require-session";
import type { EventsContent } from "./EventsForm";

type SaveResult = { ok: true; sha: string } | { ok: false; error: string };

export async function saveEvents(events: EventsContent, expectedSha: string): Promise<SaveResult> {
  await requireSession();
  try {
    const { sha } = await updateContentFile("content/events.json", events, expectedSha, "content: update events via admin");
    return { ok: true, sha };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }
}
