import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { RecruitmentSignupsViewer } from "@/components/admin/RecruitmentSignupsViewer";
import type { RecruitmentSignup } from "@/app/api/rush/route";

const SIGNUPS_PATH = "content/recruitment-signups.json";

export const dynamic = "force-dynamic";

export default async function RecruitmentSignupsPage() {
  let signups: RecruitmentSignup[] = [];
  try {
    const file = await getContentFile<RecruitmentSignup[]>(SIGNUPS_PATH);
    signups = file.data;
  } catch {
    // No signups yet — content/recruitment-signups.json is created on the first submission.
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Recruitment</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Everyone who&apos;s registered through the public recruitment form, newest first. This list is
        read-only here — signups come in automatically as people submit the form.
      </p>
      <div className="mt-8">
        <RecruitmentSignupsViewer signups={signups} />
      </div>
    </AdminShell>
  );
}
