import Link from "next/link";
import { Crest } from "./Crest";
import { content } from "@/lib/content";

export function Footer() {
  const { site } = content;

  return (
    <footer className="bg-footer text-center text-white">
      <section className="bg-maroon px-5 py-20 md:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
          {site.university}
        </p>
        <h2 className="heading-display mt-4 text-[clamp(1.9rem,4.5vw,2.75rem)] text-white">
          Become a part of the legacy
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/membership#register" className="btn btn-gold">
            Register for Rush
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
            IG
          </a>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:border-gold hover:text-gold"
            aria-label="LinkedIn"
          >
            in
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition hover:border-gold hover:text-gold"
            aria-label="Email"
          >
            @
          </a>
        </div>
      </section>

      <div className="px-5 py-12">
        <div className="mb-5 flex items-center justify-center gap-3">
          <Crest className="h-8 w-8 text-gold" />
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
        </p>
      </div>
    </footer>
  );
}
