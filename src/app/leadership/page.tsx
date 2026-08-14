import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "E-Board",
  description: "Executive board of Mu Epsilon Delta at the University of Tampa.",
};

export default function LeadershipPage() {
  const { leadership, site } = content;
  const year = new Date().getFullYear();

  return (
    <>
      <section className="bg-bg pt-28 pb-10 md:pt-36">
        <div className="container-page">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-maroon dark:text-gold">
            Mu Epsilon Delta · {site.university}
          </p>
          <h1 className="heading-display mt-3 text-[clamp(3rem,10vw,6.5rem)] text-maroon dark:text-gold">
            {year} E-Board
          </h1>
        </div>
      </section>

      <section className="bg-bg pb-16 md:pb-24">
        <div className="container-page">
          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible lg:grid-cols-3">
            {leadership.map((person) => (
              <article
                key={person.name}
                className="relative min-w-[240px] flex-shrink-0 overflow-hidden rounded-[18px] md:min-w-0"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-maroon to-maroon-deep">
                  <div className="absolute inset-0 bg-[url('/images/hero-1.jpg')] bg-cover bg-center opacity-35" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/40 to-transparent" />
                  <div className="absolute inset-x-0 top-0 p-5">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                      {person.role}
                    </p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h2 className="font-display text-2xl font-semibold text-white">
                      {person.name}
                    </h2>
                    <p className="mt-1 text-sm text-white/75">
                      {person.year} · {person.major}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      {person.focus}
                    </p>
                  </div>
                </div>
              </article>
            ))}
            <article className="relative flex min-w-[240px] flex-shrink-0 items-end overflow-hidden rounded-[18px] bg-maroon md:min-w-0">
              <div className="aspect-[3/4] w-full p-6 text-[#f7f5ef]">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  Connect
                </p>
                <h2 className="mt-auto pt-24 font-display text-3xl font-semibold">
                  Want to lead?
                </h2>
                <p className="mt-3 text-sm text-white/80">
                  Officer roles open each spring. Reach out to learn more.
                </p>
                <Link href="/contact" className="btn btn-gold mt-6">
                  Connect →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-recruit.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon-deep/65" />
        <div className="relative z-10 container-page text-center text-white">
          <h2 className="heading-display text-3xl md:text-5xl">
            Congratulations, Class of {year}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">
            Celebrating graduating brothers heading to medical school,
            PA programs, and healthcare careers.
          </p>
          <Link href="/alumni" className="btn btn-gold mt-8">
            View alumni outcomes
          </Link>
        </div>
      </section>
    </>
  );
}
