"use client";

import { useRouter } from "next/navigation";
import { content, slugify } from "@/lib/content";

type Person = (typeof content)["leadership"][number];

const FALLBACK_PHOTO = "/images/chapter-1.jpg";

export function OfficerCard({ person }: { person: Person }) {
  const router = useRouter();
  const href = `/leadership/${slugify(person.name)}`;

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-[18px] border border-line bg-bg-elevated shadow-[var(--shadow-card)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)]"
      role="link"
      tabIndex={0}
      aria-label={`View ${person.name}'s officer profile`}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(href);
        }
      }}
    >
      {/* Photo block: clean, no overlaid text or badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 ease-out group-hover:scale-[1.04]"
          style={{
            backgroundImage: `url('${person.photo || FALLBACK_PHOTO}')`,
          }}
        />
      </div>

      {/* Info panel: soft gold-tinted cream, crossfades to a "View Profile" pill on hover */}
      <div className="relative overflow-hidden bg-[var(--folder-cream)] px-5 py-5 dark:bg-bg-elevated">
        <div className="text-center transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:opacity-0">
          <h3 className="font-display text-xl font-semibold text-ink">
            {person.name}
          </h3>
          {person.role ? (
            <p className="font-display mt-1 text-base font-medium text-maroon dark:text-gold">
              {person.role}
            </p>
          ) : null}
          {person.linkedin ? (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="mt-3 inline-flex text-maroon transition hover:text-gold dark:text-gold dark:hover:text-gold-soft"
              aria-label={`${person.name}'s LinkedIn`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.24h4V23h-4V8.24zM8.5 8.24h3.83v2.02h.05c.53-1 1.85-2.06 3.8-2.06 4.07 0 4.82 2.68 4.82 6.16V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23h-4V8.24z" />
              </svg>
            </a>
          ) : null}
        </div>

        <div
          className="pointer-events-none absolute inset-0 flex translate-y-2 items-center justify-center opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-5 py-2.5 font-display text-sm font-semibold text-white shadow-md">
            View Profile <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
