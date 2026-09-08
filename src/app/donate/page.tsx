import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Mu Epsilon Delta at the University of Tampa — workshops, service, and member support.",
};

export default function DonatePage() {
  const { donate, site } = content;

  return (
    <div className="lg:flex lg:min-h-screen">
      {/* Sticky photo stack — AKPsi donate pattern */}
      <aside className="relative hidden min-h-screen w-[42%] flex-col gap-3 bg-maroon-deep p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-hidden">
        {["/images/hero-1.jpg", "/images/hero-recruit.jpg", "/images/hero-about.jpg"].map(
          (src, i) => (
            <div
              key={src}
              className="relative flex-1 overflow-hidden rounded-2xl border border-white/10"
              style={{ transform: `rotate(${i === 1 ? -1.5 : i === 2 ? 1.2 : 0}deg)` }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${src}')` }}
              />
              <div className="absolute inset-0 bg-maroon-deep/25" />
            </div>
          ),
        )}
      </aside>

      <main className="flex-1 bg-bg px-6 py-24 md:px-12 lg:px-16 lg:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
          {donate.eyebrow}
        </p>
        <h1 className="heading-display mt-3 text-4xl text-maroon dark:text-gold md:text-5xl">
          {donate.headline}
        </h1>
        <p className="mt-4 max-w-xl text-ink-muted">{donate.body}</p>

        <div className="card mt-10 p-5">
          <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-maroon dark:text-gold">
            <span>{donate.fund.name}</span>
            <span>{donate.fund.percent}% complete</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${donate.fund.percent}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            {donate.fund.raised} raised of {donate.fund.goal} goal
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {donate.tiers.map((tier) => (
            <article key={tier.name} className="card overflow-hidden">
              <div className="bg-gold px-5 py-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-maroon-deep">
                  {tier.name}
                </p>
                <p className="font-display text-3xl font-semibold text-maroon-deep">
                  {tier.amount}
                </p>
              </div>
              <div className="p-5">
                <p className="text-sm text-ink-muted">{tier.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex gap-2">
                      <span className="text-gold">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
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
              Donate
            </a>
          ) : (
            <a href={`mailto:${donate.contact}`} className="btn btn-primary">
              Donate via treasurer
            </a>
          )}
          <Link href="/contact" className="btn btn-ghost">
            Contact chapter
          </Link>
        </div>

        <blockquote className="mt-12 border-l-2 border-gold pl-5">
          <p className="font-display text-xl italic text-maroon dark:text-gold">
            “{donate.quote}”
          </p>
          <footer className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
            — {donate.quoteBy}
          </footer>
        </blockquote>
      </main>
    </div>
  );
}
