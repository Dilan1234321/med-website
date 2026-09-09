import type { Metadata } from "next";
import Link from "next/link";
import { FamilyRoster } from "@/components/FamilyRoster";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Members",
  description: "Brothers of Mu Epsilon Delta at the University of Tampa.",
};

export default function FamilyPage() {
  const { family, site, stats } = content;

  return (
    <>
      <section className="relative overflow-hidden py-28 md:py-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/chapter-2.jpg')" }}
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

      <FamilyRoster family={family} />

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
