import { Caduceus } from "./Caduceus";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ivory-soft py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <div className="flex items-center gap-2.5 text-maroon">
            <Caduceus className="h-8 w-6 text-gold-muted" />
            <span className="font-display text-2xl tracking-[0.06em]">
              Mu Epsilon Delta
            </span>
          </div>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-ink-soft">
            National co-educational pre-health professional fraternity.
            Headquarters · Ann Arbor, Michigan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-maroon">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-ink-soft">
              <li>
                <a href="#mission" className="hover:text-maroon">
                  Mission
                </a>
              </li>
              <li>
                <a href="#pillars" className="hover:text-maroon">
                  Pillars
                </a>
              </li>
              <li>
                <a href="#chapters" className="hover:text-maroon">
                  Chapters
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-maroon">
              Symbols
            </p>
            <ul className="mt-3 space-y-2 text-ink-soft">
              <li>Maroon &amp; Gold</li>
              <li>Caduceus</li>
              <li>Red Rambling Rose</li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-maroon">
              Motto
            </p>
            <p className="mt-3 font-display text-base italic leading-snug text-ink-soft">
              With purity and passion I pass my life and practice my art.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-5 md:px-8">
        <p className="border-t border-line pt-6 text-xs text-ink-soft/80">
          © {new Date().getFullYear()} Mu Epsilon Delta. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
