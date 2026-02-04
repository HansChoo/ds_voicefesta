import { VoteStats } from '../types';
import { CANDIDATES } from '../constants';

const VOTE_KEY = 'deoksu_voice_festa_voted';
const RESULTS_KEY = 'deoksu_voice_festa_results';

// Check if current user has voted
export const hasUserVoted = (): boolean => {
  return localStorage.getItem(VOTE_KEY) === 'true';
};

// Cast a vote
export const submitVote = (candidateId: number): void => {
  // 1. Mark user as voted
  localStorage.setItem(VOTE_KEY, 'true');

  // 2. Update stats (Simulation of backend)
  const currentStats = getVoteStats();
  const updatedStats = currentStats.map(stat => {
    if (stat.candidateId === candidateId) {
      return { ...stat, count: stat.count + 1 };
    }
    return stat;
  });
  
  localStorage.setItem(RESULTS_KEY, JSON.stringify(updatedStats));
};

// Get current results
export const getVoteStats = (): VoteStats[] => {
  const stored = localStorage.getItem(RESULTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize if empty
  const initialStats = CANDIDATES.map(c => ({
    candidateId: c.id,
    count: 0
  }));
  localStorage.setItem(RESULTS_KEY, JSON.stringify(initialStats));
  return initialStats;
};

// Reset system (For admin)
export const resetSystem = (): void => {
  try {
    localStorage.removeItem(VOTE_KEY);
    localStorage.removeItem(RESULTS_KEY);
  } catch (e) {
    console.error("Reset failed", e);
  }
};