import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { RushForm } from "@/components/Forms";
import { PageHero } from "@/components/PageHero";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Recruitment",
  description:
    "Eligibility, recruitment timeline, why join MED, and register for rush.",
};

export default function MembershipPage() {
  const { membership } = content;

  return (
    <>
      <PageHero
        eyebrow="Recruitment"
        title="Join the Brotherhood"
        description="Review eligibility and the four-step timeline, then register for rush."
        image="/images/hero-recruit.jpg"
      />

      <section className="container-page py-16 md:py-24">
        <p className="section-label text-center">Why join</p>
        <div className="accent-line" />
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-maroon dark:text-gold">
          Why brothers choose MED
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {membership.whyJoin.map((item, i) => (
            <article key={item.title} className="card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-maroon dark:text-gold">
                {item.title}
              </h3>
              <p className="mt-2 text-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <p className="section-label">Eligibility</p>
            <div className="accent-line-left" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-maroon dark:text-gold">
              Requirements
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-ink-muted">
              {membership.eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-10 font-display text-2xl font-bold tracking-tight text-maroon dark:text-gold">
              Expectations
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-ink-muted">
              {membership.expectations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label">Timeline</p>
            <div className="accent-line-left" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-maroon dark:text-gold">
              The process
            </h2>
            <ol className="mt-8 space-y-0">
              {membership.timeline.map((step, idx) => (
                <li
                  key={step.step}
                  className="relative grid grid-cols-[3rem_1fr] gap-4 pb-8"
                >
                  {idx < membership.timeline.length - 1 ? (
                    <span
                      className="absolute left-[1.15rem] top-8 h-[calc(100%-1.5rem)] w-px bg-gold/40"
                      aria-hidden
                    />
                  ) : null}
                  <span className="relative z-[1] flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-maroon-deep">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold tracking-tight text-maroon dark:text-gold">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="register" className="container-page scroll-mt-28 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="section-label">Register</p>
            <div className="accent-line-left" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-maroon dark:text-gold">
              Register for Rush
            </h2>
            <p className="mt-4 max-w-md text-ink-muted">
              Submit your information to receive info-session dates and
              application links. This does not commit you to membership.
            </p>
          </div>
          <RushForm />
        </div>
      </section>

      <section className="border-t border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page max-w-3xl">
          <p className="section-label text-center">FAQ</p>
          <div className="accent-line" />
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-maroon dark:text-gold">
            Frequently asked
          </h2>
          <div className="mt-10">
            <FaqAccordion items={membership.faq} />
          </div>
        </div>
      </section>
    </>
  );
}
