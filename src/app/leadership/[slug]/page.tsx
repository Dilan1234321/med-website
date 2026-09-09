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

function buildSummary(person: Person): string | null {
  const clauses: string[] = [];

  clauses.push(
    person.role
      ? `${person.name} serves as ${person.role} of Mu Epsilon Delta`
      : `${person.name} is part of the Mu Epsilon Delta executive board`
  );

  if (person.major) {
    clauses.push(`studying ${person.major}`);
  }

  if (person.year) {
    clauses.push(person.year);
  }

  if (clauses.length === 0) {
    return null;
  }

  return `${clauses.join(", ")}.`;
}

function buildFacts(person: Person): string[] {
  const facts: string[] = [];
  if (person.role) facts.push(`Role: ${person.role}`);
  if (person.year) facts.push(`Year: ${person.year}`);
  if (person.major) facts.push(`Major: ${person.major}`);
  if (person.email) facts.push(`Email: ${person.email}`);
  if (person.linkedin) facts.push(`LinkedIn: ${person.linkedin}`);
  return facts;
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

  const summary = buildSummary(person);
  const facts = buildFacts(person);

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

          {summary ? (
            <p className="mt-6 max-w-xl text-ink-muted">{summary}</p>
          ) : null}
          {person.focus ? (
            <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
              {person.focus}
            </p>
          ) : null}

          {facts.length > 0 ? (
            <div className="mt-10">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-maroon dark:text-gold">
                At a glance
              </p>
              <OfficerBulletList items={facts} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
