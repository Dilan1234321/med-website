# Mu Epsilon Delta Website

Institution-grade site for Mu Epsilon Delta (ΜΕΔ) — professional medical fraternity.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- CMS-lite: JSON files in `/content` (events, leadership, family, alumni, etc.)
- Forms: `/api/rush` and `/api/contact` (optional Formspree via env)
- Light/dark mode toggle

## Develop

```bash
npm install
npm run dev
```

## Content updates

Edit JSON under `/content` — no CMS required for v1:

| File | Purpose |
|------|---------|
| `site.json` | Name, email, socials, donate URL |
| `stats.json` | Member count, service hours, acceptance % |
| `leadership.json` | Executive board |
| `family.json` | Meet the family roster |
| `events.json` | Event types, upcoming, past |
| `alumni.json` | Outcomes + quotes |
| `service.json` | Partners + metrics |
| `accomplishments.json` | Awards, milestones, outings |
| `gallery.json` | Album captions / image paths |
| `membership.json` | Eligibility, timeline, FAQ, why join |
| `donate.json` | Giving copy + tiers |

## Forms (optional)

```bash
FORMSPREE_RUSH_ENDPOINT=https://formspree.io/f/...
FORMSPREE_CONTACT_ENDPOINT=https://formspree.io/f/...
```

Without these, APIs still validate and return success (for local QA).

## Pages

Home, About, Membership (Register to Rush), Events, Calendar, Leadership, Family, Alumni, Service, Accomplishments, Gallery, Donate, Contact.
