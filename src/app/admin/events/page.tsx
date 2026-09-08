import { AdminShell } from "@/components/admin/AdminShell";
import { getContentFile } from "@/lib/admin/github";
import { EventsForm, type EventsContent } from "./EventsForm";

export const dynamic = "force-dynamic";

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
