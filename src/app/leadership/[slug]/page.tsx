import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content, slugify } from "@/lib/content";
import { OfficerBulletList } from "@/components/OfficerBulletList";

type Person = (typeof content)["leadership"][number];

const FALLBACK_PHOTO = "/images/chapter-1.jpg";

function findPerson(slug: string): Person | undefined {
  return content.leadership.find((person) => slugify(person.name) === slug);
}

export async function generateStaticParams() {
  return content.leadership.map((person) => ({ slug: slugify(person.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = findPerson(slug);

  if (!person) {
    return { title: "Officer Not Found" };
  }

  return {
    title: person.name,
    description: person.role
      ? `${person.role} of Mu Epsilon Delta at the University of Tampa.`
      : "Officer of Mu Epsilon Delta at the University of Tampa.",
  };
}

export default async function OfficerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = findPerson(slug);

  if (!person) {
    notFound();
  }

  return (
    <div className="min-h-[100svh] bg-bg pt-[4.5rem] md:pt-[5.25rem]">
      <div className="grid lg:grid-cols-2 lg:min-h-[calc(100svh-5.25rem)]">
        <div className="relative min-h-[45vh] lg:min-h-[calc(100svh-5.25rem)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${person.photo || FALLBACK_PHOTO}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-maroon-deep/10" />

          <Link
            href="/leadership"
            className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-black/65"
          >
            <span aria-hidden>←</span> Back to the board
          </Link>

          {person.role ? (
            <span className="absolute bottom-6 left-4 z-10 rounded-full bg-maroon px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-md lg:hidden">
              {person.role}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:px-16">
          {person.role ? (
            <p className="hidden font-mono text-xs uppercase tracking-[0.18em] text-gold lg:block">
              {person.role}
            </p>
          ) : null}
          <h1 className="heading-display mt-3 text-[clamp(2.25rem,5vw,3.5rem)] text-maroon dark:text-gold">
            {person.name}
          </h1>

          {person.description ? (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              {person.description}
            </p>
          ) : null}

          {person.highlights.length > 0 ? (
            <div className="mt-10">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-maroon dark:text-gold">
                Responsibilities
              </p>
              <OfficerBulletList items={person.highlights} />
            </div>
          ) : null}

          {person.linkedin ? (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-bg-elevated px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-maroon transition hover:border-gold hover:text-gold dark:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.24h4V23h-4V8.24zM8.5 8.24h3.83v2.02h.05c.53-1 1.85-2.06 3.8-2.06 4.07 0 4.82 2.68 4.82 6.16V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23h-4V8.24z" />
              </svg>
              Connect on LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
