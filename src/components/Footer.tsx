import Link from "next/link";
import { Crest } from "./Crest";
import { content } from "@/lib/content";

export function Footer() {
  const { site } = content;

  return (
    <footer className="bg-footer text-center text-white">
      <section className="bg-maroon px-5 py-20 md:py-24">
        <h2 className="font-display text-[clamp(1.8rem,5vw,2.6rem)] font-bold tracking-[0.08em]">
          Become a Part of the Legacy
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/membership#register" className="btn btn-primary">
            Register for Rush
          </Link>
          <Link href="/about" className="btn btn-secondary">
            Explore Chapter
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
          <span className="font-display text-sm font-bold uppercase tracking-[0.2em]">
            Mu Epsilon Delta
          </span>
        </div>
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/70">
          © {new Date().getFullYear()} Mu Epsilon Delta — Professional Medical
          Fraternity
        </p>
        <p className="mt-3 text-[0.65rem] tracking-wide text-white/40">
          {site.campus} · {site.email}
        </p>
      </div>
    </footer>
  );
}
