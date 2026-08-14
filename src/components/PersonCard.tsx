export function PersonCard({
  name,
  meta,
  detail,
  initials,
}: {
  name: string;
  meta: string;
  detail?: string;
  initials?: string;
}) {
  const mark =
    initials ||
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <article className="card flex flex-col p-5">
      <div
        className="flex h-40 items-end justify-start bg-bg-muted p-4"
        aria-hidden
      >
        <span className="font-serif text-4xl text-accent/70">{mark}</span>
      </div>
      <h3 className="mt-4 font-serif text-xl text-ink">{name}</h3>
      <p className="mt-1 text-sm font-medium text-accent">{meta}</p>
      {detail ? (
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{detail}</p>
      ) : null}
    </article>
  );
}
