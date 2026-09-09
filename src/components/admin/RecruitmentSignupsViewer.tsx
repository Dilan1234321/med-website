"use client";

import { useMemo, useState } from "react";
import type { RecruitmentSignup } from "@/app/api/rush/route";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecruitmentSignupsViewer({ signups }: { signups: RecruitmentSignup[] }) {
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () => [...signups].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [signups],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.pathway.toLowerCase().includes(q),
    );
  }, [sorted, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">
          <span className="text-lg font-bold text-maroon">{sorted.length}</span>{" "}
          {sorted.length === 1 ? "person has" : "people have"} signed up
        </p>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or pathway…"
          className="min-w-[240px] rounded-full border border-line bg-bg px-4 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-muted">
          {sorted.length === 0 ? "No signups yet." : "No signups match that search."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <article key={s.id} className="rounded-xl border border-line bg-bg p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon font-display text-sm font-bold text-white">
                {initials(s.name)}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.name}</h3>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                {formatDateTime(s.submittedAt)}
              </p>
              <a
                href={`mailto:${s.email}`}
                className="mt-3 block truncate text-sm text-maroon underline-offset-4 hover:underline"
              >
                {s.email}
              </a>
              <p className="mt-1 text-sm text-ink-muted">
                {s.year} · {s.pathway}
              </p>
              {s.notes ? (
                <p className="mt-2 border-t border-line pt-2 text-xs italic text-ink-muted">
                  {s.notes}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
