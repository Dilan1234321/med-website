import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Chapter photography from programming, service, and community life.",
};

const lifePhotos = [
  { src: "/images/hero-1.jpg", caption: "Campus community", aspect: "aspect-[3/4]" },
  { src: "/images/hero-recruit.jpg", caption: "Recruitment season", aspect: "aspect-square" },
  { src: "/images/hero-about.jpg", caption: "Chapter gathering", aspect: "aspect-[4/5]" },
  { src: "/images/hero-2.jpg", caption: "Professional programming", aspect: "aspect-[3/4]" },
  { src: "/images/hero-tampa-1.jpg", caption: "Tampa Bay service", aspect: "aspect-square" },
  { src: "/images/hero-about.jpg", caption: "Brotherhood moments", aspect: "aspect-[4/3]" },
  { src: "/images/hero-1.jpg", caption: "Study cohorts", aspect: "aspect-[3/4]" },
  { src: "/images/hero-recruit.jpg", caption: "Rush events", aspect: "aspect-[4/5]" },
];

export default function GalleryPage() {
  const { gallery } = content;

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Chapter Life"
        description={gallery.note}
        image="/images/hero-recruit.jpg"
      />

      {/* AKPsi masonry “life” gallery */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-page">
          <p className="section-label text-center">Life as a brother</p>
          <div className="accent-line" />
          <h2 className="heading-display text-center text-3xl text-maroon dark:text-gold md:text-4xl">
            Moments from the chapter
          </h2>
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {lifePhotos.map((photo, i) => (
              <figure
                key={`${photo.src}-${i}`}
                className="mb-4 break-inside-avoid overflow-hidden rounded-[18px] border border-line bg-bg-elevated shadow-[var(--shadow)]"
              >
                <div className={`relative w-full ${photo.aspect}`}>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-[1.03]"
                    style={{ backgroundImage: `url('${photo.src}')` }}
                    role="img"
                    aria-label={photo.caption}
                  />
                </div>
                <figcaption className="border-t border-line px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-muted py-16 md:py-20">
        <div className="container-page space-y-14">
          {gallery.albums.map((album) => (
            <div key={album.id}>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-gold">
                Album
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-maroon dark:text-gold">
                {album.title}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {album.items.map((item, i) => (
                  <figure key={item.id} className="card overflow-hidden">
                    <div
                      className="aspect-[4/3] bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${lifePhotos[i % lifePhotos.length].src}')`,
                      }}
                      role="img"
                      aria-label={item.alt}
                    />
                    <figcaption className="border-t border-line px-4 py-3 text-sm text-ink-muted">
                      {item.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-maroon py-16 text-center text-[#f7f5ef] md:py-20">
        <h2 className="heading-display text-3xl md:text-4xl">
          Be part of the next album
        </h2>
        <Link href="/membership#register" className="btn btn-gold mt-8">
          Register for Rush
        </Link>
      </section>
    </>
  );
}
