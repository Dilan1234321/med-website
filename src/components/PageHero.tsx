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
          <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-soft">
            {eyebrow}
          </p>
        ) : null}
        <div className="accent-line" />
        <h1 className="heading-display text-center text-[clamp(2.25rem,6vw,4rem)] text-white drop-shadow-lg">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/85 md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
