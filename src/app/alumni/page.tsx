import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Alumni",
  description:
    "Alumni outcomes across medical schools, residencies, and healthcare professions.",
};

const spotlightImages = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-about.jpg",
  "/images/hero-recruit.jpg",
];

export default function AlumniPage() {
  const { alumni } = content;

  return (
    <>
      <PageHero
        eyebrow="The Family"
        title="Alumni"
        description="Where brothers continue their careers in medicine and healthcare."
        image="/images/hero-2.jpg"
      />

      {/* AKPsi-style spotlight cards */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Alumni spotlight</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Where brothers go next
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {alumni.map((person, i) => (
              <article
                key={person.name}
                className="overflow-hidden rounded-[18px] border border-line bg-bg-elevated shadow-[var(--shadow)]"
              >
                <div className="relative aspect-[4/3]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${spotlightImages[i % spotlightImages.length]}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                      Class of {person.classYear}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-white">
                      {person.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm font-medium text-maroon dark:text-gold">
                    {person.current}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">{person.outcome}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-muted py-16 md:py-20">
        <div className="container-page">
          <p className="section-label">Outcomes</p>
          <div className="accent-line-left" />
          <h2 className="heading-display text-3xl text-maroon dark:text-gold">
            Full alumni roster
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Class</th>
                  <th className="py-3 pr-4 font-semibold">Outcome</th>
                  <th className="py-3 font-semibold">Current</th>
                </tr>
              </thead>
              <tbody>
                {alumni.map((person) => (
                  <tr key={person.name} className="border-b border-line align-top">
                    <td className="py-4 pr-4 font-medium text-ink">{person.name}</td>
                    <td className="py-4 pr-4 text-ink-muted">{person.classYear}</td>
                    <td className="py-4 pr-4 text-ink-muted">{person.outcome}</td>
                    <td className="py-4 text-ink-muted">{person.current}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-20">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {alumni.map((person) =>
            person.quote ? (
              <blockquote key={`${person.name}-quote`} className="card p-6">
                <p className="font-display text-xl leading-relaxed text-ink">
                  “{person.quote}”
                </p>
                <footer className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-muted">
                  — {person.name}, {person.current}
                </footer>
              </blockquote>
            ) : null,
          )}
        </div>
      </section>

      <section className="bg-maroon py-16 text-center text-[#f7f5ef] md:py-20">
        <h2 className="heading-display text-3xl md:text-4xl">
          Stay connected with the chapter
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/80">
          Mentorship, giving, and reunion events keep alumni in the MED network.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/donate" className="btn btn-gold">
            Support the chapter
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Update your path
          </Link>
        </div>
      </section>
    </>
  );
}
