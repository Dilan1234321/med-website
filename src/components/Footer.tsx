import Link from "next/link";
import { Crest } from "./Crest";
import { content } from "@/lib/content";

export function Footer() {
  const { site } = content;

  return (
    <footer className="bg-footer text-center text-white">
      <section className="bg-maroon px-5 py-20 md:py-24">
        <h2 className="heading-display text-[clamp(1.9rem,4.5vw,2.75rem)] text-white">
          Become a part of the legacy
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/membership#register" className="btn btn-primary">
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
        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} Mu Epsilon Delta — Professional medical
          fraternity
        </p>
        <p className="mt-3 text-xs tracking-wide text-white/40">
          {site.campus} · {site.email}
        </p>
      </div>
    </footer>
  );
}
