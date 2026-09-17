"use server";

import { updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { requireSession } from "@/lib/admin/require-session";
import type { Candidate } from "@/app/speed-dating/types";

type SaveResult = { ok: true; sha: string } | { ok: false; error: string };

export async function saveCandidates(candidates: Candidate[], expectedSha: string): Promise<SaveResult> {
  await requireSession();
  try {
    const { sha } = await updateContentFile(
      "content/speed-dating-candidates.json",
      candidates,
      expectedSha,
      "content: update speed dating candidates via admin",
    );
    return { ok: true, sha };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }
}
