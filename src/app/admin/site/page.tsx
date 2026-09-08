import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { SiteSettingsForm, type SiteContent } from "./SiteSettingsForm";
import { StatsForm, type StatsContent } from "./StatsForm";

export default async function SiteSettingsPage() {
  const [site, stats] = await Promise.all([
    getContentFile<SiteContent>("content/site.json"),
    getContentFile<StatsContent>("content/stats.json"),
  ]);

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-muted">Chapter identity, contact info, and headline stats shown across the site.</p>
      <div className="mt-8 flex flex-col gap-10">
        <SiteSettingsForm initialSite={site.data} initialSha={site.sha} />
        <StatsForm initialStats={stats.data} initialSha={stats.sha} />
      </div>
    </AdminShell>
  );
}
