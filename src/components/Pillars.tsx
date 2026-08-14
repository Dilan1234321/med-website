import { Reveal } from "./Reveal";

const pillars = [
  {
    greek: "Α",
    title: "Brotherhood",
    body: "A diverse fraternity of students bound by shared purpose—supporting one another through the rigor of pre-health pathways and beyond.",
  },
  {
    greek: "Β",
    title: "Service",
    body: "Meaningful volunteering that strengthens communities and shapes compassionate caregivers committed to the public good.",
  },
  {
    greek: "Γ",
    title: "Scholarship",
    body: "Academic excellence through mentorship, professional development, and the opportunities brothers need to thrive in healthcare.",
  },
];

export function Pillars() {
  return (
    <section
      id="pillars"
      className="relative overflow-hidden bg-maroon-deep py-24 text-ivory md:py-32"
    >
      <div className="texture-grain absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,74,0.15),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold">
            Three Pillars
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
            What every brother carries forward.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={(i + 1) as 1 | 2 | 3}>
              <article className="border-t border-gold/35 pt-8">
                <span className="font-display text-4xl text-gold/80" aria-hidden>
                  {pillar.greek}
                </span>
                <h3 className="mt-4 font-display text-3xl tracking-wide text-gold-bright">
                  {pillar.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ivory/70">
                  {pillar.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
