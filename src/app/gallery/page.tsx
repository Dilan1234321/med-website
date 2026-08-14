import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Chapter photography from programming, service, and community life.",
};

export default function GalleryPage() {
  const { gallery } = content;

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Chapter photography"
        description={gallery.note}
      />
      <section className="container-page space-y-14 py-16 md:py-20">
        {gallery.albums.map((album) => (
          <div key={album.id}>
            <h2 className="font-serif text-2xl text-ink">{album.title}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {album.items.map((item) => (
                <figure key={item.id} className="card overflow-hidden">
                  <div
                    className="flex aspect-[4/3] items-center justify-center bg-bg-muted px-4 text-center"
                    role="img"
                    aria-label={item.alt}
                  >
                    <span className="text-sm text-ink-muted">
                      Photo placeholder — add WebP to <code>/public/images</code>
                    </span>
                  </div>
                  <figcaption className="border-t border-line px-4 py-3 text-sm text-ink-muted">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
