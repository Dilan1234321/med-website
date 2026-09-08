"use server";

import { updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { requireSession } from "@/lib/admin/require-session";

type SaveResult = { ok: true; sha: string } | { ok: false; error: string };

async function save(path: string, data: unknown, expectedSha: string, message: string): Promise<SaveResult> {
  await requireSession();
  try {
    const { sha } = await updateContentFile(path, data, expectedSha, message);
    return { ok: true, sha };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }
}

export async function saveSite(data: unknown, expectedSha: string): Promise<SaveResult> {
  return save("content/site.json", data, expectedSha, "content: update site settings via admin");
}

export async function saveStats(data: unknown, expectedSha: string): Promise<SaveResult> {
  return save("content/stats.json", data, expectedSha, "content: update stats via admin");
}
