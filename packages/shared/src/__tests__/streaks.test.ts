import { describe, it, expect } from "vitest";
import { updateStreak, isStreakActive } from "../gamification/streaks.js";

describe("Streak System", () => {
  // 2024-01-15 12:00:00 UTC
  const DAY1 = new Date("2024-01-15T12:00:00Z").getTime();
  const DAY2 = new Date("2024-01-16T12:00:00Z").getTime();
  const DAY3 = new Date("2024-01-17T12:00:00Z").getTime();
  const DAY5 = new Date("2024-01-19T12:00:00Z").getTime();

  it("starts streak at 1 for first study day", () => {
    const result = updateStreak(0, 0, null, DAY1);
    expect(result.streak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.lastStudyDate).toBe("2024-01-15");
  });

  it("extends streak for consecutive days", () => {
    const result = updateStreak(1, 1, "2024-01-15", DAY2);
    expect(result.streak).toBe(2);
    expect(result.longestStreak).toBe(2);
  });

  it("does not double-count same day", () => {
    const laterDay1 = new Date("2024-01-15T18:00:00Z").getTime();
    const result = updateStreak(1, 1, "2024-01-15", laterDay1);
    expect(result.streak).toBe(1);
  });

  it("resets streak when day is skipped", () => {
    const result = updateStreak(2, 2, "2024-01-15", DAY3);
    // Skipped Jan 16 -> reset
    expect(result.streak).toBe(1);
    expect(result.longestStreak).toBe(2); // longest preserved
  });

  it("preserves longest streak", () => {
    const result = updateStreak(1, 5, "2024-01-15", DAY5);
    expect(result.streak).toBe(1);
    expect(result.longestStreak).toBe(5);
  });

  it("updates longest streak when current exceeds it", () => {
    const result = updateStreak(5, 5, "2024-01-15", DAY2);
    expect(result.streak).toBe(6);
    expect(result.longestStreak).toBe(6);
  });
});

describe("isStreakActive", () => {
  const TODAY = new Date("2024-01-15T12:00:00Z").getTime();

  it("returns false with no study date", () => {
    expect(isStreakActive(null, TODAY)).toBe(false);
  });

  it("returns true if studied today", () => {
    expect(isStreakActive("2024-01-15", TODAY)).toBe(true);
  });

  it("returns true if studied yesterday", () => {
    expect(isStreakActive("2024-01-14", TODAY)).toBe(true);
  });

  it("returns false if last study was 2+ days ago", () => {
    expect(isStreakActive("2024-01-13", TODAY)).toBe(false);
  });
});
