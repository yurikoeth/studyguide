import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@comptia-study/shared/types";
import { getLevelForXP } from "@comptia-study/shared/gamification";
import { updateStreak } from "@comptia-study/shared/gamification";

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

  addXP: (amount: number) => void;
  recordAnswer: (domainId: string, wasCorrect: boolean) => void;
  recordStudyDay: () => void;
  markVideoWatched: () => void;
  recordPerfectQuiz: () => void;
  unlockAchievement: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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
      settings: {
        apiKey: "",
        dailyGoal: 20,
        newCardsPerDay: 10,
        preferredExam: "both",
        theme: "dark",
      },
      unlockedAchievements: [],

      addXP: (amount) =>
        set((state) => {
          const newXP = state.totalXP + amount;
          const levelInfo = getLevelForXP(newXP);
          return {
            totalXP: newXP,
            level: levelInfo.level,
            levelTitle: levelInfo.title,
          };
        }),

      recordAnswer: (domainId, wasCorrect) =>
        set((state) => ({
          totalCardsReviewed: state.totalCardsReviewed + 1,
          totalCorrect: state.totalCorrect + (wasCorrect ? 1 : 0),
          domainCorrectCounts: wasCorrect
            ? {
                ...state.domainCorrectCounts,
                [domainId]:
                  (state.domainCorrectCounts[domainId] ?? 0) + 1,
              }
            : state.domainCorrectCounts,
        })),

      recordStudyDay: () =>
        set((state) => {
          const result = updateStreak(
            state.currentStreak,
            state.longestStreak,
            state.lastStudyDate,
            Date.now()
          );
          return {
            currentStreak: result.streak,
            longestStreak: result.longestStreak,
            lastStudyDate: result.lastStudyDate,
          };
        }),

      markVideoWatched: () =>
        set((state) => ({ videosWatched: state.videosWatched + 1 })),

      recordPerfectQuiz: () =>
        set((state) => ({ perfectQuizzes: state.perfectQuizzes + 1 })),

      unlockAchievement: (id) =>
        set((state) => ({
          unlockedAchievements: state.unlockedAchievements.includes(id)
            ? state.unlockedAchievements
            : [...state.unlockedAchievements, id],
        })),

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
    }),
    { name: "comptia-user" }
  )
);
