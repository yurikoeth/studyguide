import type { ExamCode } from "./course.js";

export interface UserProfile {
  id: string;
  displayName: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  settings: UserSettings;
  createdAt: number;
}

export interface UserSettings {
  apiKey: string;
  dailyGoal: number;
  newCardsPerDay: number;
  preferredExam: ExamCode | "both";
  theme: "light" | "dark" | "system";
}

export interface UserStats {
  totalXP: number;
  level: number;
  totalCardsReviewed: number;
  totalCorrect: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

export interface DailyActivity {
  date: string;
  cardsReviewed: number;
  correctCount: number;
  xpEarned: number;
  timeSpentMs: number;
}
