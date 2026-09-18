export type DecisionStatus = "unreviewed" | "advance" | "discuss" | "hold" | "release";

export type ConsensusPoint = {
  text: string;
  sourceCount: number;
  brothers: string[];
};

export type MixedObservation = {
  brother: string;
  text: string;
};

export type MixedFeedbackItem = {
  topic: string;
  observations: MixedObservation[];
};

export type RawNote = {
  brother: string;
  text: string;
};

export type Candidate = {
  id: string;
  name: string;
  photo: string;
  year: string;
  major: string;
  careerPath: string;
  sourceCount: number;
  strengths: ConsensusPoint[];
  concerns: ConsensusPoint[];
  mixedFeedback: MixedFeedbackItem[];
  facts: string[];
  notes: RawNote[];
  status: DecisionStatus;
};

export type CandidatesFile = {
  candidates: Candidate[];
};
