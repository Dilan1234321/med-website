import { Reveal } from "./Reveal";

export function Mission() {
  return (
    <section id="mission" className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-maroon/5 blur-3xl" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-12 md:gap-16 md:px-8">
        <Reveal className="md:col-span-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-maroon">
            Our Mission
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
            Excellence in health science, rooted in brotherhood.
          </h2>
        </Reveal>

        <Reveal className="md:col-span-7" delay={1}>
          <p className="text-lg leading-relaxed text-ink-soft md:text-xl">
            Mu Epsilon Delta is a national co-educational pre-health professional
            fraternity. We prepare members to succeed in healthcare careers
            through scholarship, fraternity, and service—fostering collaboration
            across pre-health disciplines, educators, and professionals.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft md:text-xl">
            From MCAT prep and clinical exposure to community service and lifelong
            networks, MED is where pre-health students become the physicians,
            researchers, and caregivers our communities need.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
