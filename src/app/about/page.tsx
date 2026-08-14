import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "History, mission, and values of Mu Epsilon Delta at the University of Tampa.",
};

export default function AboutPage() {
  const { about, site, stats } = content;

  return (
    <>
      <PageHero
        eyebrow={site.chapter}
        title="Our Chapter"
        description={about.mission}
        image="/images/hero-about.jpg"
      />
      <section className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <p className="section-label">History</p>
          <div className="accent-line-left" />
          <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
            National founding {stats.foundingYear}
          </h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            {site.university} · {site.campus}
          </p>
        </div>
        <div className="space-y-5 text-left text-ink-muted md:col-span-7 md:text-lg md:leading-relaxed">
          <p>{about.history}</p>
          <p>{about.foundingStory}</p>
        </div>
      </section>
      <section className="border-t border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Values</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            What we stand on
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {about.values.map((value) => (
              <article key={value.title} className="card p-7">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-gold">
                  {value.subtitle}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-maroon dark:text-gold">
                  {value.title}
                </h3>
                <p className="mt-3 text-ink-muted">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
