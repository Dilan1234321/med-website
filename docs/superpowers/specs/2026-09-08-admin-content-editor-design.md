# Admin Content Editor — Design Spec

Date: 2026-09-08
Status: Approved by product owner (Dilan), pending implementation plan

## Problem

All site content (exec board, events, family roster, alumni, service, accomplishments, gallery, membership FAQ, donate copy, and site-wide settings) lives as JSON files under `content/*.json` in the `med-website` git repo. Updating any of it today requires editing code and pushing to git — something the fraternity's non-technical exec board members cannot do themselves. Every semester's turnover (new exec board, new events, new members) currently requires a developer.

## Goal

A password-gated `/admin` section of the live site where a handful of exec board members can add/edit/remove content through plain forms, hit Save, and see the change live on the public site within about a minute — with no git, no code, and no database to maintain.

## Non-goals

- Individual per-officer accounts (a single shared password is sufficient for this group size)
- Instant (sub-second) publish — a ~30-60s redeploy delay is acceptable
- A review/approval workflow before publishing — saves go live immediately
- A generic/reusable CMS product — this is purpose-built for `med-website`'s existing content shape

## Architecture

**No database.** Content already lives as versioned JSON in git; the admin editor writes back to those same files via GitHub's REST API, and images go to Vercel Blob (plain file storage, not a database). This means:

- No new service to run, patch, or teach anyone about (the explicit pain point with the org's existing Supabase-based sibling site)
- Full version history and one-command revert already comes free from git
- The public site's data-loading code (`src/lib/content.ts`, currently static `import` of the JSON files) does not change — a save still ends in a normal commit to `main`, which triggers a normal Vercel build

### Save flow

1. Officer logs into `/admin` with the shared password (see Auth below).
2. Picks a content section from a sidebar (Exec Board, Family, Events, Alumni, Service, Accomplishments, Gallery, Membership, Donate, About, Site Settings).
3. The section's form loads pre-filled with the **current committed content**, fetched live from GitHub's Contents API at request time (not from the site's own build output, which may be stale relative to the latest commit).
4. Officer edits fields, optionally uploads/replaces images, hits Save.
5. Server-side action:
   a. Validates the session cookie.
   b. Re-fetches the target file's current SHA from GitHub immediately before writing (concurrency check — see Error Handling).
   c. If an image was uploaded, it's already been pushed to Vercel Blob and the resulting public URL substituted into the relevant JSON field.
   d. Commits the updated JSON file straight to `main` via GitHub's Contents API (`PUT /repos/{owner}/{repo}/contents/{path}`), with a commit message like `content: update leadership via admin (Jordan)` — the officer's name is an optional free-text field on the form, used only for commit attribution and the recent-changes log, not for auth.
   e. GitHub's push triggers Vercel's existing git integration to build and deploy `main` automatically.
6. UI shows a success state ("Saved — live in about a minute") or a specific, actionable error (see Error Handling).

### Auth

- Single shared password stored as an env var (`ADMIN_PASSWORD`), never in code or git.
- `/admin/login` form checks the submitted password server-side, and on success sets a signed, `httpOnly`, `Secure` session cookie (HMAC-signed with a secret env var, short random expiry e.g. 7 days) — no third-party auth library needed for a single shared credential.
- Next.js middleware protects every `/admin/*` route except `/admin/login`, redirecting unauthenticated requests to the login page.
- No password reset flow, no lockout/rate-limit UI beyond a generic "incorrect password" message (avoids leaking whether the account is being brute-forced) — acceptable for this threat model (small private group, low-value target). Basic rate limiting on the login route (e.g. a short delay or IP-based attempt cap) is still worth including cheaply.

### Content coverage (v1 = everything)

One form per existing content file, matching its current shape:

| File | Section label | Shape |
|---|---|---|
| `site.json` | Site Settings | Flat fields (name, tagline, socials, chapter, contact) |
| `stats.json` | Site Settings (stats) | Flat fields (member count, service hours, etc.) |
| `leadership.json` | Exec Board | Repeatable list (name, title, photo, bio) |
| `family.json` | Family | Repeatable list |
| `events.json` | Events | Repeatable list, grouped (types/upcoming/past) |
| `alumni.json` | Alumni | Repeatable list (outcomes, quotes) |
| `service.json` | Service | Repeatable list (partners, metrics) + intro text |
| `accomplishments.json` | Accomplishments | Repeatable list (awards, milestones, outings) |
| `gallery.json` | Gallery | Repeatable list (image + caption) |
| `membership.json` | Membership | Mixed: flat text + repeatable FAQ list |
| `donate.json` | Donate | Flat text + repeatable tier list |

Each repeatable-list section supports add row / remove row / drag-to-reorder. No generic JSON-schema-driven form builder — each section gets a hand-built form matching its actual fields, since there are only 11 of them and a generic builder would be more code than it saves.

### Images

- Handled via Vercel Blob (`@vercel/blob`), not GitHub — binary files don't belong in frequent small git commits, and Blob gives instant, CDN-served URLs.
- Admin form: file picker → client-side validation (type: JPG/PNG/WebP; size cap, e.g. 5MB) → upload to Blob → returned URL shown as an immediate thumbnail preview → URL is what actually gets saved into the JSON on Save.
- Uploading an image does **not** by itself commit anything to git — only hitting the section's Save button does. This keeps "Save" as the one clear commit point per section, and lets an officer swap a photo a few times before committing to one.

## UI/UX

**Visual language**: reuses the site's existing brand tokens (maroon `#900b0b`, gold `#c9a24a`, warm ink/paper neutrals, Outfit sans) rather than introducing a new generic admin palette — the tool should read as "the MED site's backstage," not a bolted-on third-party product. No display serif (Fraunces) in form UI — that's reserved for the public site's editorial voice.

**Layout**: minimal, high-contrast, functional — left sidebar with the 11 sections, one section's form in the content area at a time. No dashboard widgets, charts, or KPI tiles; this is a content editor, not analytics.

**Key interaction rules**:
- Every save shows in-progress (disabled button + spinner) → success toast or specific inline error. Never a silent no-op.
- Repeatable lists: explicit add/remove-row controls, drag-to-reorder; destructive row-removal requires a confirm step, styled distinctly (red) from normal actions.
- Image fields show live thumbnail previews before save.
- Navigating away from a section with unsaved changes prompts a confirmation.
- Fully responsive down to phone width — officers should be able to edit from their phone.
- Accessibility: visible labels on every field (no placeholder-only labels), 4.5:1 text contrast minimum, visible keyboard focus states, full keyboard operability.

**Recent changes log**: a simple list (last ~20 saves) shown somewhere in the admin shell — section, timestamp, and officer name if given — so mistakes are easy to spot, and reverting (via a normal `git revert` I'd perform, or eventually a "revert this change" button if it turns out to be needed often) is straightforward. V1: read-only log, no in-UI revert button (YAGNI until proven needed).

## Error handling

| Case | Behavior |
|---|---|
| GitHub API failure (network, rate limit, bad token) | Officer's edits stay in the form; show "Couldn't save — try again" with a retry button. Nothing is lost. |
| Concurrent edit to the same file (SHA mismatch on write) | Reject the write; show "This was updated by someone else — reload to see the latest" rather than silently overwriting. |
| Image upload: bad file type / too large | Caught client-side before any network call; specific message ("Please upload a JPG or PNG under 5MB"). |
| Image upload: network failure | Same retry pattern as content saves. |
| Wrong admin password | Generic "incorrect password" message; no hints. Basic attempt throttling on the login route. |
| Unauthenticated request to `/admin/*` | Redirect to `/admin/login`. |
| Mistake after publishing | Recoverable via git history (recent-changes log surfaces what/when; revert is a manual git operation for now). |

## Deployment prerequisites

These are one-time setup steps, not part of the app code, and block this feature from working end-to-end:

1. **Merge `cursor/med-fraternity-website-582a` into `main`** — the live UTampa gold/maroon redesign currently only exists on that branch.
2. **Connect the Vercel project to GitHub properly** — the currently-live deployment (`temporary-nimble-sulfur-jd9u7ic`) has no GitHub link and was a one-off push; it will not auto-redeploy on future commits. Need a Vercel project tracking `main` on `Dilan1234321/med-website` via Vercel's normal Git integration.
3. **Point `medutampa.com` at that project**, if/when acquired — the code already treats it as the canonical URL (`metadataBase` in `layout.tsx`).
4. **Provision three secrets** (Vercel env vars, not committed to git):
   - `ADMIN_PASSWORD` — the shared login password
   - `GITHUB_TOKEN` — a fine-grained personal access token scoped to only the `med-website` repo, `contents:write` permission
   - `BLOB_READ_WRITE_TOKEN` — created automatically when a Vercel Blob store is provisioned and linked to the project
   - Plus a `SESSION_SECRET` for signing the admin session cookie

## Testing

No automated test suite is proposed for this internal tool given its scope (a handful of trusted users, low traffic). Verification is manual, covering per content-type:
- Add / edit / remove a row, save, confirm the live site updates within ~60s
- Image upload → preview → save → confirm it renders on the public page
- Wrong password rejected; correct password accepted
- Concurrent-edit conflict message appears when a file changes underneath an open form
- Mobile viewport (375px) walkthrough of at least one full edit cycle
