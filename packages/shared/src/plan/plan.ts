/**
 * Study-plan pacing math and reminder scheduling. Pure functions, no I/O.
 * Dates are "YYYY-MM-DD" strings in the user's local calendar.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local calendar date of a timestamp, as YYYY-MM-DD. */
export function toLocalDateKey(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function parseKey(key: string): number {
  // Treat the calendar date as UTC midnight so day arithmetic ignores DST.
  return Date.UTC(
    Number(key.slice(0, 4)),
    Number(key.slice(5, 7)) - 1,
    Number(key.slice(8, 10)),
  );
}

function formatUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Adds n calendar days to a YYYY-MM-DD key. */
export function addDays(key: string, n: number): string {
  return formatUtc(parseKey(key) + n * DAY_MS);
}

/** Signed number of days from `from` to `to` (positive when `to` is later). */
export function diffDays(from: string, to: string): number {
  return Math.round((parseKey(to) - parseKey(from)) / DAY_MS);
}

export interface PlanInput {
  mode: "off" | "date" | "pace";
  /** Target completion date for mode "date". */
  targetDate: string | null;
  /** Videos per week for mode "pace". */
  videosPerWeek: number;
  /** When the plan was (re)started and how many videos were watched then. */
  startedAt: string | null;
  startWatched: number;
  totalVideos: number;
  watched: number;
  today: string;
}

export interface PlanSummary {
  active: boolean;
  /** Everything is watched. */
  done: boolean;
  remaining: number;
  /** Days from today until the target; 0 or negative means overdue. Null in pace mode. */
  daysLeft: number | null;
  /** Pace needed (date mode) or chosen (pace mode). */
  videosPerDay: number;
  videosPerWeek: number;
  /** Date the course finishes at the current pace. */
  projectedFinish: string | null;
  /** Videos the plan expects to be watched by the end of today. */
  expectedByToday: number;
  /** watched minus what the plan expected by the end of yesterday. Positive is ahead, negative is behind. */
  delta: number;
  /** Videos still to watch today to be on plan by tonight. */
  todayGoal: number;
}

const INACTIVE: PlanSummary = {
  active: false,
  done: false,
  remaining: 0,
  daysLeft: null,
  videosPerDay: 0,
  videosPerWeek: 0,
  projectedFinish: null,
  expectedByToday: 0,
  delta: 0,
  todayGoal: 0,
};

export function computePlan(input: PlanInput): PlanSummary {
  const remaining = Math.max(0, input.totalVideos - input.watched);
  if (input.mode === "off") return { ...INACTIVE, remaining };
  if (remaining === 0) {
    return { ...INACTIVE, active: true, done: true, remaining: 0 };
  }

  const startedAt = input.startedAt ?? input.today;
  const startWatched = Math.min(input.startWatched, input.totalVideos);
  const elapsed = Math.max(0, diffDays(startedAt, input.today));
  // Plan-days counted inclusively: today is day `elapsed + 1` of the plan.
  const dayIndex = elapsed + 1;

  if (input.mode === "date") {
    const target = input.targetDate ?? input.today;
    const daysLeft = diffDays(input.today, target);
    // Days available including today; never below 1 so overdue plans still get a number.
    const daysAvailable = Math.max(1, daysLeft + 1);
    const videosPerDay = remaining / daysAvailable;
    const planDays = Math.max(1, diffDays(startedAt, target) + 1);
    const planVideos = Math.max(0, input.totalVideos - startWatched);
    const expectedAt = (day: number) =>
      Math.min(
        input.totalVideos,
        startWatched + Math.round((planVideos * Math.min(Math.max(0, day), planDays)) / planDays),
      );
    const expectedByToday = expectedAt(dayIndex);
    return {
      active: true,
      done: false,
      remaining,
      daysLeft,
      videosPerDay,
      videosPerWeek: videosPerDay * 7,
      projectedFinish: target,
      expectedByToday,
      delta: input.watched - expectedAt(dayIndex - 1),
      todayGoal: Math.max(0, expectedByToday - input.watched),
    };
  }

  // pace mode
  const videosPerWeek = Math.max(0.5, input.videosPerWeek);
  const videosPerDay = videosPerWeek / 7;
  const daysToFinish = Math.ceil(remaining / videosPerDay);
  const expectedAt = (day: number) =>
    Math.min(input.totalVideos, startWatched + Math.round(videosPerDay * Math.max(0, day)));
  const expectedByToday = expectedAt(dayIndex);
  return {
    active: true,
    done: false,
    remaining,
    daysLeft: null,
    videosPerDay,
    videosPerWeek,
    projectedFinish: addDays(input.today, Math.max(0, daysToFinish - 1)),
    expectedByToday,
    delta: input.watched - expectedAt(dayIndex - 1),
    todayGoal: Math.max(0, expectedByToday - input.watched),
  };
}

export interface ReminderConfig {
  mode: "daily" | "interval";
  /** "HH:MM" local time, used in daily mode. */
  time: string;
  /** Hours between reminders, used in interval mode. */
  intervalHours: number;
}

/** True when a reminder should be shown now, given when the last one was shown. */
export function isReminderDue(
  cfg: ReminderConfig,
  lastAt: number | null,
  now: number,
): boolean {
  if (cfg.mode === "interval") {
    const hours = Math.max(0.25, cfg.intervalHours);
    return lastAt === null || now - lastAt >= hours * 60 * 60 * 1000;
  }
  const [h, m] = cfg.time.split(":").map(Number);
  const d = new Date(now);
  const minutesNow = d.getHours() * 60 + d.getMinutes();
  const minutesTarget = (Number.isFinite(h) ? h : 9) * 60 + (Number.isFinite(m) ? m : 0);
  if (minutesNow < minutesTarget) return false;
  return lastAt === null || toLocalDateKey(lastAt) !== toLocalDateKey(now);
}
