import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Mu Epsilon Delta at the University of Tampa for recruitment or chapter inquiries.",
};

export default function ContactPage() {
  const { site } = content;

  return (
    <>
      <section className="page-hero min-h-[48vh]">
        <div
          className="page-hero-bg"
          style={{ backgroundImage: "url('/images/hero-about.jpg')" }}
        />
        <div className="page-hero-overlay" />
        <div className="relative z-10 container-page flex min-h-[48vh] items-end pb-14 pt-36">
          <h1 className="heading-display text-[clamp(2.5rem,7vw,4.5rem)] text-white">
            Get in <span className="text-gold">Touch</span>
          </h1>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="section-label">Chapter details</p>
          <div className="accent-line-left" />
          <h2 className="heading-display text-3xl text-maroon dark:text-gold">
            Reach the UT chapter
          </h2>

          <ul className="mt-10 space-y-8">
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-sm text-maroon dark:text-gold">
                ⌖
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  Location
                </p>
                <p className="mt-1 text-ink">
                  University of Tampa
                  <br />
                  {site.campus}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-sm text-maroon dark:text-gold">
                @
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  Email
                </p>
                <a
                  className="mt-1 block text-ink hover:text-maroon dark:hover:text-gold"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-sm text-maroon dark:text-gold">
                ⌗
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                  Social
                </p>
                <div className="mt-1 flex gap-4 text-ink">
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-maroon dark:hover:text-gold"
                  >
                    Instagram
                  </a>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-maroon dark:hover:text-gold"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
