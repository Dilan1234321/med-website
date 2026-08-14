export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-line bg-bg-elevated">
      <div className="container-page py-14 md:py-20">
        {eyebrow ? (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="prose-med mt-5">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
