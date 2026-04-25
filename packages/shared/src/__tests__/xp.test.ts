import { describe, it, expect } from "vitest";
import {
  calculateXP,
  getStreakMultiplier,
  getLevelForXP,
  getXPToNextLevel,
} from "../gamification/xp.js";

describe("XP System", () => {
  it("returns 0 XP for incorrect answers", () => {
    expect(calculateXP("medium", 5, false)).toBe(0);
  });

  it("calculates base XP for easy correct answer with no streak", () => {
    expect(calculateXP("easy", 0, true)).toBe(10);
  });

  it("adds difficulty bonus", () => {
    expect(calculateXP("medium", 0, true)).toBe(15);
    expect(calculateXP("hard", 0, true)).toBe(20);
  });

  it("applies streak multiplier", () => {
    // 5-day streak = 1.5x multiplier
    expect(calculateXP("easy", 5, true)).toBe(15); // 10 * 1.5 = 15
  });

  it("caps streak multiplier at 2x", () => {
    expect(getStreakMultiplier(100)).toBe(2.0);
    // With 2x: easy = 10 * 2 = 20
    expect(calculateXP("easy", 100, true)).toBe(20);
  });
});

describe("Level System", () => {
  it("starts at level 1 Novice", () => {
    const level = getLevelForXP(0);
    expect(level.level).toBe(1);
    expect(level.title).toBe("Novice");
  });

  it("levels up at threshold", () => {
    const level = getLevelForXP(100);
    expect(level.level).toBe(2);
    expect(level.title).toBe("Beginner");
  });

  it("handles XP between levels", () => {
    const level = getLevelForXP(150);
    expect(level.level).toBe(2); // need 250 for level 3
  });

  it("reaches max level", () => {
    const level = getLevelForXP(999999);
    expect(level.level).toBe(30);
    expect(level.title).toBe("Messer-Level");
  });

  it("calculates progress to next level", () => {
    const { current, next, progress } = getXPToNextLevel(50);
    expect(current.level).toBe(1);
    expect(next?.level).toBe(2);
    expect(progress).toBe(0.5); // 50/100
  });

  it("shows full progress at max level", () => {
    const { next, progress } = getXPToNextLevel(999999);
    expect(next).toBeNull();
    expect(progress).toBe(1);
  });
});
