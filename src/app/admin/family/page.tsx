import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { FamilyForm, type FamilyMember } from "./FamilyForm";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const family = await getContentFile<FamilyMember[]>("content/family.json");

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Family</h1>
      <p className="mt-1 text-sm text-ink-muted">Add, edit, or remove members shown on the Members page.</p>
      <div className="mt-8">
        <FamilyForm initialMembers={family.data} initialSha={family.sha} />
      </div>
    </AdminShell>
  );
}
