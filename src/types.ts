export interface Candidate {
  id: string;
  number: string;
  name: string;
  partnerName?: string; // For pairs
  class: string;
  image: string;
  vision?: string;
  missions?: string[];
  votes?: number;
  percentage?: number;
}

export enum VotingStep {
  OPPN_PUTRA = 0,
  OPPN_PUTRI = 1,
  GUDEP = 2,
}

export type UserRole = 'PUTRA' | 'PUTRI' | 'GURU';

export interface VoteState {
  [VotingStep.OPPN_PUTRA]: string | null; // Candidate ID
  [VotingStep.OPPN_PUTRI]: string | null;
  [VotingStep.GUDEP]: string | null;
}
