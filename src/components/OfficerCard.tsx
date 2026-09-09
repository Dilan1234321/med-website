"use client";

import { useRouter } from "next/navigation";
import { content, slugify } from "@/lib/content";

type Person = (typeof content)["leadership"][number];

const FALLBACK_PHOTO = "/images/chapter-1.jpg";

export function OfficerCard({ person }: { person: Person }) {
  const router = useRouter();
  const href = `/leadership/${slugify(person.name)}`;
  const yearMajor = [person.year, person.major].filter(Boolean).join(" · ");

  return (
    <article
      className="group cursor-pointer text-center"
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
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[18px] border border-line shadow-[var(--shadow)]">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
          style={{
            backgroundImage: `url('${person.photo || FALLBACK_PHOTO}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/20 to-transparent" />

        {person.role ? (
          <span className="absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-full bg-maroon px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-md">
            {person.role}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-5 text-left">
          <h3 className="font-display text-2xl font-semibold text-white">
            {person.name}
          </h3>
          {yearMajor ? (
            <p className="mt-1 text-sm text-white/75">{yearMajor}</p>
          ) : null}
          {person.linkedin ? (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
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
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
        {person.focus}
      </p>
      {person.email ? (
        <a
          href={`mailto:${person.email}`}
          onClick={(event) => event.stopPropagation()}
          className="mt-3 inline-block font-mono text-[0.65rem] uppercase tracking-[0.12em] text-maroon underline-offset-4 hover:underline dark:text-gold"
        >
          {person.email}
        </a>
      ) : null}
    </article>
  );
}
