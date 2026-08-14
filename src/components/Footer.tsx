import Link from "next/link";
import { Crest } from "./Crest";
import { content, primaryNav } from "@/lib/content";

export function Footer() {
  const { site } = content;

  return (
    <footer className="mt-auto border-t border-line bg-bg-muted">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-ink">
            <Crest className="h-8 w-8 text-accent" />
            <span className="font-serif text-xl">{site.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            {site.tagline}
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            {site.campus}
            <br />
            <a className="text-accent underline-offset-2 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {primaryNav.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink">
            Get involved
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/membership#register" className="hover:text-ink">
                Register to Rush
              </Link>
            </li>
            <li>
              <Link href="/calendar" className="hover:text-ink">
                Calendar
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-ink">
                Donate
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ink">
                Contact
              </Link>
            </li>
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-muted sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Professional medical
            fraternity.
          </p>
          <p>Content editable via JSON files in <code>/content</code>.</p>
        </div>
      </div>
    </footer>
  );
}
