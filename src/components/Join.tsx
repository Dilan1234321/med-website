import { Reveal } from "./Reveal";

export function Join() {
  return (
    <section id="join" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 hero-radial" />
      <div className="texture-grain absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,74,0.18),transparent_45%)]" />

      <div className="relative mx-auto max-w-3xl px-5 text-center text-ivory md:px-8">
        <Reveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold">
            Membership
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            Ready to practice your art?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">
            Whether you&apos;re pre-med, pre-dental, pre-PA, or exploring any
            healthcare path—find your chapter and begin the journey with MED.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://mednational.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-maroon-deep transition-colors hover:bg-gold-bright"
            >
              Visit National Site
            </a>
            <a
              href="mailto:contact@mednational.org"
              className="border border-ivory/35 px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:text-gold-bright"
            >
              Contact National
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
