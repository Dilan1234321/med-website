"use server";

import { updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { requireSession } from "@/lib/admin/require-session";
import type { LeadershipMember } from "./LeadershipForm";

type SaveResult = { ok: true; sha: string } | { ok: false; error: string };

export async function saveLeadership(members: LeadershipMember[], expectedSha: string): Promise<SaveResult> {
  await requireSession();
  try {
    const { sha } = await updateContentFile("content/leadership.json", members, expectedSha, "content: update exec board via admin");
    return { ok: true, sha };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }
}
