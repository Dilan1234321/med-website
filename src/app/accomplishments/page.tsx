import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { content, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Accomplishments",
  description:
    "Awards, milestones, past events, and chapter outings.",
};

export default function AccomplishmentsPage() {
  const { accomplishments } = content;

  return (
    <>
      <PageHeader
        eyebrow="Accomplishments"
        title="Awards, milestones, and chapter memory."
        description="Institutional recognition, program milestones, and community outings—kept distinct from recruitment slogans."
      />

      <section className="container-page py-16 md:py-20">
        <h2 className="font-serif text-3xl text-ink">Awards</h2>
        <ul className="mt-8 space-y-5">
          {accomplishments.awards.map((award) => (
            <li key={`${award.year}-${award.title}`} className="card p-6">
              <p className="text-sm text-accent">{award.year}</p>
              <h3 className="mt-1 font-serif text-2xl text-ink">{award.title}</h3>
              <p className="mt-1 text-sm font-medium text-ink-muted">
                {award.issuer}
              </p>
              <p className="mt-3 text-ink-muted">{award.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-bg-elevated py-16 md:py-20">
        <div className="container-page">
          <h2 className="font-serif text-3xl text-ink">Milestones</h2>
          <ol className="mt-8 space-y-6">
            {accomplishments.milestones.map((item) => (
              <li
                key={`${item.year}-${item.title}`}
                className="grid gap-2 border-t border-line pt-6 md:grid-cols-[5rem_1fr]"
              >
                <span className="font-serif text-lg text-accent">{item.year}</span>
                <div>
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-ink-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <h2 className="font-serif text-3xl text-ink">Outings & gatherings</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {accomplishments.outings.map((item) => (
            <article key={item.title} className="card p-5">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-muted">
                {formatDate(item.date)}
              </p>
              <h3 className="mt-2 font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
