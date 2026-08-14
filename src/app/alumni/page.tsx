import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Alumni",
  description:
    "Alumni outcomes across medical schools, residencies, and healthcare professions.",
};

export default function AlumniPage() {
  const { alumni } = content;

  return (
    <>
      <PageHero
        eyebrow="The Family"
        title="Alumni"
        description="Where brothers continue their careers in medicine and healthcare."
        image="/images/hero-2.jpg"
      />
      <section className="container-page py-16 md:py-20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold">Class</th>
                <th className="py-3 pr-4 font-semibold">Outcome</th>
                <th className="py-3 font-semibold">Current</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map((person) => (
                <tr key={person.name} className="border-b border-line align-top">
                  <td className="py-4 pr-4 font-medium text-ink">
                    {person.name}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">{person.classYear}</td>
                  <td className="py-4 pr-4 text-ink-muted">{person.outcome}</td>
                  <td className="py-4 text-ink-muted">{person.current}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {alumni.map((person) =>
            person.quote ? (
              <blockquote key={`${person.name}-quote`} className="card p-6">
                <p className="font-display text-xl leading-relaxed text-ink">
                  “{person.quote}”
                </p>
                <footer className="mt-4 text-sm text-ink-muted">
                  — {person.name}, {person.current}
                </footer>
              </blockquote>
            ) : null,
          )}
        </div>
      </section>
    </>
  );
}
