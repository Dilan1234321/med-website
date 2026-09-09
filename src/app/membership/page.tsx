import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { RushForm } from "@/components/Forms";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Recruitment",
  description:
    "Fall rush at Mu Epsilon Delta, University of Tampa. Timeline, eligibility, FAQ, and registration.",
};

export default function MembershipPage() {
  const { membership, site } = content;

  return (
    <>
      {/* Split recruitment hero: medumich Rush pattern */}
      <section className="grid min-h-[78vh] bg-bg lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-28 md:px-12 lg:px-16 lg:py-32">
          <p className="font-display text-2xl font-semibold tracking-tight text-maroon dark:text-gold md:text-3xl">
            MED Fall
          </p>
          <h1 className="heading-display mt-2 text-[clamp(3.5rem,12vw,7rem)] leading-[0.95] text-maroon dark:text-gold">
            2026 Recruitment
          </h1>
          <div className="mt-8 max-w-md border-t border-line pt-6">
            <p className="font-display text-lg font-semibold uppercase tracking-[0.08em] text-maroon dark:text-gold">
              Dates
            </p>
            <ul className="mt-4 space-y-4 font-mono text-base text-ink-muted md:text-lg">
              {membership.timeline.map((step) => (
                <li key={step.step}>
                  <span className="text-lg font-bold text-maroon dark:text-gold md:text-xl">
                    {step.date}
                  </span>
                  {" · "}
                  {step.title}
                </li>
              ))}
            </ul>
            <a
              href="#register"
              className="mt-6 inline-flex font-mono text-xs uppercase tracking-[0.14em] text-maroon underline-offset-4 hover:underline dark:text-gold"
            >
              Register for Recruitment →
            </a>
          </div>
        </div>
        <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/chapter-4.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-maroon/20 to-transparent" />
          <p className="absolute bottom-8 right-8 font-display text-[clamp(4rem,14vw,9rem)] font-semibold leading-none text-white/25">
            26
          </p>
        </div>
      </section>

      {/* Polaroid excellence: AKPsi recruitment */}
      <section className="overflow-hidden bg-bg-muted py-16 md:py-24">
        <div className="container-page grid items-center gap-10 md:grid-cols-[1fr_1.1fr_1fr]">
          <div className="relative mx-auto hidden h-64 w-44 rotate-[-8deg] md:block">
            <div className="absolute inset-0 rounded-md border-[10px] border-gold bg-cover bg-center shadow-xl"
              style={{ backgroundImage: "url('/images/chapter-1.jpg')" }}
            />
          </div>
          <div className="text-center">
            <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
              Beyond a brotherhood
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink-muted">
              Recruitment at UT is structured, transparent, and built around fit for
              healthcare pathways, not parties.
            </p>
          </div>
          <div className="relative mx-auto hidden h-64 w-44 rotate-[7deg] md:block">
            <div className="absolute inset-0 rounded-md border-[10px] border-gold bg-cover bg-center shadow-xl"
              style={{ backgroundImage: "url('/images/chapter-3.jpg')" }}
            />
          </div>
        </div>
      </section>

      {/* Vertical pillars timeline: AKPsi */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Three pillars of membership
          </h2>
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="absolute top-0 bottom-0 left-4 w-px bg-gold/50 md:left-1/2 md:-translate-x-px" />
            {[
              {
                label: "Pillar I",
                title: "Scholarship",
                body: "MCAT cohorts, tutoring, and application clinics that keep brothers competitive.",
              },
              {
                label: "Pillar II",
                title: "Service & mentorship",
                body: "Tampa Bay partners and alumni mentors who turn hours into real readiness.",
              },
              {
                label: "Pillar III",
                title: "Professional development",
                body: "Speakers, skills clinics, and interview practice for every pre-health path.",
              },
            ].map((pillar, i) => (
              <article
                key={pillar.label}
                className={`relative mb-10 grid gap-4 pl-12 md:mb-14 md:grid-cols-2 md:gap-10 md:pl-0 ${
                  i % 2 === 1 ? "md:text-right" : ""
                }`}
              >
                <div
                  className={`absolute top-1 left-2.5 h-3 w-3 rounded-full bg-gold md:left-1/2 md:-translate-x-1/2`}
                />
                <div className={i % 2 === 1 ? "md:col-start-2" : "md:col-start-1 md:pr-10"}>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                    {pillar.label}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-maroon dark:text-gold">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-ink-muted">{pillar.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility on photo */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/chapter-3.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon-deep/70" />
        <div className="relative z-10 container-page text-white">
          <h2 className="heading-display text-4xl md:text-5xl">Eligibility</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {membership.eligibility.slice(0, 3).map((item, i) => (
              <div key={item} className="border-t border-white/30 pt-5">
                <p className="font-display text-3xl font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/88 md:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#register" className="btn btn-gold">
              Register for Recruitment →
            </a>
            <Link href="/about" className="btn btn-secondary">
              About the chapter
            </Link>
          </div>
        </div>
      </section>

      {/* Member benefits: content pattern from peer MED chapters */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            What membership unlocks
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {membership.benefits.map((item, i) => (
              <article key={item.title} className="card border-t-4 border-t-gold p-6">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-maroon dark:text-gold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="scroll-mt-28 border-y border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
              Register for Recruitment
            </h2>
            <p className="mt-4 max-w-md text-ink-muted">
              Get info-session dates and application links for {membership.season}{" "}
              at {site.university}. Submitting does not commit you to membership.
            </p>
          </div>
          <RushForm />
        </div>
      </section>

      {/* FAQ: medumich "Questions?" */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-page max-w-3xl">
          <h2 className="heading-display text-center text-4xl text-maroon dark:text-gold md:text-6xl">
            Questions?
          </h2>
          <div className="mt-10">
            <FaqAccordion items={membership.faq} />
          </div>
          <p className="mt-10 text-center text-sm text-ink-muted">
            Still have questions?{" "}
            <Link href="/contact" className="font-semibold text-maroon underline-offset-2 hover:underline dark:text-gold">
              Contact the chapter
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
