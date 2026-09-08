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
  const [sha, setSha] = useState(initialSha);
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
      setSha(result.sha);
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
