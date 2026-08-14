import Link from "next/link";
import { PersonCard } from "@/components/PersonCard";
import { ScrollHero } from "@/components/ScrollHero";
import { content, formatDate } from "@/lib/content";

function RushMarquee() {
  const rush = Array.from({ length: 14 }, () => "RUSH");
  const med = Array.from({ length: 12 }, () => "MED");

  return (
    <section className="overflow-hidden bg-maroon py-5 text-[#f7f5ef]">
      <div className="marquee-track gap-8 px-4">
        {[...rush, ...rush].map((word, i) => (
          <span
            key={`r-${i}`}
            className="font-mono text-sm font-bold tracking-[0.28em] whitespace-nowrap opacity-90"
          >
            {word}
          </span>
        ))}
      </div>
      <div className="marquee-track-reverse mt-2 gap-6 px-4 opacity-70">
        {[...med, ...med].map((word, i) => (
          <span
            key={`m-${i}`}
            className="font-display text-lg tracking-tight whitespace-nowrap"
          >
            {word} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { about, events, leadership, stats, gallery, site } = content;
  const leaders = leadership.slice(0, 4);
  const president = about.president;
  const galleryItems = gallery.albums.flatMap((a) => a.items).slice(0, 6);

  return (
    <>
      <ScrollHero />

      {/* President's welcome — medumich pattern */}
      <section className="relative bg-bg py-16 md:py-24">
        <div className="container-page">
          <article className="card relative mx-auto max-w-4xl overflow-visible p-6 pt-10 md:p-10 md:pt-12">
            <div className="absolute left-1/2 top-0 z-[1] -translate-x-1/2 -translate-y-1/2">
              <span className="inline-flex rounded-full bg-maroon px-5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#f7f5ef]">
                President&apos;s Welcome
              </span>
            </div>
            <div className="grid gap-8 md:grid-cols-[200px_1fr] md:items-start">
              <div className="mx-auto aspect-[3/4] w-44 overflow-hidden rounded-2xl bg-gradient-to-br from-maroon to-maroon-deep md:mx-0 md:w-full">
                <div className="flex h-full items-end p-4">
                  <span className="font-display text-5xl font-semibold text-gold/80">
                    {president.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-display text-xl italic leading-relaxed text-maroon md:text-2xl">
                  “{president.quote}”
                </p>
                <p className="mt-6 font-display text-lg italic text-maroon">
                  — {president.name}, {president.role} · {president.year}
                </p>
                <a
                  href={`mailto:${president.email}`}
                  className="mt-2 inline-block font-mono text-xs tracking-wide text-ink-muted hover:text-maroon"
                >
                  {president.email}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Pillars — medumich energy + own type */}
      <section className="border-y border-line bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">What we stand on</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-5xl">
            Pillars of MED
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value) => (
              <article
                key={value.title}
                className="group relative overflow-hidden rounded-[18px] bg-maroon text-[#f7f5ef]"
              >
                <div className="absolute inset-0 bg-[url('/images/hero-2.jpg')] bg-cover bg-center opacity-30 transition duration-500 group-hover:scale-105 group-hover:opacity-40" />
                <div className="relative flex min-h-[220px] flex-col justify-end p-6">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-gold">
                    {value.subtitle}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-white/85 opacity-0 transition-all duration-400 group-hover:max-h-40 group-hover:opacity-100">
                    {value.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bg py-16 md:py-20">
        <div className="container-page grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { label: "Active members", value: `${stats.members}` },
            { label: "Service hours", value: `${stats.serviceHours}+` },
            {
              label: "Chi Chapter",
              value: `${stats.chapterFounded}`,
            },
            { label: "National founding", value: `${stats.foundingYear}` },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-semibold tracking-tight text-maroon dark:text-gold md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="container-page mt-6 text-center text-xs text-ink-muted">
          {stats.note}
        </p>
      </section>

      <RushMarquee />

      {/* Events + rush CTA */}
      <section className="bg-bg-elevated py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-label">Programming</p>
              <div className="accent-line-left" />
              <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-4xl">
                Upcoming at UT
              </h2>
            </div>
            <Link href="/membership" className="btn btn-primary">
              See the rush timeline →
            </Link>
          </div>
          <ul className="mt-10 divide-y divide-line rounded-[18px] border border-line bg-bg">
            {events.upcoming.slice(0, 4).map((event) => (
              <li
                key={event.id}
                className="grid gap-2 px-5 py-5 md:grid-cols-[8rem_1fr_auto] md:items-center md:gap-6"
              >
                <span className="font-mono text-xs uppercase tracking-wide text-maroon dark:text-gold">
                  {formatDate(event.date)}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold tracking-tight text-ink">
                    {event.title}
                  </p>
                  <p className="text-sm text-ink-muted">{event.location}</p>
                </div>
                <span className="badge w-fit">{event.category}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery teaser — medumich */}
      <section className="border-y border-line bg-bg py-16 md:py-24">
        <div className="container-page grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="section-label">Our story</p>
            <div className="accent-line-left" />
            <h2 className="heading-display text-3xl text-maroon dark:text-gold md:text-5xl">
              MED throughout the years
            </h2>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
              The Gallery · {site.campus}
            </p>
            <Link href="/gallery" className="btn btn-ghost mt-8">
              View gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryItems.map((item, i) => (
              <figure
                key={item.id}
                className="card relative aspect-square overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{
                    backgroundImage: `url('${i % 2 === 0 ? "/images/hero-about.jpg" : "/images/hero-recruit.jpg"}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 to-transparent" />
                <figcaption className="absolute bottom-3 left-3 font-mono text-[0.65rem] tracking-wide text-white">
                  {String(i + 1).padStart(2, "0")} · {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Board teaser */}
      <section className="bg-bg-muted py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">The Family</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Meet the board
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((person) => (
              <PersonCard
                key={person.name}
                name={person.name}
                meta={person.role}
                detail={`${person.year} · ${person.major}`}
              />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/leadership" className="btn btn-ghost">
              Officers
            </Link>
            <Link href="/family" className="btn btn-primary">
              The brothers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
