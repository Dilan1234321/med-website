import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getContentFile, updateContentFile, ContentConflictError } from "@/lib/admin/github";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  year?: string;
  pathway?: string;
  notes?: string;
};

export type RecruitmentSignup = {
  id: string;
  name: string;
  email: string;
  year: string;
  pathway: string;
  notes: string;
  submittedAt: string;
};

const SIGNUPS_PATH = "content/recruitment-signups.json";
const MAX_APPEND_RETRIES = 3;

/**
 * Appends via read-modify-write against a shared file that multiple
 * concurrent public submissions can hit at once. A stale-sha 409 here just
 * means another signup landed first — unlike the admin editor's single-user
 * forms, this genuinely warrants a retry rather than surfacing a conflict
 * to the submitter, who has no "someone else changed this" context to act on.
 */
async function appendSignup(item: RecruitmentSignup): Promise<void> {
  for (let attempt = 0; attempt < MAX_APPEND_RETRIES; attempt++) {
    let existing: RecruitmentSignup[] = [];
    let sha: string | undefined;
    try {
      const file = await getContentFile<RecruitmentSignup[]>(SIGNUPS_PATH);
      existing = file.data;
      sha = file.sha;
    } catch {
      // File doesn't exist yet — first signup ever. Create it below with no sha.
    }

    try {
      await updateContentFile(
        SIGNUPS_PATH,
        [...existing, item],
        sha ?? "",
        `content: add recruitment signup (${item.name})`,
      );
      return;
    } catch (error) {
      if (error instanceof ContentConflictError && attempt < MAX_APPEND_RETRIES - 1) {
        continue;
      }
      throw error;
    }
  }
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = "Name is required.";
  if (!body.email?.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.email = "Enter a valid email.";
  if (!body.year?.trim()) errors.year = "Class year is required.";
  if (!body.pathway?.trim()) errors.pathway = "Select a pathway.";

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const item: RecruitmentSignup = {
    id: randomUUID(),
    name: body.name!.trim(),
    email: body.email!.trim(),
    year: body.year!.trim(),
    pathway: body.pathway!.trim(),
    notes: body.notes?.trim() ?? "",
    submittedAt: new Date().toISOString(),
  };

  try {
    await appendSignup(item);
  } catch (error) {
    console.error("Recruitment signup failed to save:", error);
    return NextResponse.json(
      { message: "Submission failed. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message:
      "You’re registered for rush updates. An officer will follow up with dates.",
  });
}
