import candidatesFile from "../../../content/deliberation-candidates.json";
import { DeliberationApp } from "./DeliberationApp";
import type { CandidatesFile } from "./types";

export const metadata = { title: "Deliberation | Mu Epsilon Delta" };

// Hardcoded/imported for tonight per spec - no auth, no live data fetch. Swap
// in the real 26+ PNM dataset in content/deliberation-candidates.json before
// chapter, following the same schema (see types.ts).
export default function DeliberationPage() {
  const data = candidatesFile as CandidatesFile;
  return <DeliberationApp initialCandidates={data.candidates} />;
}
