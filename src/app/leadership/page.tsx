import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";
import { OfficerCard } from "@/components/OfficerCard";

export const metadata: Metadata = {
  title: "E-Board",
  description: "Executive board of Mu Epsilon Delta at the University of Tampa.",
};

export default function LeadershipPage() {
  const { leadership, site } = content;
  const year = new Date().getFullYear();

  return (
    <>
      {/* AKPsi officers corridor hero */}
      <section className="page-hero min-h-[52vh]">
        <div
          className="page-hero-bg"
          style={{ backgroundImage: "url('/images/chapter-1.jpg')", backgroundPosition: "center 75%" }}
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
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Meet the officers
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((person) => (
              <OfficerCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-muted py-16 md:py-20">
        <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
          <div>
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
              style={{ backgroundImage: "url('/images/chapter-4.jpg')" }}
            />
            <div className="absolute inset-0 bg-maroon-deep/35" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/chapter-5.jpg')" }}
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
        </div>
      </section>
    </>
  );
}
