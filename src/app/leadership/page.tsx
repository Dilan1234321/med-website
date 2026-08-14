import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PersonCard } from "@/components/PersonCard";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Leadership Board",
  description: "Meet the Mu Epsilon Delta executive board.",
};

export default function LeadershipPage() {
  const { leadership } = content;

  return (
    <>
      <PageHero
        eyebrow="The Family"
        title="Chapter Leadership"
        description="Executive officers who run strategy, membership, scholarship, and service."
        image="/images/hero-1.jpg"
      />
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((person) => (
            <PersonCard
              key={person.name}
              name={person.name}
              meta={`${person.role} · ${person.year}`}
              detail={`${person.major}. ${person.focus}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
