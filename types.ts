export interface Candidate {
  id: number;
  name: string;
  graduationYear: number; // 기수 (e.g., 50기)
  songTitle: string;
  singer: string;
  imageUrl: string;
}

export interface VoteStats {
  candidateId: number;
  count: number;
}

export type ViewState = 'VOTING' | 'CONFIRM' | 'SUCCESS' | 'ADMIN';