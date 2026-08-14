import type { Metadata } from "next";
import Link from "next/link";
import { content, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events & Programming",
  description:
    "Professional development, academic support, service, mentorship, and chapter community events.",
};

export default function EventsPage() {
  const { events } = content;

  return (
    <>
      <section className="page-hero min-h-[55vh]">
        <div
          className="page-hero-bg"
          style={{ backgroundImage: "url('/images/hero-2.jpg')" }}
        />
        <div className="page-hero-overlay" />
        <div className="relative z-10 container-page flex min-h-[55vh] flex-col justify-end pb-14 pt-36">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
            Programming
          </p>
          <h1 className="heading-display mt-3 text-[clamp(2.5rem,8vw,5rem)] text-white">
            The professional journey
          </h1>
          <p className="mt-4 max-w-xl text-white/85">
            Workshops, speakers, service, and mentorship that prepare brothers
            for healthcare careers.
          </p>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-label">Categories</p>
              <div className="accent-line-left" />
              <h2 className="heading-display text-3xl text-maroon dark:text-gold">
                Event types
              </h2>
            </div>
            <Link
              href="/calendar"
              className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:underline"
            >
              View calendar →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.categories.map((cat, i) => (
              <article
                key={cat.id}
                className="card overflow-hidden border-t-4 border-t-gold p-6"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  {String(i + 1).padStart(2, "0")} · {cat.id}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-maroon dark:text-gold">
                  {cat.title}
                </h3>
                <p className="mt-3 text-ink-muted">{cat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-recruit.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon-deep/80" />
        <div className="relative z-10 container-page text-white">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
            Upcoming
          </p>
          <h2 className="heading-display mt-2 text-3xl md:text-5xl">
            On the calendar
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {events.upcoming.map((event) => (
              <li
                key={event.id}
                className="rounded-[18px] border border-white/20 bg-white/10 p-5 backdrop-blur-md"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  {formatDate(event.date)} · {event.category}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {event.time} · {event.location}
                </p>
                <p className="mt-3 text-sm text-white/80">{event.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Archive</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold">
            Recent past events
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {events.past.map((event) => (
              <li key={event.id} className="card p-5">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-muted">
                  {formatDate(event.date)} · {event.category}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-maroon dark:text-gold">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{event.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
