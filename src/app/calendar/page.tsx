import type { Metadata } from "next";
import Link from "next/link";
import { content, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Upcoming Mu Epsilon Delta chapter events and programming dates.",
};

export default function CalendarPage() {
  const { events } = content;
  const sorted = [...events.upcoming].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return (
    <>
      <section className="page-hero min-h-[48vh]">
        <div
          className="page-hero-bg"
          style={{ backgroundImage: "url('/images/hero-about.jpg')" }}
        />
        <div className="page-hero-overlay" />
        <div className="relative z-10 container-page flex min-h-[48vh] items-end pb-14 pt-36">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
              Chapter calendar
            </p>
            <h1 className="heading-display mt-3 text-[clamp(2.5rem,8vw,5rem)] text-white">
              Calendar
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label">Upcoming</p>
              <div className="accent-line-left" />
              <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
                On the schedule
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/events" className="btn btn-ghost">
                Event types
              </Link>
              <Link href="/membership#register" className="btn btn-primary">
                Register to Rush
              </Link>
            </div>
          </div>

          <ol className="mt-12 space-y-4">
            {sorted.map((event, i) => (
              <li
                key={event.id}
                className="card grid gap-4 p-5 transition hover:border-gold/50 md:grid-cols-[7rem_10rem_1fr_8rem] md:items-center"
              >
                <p className="font-display text-3xl font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <time
                  dateTime={event.date}
                  className="font-mono text-sm uppercase tracking-[0.1em] text-maroon dark:text-gold"
                >
                  {formatDate(event.date)}
                </time>
                <div>
                  <p className="font-display text-xl font-semibold text-ink">
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {event.time} · {event.location}
                  </p>
                  {event.summary ? (
                    <p className="mt-2 text-sm text-ink-muted">{event.summary}</p>
                  ) : null}
                </div>
                <span className="badge w-fit md:justify-self-end">
                  {event.category}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-2.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon-deep/75" />
        <div className="relative z-10 container-page text-center text-white">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
            Don&apos;t miss rush
          </p>
          <h2 className="heading-display mt-3 text-3xl md:text-5xl">
            Fall 2026 recruitment
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">
            Info sessions and interviews land on this calendar first. Register
            to get notified.
          </p>
          <Link href="/membership#register" className="btn btn-gold mt-8">
            Interest form →
          </Link>
        </div>
      </section>
    </>
  );
}
