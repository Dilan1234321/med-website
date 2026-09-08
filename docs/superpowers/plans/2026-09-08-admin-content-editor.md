# Admin Content Editor Implementation Plan (Phase 1: Foundation, Site Settings, Exec Board, Events)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-gated `/admin` section of the med-website Next.js app where exec board members can edit Site Settings, the Exec Board roster, and Events through plain forms — saves commit straight to GitHub and redeploy automatically, with no database and no code/git knowledge required.

**Architecture:** No database. Content stays as JSON in `content/*.json`, versioned by git. The admin editor reads the current committed JSON live from GitHub's Contents API, and writes back to it the same way — each Save is a normal git commit to `main`, which triggers Vercel's existing build/deploy. Auth is a single shared password behind a signed session cookie, checked in `src/proxy.ts` (Next.js 16's replacement for `middleware.ts`, which runs in the Node.js runtime by default — this matters because it lets us use Node's built-in `crypto` module directly for HMAC signing, no Edge-crypto workarounds needed). Images upload to Vercel Blob and the resulting URL is what actually gets saved into the JSON.

**Tech Stack:** Next.js 16 (App Router, `src/proxy.ts`, Server Actions), React 19 (`useTransition`), Tailwind v4 (reusing the site's existing `--color-*` design tokens), `@vercel/blob` for image storage, GitHub REST Contents API (via plain `fetch`, no SDK dependency) for reading/writing content.

**Scope note:** The approved design spec (`docs/superpowers/specs/2026-09-08-admin-content-editor-design.md`) calls for all 11 content files to eventually be editable. This plan covers the shared foundation plus the three sections requested most directly (Site Settings, Exec Board, Events) as a complete, shippable, testable increment. The remaining 8 sections (Family, Alumni, Service, Accomplishments, Gallery, Membership, Donate, About) follow the exact same pattern established here — a **Phase 2 plan** should be written once this phase is reviewed, rather than cramming all 11 into one plan.

**Testing note:** The project has no test runner configured (no Jest/Vitest/Playwright, confirmed in `package.json`), and the approved spec's Testing section explicitly calls for manual verification rather than an automated suite for this internal tool. So instead of "write failing test → implement → pass" steps, each task below has an "implement" step followed by a concrete manual verification step (dev server + browser, or `curl`).

---

## Before you start

Create `.env.local` in the repo root (gitignored — never commit it) with real values so you can test against your own GitHub branch without touching `main` prematurely:

```
ADMIN_PASSWORD=test-password-change-me
SESSION_SECRET=<any long random string, e.g. output of `openssl rand -hex 32`>
GITHUB_TOKEN=<a GitHub fine-grained PAT scoped to only the med-website repo, Contents: Read and write>
GITHUB_OWNER=Dilan1234321
GITHUB_REPO=med-website
GITHUB_BRANCH=cursor/med-fraternity-website-582a
BLOB_READ_WRITE_TOKEN=<created by provisioning a Vercel Blob store and linking it to this project — see the "Deployment prerequisites" section of the design spec>
```

Use the current feature branch (`cursor/med-fraternity-website-582a`) as `GITHUB_BRANCH` for now, **not** `main` — that way manual QA commits land somewhere disposable instead of the branch that will become production. Switch it to `main` once the branch-merge deployment prerequisite from the spec is done.

---

### Task 1: Dependencies and environment template

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Step 1: Add the `@vercel/blob` dependency**

Run:
```bash
npm install @vercel/blob
```

- [ ] **Step 2: Document the new env vars in `.env.example`**

Add this to the end of `.env.example`:

```
# Admin content editor (see docs/superpowers/specs/2026-09-08-admin-content-editor-design.md)
ADMIN_PASSWORD=
SESSION_SECRET=
GITHUB_TOKEN=
GITHUB_OWNER=Dilan1234321
GITHUB_REPO=med-website
GITHUB_BRANCH=main
BLOB_READ_WRITE_TOKEN=
```

- [ ] **Step 3: Verify**

Run: `cat package.json | grep vercel/blob`
Expected: a line like `"@vercel/blob": "^..."` under `dependencies`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add @vercel/blob dependency and admin env var template"
```

---

### Task 2: Signed session token helper

**Files:**
- Create: `src/lib/admin/session.ts`

- [ ] **Step 1: Implement the session helper**

```ts
// src/lib/admin/session.ts
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "med_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Creates a signed token of the form "<expiresAtMs>.<hmacHex>". */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

/** Verifies signature and expiry. Never throws — returns false on any problem. */
export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  let expectedBuf: Buffer;
  let actualBuf: Buffer;
  try {
    expectedBuf = Buffer.from(sign(payload), "hex");
    actualBuf = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  if (expectedBuf.length !== actualBuf.length) return false;
  if (!timingSafeEqual(expectedBuf, actualBuf)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}
```

- [ ] **Step 2: Verify with a throwaway script**

Run:
```bash
SESSION_SECRET=test-secret npx tsx -e "
import { createSessionToken, isValidSessionToken } from './src/lib/admin/session';
const token = createSessionToken();
console.log('token:', token);
console.log('valid:', isValidSessionToken(token));
console.log('tampered valid (expect false):', isValidSessionToken(token + 'x'));
console.log('empty valid (expect false):', isValidSessionToken(''));
"
```
Expected: `valid: true`, both other lines `false`. (If `tsx` isn't available, run `npx --yes tsx@latest -e "..."` instead — it will install it on the fly for this one-off check.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/session.ts
git commit -m "feat(admin): add signed session token helper"
```

---

### Task 3: `requireSession` guard for Server Actions

**Files:**
- Create: `src/lib/admin/require-session.ts`

- [ ] **Step 1: Implement**

```ts
// src/lib/admin/require-session.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, isValidSessionToken } from "./session";

/**
 * Defense-in-depth check inside Server Actions. The proxy already blocks
 * unauthenticated requests to /admin/* and /api/admin/*, but this guarantees
 * any action added later is still protected even if the matcher is ever
 * misconfigured.
 */
export async function requireSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no new type errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/require-session.ts
git commit -m "feat(admin): add requireSession guard for server actions"
```

---

### Task 4: Route protection via `proxy.ts`

**Files:**
- Create: `src/proxy.ts`

- [ ] **Step 1: Implement**

```ts
// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (isValidSessionToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

- [ ] **Step 2: Verify**

Run: `npm run dev` (in one terminal), then in another:
```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/admin
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/login
```
Expected: first line `307 http://localhost:3000/admin/login` (redirected, unauthenticated), second line `200` (login page itself is reachable). `/admin` and `/admin/login` don't exist as pages yet at this point in the plan, so a 404 body is fine — what matters is the redirect status/behavior, not page content yet.

- [ ] **Step 3: Commit**

```bash
git add src/proxy.ts
git commit -m "feat(admin): protect /admin and /api/admin routes with session check"
```

---

### Task 5: GitHub content client

**Files:**
- Create: `src/lib/admin/github.ts`

- [ ] **Step 1: Implement**

```ts
// src/lib/admin/github.ts
const GITHUB_API = "https://api.github.com";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function repoConfig() {
  return {
    owner: env("GITHUB_OWNER"),
    repo: env("GITHUB_REPO"),
    branch: env("GITHUB_BRANCH"),
    token: env("GITHUB_TOKEN"),
  };
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export class ContentConflictError extends Error {
  constructor(path: string) {
    super(`"${path}" was changed by someone else since you loaded it. Reload the page to see the latest version.`);
    this.name = "ContentConflictError";
  }
}

/** Reads a JSON file from the repo at the current HEAD of the configured branch. */
export async function getContentFile<T>(path: string): Promise<{ data: T; sha: string }> {
  const { owner, repo, branch, token } = repoConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load ${path} from GitHub (${res.status})`);
  }
  const json = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded) as T, sha: json.sha };
}

/**
 * Commits an updated JSON file straight to the configured branch.
 * Throws ContentConflictError if expectedSha is stale (someone else saved
 * this file since the caller loaded it).
 */
export async function updateContentFile(
  path: string,
  data: unknown,
  expectedSha: string,
  message: string,
): Promise<void> {
  const { owner, repo, branch, token } = repoConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n", "utf-8").toString("base64");
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content, sha: expectedSha, branch }),
  });
  if (res.status === 409) {
    throw new ContentConflictError(path);
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update ${path} on GitHub (${res.status}): ${body}`);
  }
}

export type RecentChange = { sha: string; message: string; author: string; date: string };

/** Lists the most recent commits that touched anything under content/. */
export async function listRecentContentChanges(limit = 20): Promise<RecentChange[]> {
  const { owner, repo, branch, token } = repoConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/commits?path=content&sha=${branch}&per_page=${limit}`;
  const res = await fetch(url, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load recent changes (${res.status})`);
  }
  const commits = (await res.json()) as Array<{
    sha: string;
    commit: { message: string; author: { name: string; date: string } };
  }>;
  return commits.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date,
  }));
}
```

- [ ] **Step 2: Verify with a throwaway script (uses your real `.env.local` GitHub token/branch)**

Run:
```bash
npx tsx -e "
import 'dotenv/config';
import { getContentFile } from './src/lib/admin/github';
getContentFile('content/site.json').then(({ data, sha }) => {
  console.log('sha:', sha);
  console.log('name:', (data as any).name);
});
"
```
If `dotenv` isn't installed, run `npm install --no-save dotenv` first (dev-only, not committed — it's just for this manual check). Expected: prints a real sha string and `name: Mu Epsilon Delta`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/github.ts
git commit -m "feat(admin): add GitHub Contents API client for reading/writing content JSON"
```

---

### Task 6: Image upload API route

**Files:**
- Create: `src/app/api/admin/upload/route.ts`

- [ ] **Step 1: Implement**

```ts
// src/app/api/admin/upload/route.ts
export const runtime = "nodejs";

import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Please upload an image under 5MB." }, { status: 400 });
  }

  const extension = file.type.split("/")[1];
  const pathname = `content/${randomUUID()}.${extension}`;

  const blob = await put(pathname, file, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
```

- [ ] **Step 2: Verify**

With `npm run dev` running and `BLOB_READ_WRITE_TOKEN` set in `.env.local`:
```bash
curl -s -F "file=@public/images/hero-1.jpg;type=image/jpeg" http://localhost:3000/api/admin/upload
```
Expected (once logged in — this route sits behind the proxy from Task 4, so before Task 10 exists this call correctly returns `401 {"error":"Unauthorized"}`; that 401 response itself is the expected result for now). Re-run this same check after Task 10 (login) exists, with a valid session cookie, and confirm it instead returns `{"url":"https://...blob.vercel-storage.com/..."}`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/upload/route.ts
git commit -m "feat(admin): add image upload endpoint backed by Vercel Blob"
```

---

### Task 7: Shared form components and admin button styles

**Files:**
- Create: `src/components/admin/TextField.tsx`
- Create: `src/components/admin/TextAreaField.tsx`
- Create: `src/components/admin/ImageField.tsx`
- Create: `src/components/admin/SaveButton.tsx`
- Create: `src/components/admin/RepeatableListField.tsx`
- Create: `src/components/admin/ToastProvider.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: `TextField`**

```tsx
// src/components/admin/TextField.tsx
"use client";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "number" | "date";
  required?: boolean;
  helperText?: string;
};

export function TextField({ label, value, onChange, type = "text", required = false, helperText }: TextFieldProps) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-maroon"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-bg px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
      {helperText && <p className="text-xs text-ink-muted">{helperText}</p>}
    </div>
  );
}
```

- [ ] **Step 2: `TextAreaField`**

```tsx
// src/components/admin/TextAreaField.tsx
"use client";

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  helperText?: string;
};

export function TextAreaField({ label, value, onChange, rows = 4, required = false, helperText }: TextAreaFieldProps) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-maroon"> *</span>}
      </label>
      <textarea
        id={id}
        value={value}
        required={required}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-bg px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
      {helperText && <p className="text-xs text-ink-muted">{helperText}</p>}
    </div>
  );
}
```

- [ ] **Step 3: `ImageField`**

```tsx
// src/components/admin/ImageField.tsx
"use client";

import { useState } from "react";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Please upload an image under 5MB.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        setError(body.error ?? "Upload failed. Try again.");
        return;
      }
      onChange(body.url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-line bg-bg-muted">
          {value ? (
            // Plain <img>, not next/image: blob URLs are on a dynamic per-store
            // domain, so avoiding next/image sidesteps a remotePatterns config.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-center text-[10px] text-ink-muted">No photo</span>
          )}
        </div>
        <label className="admin-button-secondary cursor-pointer">
          {uploading ? "Uploading…" : "Upload photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <p className="text-xs text-maroon">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 4: `SaveButton`**

```tsx
// src/components/admin/SaveButton.tsx
"use client";

export function SaveButton({ pending, label = "Save" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="admin-button-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {pending ? "Saving…" : label}
    </button>
  );
}
```

- [ ] **Step 5: `RepeatableListField`**

```tsx
// src/components/admin/RepeatableListField.tsx
"use client";

import type { ReactNode } from "react";

type RepeatableListFieldProps<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
  emptyLabel: string;
};

export function RepeatableListField<T>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel,
  emptyLabel,
}: RepeatableListFieldProps<T>) {
  function updateAt(index: number, patch: Partial<T>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeAt(index: number) {
    if (!confirm("Remove this entry? This can't be undone from here.")) return;
    onChange(items.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = items.slice();
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    const next = items.slice();
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-line p-4 text-sm text-ink-muted">{emptyLabel}</p>
      )}
      {items.map((item, index) => (
        // Index as key is fine here: rows are swapped in place (moveUp/moveDown)
        // or removed outright, never reordered by insertion — no key-stability
        // bugs result, only a minor loss of focus on remove, which is acceptable
        // for this internal tool.
        <div key={index} className="rounded-xl border border-line bg-bg-elevated p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">#{index + 1}</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveUp(index)} disabled={index === 0} className="admin-icon-button" aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="admin-icon-button"
                aria-label="Move down"
              >
                ↓
              </button>
              <button type="button" onClick={() => removeAt(index)} className="admin-icon-button admin-icon-button-danger">
                Remove
              </button>
            </div>
          </div>
          {renderItem(item, index, (patch) => updateAt(index, patch))}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, createItem()])} className="admin-button-secondary">
        {addLabel}
      </button>
    </div>
  );
}
```

- [ ] **Step 6: `ToastProvider`**

```tsx
// src/components/admin/ToastProvider.tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastType = "success" | "error";
type Toast = { id: number; type: ToastType; message: string };
type ToastContextValue = { showToast: (type: ToastType, message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success" ? "bg-maroon text-white" : "border border-maroon bg-white text-maroon"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
```

- [ ] **Step 7: Admin button styles — append to `src/app/globals.css`**

```css
@layer components {
  .admin-button-primary {
    @apply inline-flex items-center justify-center rounded-lg bg-maroon px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-maroon-rich;
  }
  .admin-button-secondary {
    @apply inline-flex items-center justify-center rounded-lg border border-line bg-bg px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold;
  }
  .admin-icon-button {
    @apply rounded-md border border-line bg-bg px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-40;
  }
  .admin-icon-button-danger {
    @apply border-maroon/30 text-maroon hover:bg-maroon/10;
  }
}
```

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit`
Expected: no type errors in the new files.

- [ ] **Step 9: Commit**

```bash
git add src/components/admin src/app/globals.css
git commit -m "feat(admin): add shared form field, toast, and repeatable-list components"
```

---

### Task 8: Stop the public Header/Footer from wrapping `/admin`

**Files:**
- Modify: `src/components/SiteShell.tsx`

- [ ] **Step 1: Add the admin branch**

Replace the full contents of `src/components/SiteShell.tsx` with:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transparent = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header transparent={transparent} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ThemeToggle />
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Verify**

With `npm run dev` running, visit `http://localhost:3000/` in a browser and confirm the public Header/Footer still render there (nothing else changed for public pages). `/admin` itself doesn't have a page yet — that's checked once Task 9 exists.

- [ ] **Step 3: Commit**

```bash
git add src/components/SiteShell.tsx
git commit -m "fix(admin): don't wrap /admin routes in the public site header/footer"
```

---

### Task 9: `AdminShell` layout and logout action

**Files:**
- Create: `src/app/admin/actions.ts`
- Create: `src/components/admin/AdminShell.tsx`

- [ ] **Step 1: Logout action**

```ts
// src/app/admin/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/admin/session";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
```

- [ ] **Step 2: `AdminShell`**

```tsx
// src/components/admin/AdminShell.tsx
import Link from "next/link";
import { logout } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site", label: "Site Settings" },
  { href: "/admin/leadership", label: "Exec Board" },
  { href: "/admin/events", label: "Events" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-muted md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-line bg-bg px-4 py-4 md:w-60 md:border-b-0 md:border-r md:py-6">
        <p className="mb-3 px-2 text-sm font-semibold uppercase tracking-wide text-ink-muted md:mb-6">MED Admin</p>
        <nav className="flex flex-1 gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="mt-3 md:mt-0">
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-muted transition-colors hover:bg-bg-muted">
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new type errors. (Visual verification happens once a page uses `AdminShell`, in Task 11.)

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/actions.ts src/components/admin/AdminShell.tsx
git commit -m "feat(admin): add AdminShell layout and logout action"
```

---

### Task 10: Login page

**Files:**
- Create: `src/app/admin/login/actions.ts`
- Create: `src/app/admin/login/LoginForm.tsx`
- Create: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Login action with a best-effort attempt limiter**

```ts
// src/app/admin/login/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin/session";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function login(password: string): Promise<{ error: string } | void> {
  // Best-effort only: keyed globally (no per-IP tracking) and resets on cold
  // start on serverless. Acceptable for this app's low-value threat model
  // per the approved design spec — a small, private admin tool.
  if (isRateLimited("global")) {
    return { error: "Too many attempts. Wait a few minutes and try again." };
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}
```

- [ ] **Step 2: Login form**

```tsx
// src/app/admin/login/LoginForm.tsx
"use client";

import { useState, useTransition } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await login(password);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Admin password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-line bg-bg px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-maroon">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Login page**

```tsx
// src/app/admin/login/page.tsx
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-muted px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-line bg-bg p-8">
        <h1 className="text-xl font-semibold text-ink">MED Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

With `npm run dev` running, visit `http://localhost:3000/admin/login`. Confirm:
- No public header/footer shows (Task 8 working)
- Entering the wrong password shows "Incorrect password."
- Entering the value of `ADMIN_PASSWORD` from `.env.local` redirects to `/admin` (a 404 is expected right now — the dashboard page doesn't exist until Task 11 — but the URL bar should show `/admin`, confirming redirect + auth worked)

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/login
git commit -m "feat(admin): add login page with rate-limited password check"
```

---

### Task 11: Admin dashboard (`/admin`) with recent changes

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/page.tsx
import { AdminShell } from "@/components/admin/AdminShell";
import { listRecentContentChanges } from "@/lib/admin/github";

export default async function AdminDashboardPage() {
  const changes = await listRecentContentChanges(20);

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Recent content changes, newest first. Every save here is a normal git commit, so nothing is ever truly lost.
      </p>
      <ul className="mt-8 flex flex-col divide-y divide-line rounded-xl border border-line bg-bg">
        {changes.length === 0 && <li className="p-4 text-sm text-ink-muted">No content changes yet.</li>}
        {changes.map((change) => (
          <li key={change.sha} className="flex flex-col gap-1 p-4">
            <span className="text-sm font-medium text-ink">{change.message}</span>
            <span className="text-xs text-ink-muted">
              {change.author} · {new Date(change.date).toLocaleString("en-US")}
            </span>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
```

- [ ] **Step 2: Verify**

Log in at `/admin/login`, confirm you land on `/admin` and see:
- The sidebar (Dashboard, Site Settings, Exec Board, Events, Sign out)
- A list of recent commits to `content/` on the configured branch (should show the repo's real history, e.g. the "Fix chapter designation from Chi to Gamma..." commit)
- Clicking "Sign out" returns you to `/admin/login`, and visiting `/admin` directly afterward redirects back to login (session cleared)

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): add dashboard page with recent content changes"
```

---

### Task 12: Site Settings section (`site.json` + `stats.json`)

**Files:**
- Create: `src/app/admin/site/actions.ts`
- Create: `src/app/admin/site/SiteSettingsForm.tsx`
- Create: `src/app/admin/site/StatsForm.tsx`
- Create: `src/app/admin/site/page.tsx`

- [ ] **Step 1: Server actions**

```ts
// src/app/admin/site/actions.ts
"use server";

import { updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { requireSession } from "@/lib/admin/require-session";

type SaveResult = { ok: true } | { ok: false; error: string };

async function save(path: string, data: unknown, expectedSha: string, message: string): Promise<SaveResult> {
  await requireSession();
  try {
    await updateContentFile(path, data, expectedSha, message);
    return { ok: true };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }
}

export async function saveSite(data: unknown, expectedSha: string): Promise<SaveResult> {
  return save("content/site.json", data, expectedSha, "content: update site settings via admin");
}

export async function saveStats(data: unknown, expectedSha: string): Promise<SaveResult> {
  return save("content/stats.json", data, expectedSha, "content: update stats via admin");
}
```

- [ ] **Step 2: Site settings form**

```tsx
// src/app/admin/site/SiteSettingsForm.tsx
"use client";

import { useState, useTransition } from "react";
import { TextField } from "@/components/admin/TextField";
import { SaveButton } from "@/components/admin/SaveButton";
import { useToast } from "@/components/admin/ToastProvider";
import { saveSite } from "./actions";

export type SiteContent = {
  name: string;
  shortName: string;
  greek: string;
  tagline: string;
  chapter: string;
  chapterDesignation: string;
  campus: string;
  university: string;
  email: string;
  founded: number;
  chapterFounded: number;
  nationalUrl: string;
  social: { instagram: string; linkedin: string };
  rushFormUrl: string;
  donateUrl: string;
  applicationFormUrl: string;
};

export function SiteSettingsForm({ initialSite, initialSha }: { initialSite: SiteContent; initialSha: string }) {
  const [site, setSite] = useState(initialSite);
  const [sha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setSite((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveSite(site, sha);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      showToast("success", "Saved — live in about a minute.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-line bg-bg p-6">
      <h2 className="text-lg font-semibold text-ink">Chapter identity</h2>
      <TextField label="Chapter name" value={site.name} onChange={(v) => update("name", v)} required />
      <TextField label="Short name" value={site.shortName} onChange={(v) => update("shortName", v)} required />
      <TextField label="Greek letters" value={site.greek} onChange={(v) => update("greek", v)} required />
      <TextField
        label="Chapter designation"
        value={site.chapterDesignation}
        onChange={(v) => update("chapterDesignation", v)}
        required
        helperText='e.g. "Gamma" — used in "Gamma Chapter" throughout the site'
      />
      <TextField label="Chapter line" value={site.chapter} onChange={(v) => update("chapter", v)} required helperText='e.g. "Gamma Chapter · University of Tampa"' />
      <TextField label="Tagline" value={site.tagline} onChange={(v) => update("tagline", v)} required />
      <TextField label="University" value={site.university} onChange={(v) => update("university", v)} required />
      <TextField label="Campus" value={site.campus} onChange={(v) => update("campus", v)} required />
      <TextField label="Contact email" type="email" value={site.email} onChange={(v) => update("email", v)} required />
      <TextField
        label="National founding year"
        type="number"
        value={String(site.founded)}
        onChange={(v) => update("founded", Number(v))}
        required
      />
      <TextField
        label="Chapter founding year"
        type="number"
        value={String(site.chapterFounded)}
        onChange={(v) => update("chapterFounded", Number(v))}
        required
      />
      <TextField label="National org URL" type="url" value={site.nationalUrl} onChange={(v) => update("nationalUrl", v)} />
      <TextField
        label="Instagram URL"
        type="url"
        value={site.social.instagram}
        onChange={(v) => update("social", { ...site.social, instagram: v })}
      />
      <TextField
        label="LinkedIn URL"
        type="url"
        value={site.social.linkedin}
        onChange={(v) => update("social", { ...site.social, linkedin: v })}
      />
      <TextField label="Rush form URL" type="url" value={site.rushFormUrl} onChange={(v) => update("rushFormUrl", v)} helperText="Leave blank to hide the rush form link" />
      <TextField label="Donate URL" type="url" value={site.donateUrl} onChange={(v) => update("donateUrl", v)} />
      <TextField label="Application form URL" type="url" value={site.applicationFormUrl} onChange={(v) => update("applicationFormUrl", v)} />
      {error && (
        <p role="alert" className="text-sm text-maroon">
          {error}
        </p>
      )}
      <div>
        <SaveButton pending={pending} />
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Stats form**

```tsx
// src/app/admin/site/StatsForm.tsx
"use client";

import { useState, useTransition } from "react";
import { TextField } from "@/components/admin/TextField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { SaveButton } from "@/components/admin/SaveButton";
import { useToast } from "@/components/admin/ToastProvider";
import { saveStats } from "./actions";

export type StatsContent = {
  members: number;
  serviceHours: number;
  medSchoolAcceptanceRate: number | null;
  foundingYear: number;
  chapterFounded: number;
  programs: number;
  alumniInMedicine: number;
  nationalChapters: number;
  note: string;
};

export function StatsForm({ initialStats, initialSha }: { initialStats: StatsContent; initialSha: string }) {
  const [stats, setStats] = useState(initialStats);
  const [sha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function update<K extends keyof StatsContent>(key: K, value: StatsContent[K]) {
    setStats((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveStats(stats, sha);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      showToast("success", "Saved — live in about a minute.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-line bg-bg p-6">
      <h2 className="text-lg font-semibold text-ink">Headline stats</h2>
      <TextField label="Members" type="number" value={String(stats.members)} onChange={(v) => update("members", Number(v))} required />
      <TextField label="Service hours" type="number" value={String(stats.serviceHours)} onChange={(v) => update("serviceHours", Number(v))} required />
      <TextField
        label="Med school acceptance rate (%)"
        type="number"
        value={stats.medSchoolAcceptanceRate === null ? "" : String(stats.medSchoolAcceptanceRate)}
        onChange={(v) => update("medSchoolAcceptanceRate", v === "" ? null : Number(v))}
        helperText="Leave blank to hide this stat until the chapter has graduates"
      />
      <TextField label="National founding year" type="number" value={String(stats.foundingYear)} onChange={(v) => update("foundingYear", Number(v))} required />
      <TextField label="Chapter founding year" type="number" value={String(stats.chapterFounded)} onChange={(v) => update("chapterFounded", Number(v))} required />
      <TextField label="Programs" type="number" value={String(stats.programs)} onChange={(v) => update("programs", Number(v))} required />
      <TextField label="Alumni in medicine" type="number" value={String(stats.alumniInMedicine)} onChange={(v) => update("alumniInMedicine", Number(v))} required />
      <TextField label="National chapters" type="number" value={String(stats.nationalChapters)} onChange={(v) => update("nationalChapters", Number(v))} required />
      <TextAreaField label="Internal note" value={stats.note} onChange={(v) => update("note", v)} rows={2} helperText="Not shown publicly — a reminder to whoever edits this file next" />
      {error && (
        <p role="alert" className="text-sm text-maroon">
          {error}
        </p>
      )}
      <div>
        <SaveButton pending={pending} />
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Page combining both forms**

```tsx
// src/app/admin/site/page.tsx
import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { SiteSettingsForm, type SiteContent } from "./SiteSettingsForm";
import { StatsForm, type StatsContent } from "./StatsForm";

export default async function SiteSettingsPage() {
  const [site, stats] = await Promise.all([
    getContentFile<SiteContent>("content/site.json"),
    getContentFile<StatsContent>("content/stats.json"),
  ]);

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-muted">Chapter identity, contact info, and headline stats shown across the site.</p>
      <div className="mt-8 flex flex-col gap-10">
        <SiteSettingsForm initialSite={site.data} initialSha={site.sha} />
        <StatsForm initialStats={stats.data} initialSha={stats.sha} />
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 5: Verify**

Log in, go to Site Settings, change the Tagline field, click Save. Confirm:
- Button shows "Saving…" then a success toast appears
- On GitHub, a new commit "content: update site settings via admin" appears on the configured branch, and `content/site.json`'s tagline changed
- Reloading the page shows the new tagline (proves it's reading live from GitHub, not a stale build)
- Repeat once for the Stats form to confirm it saves independently

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/site
git commit -m "feat(admin): add Site Settings section (site.json + stats.json)"
```

---

### Task 13: Exec Board section (`leadership.json`)

**Files:**
- Create: `src/app/admin/leadership/actions.ts`
- Create: `src/app/admin/leadership/LeadershipForm.tsx`
- Create: `src/app/admin/leadership/page.tsx`

- [ ] **Step 1: Server action**

```ts
// src/app/admin/leadership/actions.ts
"use server";

import { updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { requireSession } from "@/lib/admin/require-session";
import type { LeadershipMember } from "./LeadershipForm";

type SaveResult = { ok: true } | { ok: false; error: string };

export async function saveLeadership(members: LeadershipMember[], expectedSha: string): Promise<SaveResult> {
  await requireSession();
  try {
    await updateContentFile("content/leadership.json", members, expectedSha, "content: update exec board via admin");
    return { ok: true };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }
}
```

- [ ] **Step 2: Form**

```tsx
// src/app/admin/leadership/LeadershipForm.tsx
"use client";

import { useState, useTransition } from "react";
import { TextField } from "@/components/admin/TextField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { ImageField } from "@/components/admin/ImageField";
import { RepeatableListField } from "@/components/admin/RepeatableListField";
import { SaveButton } from "@/components/admin/SaveButton";
import { useToast } from "@/components/admin/ToastProvider";
import { saveLeadership } from "./actions";

export type LeadershipMember = {
  name: string;
  role: string;
  year: string;
  major: string;
  focus: string;
  email: string;
  photo: string;
};

const EMPTY_MEMBER: LeadershipMember = { name: "", role: "", year: "", major: "", focus: "", email: "", photo: "" };

export function LeadershipForm({ initialMembers, initialSha }: { initialMembers: LeadershipMember[]; initialSha: string }) {
  const [members, setMembers] = useState(initialMembers);
  const [sha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveLeadership(members, sha);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      showToast("success", "Saved — live in about a minute.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <RepeatableListField
        items={members}
        onChange={setMembers}
        createItem={() => ({ ...EMPTY_MEMBER })}
        addLabel="Add exec board member"
        emptyLabel="No exec board members yet. Add the first one below."
        renderItem={(member, _index, update) => (
          <div className="flex flex-col gap-3">
            <ImageField label="Photo" value={member.photo} onChange={(url) => update({ photo: url })} />
            <TextField label="Name" value={member.name} onChange={(v) => update({ name: v })} required />
            <TextField label="Role" value={member.role} onChange={(v) => update({ role: v })} required helperText='e.g. "President", "VP of Finance"' />
            <TextField label="Class year" value={member.year} onChange={(v) => update({ year: v })} required helperText='e.g. "Class of 2027"' />
            <TextField label="Major" value={member.major} onChange={(v) => update({ major: v })} required />
            <TextAreaField label="Focus / responsibilities" value={member.focus} onChange={(v) => update({ focus: v })} rows={2} required />
            <TextField label="Email" type="email" value={member.email} onChange={(v) => update({ email: v })} required />
          </div>
        )}
      />
      {error && (
        <p role="alert" className="text-sm text-maroon">
          {error}
        </p>
      )}
      <div>
        <SaveButton pending={pending} />
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Page**

```tsx
// src/app/admin/leadership/page.tsx
import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { LeadershipForm, type LeadershipMember } from "./LeadershipForm";

export default async function LeadershipPage() {
  const leadership = await getContentFile<LeadershipMember[]>("content/leadership.json");

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Exec Board</h1>
      <p className="mt-1 text-sm text-ink-muted">Add, edit, or remove exec board members shown on the Leadership page.</p>
      <div className="mt-8">
        <LeadershipForm initialMembers={leadership.data} initialSha={leadership.sha} />
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 4: Verify**

Log in, go to Exec Board. Confirm:
- All 6 current members render with their fields pre-filled
- Uploading a photo for one member shows a live thumbnail preview before saving
- Clicking "Add exec board member" appends a blank row; filling it in and saving adds a 7th entry to `content/leadership.json` on GitHub
- Clicking "Remove" on a member (after confirming the browser dialog) and saving removes that entry
- The ↑/↓ buttons reorder two members and Save persists the new order

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/leadership
git commit -m "feat(admin): add Exec Board section (leadership.json)"
```

---

### Task 14: Events section (`events.json`)

**Files:**
- Create: `src/app/admin/events/actions.ts`
- Create: `src/app/admin/events/EventsForm.tsx`
- Create: `src/app/admin/events/page.tsx`

- [ ] **Step 1: Server action**

```ts
// src/app/admin/events/actions.ts
"use server";

import { updateContentFile, ContentConflictError } from "@/lib/admin/github";
import { requireSession } from "@/lib/admin/require-session";
import type { EventsContent } from "./EventsForm";

type SaveResult = { ok: true } | { ok: false; error: string };

export async function saveEvents(events: EventsContent, expectedSha: string): Promise<SaveResult> {
  await requireSession();
  try {
    await updateContentFile("content/events.json", events, expectedSha, "content: update events via admin");
    return { ok: true };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }
}
```

- [ ] **Step 2: Form**

```tsx
// src/app/admin/events/EventsForm.tsx
"use client";

import { useState, useTransition } from "react";
import { TextField } from "@/components/admin/TextField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { RepeatableListField } from "@/components/admin/RepeatableListField";
import { SaveButton } from "@/components/admin/SaveButton";
import { useToast } from "@/components/admin/ToastProvider";
import { saveEvents } from "./actions";

export type EventCategory = { id: string; title: string; description: string };
export type UpcomingEvent = { id: string; title: string; date: string; time: string; location: string; category: string; summary: string };
export type PastEvent = { id: string; title: string; date: string; category: string; summary: string };
export type EventsContent = { categories: EventCategory[]; upcoming: UpcomingEvent[]; past: PastEvent[] };

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY_CATEGORY: EventCategory = { id: "", title: "", description: "" };
const EMPTY_UPCOMING: UpcomingEvent = { id: "", title: "", date: "", time: "", location: "", category: "", summary: "" };
const EMPTY_PAST: PastEvent = { id: "", title: "", date: "", category: "", summary: "" };

function CategorySelect({ value, categories, onChange }: { value: string; categories: EventCategory[]; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">Category</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-bg px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
      >
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title || c.id}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EventsForm({ initialEvents, initialSha }: { initialEvents: EventsContent; initialSha: string }) {
  const [events, setEvents] = useState(initialEvents);
  const [sha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveEvents(events, sha);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      showToast("success", "Saved — live in about a minute.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink">Categories</h2>
        <RepeatableListField
          items={events.categories}
          onChange={(categories) => setEvents((current) => ({ ...current, categories }))}
          createItem={() => ({ ...EMPTY_CATEGORY })}
          addLabel="Add category"
          emptyLabel="No categories yet."
          renderItem={(category, _index, update) => (
            <div className="flex flex-col gap-3">
              <TextField label="Title" value={category.title} onChange={(v) => update({ title: v, id: category.id || slugify(v) })} required />
              <TextAreaField label="Description" value={category.description} onChange={(v) => update({ description: v })} rows={2} required />
            </div>
          )}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink">Upcoming events</h2>
        <RepeatableListField
          items={events.upcoming}
          onChange={(upcoming) => setEvents((current) => ({ ...current, upcoming }))}
          createItem={() => ({ ...EMPTY_UPCOMING })}
          addLabel="Add upcoming event"
          emptyLabel="No upcoming events yet."
          renderItem={(item, _index, update) => (
            <div className="flex flex-col gap-3">
              <TextField label="Title" value={item.title} onChange={(v) => update({ title: v, id: item.id || slugify(v) })} required />
              <TextField label="Date" type="date" value={item.date} onChange={(v) => update({ date: v })} required />
              <TextField label="Time" value={item.time} onChange={(v) => update({ time: v })} required helperText='e.g. "7:00 PM" or "10:00 AM – 4:00 PM"' />
              <TextField label="Location" value={item.location} onChange={(v) => update({ location: v })} required />
              <CategorySelect value={item.category} categories={events.categories} onChange={(v) => update({ category: v })} />
              <TextAreaField label="Summary" value={item.summary} onChange={(v) => update({ summary: v })} rows={2} required />
            </div>
          )}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink">Past events</h2>
        <RepeatableListField
          items={events.past}
          onChange={(past) => setEvents((current) => ({ ...current, past }))}
          createItem={() => ({ ...EMPTY_PAST })}
          addLabel="Add past event"
          emptyLabel="No past events yet."
          renderItem={(item, _index, update) => (
            <div className="flex flex-col gap-3">
              <TextField label="Title" value={item.title} onChange={(v) => update({ title: v, id: item.id || slugify(v) })} required />
              <TextField label="Date" type="date" value={item.date} onChange={(v) => update({ date: v })} required />
              <CategorySelect value={item.category} categories={events.categories} onChange={(v) => update({ category: v })} />
              <TextAreaField label="Summary" value={item.summary} onChange={(v) => update({ summary: v })} rows={2} required />
            </div>
          )}
        />
      </section>

      {error && (
        <p role="alert" className="text-sm text-maroon">
          {error}
        </p>
      )}
      <div>
        <SaveButton pending={pending} />
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Page**

```tsx
// src/app/admin/events/page.tsx
import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { EventsForm, type EventsContent } from "./EventsForm";

export default async function EventsPage() {
  const events = await getContentFile<EventsContent>("content/events.json");

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-ink">Events</h1>
      <p className="mt-1 text-sm text-ink-muted">Manage event categories, upcoming events, and past events.</p>
      <div className="mt-8">
        <EventsForm initialEvents={events.data} initialSha={events.sha} />
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 4: Verify**

Log in, go to Events. Confirm:
- All 5 categories, 5 upcoming events, and 3 past events render with fields pre-filled and the right category pre-selected in each dropdown
- Adding a new upcoming event, picking a category from the dropdown, and saving adds it to `content/events.json` on GitHub inside the `upcoming` array specifically (not `past` or `categories`)
- Removing a past event and saving removes only that one entry from `past`

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/events
git commit -m "feat(admin): add Events section (events.json)"
```

---

### Task 15: Full manual QA pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full checklist from the design spec's Testing section**

With `npm run dev` running and logged into `/admin`:
1. Site Settings: edit a field in each of the two forms, save each independently, confirm both commits land and both reload with fresh data.
2. Exec Board: add a member, edit a member, remove a member, reorder two members — save after each and confirm on GitHub.
3. Events: add/edit/remove one entry in each of categories/upcoming/past — confirm each stays in its correct array.
4. Image upload: upload a >5MB file and a `.gif` file to an Exec Board member's photo field — confirm both are rejected client-side with the specific messages from `ImageField`, not a generic error.
5. Auth: log out, confirm `/admin`, `/admin/site`, `/admin/leadership`, `/admin/events` all redirect to `/admin/login` when visited directly while logged out.
6. Conflict handling: open the Exec Board page in two browser tabs, save a change in tab 1, then try to save a (now-stale) change in tab 2 — confirm tab 2 shows the "was changed by someone else" message instead of silently overwriting tab 1's save.
7. Mobile: resize the browser to 375px width and walk through one full edit-and-save cycle on the Exec Board page — confirm the sidebar collapses to a scrollable top bar and every control stays usable.

- [ ] **Step 2: Fix anything the checklist surfaces**

If any check fails, fix it in the relevant file from Tasks 1–14 and re-run just that check before moving on — don't batch fixes to the end.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore(admin): manual QA pass for content editor phase 1"
```

(Skip this commit if Step 2 required no fixes — nothing to commit.)

---

## What's deliberately not in this plan

- **Family, Alumni, Service, Accomplishments, Gallery, Membership, Donate, About sections** — same pattern as Site Settings/Exec Board/Events, established here; write as a Phase 2 plan once this one ships.
- **Merging `cursor/med-fraternity-website-582a` into `main`, reconnecting the Vercel project to GitHub, and pointing `medutampa.com` at it** — these are the design spec's "Deployment prerequisites," not app code, and block this feature from working in production even after Phase 1 and 2 both ship. Handle separately.
- **A revert button in the recent-changes log** — v1 is read-only per the approved spec; add only if manual `git revert` proves to be a real friction point in practice.
