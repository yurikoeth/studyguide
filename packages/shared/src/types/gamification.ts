export interface XPEvent {
  amount: number;
  reason: string;
  multiplier: number;
  timestamp: number;
}

export interface LevelThreshold {
  level: number;
  xpRequired: number;
  title: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "study" | "streak" | "mastery" | "quiz" | "course";
  condition: AchievementCondition;
}

export type AchievementCondition =
  | { type: "cards_reviewed"; count: number }
  | { type: "domain_mastery"; domainId: string; correctCount: number }
  | { type: "streak_days"; count: number }
  | { type: "perfect_quiz"; count: number }
  | { type: "level_reached"; level: number }
  | { type: "total_xp"; amount: number }
  | { type: "videos_watched"; count: number }
  | { type: "course_complete" };
