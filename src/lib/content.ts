import site from "../../content/site.json";
import stats from "../../content/stats.json";
import about from "../../content/about.json";
import membership from "../../content/membership.json";
import events from "../../content/events.json";
import leadership from "../../content/leadership.json";
import family from "../../content/family.json";
import alumni from "../../content/alumni.json";
import service from "../../content/service.json";
import accomplishments from "../../content/accomplishments.json";
import gallery from "../../content/gallery.json";
import donate from "../../content/donate.json";

export const content = {
  site,
  stats,
  about,
  membership,
  events,
  leadership,
  family,
  alumni,
  service,
  accomplishments,
  gallery,
  donate,
};

export type NavItem = { href: string; label: string };

export const primaryNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Membership" },
  { href: "/events", label: "Events" },
  { href: "/leadership", label: "Board" },
  { href: "/family", label: "Family" },
  { href: "/alumni", label: "Alumni" },
  { href: "/service", label: "Service" },
  { href: "/accomplishments", label: "Accomplishments" },
  { href: "/gallery", label: "Gallery" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
