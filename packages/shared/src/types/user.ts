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
  /** Hex colour used for buttons, active tab, progress bars. */
  accentColor: string;
  /** Hex colour of the app background when no wallpaper is set; panels and text derive from it. */
  backgroundColor: string;
  /** 0-95: how much black overlay sits on the wallpaper. */
  wallpaperDim: number;
  /** 0-30: px of blur applied to the wallpaper. */
  wallpaperBlur: number;

  /** Study plan: finish by a date, keep a weekly pace, or none. */
  planMode: "off" | "date" | "pace";
  /** YYYY-MM-DD (local) for mode "date". */
  planTargetDate: string | null;
  /** Videos per week for mode "pace". */
  planVideosPerWeek: number;
  /** YYYY-MM-DD the current plan was (re)started; used to judge ahead/behind. */
  planStartedAt: string | null;
  /** Videos already watched when the plan started. */
  planStartWatched: number;

  /** Desktop reminders. */
  remindersEnabled: boolean;
  reminderMode: "daily" | "interval";
  /** "HH:MM" local time for mode "daily". */
  reminderTime: string;
  /** Hours between reminders for mode "interval". */
  reminderIntervalHours: number;
  /** Keep running in the tray when the window is closed so reminders still fire. */
  runInBackground: boolean;
  /** Epoch ms of the last reminder actually shown. */
  lastReminderAt: number | null;
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
