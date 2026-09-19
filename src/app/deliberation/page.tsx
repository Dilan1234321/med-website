import candidatesFile from "../../../content/deliberation-candidates.json";
import { SwipeApp } from "./SwipeApp";
import type { CandidatesFile } from "./types";

export const metadata = { title: "Final Decisions | Mu Epsilon Delta" };

export default function DeliberationPage() {
  const data = candidatesFile as CandidatesFile;
  return <SwipeApp initialCandidates={data.candidates} />;
}
