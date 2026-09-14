"use client";

import { useMemo, useState } from "react";
import type { content } from "@/lib/content";

type FamilyMember = (typeof content)["family"][number];

export function FamilyRoster({ family }: { family: FamilyMember[] }) {
  const pathways = useMemo(() => {
    const set = new Set<string>();
    family.forEach((m) => set.add(m.pathway || "Other"));
    return Array.from(set);
  }, [family]);

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const visible = family.filter((m) => {
    const matchesPathway = active === "All" || (m.pathway || "Other") === active;
    const matchesQuery = m.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesPathway && matchesQuery;
  });

  return (
    <>
      <section className="bg-bg py-10">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {["All", ...pathways].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setActive(label)}
                className={`rounded-full border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition ${
                  active === label
                    ? "border-gold bg-gold/15 text-maroon dark:text-gold"
                    : "border-line bg-bg-elevated text-maroon hover:border-maroon dark:text-gold"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/50 dark:text-gold/60"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 14L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              aria-label="Search members by name"
              className="w-full rounded-full border border-line bg-bg-elevated py-2 pl-9 pr-4 text-sm text-maroon outline-none transition placeholder:text-maroon/40 focus:border-gold focus:ring-2 focus:ring-gold/30 dark:text-gold dark:placeholder:text-gold/40"
            />
          </div>
        </div>
      </section>

      <section id="roster" className="bg-bg pb-16 md:pb-24">
        <div className="container-page">
          {visible.length === 0 ? (
            <p className="rounded-[18px] border border-dashed border-line bg-bg-elevated p-10 text-center text-sm text-ink-muted">
              No members match that search.
            </p>
          ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((person) => (
              <article
                key={person.name}
                className="group relative overflow-hidden rounded-[18px] shadow-[var(--shadow-card)] transition-shadow duration-300 ease-out hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-maroon-rich to-maroon-deep">
                  {person.photo ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${person.photo}')` }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/10 to-transparent" />
                  <div className="absolute inset-x-0 top-0 p-4">
                    <h2 className="font-display text-xl font-semibold text-white">
                      {person.name}
                    </h2>
                    {person.pathway ? (
                      <p className="mt-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-gold">
                        {person.pathway}
                      </p>
                    ) : null}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm text-white/75">
                      <span className="font-bold text-white">
                        {person.year.replace(/^Class of\s+/i, "")}
                      </span>
                      {person.major ? ` · ${person.major}` : ""}
                    </p>
                    {person.linkedin ? (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex text-white/85 transition hover:text-gold"
                        aria-label={`${person.name}'s LinkedIn`}
                      >
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.24h4V23h-4V8.24zM8.5 8.24h3.83v2.02h.05c.53-1 1.85-2.06 3.8-2.06 4.07 0 4.82 2.68 4.82 6.16V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23h-4V8.24z" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
