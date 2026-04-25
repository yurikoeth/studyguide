import type { Achievement } from "../types/gamification.js";

export const ACHIEVEMENTS: Achievement[] = [
  // Study milestones
  {
    id: "first-question",
    name: "First Steps",
    description: "Answer your first question",
    icon: "star",
    category: "study",
    condition: { type: "cards_reviewed", count: 1 },
  },
  {
    id: "50-cards",
    name: "Getting Serious",
    description: "Review 50 cards",
    icon: "books",
    category: "study",
    condition: { type: "cards_reviewed", count: 50 },
  },
  {
    id: "100-cards",
    name: "Century Club",
    description: "Review 100 cards",
    icon: "hundred",
    category: "study",
    condition: { type: "cards_reviewed", count: 100 },
  },
  {
    id: "500-cards",
    name: "Card Shark",
    description: "Review 500 cards",
    icon: "shark",
    category: "study",
    condition: { type: "cards_reviewed", count: 500 },
  },
  {
    id: "1000-cards",
    name: "Knowledge Machine",
    description: "Review 1000 cards",
    icon: "robot",
    category: "study",
    condition: { type: "cards_reviewed", count: 1000 },
  },

  // Streak achievements
  {
    id: "streak-3",
    name: "On a Roll",
    description: "3-day study streak",
    icon: "fire",
    category: "streak",
    condition: { type: "streak_days", count: 3 },
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "7-day study streak",
    icon: "fire-double",
    category: "streak",
    condition: { type: "streak_days", count: 7 },
  },
  {
    id: "streak-14",
    name: "Fortnight Fighter",
    description: "14-day study streak",
    icon: "fire-triple",
    category: "streak",
    condition: { type: "streak_days", count: 14 },
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "30-day study streak",
    icon: "crown",
    category: "streak",
    condition: { type: "streak_days", count: 30 },
  },
  {
    id: "streak-60",
    name: "Unstoppable",
    description: "60-day study streak",
    icon: "diamond",
    category: "streak",
    condition: { type: "streak_days", count: 60 },
  },

  // Domain mastery
  {
    id: "mastery-mobile",
    name: "Mobile Devices Pro",
    description: "Get 50 questions correct in Mobile Devices",
    icon: "phone",
    category: "mastery",
    condition: { type: "domain_mastery", domainId: "1", correctCount: 50 },
  },
  {
    id: "mastery-networking",
    name: "Networking Guru",
    description: "Get 50 questions correct in Networking",
    icon: "network",
    category: "mastery",
    condition: { type: "domain_mastery", domainId: "2", correctCount: 50 },
  },
  {
    id: "mastery-hardware",
    name: "Hardware Wizard",
    description: "Get 50 questions correct in Hardware",
    icon: "cpu",
    category: "mastery",
    condition: { type: "domain_mastery", domainId: "3", correctCount: 50 },
  },
  {
    id: "mastery-cloud",
    name: "Cloud Navigator",
    description: "Get 50 questions correct in Virtualization & Cloud",
    icon: "cloud",
    category: "mastery",
    condition: { type: "domain_mastery", domainId: "4", correctCount: 50 },
  },
  {
    id: "mastery-troubleshooting",
    name: "Troubleshooter",
    description: "Get 50 questions correct in Troubleshooting",
    icon: "wrench",
    category: "mastery",
    condition: { type: "domain_mastery", domainId: "5", correctCount: 50 },
  },

  // Quiz achievements
  {
    id: "perfect-quiz",
    name: "Perfect Score",
    description: "Get 100% on a quick quiz",
    icon: "trophy",
    category: "quiz",
    condition: { type: "perfect_quiz", count: 1 },
  },
  {
    id: "perfect-quiz-5",
    name: "Quiz Master",
    description: "Get 5 perfect quizzes",
    icon: "trophy-gold",
    category: "quiz",
    condition: { type: "perfect_quiz", count: 5 },
  },

  // Level achievements
  {
    id: "level-5",
    name: "Help Desk Ready",
    description: "Reach level 5",
    icon: "badge",
    category: "study",
    condition: { type: "level_reached", level: 5 },
  },
  {
    id: "level-10",
    name: "Specialist",
    description: "Reach level 10",
    icon: "badge-silver",
    category: "study",
    condition: { type: "level_reached", level: 10 },
  },
  {
    id: "level-20",
    name: "Architect",
    description: "Reach level 20",
    icon: "badge-gold",
    category: "study",
    condition: { type: "level_reached", level: 20 },
  },
  {
    id: "level-30",
    name: "Messer Level",
    description: "Reach the maximum level",
    icon: "badge-platinum",
    category: "study",
    condition: { type: "level_reached", level: 30 },
  },

  // Course progress
  {
    id: "videos-10",
    name: "Getting Started",
    description: "Watch 10 Professor Messer videos",
    icon: "play",
    category: "course",
    condition: { type: "videos_watched", count: 10 },
  },
  {
    id: "videos-32",
    name: "Halfway There",
    description: "Watch 32 Professor Messer videos",
    icon: "play-half",
    category: "course",
    condition: { type: "videos_watched", count: 32 },
  },
  {
    id: "course-complete",
    name: "Course Complete",
    description: "Watch all 63 Professor Messer 220-1201 videos",
    icon: "graduation",
    category: "course",
    condition: { type: "course_complete" },
  },

  // XP milestones
  {
    id: "xp-1000",
    name: "First Thousand",
    description: "Earn 1,000 total XP",
    icon: "sparkle",
    category: "study",
    condition: { type: "total_xp", amount: 1000 },
  },
  {
    id: "xp-10000",
    name: "Ten Grand",
    description: "Earn 10,000 total XP",
    icon: "sparkle-double",
    category: "study",
    condition: { type: "total_xp", amount: 10000 },
  },
  {
    id: "xp-50000",
    name: "XP Legend",
    description: "Earn 50,000 total XP",
    icon: "sparkle-triple",
    category: "study",
    condition: { type: "total_xp", amount: 50000 },
  },
];

export interface AchievementCheckContext {
  totalCardsReviewed: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  videosWatched: number;
  totalVideos: number;
  perfectQuizzes: number;
  domainCorrectCounts: Record<string, number>;
}

export function checkAchievements(
  context: AchievementCheckContext,
  unlockedIds: Set<string>
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue;

    const { condition } = achievement;
    let earned = false;

    switch (condition.type) {
      case "cards_reviewed":
        earned = context.totalCardsReviewed >= condition.count;
        break;
      case "streak_days":
        earned = context.longestStreak >= condition.count;
        break;
      case "total_xp":
        earned = context.totalXP >= condition.amount;
        break;
      case "level_reached":
        earned = context.level >= condition.level;
        break;
      case "videos_watched":
        earned = context.videosWatched >= condition.count;
        break;
      case "course_complete":
        earned = context.videosWatched >= context.totalVideos;
        break;
      case "perfect_quiz":
        earned = context.perfectQuizzes >= condition.count;
        break;
      case "domain_mastery":
        earned =
          (context.domainCorrectCounts[condition.domainId] ?? 0) >=
          condition.correctCount;
        break;
    }

    if (earned) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}
