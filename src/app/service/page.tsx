import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Service & Philanthropy",
  description:
    "Gift of Life Bone Marrow Registry, Tampa Bay partners, and Chi Chapter service impact.",
};

export default function ServicePage() {
  const { service } = content;
  const national = service.nationalPhilanthropy;

  return (
    <>
      <PageHero
        eyebrow="Service"
        title="Service & Philanthropy"
        description={service.intro}
        image="/images/hero-about.jpg"
      />

      <section className="border-b border-line">
        <div className="container-page grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          {service.metrics.map((metric) => (
            <div key={metric.label} className="bg-bg px-6 py-12 text-center">
              <p className="font-display text-4xl font-semibold text-maroon dark:text-gold">
                {metric.value}
              </p>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg py-16 md:py-24">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="section-label">{national.eyebrow}</p>
            <div className="accent-line-left" />
            <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
              {national.name}
            </h2>
            <p className="mt-4 text-ink-muted">{national.body}</p>
            <ol className="mt-6 space-y-3">
              {national.goals.map((goal, i) => (
                <li key={goal} className="flex gap-3 text-sm text-ink">
                  <span className="font-mono text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {goal}
                </li>
              ))}
            </ol>
            <a
              href={national.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-8"
            >
              Visit Gift of Life →
            </a>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/hero-tampa-1.jpg')" }}
            />
            <div className="absolute inset-0 bg-maroon-deep/40" />
            <p className="absolute bottom-6 left-6 right-6 font-display text-2xl font-semibold text-white md:text-3xl">
              Registry drives that save lives
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Partners</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Where we serve
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {service.partners.map((partner, i) => (
              <article
                key={partner.name}
                className="card overflow-hidden border-t-4 border-t-gold p-6"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  Partner {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-maroon dark:text-gold">
                  {partner.name}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{partner.role}</p>
                <p className="mt-4 text-sm font-medium text-gold">
                  {partner.impact}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-2.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon-deep/75" />
        <div className="relative z-10 container-page text-center text-white">
          <h2 className="heading-display text-3xl md:text-5xl">
            Invest in service impact
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">
            Donations fund supplies, drives, and travel so more brothers can
            serve Tampa Bay and support Gift of Life.
          </p>
          <Link href="/donate" className="btn btn-gold mt-8">
            Support the chapter
          </Link>
        </div>
      </section>
    </>
  );
}
