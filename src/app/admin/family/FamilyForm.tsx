"use client";

import { useState, useTransition } from "react";
import { TextField } from "@/components/admin/TextField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { ImageField } from "@/components/admin/ImageField";
import { RepeatableListField } from "@/components/admin/RepeatableListField";
import { SaveButton } from "@/components/admin/SaveButton";
import { useToast } from "@/components/admin/ToastProvider";
import { saveFamily } from "./actions";

export type FamilyMember = {
  name: string;
  year: string;
  major: string;
  pathway: string;
  hometown: string;
  photo: string;
  linkedin: string;
  skills: string[];
};

const EMPTY_MEMBER: FamilyMember = {
  name: "",
  year: "",
  major: "",
  pathway: "",
  hometown: "",
  photo: "",
  linkedin: "",
  skills: [],
};

function skillsToText(skills: string[]): string {
  return skills.join("\n");
}

function textToSkills(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function FamilyForm({ initialMembers, initialSha }: { initialMembers: FamilyMember[]; initialSha: string }) {
  const [members, setMembers] = useState(initialMembers);
  const [sha, setSha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await saveFamily(members, sha);
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
        items={members}
        onChange={setMembers}
        createItem={() => ({ ...EMPTY_MEMBER, skills: [] })}
        addLabel="Add member"
        emptyLabel="No members yet. Add the first one below."
        renderItem={(member, _index, update) => (
          <div className="flex flex-col gap-3">
            <ImageField label={`Photo — ${member.name || "new member"}`} value={member.photo} onChange={(url) => update({ photo: url })} />
            <TextField label="Name" value={member.name} onChange={(v) => update({ name: v })} required />
            <TextField label="Class year" value={member.year} onChange={(v) => update({ year: v })} required helperText='e.g. "Class of 2027" or "Sophomore"' />
            <TextField label="Major" value={member.major} onChange={(v) => update({ major: v })} />
            <TextField label="Pathway" value={member.pathway} onChange={(v) => update({ pathway: v })} required helperText='e.g. "MD", "PA", "Dental", "Physical Therapy"' />
            <TextField label="Hometown" value={member.hometown} onChange={(v) => update({ hometown: v })} />
            <TextField label="LinkedIn" type="url" value={member.linkedin} onChange={(v) => update({ linkedin: v })} />
            <TextAreaField
              label="Skills"
              value={skillsToText(member.skills)}
              onChange={(v) => update({ skills: textToSkills(v) })}
              rows={3}
              helperText="One skill per line."
            />
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
