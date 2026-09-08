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
  const [sha, setSha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await saveLeadership(members, sha);
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
        createItem={() => ({ ...EMPTY_MEMBER })}
        addLabel="Add exec board member"
        emptyLabel="No exec board members yet. Add the first one below."
        renderItem={(member, _index, update) => (
          <div className="flex flex-col gap-3">
            <ImageField label={`Photo — ${member.name || "new member"}`} value={member.photo} onChange={(url) => update({ photo: url })} />
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
