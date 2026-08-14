import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        eyebrow="Calendar"
        title="Chapter calendar"
        description="Upcoming info sessions, workshops, service projects, and mentorship hours. Update dates in content/events.json."
      />
      <section className="container-page py-16 md:py-20">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/events" className="btn btn-secondary">
            Event types
          </Link>
          <Link href="/membership#register" className="btn btn-primary">
            Register to Rush
          </Link>
        </div>
        <ol className="space-y-4">
          {sorted.map((event) => (
            <li
              key={event.id}
              className="card grid gap-4 p-5 md:grid-cols-[10rem_1fr_8rem] md:items-center"
            >
              <time
                dateTime={event.date}
                className="font-serif text-lg text-accent"
              >
                {formatDate(event.date)}
              </time>
              <div>
                <p className="font-medium text-ink">{event.title}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {event.time} · {event.location}
                </p>
              </div>
              <span className="badge w-fit md:justify-self-end">
                {event.category}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
