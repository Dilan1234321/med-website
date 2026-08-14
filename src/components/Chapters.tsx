import { Reveal } from "./Reveal";

const chapters = [
  { year: "1965", school: "University of Tennessee at Martin", place: "Martin, TN" },
  { year: "2019", school: "University of Michigan", place: "Ann Arbor, MI" },
  { year: "2020", school: "Michigan State University", place: "East Lansing, MI" },
  { year: "2022", school: "Grand Valley State University", place: "Allendale, MI" },
  { year: "2023", school: "University of South Florida", place: "Tampa, FL" },
  {
    year: "2023",
    school: "University of Illinois Urbana-Champaign",
    place: "Urbana, IL",
  },
  { year: "2024", school: "University of Massachusetts Amherst", place: "Amherst, MA" },
  { year: "2024", school: "Virginia Tech", place: "Blacksburg, VA" },
  { year: "2024", school: "University of Wisconsin–Madison", place: "Madison, WI" },
  { year: "2024", school: "North Carolina State University", place: "Raleigh, NC" },
  {
    year: "2025",
    school: "Alabama A&M University",
    place: "Huntsville, AL",
  },
  { year: "2025", school: "University of Pittsburgh", place: "Pittsburgh, PA" },
  { year: "2025", school: "University of Iowa", place: "Iowa City, IA" },
  { year: "2025", school: "University of Virginia", place: "Charlottesville, VA" },
  {
    year: "2025",
    school: "Rutgers University–New Brunswick",
    place: "New Brunswick, NJ",
  },
];

export function Chapters() {
  return (
    <section id="chapters" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-maroon">
                Chapters Nationwide
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
                Fifteen campuses. One brotherhood.
              </h2>
            </div>
            <p className="max-w-sm text-ink-soft md:text-right">
              Active chapters from Tennessee to the coasts—growing where
              pre-health students lead.
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <ul className="mt-14 divide-y divide-line border-y border-line">
            {chapters.map((chapter) => (
              <li
                key={`${chapter.school}-${chapter.year}`}
                className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-4 py-5 transition-colors hover:bg-ivory-soft/60 md:grid-cols-[5.5rem_1fr_auto] md:gap-8 md:px-2"
              >
                <span className="font-display text-lg text-gold-muted transition-colors group-hover:text-maroon">
                  {chapter.year}
                </span>
                <span className="font-display text-xl text-ink md:text-2xl">
                  {chapter.school}
                </span>
                <span className="col-start-2 text-sm text-ink-soft md:col-start-auto md:text-right">
                  {chapter.place}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
