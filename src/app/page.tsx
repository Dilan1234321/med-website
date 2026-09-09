import Image from "next/image";
import Link from "next/link";
import { PersonCard } from "@/components/PersonCard";
import { FolderHero } from "@/components/FolderHero";
import { content, formatDate } from "@/lib/content";

function RushMarquee() {
  const rush = Array.from({ length: 14 }, () => "RECRUITMENT");
  const med = Array.from({ length: 12 }, () => "MED");

  return (
    <section className="overflow-hidden bg-maroon py-5 text-[#f7f5ef]">
      <div className="marquee-track gap-8 px-4">
        {[...rush, ...rush].map((word, i) => (
          <span
            key={`r-${i}`}
            className="font-mono text-sm font-bold tracking-[0.28em] whitespace-nowrap opacity-90"
          >
            {word}
          </span>
        ))}
      </div>
      <div className="marquee-track-reverse mt-2 gap-6 px-4 opacity-70">
        {[...med, ...med].map((word, i) => (
          <span
            key={`m-${i}`}
            className="font-display text-lg tracking-tight whitespace-nowrap"
          >
            {word} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { about, events, leadership, stats } = content;
  const leaders = leadership.slice(0, 4);
  const president = about.president;

  return (
    <>
      <FolderHero />

      {/* Recruitment season band — nautical motifs from the Fall '26 flyer */}
      <section className="relative overflow-hidden bg-[#12203a] py-16 text-[#f4ecd8] md:py-20">
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-10 top-1/2 h-56 w-56 -translate-y-1/2 opacity-[0.12] md:h-72 md:w-72"
          aria-hidden
        >
          <circle cx="100" cy="100" r="92" fill="none" stroke="#d4b96a" strokeWidth="2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#d4b96a" strokeWidth="1" />
          <path d="M100 12 L108 100 L100 188 L92 100 Z" fill="#d4b96a" />
          <path d="M12 100 L100 92 L188 100 L100 108 Z" fill="#d4b96a" opacity="0.6" />
        </svg>

        <div className="container-page relative">
          <div className="flex flex-col items-center text-center">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#d4b96a]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v10m0 0c-3.5 0-6-2-6-2m6 2c3.5 0 6-2 6-2M6 11h12" strokeLinecap="round" />
            </svg>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.28em] text-[#d4b96a]">
              Fall &apos;26 Recruitment Schedule
            </p>
            <h2 className="heading-display mt-3 text-[clamp(1.9rem,5vw,3rem)] text-[#f4ecd8]">
              Chart your course with MED
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.upcoming.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-[#d4b96a]/25 bg-white/5 p-5 text-left backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-[#d4b96a]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <circle cx="12" cy="5" r="1.6" />
                    <path d="M12 6.5v9m0 0c-2.8 0-4.8-1.6-4.8-1.6M12 15.5c2.8 0 4.8-1.6 4.8-1.6M7.8 9.5h8.4" strokeLinecap="round" />
                  </svg>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em]">
                    {formatDate(event.date)}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-semibold text-[#f4ecd8]">
                  {event.title}
                </p>
                <p className="mt-1 font-mono text-[0.7rem] tracking-wide text-[#f4ecd8]/70">
                  {event.time}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/membership" className="btn btn-gold">
              See the full schedule →
            </Link>
          </div>
        </div>
      </section>

      {/* President's welcome — medumich pattern */}
      <section className="relative bg-bg py-16 md:py-24">
        <div className="container-page">
          <article className="card relative mx-auto max-w-4xl overflow-visible p-6 pt-10 md:p-10 md:pt-12">
            <div className="absolute left-1/2 top-0 z-[1] -translate-x-1/2 -translate-y-1/2">
              <span className="inline-flex rounded-full bg-maroon px-5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#f7f5ef]">
                President&apos;s Welcome
              </span>
            </div>
            <div className="grid gap-8 md:grid-cols-[200px_1fr] md:items-start">
              <div className="relative mx-auto aspect-[3/4] w-44 overflow-hidden rounded-2xl md:mx-0 md:w-full">
                {president.photo ? (
                  <Image src={president.photo} alt={president.name} fill className="object-cover" sizes="(min-width: 768px) 200px, 176px" />
                ) : (
                  <div className="flex h-full items-end bg-gradient-to-br from-maroon to-maroon-deep p-4">
                    <span className="font-display text-5xl font-semibold text-gold/80">
                      {president.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-display text-xl italic leading-relaxed text-maroon md:text-2xl">
                  “{president.quote}”
                </p>
                <p className="mt-6 font-display text-lg italic text-maroon">
                  — {president.name}, {president.role}
                  {president.year ? ` · ${president.year}` : ""}
                </p>
                {president.email ? (
                  <a
                    href={`mailto:${president.email}`}
                    className="mt-2 inline-block font-mono text-xs tracking-wide text-ink-muted hover:text-maroon"
                  >
                    {president.email}
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bg py-16 md:py-20">
        <div className="container-page grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { label: "Active members", value: `${stats.members}` },
            { label: "Service hours", value: `${stats.serviceHours}+` },
            {
              label: "Gamma Chapter",
              value: `${stats.chapterFounded}`,
            },
            { label: "National founding", value: `${stats.foundingYear}` },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-semibold tracking-tight text-maroon dark:text-gold md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="container-page mt-6 text-center text-xs text-ink-muted">
          {stats.note}
        </p>
      </section>

      <RushMarquee />

      {/* Events + rush CTA */}
      <section className="bg-bg-elevated py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
                Upcoming at UT
              </h2>
            </div>
            <Link href="/membership" className="btn btn-primary">
              See the recruitment timeline →
            </Link>
          </div>
          <ul className="mt-10 divide-y divide-line rounded-[18px] border border-line bg-bg">
            {events.upcoming.slice(0, 4).map((event) => (
              <li
                key={event.id}
                className="grid gap-2 px-5 py-5 md:grid-cols-[8rem_1fr_auto] md:items-center md:gap-6"
              >
                <span className="font-mono text-xs uppercase tracking-wide text-maroon dark:text-gold">
                  {formatDate(event.date)}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold tracking-tight text-ink">
                    {event.title}
                  </p>
                  <p className="text-sm text-ink-muted">{event.location}</p>
                </div>
                <span className="badge w-fit">{event.category}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Board teaser */}
      <section className="bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">The Family</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Meet the board
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((person) => (
              <PersonCard
                key={person.name}
                name={person.name}
                meta={person.role}
                detail={`${person.year} · ${person.major}`}
                photo={person.photo}
              />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/leadership" className="btn btn-ghost">
              Officers
            </Link>
            <Link href="/family" className="btn btn-primary">
              The brothers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
