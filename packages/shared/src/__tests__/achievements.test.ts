import { describe, it, expect } from "vitest";
import {
  checkAchievements,
  type AchievementCheckContext,
} from "../gamification/achievements.js";

function makeContext(
  overrides: Partial<AchievementCheckContext> = {}
): AchievementCheckContext {
  return {
    totalCardsReviewed: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0,
    level: 1,
    videosWatched: 0,
    totalVideos: 62,
    perfectQuizzes: 0,
    domainCorrectCounts: {},
    ...overrides,
  };
}

describe("Achievement System", () => {
  it("unlocks 'First Steps' after 1 card reviewed", () => {
    const context = makeContext({ totalCardsReviewed: 1 });
    const unlocked = checkAchievements(context, new Set());
    expect(unlocked.some((a) => a.id === "first-question")).toBe(true);
  });

  it("does not re-unlock already unlocked achievements", () => {
    const context = makeContext({ totalCardsReviewed: 100 });
    const alreadyUnlocked = new Set(["first-question", "50-cards"]);
    const unlocked = checkAchievements(context, alreadyUnlocked);
    expect(unlocked.some((a) => a.id === "first-question")).toBe(false);
    expect(unlocked.some((a) => a.id === "50-cards")).toBe(false);
    expect(unlocked.some((a) => a.id === "100-cards")).toBe(true);
  });

  it("unlocks streak achievements based on longest streak", () => {
    const context = makeContext({ longestStreak: 7 });
    const unlocked = checkAchievements(context, new Set());
    const ids = unlocked.map((a) => a.id);
    expect(ids).toContain("streak-3");
    expect(ids).toContain("streak-7");
    expect(ids).not.toContain("streak-14");
  });

  it("unlocks domain mastery", () => {
    const context = makeContext({
      domainCorrectCounts: { "2": 55 },
    });
    const unlocked = checkAchievements(context, new Set());
    expect(unlocked.some((a) => a.id === "mastery-networking")).toBe(true);
    expect(unlocked.some((a) => a.id === "mastery-hardware")).toBe(false);
  });

  it("unlocks course complete when all videos watched", () => {
    const context = makeContext({ videosWatched: 62, totalVideos: 62 });
    const unlocked = checkAchievements(context, new Set());
    expect(unlocked.some((a) => a.id === "course-complete")).toBe(true);
  });

  it("unlocks level achievements", () => {
    const context = makeContext({ level: 10 });
    const unlocked = checkAchievements(context, new Set());
    const ids = unlocked.map((a) => a.id);
    expect(ids).toContain("level-5");
    expect(ids).toContain("level-10");
    expect(ids).not.toContain("level-20");
  });

  it("returns empty array when no achievements earned", () => {
    const context = makeContext();
    const unlocked = checkAchievements(context, new Set());
    expect(unlocked).toHaveLength(0);
  });
});
