import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { LeadershipForm, type LeadershipMember } from "./LeadershipForm";

export default async function LeadershipPage() {
  const leadership = await getContentFile<LeadershipMember[]>("content/leadership.json");

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Exec Board</h1>
      <p className="mt-1 text-sm text-ink-muted">Add, edit, or remove exec board members shown on the Leadership page.</p>
      <div className="mt-8">
        <LeadershipForm initialMembers={leadership.data} initialSha={leadership.sha} />
      </div>
    </AdminShell>
  );
}
