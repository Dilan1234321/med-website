import Link from "next/link";
import { PersonCard } from "@/components/PersonCard";
import { ScrollHero } from "@/components/ScrollHero";
import { content, formatDate } from "@/lib/content";

const destinations = [
  "Michigan Medicine",
  "Feinberg",
  "UCSF",
  "Hopkins",
  "Mayo Clinic",
  "Emory",
  "WashU",
  "Duke",
  "UCLA",
  "Penn Med",
  "Stanford Med",
  "Vanderbilt",
];

export default function HomePage() {
  const { about, events, leadership, stats } = content;
  const leaders = leadership.slice(0, 4);

  return (
    <>
      <ScrollHero />

      <section className="bg-bg py-10 md:py-14">
        <h2 className="mb-8 text-center text-[0.8rem] font-bold uppercase tracking-[0.28em] text-[#aaa]">
          Where our brothers lead
        </h2>
        <div className="marquee-mask overflow-hidden py-4">
          <div className="marquee-track gap-12 px-6">
            {[...destinations, ...destinations].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display text-lg font-bold uppercase tracking-[0.12em] text-ink/35 whitespace-nowrap transition hover:text-maroon dark:text-gold md:text-xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        <div className="marquee-mask mt-2 overflow-hidden py-4">
          <div className="marquee-track-reverse gap-12 px-6">
            {[...destinations].reverse().concat([...destinations].reverse()).map((name, i) => (
              <span
                key={`r-${name}-${i}`}
                className="font-display text-base font-bold uppercase tracking-[0.12em] text-ink/30 whitespace-nowrap md:text-lg"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-maroon">
          And so much more!
        </p>
      </section>

      <section className="border-y border-line bg-bg-elevated py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Our pillars</p>
          <div className="accent-line" />
          <h2 className="text-center font-display text-3xl font-bold uppercase tracking-[0.08em] text-maroon dark:text-gold dark:text-gold md:text-4xl">
            What we stand for
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value, i) => (
              <article key={value.title} className="card p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  Pillar {["I", "II", "III", "IV"][i]}
                </p>
                <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-maroon">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-24">
        <div className="container-page grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { label: "Active members", value: `${stats.members}` },
            { label: "Service hours", value: `${stats.serviceHours}+` },
            { label: "Acceptance rate*", value: `${stats.medSchoolAcceptanceRate}%` },
            { label: "Founded", value: `${stats.foundingYear}` },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-bold text-maroon dark:text-gold md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="container-page mt-6 text-center text-xs text-ink-muted">
          *Replace placeholder stats in content/stats.json before launch.
        </p>
      </section>

      <section className="border-y border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-label">Programming</p>
              <div className="accent-line-left" />
              <h2 className="font-display text-3xl font-bold uppercase tracking-[0.06em] text-maroon dark:text-gold dark:text-gold md:text-4xl">
                Upcoming events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm font-bold uppercase tracking-[0.14em] text-gold hover:underline"
            >
              View all events →
            </Link>
          </div>
          <ul className="mt-10 divide-y divide-line rounded-[16px] border border-line bg-bg-elevated">
            {events.upcoming.slice(0, 4).map((event) => (
              <li
                key={event.id}
                className="grid gap-2 px-5 py-5 md:grid-cols-[8rem_1fr_auto] md:items-center md:gap-6"
              >
                <span className="text-sm font-bold uppercase tracking-wide text-gold">
                  {formatDate(event.date)}
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-ink">
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

      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Leadership</p>
          <div className="accent-line" />
          <h2 className="text-center font-display text-3xl font-bold uppercase tracking-[0.08em] text-maroon dark:text-gold dark:text-gold md:text-4xl">
            Meet the board
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((person) => (
              <PersonCard
                key={person.name}
                name={person.name}
                meta={person.role}
                detail={`${person.year} · ${person.major}`}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/leadership" className="btn btn-ghost">
              Full board
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
