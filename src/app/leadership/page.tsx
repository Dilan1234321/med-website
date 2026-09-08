import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "E-Board",
  description: "Executive board of Mu Epsilon Delta at the University of Tampa.",
};

const officerImages = [
  "/images/hero-1.jpg",
  "/images/hero-recruit.jpg",
  "/images/hero-about.jpg",
  "/images/hero-2.jpg",
  "/images/hero-tampa-1.jpg",
  "/images/hero-1.jpg",
];

export default function LeadershipPage() {
  const { leadership, site } = content;
  const year = new Date().getFullYear();

  return (
    <>
      {/* AKPsi officers corridor hero */}
      <section className="page-hero min-h-[52vh]">
        <div
          className="page-hero-bg"
          style={{ backgroundImage: "url('/images/hero-1.jpg')" }}
        />
        <div className="page-hero-overlay" />
        <div className="relative z-10 container-page flex min-h-[52vh] flex-col justify-end pb-14 pt-36">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
            Mu Epsilon Delta · {site.university}
          </p>
          <h1 className="heading-display mt-3 text-[clamp(2.75rem,9vw,5.5rem)] text-white">
            Chapter Leadership
          </h1>
          <p className="mt-3 max-w-xl text-white/85">
            The {year} executive board guiding scholarship, service, and
            professional development for Spartans in healthcare.
          </p>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Executive board</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Meet the officers
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((person, i) => (
              <article key={person.name} className="group text-center">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[18px] border border-line shadow-[var(--shadow)]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
                    style={{
                      backgroundImage: `url('${officerImages[i % officerImages.length]}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-gold">
                      {person.role}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">
                      {person.year} · {person.major}
                    </p>
                  </div>
                </div>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
                  {person.focus}
                </p>
                {person.email ? (
                  <a
                    href={`mailto:${person.email}`}
                    className="mt-3 inline-block font-mono text-[0.65rem] uppercase tracking-[0.12em] text-maroon underline-offset-4 hover:underline dark:text-gold"
                  >
                    {person.email}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-muted py-16 md:py-20">
        <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="section-label">Lead with us</p>
            <div className="accent-line-left" />
            <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
              Interested in an officer role?
            </h2>
            <p className="mt-4 max-w-md text-ink-muted">
              Board positions open each spring. Start by joining a committee
              and talking with current chairs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Connect →
              </Link>
              <Link href="/membership" className="btn btn-ghost">
                Membership path
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/hero-recruit.jpg')" }}
            />
            <div className="absolute inset-0 bg-maroon-deep/35" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-tampa-1.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon-deep/70" />
        <div className="relative z-10 container-page text-center text-white">
          <h2 className="heading-display text-3xl md:text-5xl">
            Congratulations, Class of {year}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">
            Celebrating graduating brothers heading to medical school, PA
            programs, and healthcare careers.
          </p>
          <Link href="/alumni" className="btn btn-gold mt-8">
            View alumni outcomes
          </Link>
        </div>
      </section>
    </>
  );
}
