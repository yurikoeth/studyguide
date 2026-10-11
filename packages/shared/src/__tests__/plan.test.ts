import { describe, it, expect } from "vitest";
import {
  addDays,
  computePlan,
  diffDays,
  isReminderDue,
  toLocalDateKey,
} from "../plan/plan.js";

describe("date helpers", () => {
  it("adds and diffs calendar days", () => {
    expect(addDays("2026-01-30", 3)).toBe("2026-02-02");
    expect(diffDays("2026-01-01", "2026-01-31")).toBe(30);
    expect(diffDays("2026-01-31", "2026-01-01")).toBe(-30);
  });

  it("formats local date keys", () => {
    const ts = new Date(2026, 2, 5, 23, 30).getTime(); // local
    expect(toLocalDateKey(ts)).toBe("2026-03-05");
  });
});

describe("computePlan - date mode", () => {
  const base = {
    mode: "date" as const,
    targetDate: "2026-01-21",
    videosPerWeek: 0,
    startedAt: "2026-01-01",
    startWatched: 2,
    totalVideos: 62,
    watched: 2,
    today: "2026-01-01",
  };

  it("spreads remaining videos over the days available", () => {
    const p = computePlan(base);
    expect(p.active).toBe(true);
    expect(p.remaining).toBe(60);
    expect(p.daysLeft).toBe(20);
    // 60 videos over 21 inclusive days
    expect(p.videosPerDay).toBeCloseTo(60 / 21, 5);
    expect(p.projectedFinish).toBe("2026-01-21");
  });

  it("expects roughly linear progress and reports behind/ahead", () => {
    const midway = computePlan({ ...base, today: "2026-01-11", watched: 20 });
    // day 11 of 21: expected by tonight 2 + round(60 * 11/21) = 33,
    // by end of yesterday 2 + round(60 * 10/21) = 31
    expect(midway.expectedByToday).toBe(33);
    expect(midway.delta).toBe(-11);
    expect(midway.todayGoal).toBe(13);

    const ahead = computePlan({ ...base, today: "2026-01-11", watched: 40 });
    expect(ahead.delta).toBe(9);
    expect(ahead.todayGoal).toBe(0);
  });

  it("still yields a pace when the target is overdue", () => {
    const p = computePlan({ ...base, today: "2026-01-25", watched: 30 });
    expect(p.daysLeft).toBe(-4);
    expect(p.videosPerDay).toBe(32);
    expect(p.expectedByToday).toBe(62);
  });

  it("is done when everything is watched", () => {
    const p = computePlan({ ...base, watched: 62 });
    expect(p.done).toBe(true);
    expect(p.remaining).toBe(0);
  });
});

describe("computePlan - pace mode", () => {
  const base = {
    mode: "pace" as const,
    targetDate: null,
    videosPerWeek: 7,
    startedAt: "2026-03-01",
    startWatched: 0,
    totalVideos: 62,
    watched: 0,
    today: "2026-03-01",
  };

  it("projects the finish date from the weekly pace", () => {
    const p = computePlan(base);
    expect(p.videosPerDay).toBe(1);
    expect(p.daysLeft).toBeNull();
    // 62 videos at 1/day, counting today: finishes 61 days later
    expect(p.projectedFinish).toBe(addDays("2026-03-01", 61));
    expect(p.todayGoal).toBe(1);
    // nothing was expected before the plan started
    expect(p.delta).toBe(0);
  });

  it("tracks expected progress from the plan start", () => {
    const p = computePlan({ ...base, today: "2026-03-10", watched: 5 });
    expect(p.expectedByToday).toBe(10);
    // 9 expected by end of yesterday
    expect(p.delta).toBe(-4);
  });

  it("is inactive when mode is off", () => {
    const p = computePlan({ ...base, mode: "off" });
    expect(p.active).toBe(false);
    expect(p.remaining).toBe(62);
  });
});

describe("isReminderDue", () => {
  const at = (h: number, m = 0, day = 10) => new Date(2026, 4, day, h, m).getTime();

  it("interval mode fires after the interval elapses", () => {
    const cfg = { mode: "interval" as const, time: "09:00", intervalHours: 2 };
    expect(isReminderDue(cfg, null, at(12))).toBe(true);
    expect(isReminderDue(cfg, at(11), at(12))).toBe(false);
    expect(isReminderDue(cfg, at(10), at(12))).toBe(true);
  });

  it("daily mode fires once per day after the set time", () => {
    const cfg = { mode: "daily" as const, time: "09:30", intervalHours: 0 };
    expect(isReminderDue(cfg, null, at(9, 0))).toBe(false);
    expect(isReminderDue(cfg, null, at(9, 30))).toBe(true);
    expect(isReminderDue(cfg, at(9, 31), at(15))).toBe(false);
    expect(isReminderDue(cfg, at(9, 31, 9), at(9, 30))).toBe(true);
  });
});
