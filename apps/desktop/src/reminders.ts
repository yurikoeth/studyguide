import { invoke } from "@tauri-apps/api/core";
import type { SRSCard, UserSettings } from "@comptia-study/shared/types";
import { computePlan, toLocalDateKey, type PlanSummary } from "@comptia-study/shared/plan";
import { isDue } from "@comptia-study/shared/srs";
import { TOTAL_VIDEOS } from "@comptia-study/shared/data";
import { isTauri } from "./db/client";

/** Plan summary for right now, from settings + watched count. */
export function planFor(settings: UserSettings, watched: number, now = Date.now()): PlanSummary {
  return computePlan({
    mode: settings.planMode,
    targetDate: settings.planTargetDate,
    videosPerWeek: settings.planVideosPerWeek,
    startedAt: settings.planStartedAt,
    startWatched: settings.planStartWatched,
    totalVideos: TOTAL_VIDEOS,
    watched,
    today: toLocalDateKey(now),
  });
}

export function dueCardCount(cards: Record<string, SRSCard>, now = Date.now()): number {
  return Object.values(cards).filter((c) => isDue(c, now)).length;
}

/** The text a reminder shows. Exported so Settings can preview it. */
export function reminderBody(plan: PlanSummary, dueCards: number): string {
  const parts: string[] = [];
  if (plan.active && !plan.done) {
    parts.push(
      plan.todayGoal > 0
        ? `${plan.todayGoal} video${plan.todayGoal === 1 ? "" : "s"} to watch today`
        : "You're on pace for today",
    );
    if (plan.delta < 0) parts.push(`${-plan.delta} behind plan`);
    else if (plan.delta > 0) parts.push(`${plan.delta} ahead of plan`);
  }
  if (dueCards > 0) parts.push(`${dueCards} card${dueCards === 1 ? "" : "s"} due for review`);
  if (parts.length === 0) return "Time for a quick study session.";
  return parts.join(" · ");
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!isTauri) return false;
  const n = await import("@tauri-apps/plugin-notification");
  if (await n.isPermissionGranted()) return true;
  return (await n.requestPermission()) === "granted";
}

export async function sendReminder(body: string): Promise<void> {
  if (!(await ensureNotificationPermission())) throw new Error("Notifications are not permitted");
  const n = await import("@tauri-apps/plugin-notification");
  n.sendNotification({ title: "StudyGuide", body });
}

/** Tells the Rust side whether closing the window should hide to the tray. */
export async function syncBackgroundMode(enabled: boolean): Promise<void> {
  if (!isTauri) return;
  await invoke("set_background_mode", { enabled });
}
