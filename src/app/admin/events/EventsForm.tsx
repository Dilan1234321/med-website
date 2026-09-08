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
  const [sha, setSha] = useState(initialSha);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await saveEvents(events, sha);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSha(result.sha);
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
