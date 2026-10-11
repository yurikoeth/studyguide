import { create } from "zustand";
import type { UserSettings, Achievement } from "@comptia-study/shared/types";
import {
  getLevelForXP,
  updateStreak,
  checkAchievements,
} from "@comptia-study/shared/gamification";
import { TOTAL_VIDEOS } from "@comptia-study/shared/data";
import { DEFAULT_SETTINGS } from "../theme";

interface UserState {
  displayName: string;
  totalXP: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalCardsReviewed: number;
  totalCorrect: number;
  perfectQuizzes: number;
  videosWatched: number;
  domainCorrectCounts: Record<string, number>;
  settings: UserSettings;
  unlockedAchievements: string[];
  pendingAchievementToasts: Achievement[];

  addXP: (amount: number) => void;
  recordAnswer: (domainId: string, wasCorrect: boolean) => void;
  recordStudyDay: () => void;
  markVideoWatched: () => void;
  recordPerfectQuiz: () => void;
  dismissAchievementToast: (id: string) => void;
  backfillAchievements: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

function getNewAchievements(state: UserState): Achievement[] {
  return checkAchievements(
    {
      totalCardsReviewed: state.totalCardsReviewed,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      totalXP: state.totalXP,
      level: state.level,
      videosWatched: state.videosWatched,
      totalVideos: TOTAL_VIDEOS,
      perfectQuizzes: state.perfectQuizzes,
      domainCorrectCounts: state.domainCorrectCounts,
    },
    new Set(state.unlockedAchievements),
  );
}

function withAchievementCheck(
  state: UserState,
  partial: Partial<UserState>,
): Partial<UserState> {
  const next = { ...state, ...partial } as UserState;
  const earned = getNewAchievements(next);
  if (earned.length === 0) return partial;
  return {
    ...partial,
    unlockedAchievements: [
      ...state.unlockedAchievements,
      ...earned.map((a) => a.id),
    ],
    pendingAchievementToasts: [
      ...state.pendingAchievementToasts,
      ...earned,
    ],
  };
}

export const useUserStore = create<UserState>()((set) => ({
  displayName: "Student",
  totalXP: 0,
  level: 1,
  levelTitle: "Novice",
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalCardsReviewed: 0,
  totalCorrect: 0,
  perfectQuizzes: 0,
  videosWatched: 0,
  domainCorrectCounts: {},
  settings: { ...DEFAULT_SETTINGS },
  unlockedAchievements: [],
  pendingAchievementToasts: [],

  addXP: (amount) =>
    set((state) => {
      const newXP = state.totalXP + amount;
      const levelInfo = getLevelForXP(newXP);
      return withAchievementCheck(state, {
        totalXP: newXP,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
      });
    }),

  recordAnswer: (domainId, wasCorrect) =>
    set((state) =>
      withAchievementCheck(state, {
        totalCardsReviewed: state.totalCardsReviewed + 1,
        totalCorrect: state.totalCorrect + (wasCorrect ? 1 : 0),
        domainCorrectCounts: wasCorrect
          ? {
              ...state.domainCorrectCounts,
              [domainId]:
                (state.domainCorrectCounts[domainId] ?? 0) + 1,
            }
          : state.domainCorrectCounts,
      }),
    ),

  recordStudyDay: () =>
    set((state) => {
      const result = updateStreak(
        state.currentStreak,
        state.longestStreak,
        state.lastStudyDate,
        Date.now(),
      );
      return withAchievementCheck(state, {
        currentStreak: result.streak,
        longestStreak: result.longestStreak,
        lastStudyDate: result.lastStudyDate,
      });
    }),

  markVideoWatched: () =>
    set((state) =>
      withAchievementCheck(state, {
        videosWatched: state.videosWatched + 1,
      }),
    ),

  recordPerfectQuiz: () =>
    set((state) =>
      withAchievementCheck(state, {
        perfectQuizzes: state.perfectQuizzes + 1,
      }),
    ),

  dismissAchievementToast: (id) =>
    set((state) => ({
      pendingAchievementToasts: state.pendingAchievementToasts.filter(
        (a) => a.id !== id,
      ),
    })),

  backfillAchievements: () =>
    set((state) => {
      const earned = getNewAchievements(state);
      if (earned.length === 0) return state;
      return {
        unlockedAchievements: [
          ...state.unlockedAchievements,
          ...earned.map((a) => a.id),
        ],
      };
    }),

  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),
}));
