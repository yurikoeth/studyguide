import type { DifficultyLevel } from "../types/question.js";
import type { LevelThreshold } from "../types/gamification.js";

const BASE_XP = 10;
const DIFFICULTY_BONUS: Record<DifficultyLevel, number> = {
  easy: 0,
  medium: 5,
  hard: 10,
};
const MAX_STREAK_MULTIPLIER = 2.0;
const STREAK_MULTIPLIER_INCREMENT = 0.1;

export function calculateXP(
  difficulty: DifficultyLevel,
  streakDays: number,
  wasCorrect: boolean
): number {
  if (!wasCorrect) return 0;

  const base = BASE_XP + DIFFICULTY_BONUS[difficulty];
  const multiplier = getStreakMultiplier(streakDays);
  return Math.round(base * multiplier);
}

export function getStreakMultiplier(streakDays: number): number {
  return Math.min(
    MAX_STREAK_MULTIPLIER,
    1.0 + streakDays * STREAK_MULTIPLIER_INCREMENT
  );
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0, title: "Novice" },
  { level: 2, xpRequired: 100, title: "Beginner" },
  { level: 3, xpRequired: 250, title: "Apprentice" },
  { level: 4, xpRequired: 500, title: "Help Desk" },
  { level: 5, xpRequired: 850, title: "Help Desk II" },
  { level: 6, xpRequired: 1300, title: "Technician" },
  { level: 7, xpRequired: 1900, title: "Technician II" },
  { level: 8, xpRequired: 2600, title: "Technician III" },
  { level: 9, xpRequired: 3500, title: "Specialist" },
  { level: 10, xpRequired: 4600, title: "Specialist II" },
  { level: 11, xpRequired: 5900, title: "Specialist III" },
  { level: 12, xpRequired: 7500, title: "Senior Tech" },
  { level: 13, xpRequired: 9400, title: "Senior Tech II" },
  { level: 14, xpRequired: 11700, title: "Expert" },
  { level: 15, xpRequired: 14500, title: "Expert II" },
  { level: 16, xpRequired: 17800, title: "Expert III" },
  { level: 17, xpRequired: 21700, title: "Lead Engineer" },
  { level: 18, xpRequired: 26300, title: "Lead Engineer II" },
  { level: 19, xpRequired: 31700, title: "Architect" },
  { level: 20, xpRequired: 38000, title: "Architect II" },
  { level: 21, xpRequired: 45200, title: "Principal" },
  { level: 22, xpRequired: 53500, title: "Principal II" },
  { level: 23, xpRequired: 63000, title: "Distinguished" },
  { level: 24, xpRequired: 74000, title: "Distinguished II" },
  { level: 25, xpRequired: 86500, title: "A+ Master" },
  { level: 26, xpRequired: 100000, title: "A+ Master II" },
  { level: 27, xpRequired: 120000, title: "A+ Legend" },
  { level: 28, xpRequired: 145000, title: "A+ Legend II" },
  { level: 29, xpRequired: 175000, title: "Professor" },
  { level: 30, xpRequired: 210000, title: "Messer-Level" },
];

export function getLevelForXP(totalXP: number): LevelThreshold {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].xpRequired) {
      return LEVEL_THRESHOLDS[i];
    }
  }
  return LEVEL_THRESHOLDS[0];
}

export function getXPToNextLevel(totalXP: number): {
  current: LevelThreshold;
  next: LevelThreshold | null;
  progress: number;
} {
  const current = getLevelForXP(totalXP);
  const nextIndex = LEVEL_THRESHOLDS.findIndex(
    (l) => l.level === current.level + 1
  );
  const next = nextIndex >= 0 ? LEVEL_THRESHOLDS[nextIndex] : null;

  if (!next) return { current, next: null, progress: 1 };

  const progressXP = totalXP - current.xpRequired;
  const neededXP = next.xpRequired - current.xpRequired;
  return { current, next, progress: progressXP / neededXP };
}
