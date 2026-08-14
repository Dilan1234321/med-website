import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        eyebrow="Meet the Family"
        title="The current chapter"
        description="Members across MD, DO, PA, dental, pharmacy, and related pathways. Update the roster in content/family.json and swap initials for real headshots when available."
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
