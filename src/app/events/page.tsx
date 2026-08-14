import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        eyebrow="Events"
        title="What MED programs look like."
        description="Programming spans professional development, academics, service, mentorship, and chapter community—scheduled on the public calendar."
      />

      <section className="container-page py-16 md:py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-serif text-3xl text-ink">Event types</h2>
          <Link href="/calendar" className="text-sm font-semibold text-accent hover:underline">
            View calendar →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.categories.map((cat) => (
            <article key={cat.id} className="card p-6">
              <span className="badge">{cat.id}</span>
              <h3 className="mt-4 font-serif text-2xl text-ink">{cat.title}</h3>
              <p className="mt-3 text-ink-muted">{cat.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-bg-elevated py-16 md:py-20">
        <div className="container-page">
          <h2 className="font-serif text-3xl text-ink">Upcoming</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {events.upcoming.map((event) => (
              <li key={event.id} className="grid gap-3 py-6 md:grid-cols-[8rem_1fr]">
                <div>
                  <p className="text-sm font-medium text-accent">
                    {formatDate(event.date)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ink-muted">
                    {event.category}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-ink">{event.title}</h3>
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

      <section className="container-page py-16 md:py-20">
        <h2 className="font-serif text-3xl text-ink">Recent past events</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {events.past.map((event) => (
            <li key={event.id} className="card p-5">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-muted">
                {formatDate(event.date)} · {event.category}
              </p>
              <h3 className="mt-2 font-serif text-xl text-ink">{event.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{event.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
