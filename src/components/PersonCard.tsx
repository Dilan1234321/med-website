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
    <article className="card overflow-hidden">
      <div
        className="flex aspect-[4/5] items-end bg-gradient-to-br from-maroon to-maroon-deep p-5"
        aria-hidden
      >
        <span className="font-display text-5xl font-semibold text-gold/80">
          {mark}
        </span>
      </div>
      <div className="p-5 text-center">
        <h3 className="font-display text-xl font-semibold tracking-tight text-maroon dark:text-gold">
          {name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
          {meta}
        </p>
        {detail ? (
          <p className="mt-2 text-sm text-ink-muted">{detail}</p>
        ) : null}
      </div>
    </article>
  );
}
