function toDateString(timestamp: number): string {
  return new Date(timestamp).toISOString().split("T")[0];
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + "T00:00:00Z").getTime();
  const b = new Date(dateB + "T00:00:00Z").getTime();
  return Math.round(Math.abs(b - a) / (24 * 60 * 60 * 1000));
}

export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  lastStudyDate: string | null,
  now: number
): { streak: number; longestStreak: number; lastStudyDate: string } {
  const today = toDateString(now);

  if (lastStudyDate === today) {
    // Already studied today — no change
    return { streak: currentStreak, longestStreak, lastStudyDate: today };
  }

  if (lastStudyDate && daysBetween(lastStudyDate, today) === 1) {
    // Consecutive day — extend streak
    const newStreak = currentStreak + 1;
    return {
      streak: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      lastStudyDate: today,
    };
  }

  // First day or streak broken — start fresh
  return {
    streak: 1,
    longestStreak: Math.max(longestStreak, 1),
    lastStudyDate: today,
  };
}

export function isStreakActive(
  lastStudyDate: string | null,
  now: number
): boolean {
  if (!lastStudyDate) return false;
  const today = toDateString(now);
  const gap = daysBetween(lastStudyDate, today);
  return gap <= 1;
}
