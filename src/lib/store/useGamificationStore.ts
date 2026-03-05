import { create } from 'zustand';

interface GamificationState {
  comboScore: number;
  maxScore: number;
  addScore: (points: number) => void;
  resetScore: () => void;
  hasUnlockedGoldenState: boolean;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  comboScore: 0,
  maxScore: 100,
  hasUnlockedGoldenState: false,
  
  addScore: (points) => set((state) => {
    const newScore = Math.min(state.comboScore + points, state.maxScore);
    return {
      comboScore: newScore,
      hasUnlockedGoldenState: newScore >= state.maxScore,
    };
  }),

  resetScore: () => set({ comboScore: 0, hasUnlockedGoldenState: false }),
}));
