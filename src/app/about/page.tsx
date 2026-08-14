import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "History, mission, and why Mu Epsilon Delta at the University of Tampa.",
};

const whyCards = [
  {
    title: "Professional development & service",
    image: "/images/hero-2.jpg",
  },
  {
    title: "Academic support",
    image: "/images/hero-about.jpg",
  },
  {
    title: "Inclusivity",
    image: "/images/hero-recruit.jpg",
  },
  {
    title: "Community",
    image: "/images/hero-1.jpg",
  },
];

export default function AboutPage() {
  const { about, site, stats } = content;

  return (
    <>
      <section className="page-hero min-h-[70vh]">
        <div
          className="page-hero-bg"
          style={{ backgroundImage: "url('/images/hero-tampa-1.jpg')" }}
        />
        <div className="page-hero-overlay" />
        <div className="relative z-10 container-page flex min-h-[70vh] flex-col items-center justify-center pb-16 pt-36 text-center md:pb-24">
          <p
            className="font-display text-[clamp(4rem,18vw,11rem)] font-semibold leading-none tracking-[0.08em] text-transparent"
            style={{ WebkitTextStroke: "2px rgba(201,162,74,0.85)" }}
            aria-hidden
          >
            ΜΕΔ
          </p>
          <h1 className="heading-display mt-6 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] text-white">
            A network you grow with.
          </h1>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-about.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon-deep/75" />
        <div className="relative z-10 container-page max-w-4xl text-white">
          <p className="section-label !text-gold">About us</p>
          <div className="accent-line-left !bg-gold" />
          <h2 className="heading-display mt-2 text-3xl md:text-5xl">
            Founded in {stats.foundingYear}. University of Tampa chapter
            carrying the mission forward.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-white/88 md:text-lg">
            <p>{about.history}</p>
            <p>{about.foundingStory}</p>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="section-label">Build your pre-health journey with us</p>
            <div className="accent-line-left" />
            <h2 className="heading-display text-4xl text-maroon dark:text-gold md:text-6xl">
              Why MED?
            </h2>
            <p className="mt-6 text-ink-muted md:text-lg">{about.mission}</p>
            <blockquote className="mt-8 border-l-2 border-maroon pl-5 font-mono text-sm leading-relaxed text-maroon dark:text-gold md:text-base">
              “{about.president.quote.slice(0, 180)}…”
              <footer className="mt-3 font-display text-base italic">
                — {about.president.name}, {about.president.role}
              </footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {whyCards.map((card, i) => (
              <article
                key={card.title}
                className={`relative overflow-hidden rounded-[18px] ${i === 0 ? "min-h-[220px]" : "min-h-[180px]"}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                <div className="absolute inset-0 bg-maroon-deep/65" />
                <div className="relative flex h-full min-h-[180px] items-end p-4">
                  <h3 className="font-display text-lg font-semibold leading-snug text-white md:text-xl">
                    {card.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-muted py-20 md:py-28">
        <div className="container-page text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-maroon dark:text-gold">
            The family
          </p>
          <h2 className="heading-display mx-auto mt-4 max-w-5xl text-[clamp(2.75rem,10vw,6.5rem)] text-maroon dark:text-gold">
            The brothers
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-ink-muted">
            A close-knit family of brothers and sisters who show up for each
            other—for life.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/family" className="btn btn-primary">
              Meet the family
            </Link>
            <Link href="/leadership" className="btn btn-ghost">
              Meet the board
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg py-16 md:py-20">
        <div className="container-page">
          <p className="section-label text-center">What we stand on</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Pillars of MED
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <article key={v.title} className="card p-5 text-center">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  {v.subtitle}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-maroon dark:text-gold">
                  {v.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Life as a brother — AKPsi masonry */}
      <section className="bg-maroon-deep py-16 text-[#f7f5ef] md:py-24">
        <div className="container-page">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
            Chapter life
          </p>
          <h2 className="heading-display mt-3 text-3xl text-gold md:text-5xl">
            Life as a brother
          </h2>
          <div className="mt-10 columns-2 gap-3 md:columns-3">
            {[
              { src: "/images/hero-1.jpg", h: "aspect-[3/4]" },
              { src: "/images/hero-recruit.jpg", h: "aspect-square" },
              { src: "/images/hero-about.jpg", h: "aspect-[4/5]" },
              { src: "/images/hero-2.jpg", h: "aspect-[3/4]" },
              { src: "/images/hero-tampa-1.jpg", h: "aspect-square" },
              { src: "/images/hero-about.jpg", h: "aspect-[4/3]" },
            ].map((item, i) => (
              <figure
                key={`${item.src}-${i}`}
                className={`mb-3 break-inside-avoid overflow-hidden rounded-2xl ${item.h}`}
              >
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.src}')` }}
                  role="img"
                  aria-label={`Chapter life photo ${i + 1}`}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline — national + UT */}
      <section className="bg-maroon-deep pb-20 text-[#f7f5ef]">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <article className="border-t border-gold/40 pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
              1965 · Tennessee
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-gold">
              Our global origins
            </h3>
            <p className="mt-3 text-white/75">
              Mu Epsilon Delta founded at the University of Tennessee at Martin as
              a co-ed pre-health professional fraternity.
            </p>
          </article>
          <article className="border-t border-gold/40 pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
              Today · Tampa
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-gold">
              University of Tampa chapter
            </h3>
            <p className="mt-3 text-white/75">
              Building scholarship, service, and mentorship for Spartans on the
              path to healthcare careers.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-maroon py-16 text-[#f7f5ef] md:py-20">
        <div className="container-page text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
            The MED network
          </p>
          <h2 className="heading-display mx-auto mt-4 max-w-3xl text-3xl md:text-5xl">
            Keep in touch with us
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            {site.university} · {site.campus}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              Instagram
            </a>
            <Link href="/membership#register" className="btn btn-secondary">
              Register for Rush
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
