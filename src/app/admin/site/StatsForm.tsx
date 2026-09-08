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
  const [sha, setSha] = useState(initialSha);
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
      setSha(result.sha);
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
