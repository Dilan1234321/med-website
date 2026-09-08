"use client";

import { useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AdminShell>
      <div className="flex flex-col items-start gap-4 rounded-xl border border-line bg-bg p-6">
        <h1 className="text-lg font-semibold text-ink">Something went wrong</h1>
        <p className="text-sm text-ink-muted">
          Couldn&apos;t load this page — it&apos;s usually a temporary GitHub API hiccup. Try again, and if it keeps
          happening, check that the site&apos;s GitHub token hasn&apos;t expired.
        </p>
        <button type="button" onClick={reset} className="admin-button-primary">
          Try again
        </button>
      </div>
    </AdminShell>
  );
}
