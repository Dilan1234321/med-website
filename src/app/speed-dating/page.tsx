import { content } from "@/lib/content";
import { getContentFile } from "@/lib/admin/github";
import { SpeedDatingApp } from "./SpeedDatingApp";
import type { Candidate, SpeedDatingEventRecord } from "./types";
import type { SpeedDatingEvaluation } from "@/app/api/speed-dating/evaluate/route";

// Candidates/events/evaluations change during a live event, so this reads
// live from GitHub on every request (same reason the admin pages use
// getContentFile instead of the build-time content.ts import). Family stays
// on the static import — brothers' roster info doesn't change mid-event.
export const dynamic = "force-dynamic";

export default async function SpeedDatingPage() {
  const [candidatesFile, eventsFile, evaluationsFile] = await Promise.all([
    getContentFile<Candidate[]>("content/speed-dating-candidates.json"),
    getContentFile<SpeedDatingEventRecord[]>("content/speed-dating-events.json"),
    getContentFile<SpeedDatingEvaluation[]>("content/speed-dating-evaluations.json"),
  ]);

  return (
    <SpeedDatingApp
      family={content.family}
      candidates={candidatesFile.data}
      events={eventsFile.data}
      initialEvaluations={evaluationsFile.data}
    />
  );
}
