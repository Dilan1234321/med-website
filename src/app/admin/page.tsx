import { AdminShell } from "@/components/admin/AdminShell";
import { listRecentContentChanges } from "@/lib/admin/github";

export default async function AdminDashboardPage() {
  const changes = await listRecentContentChanges(20);

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Recent content changes, newest first. Every save here is a normal git commit, so nothing is ever truly lost.
      </p>
      <ul className="mt-8 flex flex-col divide-y divide-line rounded-xl border border-line bg-bg">
        {changes.length === 0 && <li className="p-4 text-sm text-ink-muted">No content changes yet.</li>}
        {changes.map((change) => (
          <li key={change.sha} className="flex flex-col gap-1 p-4">
            <span className="text-sm font-medium text-ink">{change.message}</span>
            <span className="text-xs text-ink-muted">
              {change.author} · {new Date(change.date).toLocaleString("en-US")}
            </span>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
