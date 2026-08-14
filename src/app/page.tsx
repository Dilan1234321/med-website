import Link from "next/link";
import { Crest } from "@/components/Crest";
import { PersonCard } from "@/components/PersonCard";
import { content, formatDate } from "@/lib/content";

export default function HomePage() {
  const { site, stats, about, events, leadership, membership } = content;
  const programs = events.categories.slice(0, 3);
  const leaders = leadership.slice(0, 4);

  return (
    <>
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-page grid items-end gap-10 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-24">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
              {site.greek} · Professional medical fraternity · Est.{" "}
              {stats.foundingYear}
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.12] text-ink md:text-5xl lg:text-[3.35rem]">
              {site.tagline}
            </h1>
            <p className="prose-med mt-6">
              {about.mission} Membership is selective, structured, and built
              around measurable academic and service expectations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/membership#register" className="btn btn-primary">
                Register to Rush
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Learn About Us
              </Link>
            </div>
          </div>
          <aside className="card relative overflow-hidden p-6 md:p-8">
            <Crest className="absolute -right-4 -top-4 h-28 w-28 text-accent/15" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Positioning
            </p>
            <p className="mt-3 font-serif text-2xl leading-snug text-ink">
              Scholarship. Service. Mentorship. Professional development.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              An institution-grade chapter experience—closer to a medical-school
              microsite than a social rush brochure.
            </p>
            <Link
              href="/membership"
              className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline"
            >
              Why join →
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-b border-line bg-bg">
        <div className="container-page grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[
            { label: "Active members", value: `${stats.members}` },
            { label: "Service hours / year", value: `${stats.serviceHours}+` },
            {
              label: "Med-school acceptance*",
              value: `${stats.medSchoolAcceptanceRate}%`,
            },
            { label: "Founded", value: `${stats.foundingYear}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg px-5 py-8 md:px-6">
              <p className="font-serif text-3xl text-ink md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="container-page py-3 text-xs text-ink-muted">
          *Replace placeholder stats in <code>content/stats.json</code> with
          verified chapter figures before launch.
        </p>
      </section>

      <section className="border-b border-line py-16 md:py-24">
        <div className="container-page">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
            Pillars
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl text-ink md:text-4xl">
            Four commitments that structure chapter life.
          </h2>
          <div className="mt-12 space-y-10">
            {about.values.map((value, i) => (
              <div
                key={value.title}
                className={`grid gap-4 border-t border-line pt-8 md:grid-cols-12 md:gap-8 ${
                  i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="md:col-span-4">
                  <p className="font-serif text-sm text-ink-muted">
                    0{i + 1}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-ink">
                    {value.title}
                  </h3>
                </div>
                <p className="prose-med md:col-span-7 md:col-start-6">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bg-elevated py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
                Programming
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                Flagship program areas
              </h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-accent hover:underline">
              All events & calendar →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {programs.map((program) => (
              <article key={program.id} className="card p-6">
                <span className="badge">{program.id}</span>
                <h3 className="mt-4 font-serif text-2xl text-ink">
                  {program.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {program.description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 border-t border-line pt-8">
            <h3 className="font-serif text-xl text-ink">Next on the calendar</h3>
            <ul className="mt-4 divide-y divide-line">
              {events.upcoming.slice(0, 3).map((event) => (
                <li
                  key={event.id}
                  className="grid gap-1 py-4 md:grid-cols-[7rem_1fr_auto] md:items-baseline md:gap-6"
                >
                  <span className="text-sm text-accent">
                    {formatDate(event.date)}
                  </span>
                  <span className="font-medium text-ink">{event.title}</span>
                  <span className="text-sm text-ink-muted">{event.location}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
                Leadership
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                Meet the executive board
              </h2>
            </div>
            <Link
              href="/leadership"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Full board →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((person) => (
              <PersonCard
                key={person.name}
                name={person.name}
                meta={`${person.role} · ${person.year}`}
                detail={person.major}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent py-16 text-white md:py-20">
        <div className="container-page grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">
              Ready for the next recruitment cycle?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85">
              {membership.timeline[0].detail} Register to rush for info-session
              dates, or review eligibility and expectations first.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/membership#register"
              className="btn bg-white text-accent hover:bg-bg"
            >
              Register to Rush
            </Link>
            <Link
              href="/contact"
              className="btn border border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
