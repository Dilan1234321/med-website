export type Candidate = {
  id: number;
  name: string;
  major: string;
  graduationYear: string;
  photo: string;
  instagram: string;
  referralSource: string;
  active: boolean;
};

export type SpeedDatingEventRecord = {
  id: number;
  name: string;
  active: boolean;
};

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
