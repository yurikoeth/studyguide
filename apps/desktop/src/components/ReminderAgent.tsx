import { useEffect } from "react";
import { isReminderDue } from "@comptia-study/shared/plan";
import { useUserStore } from "../stores/user-store";
import { useStudyStore } from "../stores/study-store";
import { dueCardCount, planFor, reminderBody, sendReminder, syncBackgroundMode } from "../reminders";

const TICK_MS = 60_000;

/** Fires desktop reminders on the configured schedule while the app runs. Mount once. */
export function ReminderAgent() {
  const remindersEnabled = useUserStore((s) => s.settings.remindersEnabled);
  const runInBackground = useUserStore((s) => s.settings.runInBackground);

  useEffect(() => {
    syncBackgroundMode(remindersEnabled && runInBackground).catch((err) =>
      console.error("[reminders] background mode sync failed", err),
    );
  }, [remindersEnabled, runInBackground]);

  useEffect(() => {
    if (!remindersEnabled) return;
    let busy = false;

    const tick = async () => {
      if (busy) return;
      const { settings, updateSettings } = useUserStore.getState();
      if (!settings.remindersEnabled) return;
      const now = Date.now();
      const due = isReminderDue(
        {
          mode: settings.reminderMode,
          time: settings.reminderTime,
          intervalHours: settings.reminderIntervalHours,
        },
        settings.lastReminderAt,
        now,
      );
      if (!due) return;
      busy = true;
      try {
        const study = useStudyStore.getState();
        const plan = planFor(settings, study.watchedVideos.length, now);
        await sendReminder(reminderBody(plan, dueCardCount(study.srsCards, now)));
        updateSettings({ lastReminderAt: now });
      } catch (err) {
        console.error("[reminders] send failed", err);
        // Back off so a broken permission does not retry every minute.
        updateSettings({ lastReminderAt: now });
      } finally {
        busy = false;
      }
    };

    void tick();
    const id = window.setInterval(() => void tick(), TICK_MS);
    return () => window.clearInterval(id);
  }, [remindersEnabled]);

  return null;
}
