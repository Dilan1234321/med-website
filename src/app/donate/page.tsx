import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Mu Epsilon Delta scholarship, service, and mentorship programs.",
};

export default function DonatePage() {
  const { donate, site } = content;

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Support the Chapter"
        description={donate.body}
        image="/images/hero-2.jpg"
      />
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {donate.tiers.map((tier) => (
            <article key={tier.name} className="card p-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                {tier.name}
              </p>
              <p className="mt-3 font-display text-3xl text-ink">{tier.amount}</p>
              <p className="mt-3 text-sm text-ink-muted">{tier.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {site.donateUrl ? (
            <a
              href={site.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Give now
            </a>
          ) : (
            <a href={`mailto:${donate.contact}`} className="btn btn-primary">
              Email treasurer to give
            </a>
          )}
          <Link href="/contact" className="btn btn-secondary">
            Contact chapter
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          Giving contact:{" "}
          <a className="text-gold hover:underline" href={`mailto:${donate.contact}`}>
            {donate.contact}
          </a>
        </p>
      </section>
    </>
  );
}
