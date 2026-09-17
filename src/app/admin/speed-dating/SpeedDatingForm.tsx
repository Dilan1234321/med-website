"use client";

import { useState, useTransition } from "react";
import { TextField } from "@/components/admin/TextField";
import { ImageField } from "@/components/admin/ImageField";
import { RepeatableListField } from "@/components/admin/RepeatableListField";
import { SaveButton } from "@/components/admin/SaveButton";
import { useToast } from "@/components/admin/ToastProvider";
import { saveCandidates } from "./actions";
import type { Candidate } from "@/app/speed-dating/types";

function nextId(candidates: Candidate[]): number {
  return candidates.reduce((max, c) => Math.max(max, c.id), 0) + 1;
}

export function SpeedDatingForm({ initialCandidates, initialSha }: { initialCandidates: Candidate[]; initialSha: string }) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [sha, setSha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await saveCandidates(candidates, sha);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSha(result.sha);
      showToast("success", "Saved — live in about a minute.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <RepeatableListField
        items={candidates}
        onChange={setCandidates}
        createItem={() => ({
          id: nextId(candidates),
          name: "",
          major: "",
          graduationYear: "",
          photo: "",
          instagram: "",
          referralSource: "",
          active: true,
        })}
        addLabel="Add PNM"
        emptyLabel="No PNMs yet. Add the first one below."
        renderItem={(candidate, _index, update) => (
          <div className="flex flex-col gap-3">
            <ImageField label={`Photo — ${candidate.name || "new PNM"}`} value={candidate.photo} onChange={(url) => update({ photo: url })} />
            <TextField label="Name" value={candidate.name} onChange={(v) => update({ name: v })} required />
            <TextField label="Graduation year" value={candidate.graduationYear} onChange={(v) => update({ graduationYear: v })} helperText='e.g. "2029"' />
            <TextField label="Major" value={candidate.major} onChange={(v) => update({ major: v })} />
            <TextField label="Instagram" value={candidate.instagram} onChange={(v) => update({ instagram: v })} />
            <TextField label="Referral source" value={candidate.referralSource} onChange={(v) => update({ referralSource: v })} helperText="How did they hear about us?" />
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={candidate.active}
                onChange={(e) => update({ active: e.target.checked })}
                className="h-4 w-4 rounded border-line accent-maroon"
              />
              Active (shows up in Speed Dating)
            </label>
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
