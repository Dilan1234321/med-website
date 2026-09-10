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
          <h1 className="heading-display mt-2 text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] text-maroon dark:text-gold">
            2026 Recruitment
          </h1>
          <div className="mt-8 max-w-md border-t border-line pt-6">
            <Link href="/#recruitment-schedule" className="btn btn-primary">
              See Recruitment Events
            </Link>
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
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-[24px] border-[10px] border-gold shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/chapter-1.jpg')" }}
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="heading-display text-4xl text-maroon dark:text-gold md:text-6xl">
              Beyond a brotherhood
            </h2>
            <p className="mx-auto mt-6 max-w-md text-lg text-ink-muted md:mx-0">
              Recruitment at UT is structured, transparent, and built around fit for
              healthcare pathways, not parties.
            </p>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="heading-display text-4xl text-maroon dark:text-gold md:text-5xl">
              Eligibility
            </h2>
            <div className="mt-10 space-y-8">
              {membership.eligibility.slice(0, 3).map((item, i) => (
                <div key={item} className="border-t border-line pt-5">
                  <p className="font-display text-3xl font-semibold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#register" className="btn btn-primary">
                Register for Recruitment →
              </a>
              <Link href="/about" className="btn btn-ghost">
                About the chapter
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[24px] border border-line shadow-xl md:max-w-none">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/chapter-3.jpg')" }}
            />
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
