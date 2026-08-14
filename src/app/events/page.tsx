import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
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
      <PageHero
        eyebrow="Events"
        title="Programming"
        description="Professional development, academics, service, mentorship, and chapter community."
        image="/images/hero-2.jpg"
      />

      <section className="container-page py-16 md:py-24">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="section-label">Categories</p>
            <div className="accent-line-left" />
            <h2 className="font-display text-3xl font-bold uppercase tracking-[0.06em] text-maroon dark:text-gold dark:text-gold">
              Event types
            </h2>
          </div>
          <Link
            href="/calendar"
            className="text-sm font-bold uppercase tracking-[0.14em] text-gold hover:underline"
          >
            View calendar →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.categories.map((cat) => (
            <article key={cat.id} className="card p-6">
              <span className="badge">{cat.id}</span>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase text-maroon dark:text-gold">
                {cat.title}
              </h3>
              <p className="mt-3 text-ink-muted">{cat.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Upcoming</p>
          <div className="accent-line" />
          <h2 className="text-center font-display text-3xl font-bold uppercase text-maroon dark:text-gold">
            On the calendar
          </h2>
          <ul className="mt-10 divide-y divide-line rounded-2xl border border-line bg-bg-elevated">
            {events.upcoming.map((event) => (
              <li
                key={event.id}
                className="grid gap-3 px-5 py-6 md:grid-cols-[8rem_1fr]"
              >
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-gold">
                    {formatDate(event.date)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ink-muted">
                    {event.category}
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-ink">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {event.time} · {event.location}
                  </p>
                  <p className="mt-2 text-ink-muted">{event.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <p className="section-label text-center">Archive</p>
        <div className="accent-line" />
        <h2 className="text-center font-display text-3xl font-bold uppercase text-maroon dark:text-gold">
          Recent past events
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {events.past.map((event) => (
            <li key={event.id} className="card p-5">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-muted">
                {formatDate(event.date)} · {event.category}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase text-maroon dark:text-gold">
                {event.title}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">{event.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
