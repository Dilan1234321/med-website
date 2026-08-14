import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms";
import { PageHeader } from "@/components/PageHeader";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Mu Epsilon Delta for recruitment, programming, or alumni inquiries.",
};

export default function ContactPage() {
  const { site } = content;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Reach the chapter"
        description="Recruitment questions, programming partnerships, alumni mentorship, and general inquiries."
      />
      <section className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-20">
        <div>
          <h2 className="font-serif text-2xl text-ink">Chapter details</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">Email</dt>
              <dd className="mt-1">
                <a className="text-accent hover:underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Campus / location</dt>
              <dd className="mt-1 text-ink-muted">{site.campus}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Social</dt>
              <dd className="mt-1 flex gap-4 text-ink-muted">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  Instagram
                </a>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  LinkedIn
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
