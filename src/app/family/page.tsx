import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PersonCard } from "@/components/PersonCard";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meet the Family",
  description: "Current Mu Epsilon Delta members across pre-health pathways.",
};

export default function FamilyPage() {
  const { family } = content;

  return (
    <>
      <PageHero
        eyebrow="The Family"
        title="The Brothers"
        description="Members across MD, DO, PA, dental, pharmacy, and related pathways."
        image="/images/hero-recruit.jpg"
      />
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {family.map((person) => (
            <PersonCard
              key={person.name}
              name={person.name}
              meta={`${person.pathway} · ${person.year}`}
              detail={`${person.major} · ${person.hometown}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
