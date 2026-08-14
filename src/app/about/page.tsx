import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "History, mission, and values of Mu Epsilon Delta—professional medical fraternity.",
};

export default function AboutPage() {
  const { about, site, stats } = content;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Built for pre-health rigor, not rush-week theater."
        description={about.mission}
      />
      <section className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <h2 className="font-serif text-3xl text-ink">History</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Est. {stats.foundingYear} · {site.campus}
          </p>
        </div>
        <div className="prose-med space-y-5 md:col-span-7">
          <p>{about.history}</p>
          <p>{about.foundingStory}</p>
        </div>
      </section>
      <section className="border-t border-line bg-bg-elevated py-16 md:py-20">
        <div className="container-page">
          <h2 className="font-serif text-3xl text-ink">Values in practice</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {about.values.map((value) => (
              <article key={value.title} className="card p-6">
                <h3 className="font-serif text-2xl text-ink">{value.title}</h3>
                <p className="mt-3 text-ink-muted">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
