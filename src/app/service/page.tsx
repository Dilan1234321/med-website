import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Service & Philanthropy",
  description:
    "Service partners, impact metrics, and philanthropy initiatives.",
};

export default function ServicePage() {
  const { service } = content;

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title="Service with partners and measurable hours."
        description={service.intro}
      />
      <section className="border-b border-line">
        <div className="container-page grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          {service.metrics.map((metric) => (
            <div key={metric.label} className="bg-bg px-6 py-10">
              <p className="font-serif text-3xl text-ink">{metric.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ink-muted">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-page py-16 md:py-20">
        <h2 className="font-serif text-3xl text-ink">Partners</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {service.partners.map((partner) => (
            <article key={partner.name} className="card p-6">
              <h3 className="font-serif text-xl text-ink">{partner.name}</h3>
              <p className="mt-2 text-sm text-ink-muted">{partner.role}</p>
              <p className="mt-4 text-sm font-medium text-accent">
                {partner.impact}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
