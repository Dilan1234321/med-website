import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { RushForm } from "@/components/Forms";
import { PageHeader } from "@/components/PageHeader";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Membership & Rush",
  description:
    "Eligibility, recruitment timeline, why join MED, and register to rush.",
};

export default function MembershipPage() {
  const { membership } = content;

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Recruitment with clear expectations."
        description="Review eligibility and the four-step timeline, then register to rush for the current cycle’s info sessions."
      />

      <section className="container-page py-16 md:py-20">
        <h2 className="font-serif text-3xl text-ink">Why join</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {membership.whyJoin.map((item) => (
            <article key={item.title} className="border-t border-line pt-5">
              <h3 className="font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-2 text-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bg-elevated py-16 md:py-20">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">Eligibility</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-ink-muted">
              {membership.eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-10 font-serif text-2xl text-ink">
              Membership expectations
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-ink-muted">
              {membership.expectations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">Timeline</h2>
            <ol className="mt-6 space-y-6">
              {membership.timeline.map((step) => (
                <li key={step.step} className="grid grid-cols-[3rem_1fr] gap-4">
                  <span className="font-serif text-2xl text-accent">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{step.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="register" className="container-page scroll-mt-24 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-serif text-3xl text-ink">Register to Rush</h2>
            <p className="prose-med mt-4">
              Submit your information to receive info-session dates and
              application links. This does not commit you to membership.
            </p>
          </div>
          <RushForm />
        </div>
      </section>

      <section className="border-t border-line bg-bg-elevated py-16 md:py-20">
        <div className="container-page max-w-3xl">
          <h2 className="font-serif text-3xl text-ink">FAQ</h2>
          <div className="mt-8">
            <FaqAccordion items={membership.faq} />
          </div>
        </div>
      </section>
    </>
  );
}
