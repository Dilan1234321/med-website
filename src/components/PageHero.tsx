export function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/hero-about.jpg",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="page-hero">
      <div
        className="page-hero-bg"
        style={{ backgroundImage: `url('${image}')` }}
        role="img"
        aria-label=""
      />
      <div className="page-hero-overlay" />
      <div className="relative z-10 container-page w-full pb-14 pt-36 md:pb-20 md:pt-44">
        {eyebrow ? (
          <p className="text-center text-[0.75rem] font-bold uppercase tracking-[0.28em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <div className="accent-line" />
        <h1 className="text-center font-display text-[clamp(2rem,6vw,3.75rem)] font-bold uppercase tracking-[0.1em] text-white drop-shadow-lg">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-white/85 md:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
