import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Members",
  description: "Brothers of Mu Epsilon Delta at the University of Tampa.",
};

export default function FamilyPage() {
  const { family, site, stats } = content;

  const byPathway = family.reduce<Record<string, typeof family>>((acc, m) => {
    const key = m.pathway || "Other";
    (acc[key] ||= []).push(m);
    return acc;
  }, {});

  return (
    <>
      <section className="relative overflow-hidden py-28 md:py-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-2.jpg')" }}
        />
        <div className="absolute inset-0 bg-maroon/75" />
        <div className="relative z-10 container-page text-white">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
            {stats.members}+ members · {site.university}
          </p>
          <h1 className="heading-display mt-4 text-[clamp(3rem,10vw,6rem)]">
            Members
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Pre-health Spartans across MD, DO, PA, dental, pharmacy, and more.
          </p>
          <Link href="/membership#register" className="btn btn-gold mt-8">
            Join the next class
          </Link>
        </div>
      </section>

      <section className="bg-bg py-10">
          <div className="container-page flex flex-wrap items-center gap-2">
          {["All", ...Object.keys(byPathway)].map((label, i) => (
            <a
              key={label}
              href={label === "All" ? "#roster" : `#path-${label}`}
              className={`rounded-full border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition ${
                i === 0
                  ? "border-gold bg-gold/15 text-maroon dark:text-gold"
                  : "border-line bg-bg-elevated text-maroon hover:border-maroon dark:text-gold"
              }`}
            >
              {label}
            </a>
          ))}
          <Link
            href="/membership#register"
            className="ml-auto rounded-full border border-gold px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-maroon dark:text-gold"
          >
            Brother portal · Join rush
          </Link>
        </div>
      </section>

      <section id="roster" className="bg-bg pb-16 md:pb-24">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {family.map((person) => (
              <article
                key={person.name}
                className="group relative overflow-hidden rounded-[18px]"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-maroon-rich to-maroon-deep">
                  {person.photo ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${person.photo}')` }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/10 to-transparent" />
                  {person.pathway ? (
                    <div className="absolute inset-x-0 top-0 p-4">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                        {person.pathway}
                      </p>
                    </div>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h2 className="font-display text-xl font-semibold text-white">
                      {person.name}
                    </h2>
                    <p className="mt-1 text-sm text-white/75">
                      {person.year}
                      {person.major ? ` · ${person.major}` : ""}
                    </p>
                    {person.linkedin ? (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex text-white/85 transition hover:text-gold"
                        aria-label={`${person.name}'s LinkedIn`}
                      >
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.24h4V23h-4V8.24zM8.5 8.24h3.83v2.02h.05c.53-1 1.85-2.06 3.8-2.06 4.07 0 4.82 2.68 4.82 6.16V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23h-4V8.24z" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {Object.entries(byPathway).map(([pathway, members]) => (
        <section
          key={pathway}
          id={`path-${pathway}`}
          className="scroll-mt-28 border-t border-line bg-bg-muted py-12"
        >
          <div className="container-page">
            <h2 className="font-display text-2xl font-semibold text-maroon dark:text-gold">
              {pathway}
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              {members.length} brothers
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {members.map((m) => (
                <li key={m.name} className="text-sm text-ink-muted">
                  <span className="font-medium text-ink">{m.name}</span>
                  {" · "}
                  {m.year}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="bg-maroon py-16 text-center text-[#f7f5ef] md:py-20">
        <h2 className="heading-display text-3xl md:text-4xl">
          Ready to join the family?
        </h2>
        <Link href="/membership#register" className="btn btn-gold mt-8">
          Register for Recruitment
        </Link>
      </section>
    </>
  );
}
