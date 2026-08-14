import { Reveal } from "./Reveal";

export function History() {
  return (
    <section id="history" className="relative bg-ivory-soft py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <div
                className="absolute inset-0 scale-105 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80')",
                }}
                role="img"
                aria-label="University campus architecture at dusk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="font-display text-5xl text-gold-bright md:text-6xl">
                  1965
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ivory/80">
                  Founded · University of Tennessee at Martin
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-maroon">
              Our Story
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
              From one chapter to a national brotherhood.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Mu Epsilon Delta began in 1965 at the University of Tennessee at
              Martin as a home for students devoted to the health sciences. Today,
              chapters span the country—bound by maroon and gold, the caduceus,
              and a shared vow to serve with purity and passion.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-line pt-8">
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-maroon">
                  Colors
                </dt>
                <dd className="mt-2 font-display text-2xl text-ink">
                  Maroon &amp; Gold
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-maroon">
                  Symbol
                </dt>
                <dd className="mt-2 font-display text-2xl text-ink">Caduceus</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-maroon">
                  Flower
                </dt>
                <dd className="mt-2 font-display text-2xl text-ink">
                  Red Rambling Rose
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-maroon">
                  Jewel
                </dt>
                <dd className="mt-2 font-display text-2xl text-ink">Ruby</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
