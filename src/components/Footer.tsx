import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";

export function Footer() {
  const { site } = content;

  return (
    <footer className="bg-footer text-center text-white">
      <section className="bg-maroon px-5 py-20 md:py-24">
        <h2 className="heading-display text-[clamp(1.9rem,4.5vw,2.75rem)] text-white">
          Join the fastest growing medical community in Tampa
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/membership#register" className="btn btn-gold">
            Register for Recruitment
          </Link>
          <Link href="/about" className="btn btn-secondary">
            Explore chapter
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-5 text-white/85">
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:border-gold hover:text-gold"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:border-gold hover:text-gold"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.24h4V23h-4V8.24zM8.5 8.24h3.83v2.02h.05c.53-1 1.85-2.06 3.8-2.06 4.07 0 4.82 2.68 4.82 6.16V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23h-4V8.24z" />
            </svg>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:border-gold hover:text-gold"
            aria-label="Email"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
              <path d="M3.5 6l8.5 7 8.5-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <div className="px-5 py-12">
        <div className="mb-5 flex items-center justify-center gap-3">
          <Image src="/images/logo.png" alt="Mu Epsilon Delta crest" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-base font-semibold tracking-tight">
            Mu Epsilon Delta
          </span>
        </div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/65">
          © {new Date().getFullYear()} Mu Epsilon Delta — {site.chapter}
        </p>
        <p className="mt-3 text-xs text-white/40">
          {site.campus} ·{" "}
          <a className="hover:text-gold" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          {site.nationalUrl ? (
            <>
              {" · "}
              <a
                className="hover:text-gold"
                href={site.nationalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                MED National
              </a>
            </>
          ) : null}
        </p>
      </div>
    </footer>
  );
}
