import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { SpeedDatingForm } from "./SpeedDatingForm";
import type { Candidate } from "@/app/speed-dating/types";

export const dynamic = "force-dynamic";

export default async function AdminSpeedDatingPage() {
  const candidates = await getContentFile<Candidate[]>("content/speed-dating-candidates.json");

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Speed Dating</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Add, edit, or remove the PNMs brothers can rate at{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">/speed-dating</code>.
      </p>
      <div className="mt-8">
        <SpeedDatingForm initialCandidates={candidates.data} initialSha={candidates.sha} />
      </div>
    </AdminShell>
  );
}
