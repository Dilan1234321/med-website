import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        eyebrow="Leadership"
        title="Meet the board"
        description="Executive officers responsible for strategy, membership, scholarship, service, and chapter operations. Replace placeholder names and add headshots in content/leadership.json."
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
