import { Caduceus } from "./Caduceus";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden text-ivory"
    >
      <div className="absolute inset-0 hero-radial" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          mixBlendMode: "luminosity",
        }}
        role="img"
        aria-label="Healthcare professionals collaborating in a clinical setting"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/55 to-maroon/30" />
      <div className="texture-grain absolute inset-0 opacity-30" />

      <div className="animate-float pointer-events-none absolute right-[-8%] top-[18%] hidden opacity-20 lg:block">
        <Caduceus className="h-[52vh] w-auto text-gold" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-36">
        <p className="animate-rise mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold-bright md:text-[0.75rem]">
          National Pre-Health Fraternity · Est. 1965
        </p>

        <h1 className="animate-rise-delay-1 font-display text-[clamp(3.5rem,14vw,9.5rem)] leading-[0.85] tracking-[-0.02em]">
          <span className="block">Mu Epsilon</span>
          <span className="gold-shimmer block">Delta</span>
        </h1>

        <div className="animate-draw mt-6 h-px w-24 bg-gold md:w-32" />

        <p className="animate-rise-delay-2 mt-7 max-w-xl font-display text-xl italic leading-relaxed text-ivory/85 md:text-2xl">
          With purity and passion I pass my life and practice my art.
        </p>

        <p className="animate-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-ivory/70 md:text-lg">
          Preparing brothers for careers in healthcare through scholarship,
          service, and lifelong fraternity.
        </p>

        <div className="animate-rise-delay-3 mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#join"
            className="bg-gold px-7 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-maroon-deep transition-colors hover:bg-gold-bright"
          >
            Join MED
          </a>
          <a
            href="#chapters"
            className="border border-ivory/35 px-7 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:text-gold-bright"
          >
            Find a Chapter
          </a>
        </div>
      </div>
    </section>
  );
}
