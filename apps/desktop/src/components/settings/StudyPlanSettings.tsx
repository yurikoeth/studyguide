import { useState } from "react";
import type { UserSettings } from "@comptia-study/shared/types";
import { addDays, toLocalDateKey } from "@comptia-study/shared/plan";
import { TOTAL_VIDEOS } from "@comptia-study/shared/data";
import { useUserStore } from "../../stores/user-store";
import { useStudyStore } from "../../stores/study-store";
import { dueCardCount, planFor, reminderBody, sendReminder } from "../../reminders";

const field =
  "mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-indigo-500";

function prettyDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StudyPlanSettings() {
  const settings = useUserStore((s) => s.settings);
  const updateSettings = useUserStore((s) => s.updateSettings);
  const watched = useStudyStore((s) => s.watchedVideos.length);
  const srsCards = useStudyStore((s) => s.srsCards);
  const [testState, setTestState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [testError, setTestError] = useState<string | null>(null);

  const today = toLocalDateKey(Date.now());
  const plan = planFor(settings, watched);
  const due = dueCardCount(srsCards);

  /** Any change to the plan's shape restarts the plan clock from today. */
  function setPlan(partial: Partial<UserSettings>) {
    updateSettings({
      ...partial,
      planStartedAt: today,
      planStartWatched: watched,
    });
  }

  function chooseMode(mode: UserSettings["planMode"]) {
    const extra: Partial<UserSettings> = {};
    if (mode === "date" && !settings.planTargetDate) extra.planTargetDate = addDays(today, 30);
    setPlan({ planMode: mode, ...extra });
  }

  async function sendTest() {
    setTestState("sending");
    setTestError(null);
    try {
      await sendReminder(reminderBody(plan, due));
      setTestState("sent");
    } catch (err) {
      setTestState("failed");
      setTestError(err instanceof Error ? err.message : String(err));
    }
  }

  const remaining = TOTAL_VIDEOS - watched;

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-5">
      <h3 className="text-lg font-semibold">Study Plan</h3>

      {/* Mode */}
      <div className="flex gap-2">
        {(
          [
            ["off", "No plan"],
            ["date", "Finish by a date"],
            ["pace", "Videos per week"],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => chooseMode(mode)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              settings.planMode === mode
                ? "bg-indigo-600 text-accent-fg border-indigo-600"
                : "border-white/20 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {settings.planMode === "date" && (
        <label className="block">
          <span className="text-sm text-slate-300">Target date</span>
          <input
            type="date"
            min={today}
            value={settings.planTargetDate ?? ""}
            onChange={(e) => e.target.value && setPlan({ planTargetDate: e.target.value })}
            className={field}
          />
        </label>
      )}

      {settings.planMode === "pace" && (
        <label className="block">
          <span className="text-sm text-slate-300">Videos per week</span>
          <input
            type="number"
            min={1}
            max={62}
            value={settings.planVideosPerWeek}
            onChange={(e) =>
              setPlan({ planVideosPerWeek: Math.max(1, Math.min(62, Number(e.target.value) || 1)) })
            }
            className={field}
          />
        </label>
      )}

      {/* The math */}
      {plan.active && !plan.done && (
        <div className="rounded-lg border border-white/10 bg-slate-900 p-4 text-sm space-y-1.5">
          <Row label="Videos left" value={`${remaining} of ${TOTAL_VIDEOS}`} />
          {settings.planMode === "date" ? (
            <>
              <Row
                label="Days until target"
                value={plan.daysLeft !== null && plan.daysLeft < 0 ? `overdue by ${-plan.daysLeft}` : `${plan.daysLeft}`}
              />
              <Row label="Needed pace" value={`${plan.videosPerDay.toFixed(2)} / day · ${plan.videosPerWeek.toFixed(1)} / week`} />
            </>
          ) : (
            <>
              <Row label="Pace" value={`${plan.videosPerDay.toFixed(2)} / day`} />
              <Row label="Projected finish" value={plan.projectedFinish ? prettyDate(plan.projectedFinish) : "—"} />
            </>
          )}
          <Row label="Expected by tonight" value={`${plan.expectedByToday} watched`} />
          <Row
            label="Status"
            value={plan.delta === 0 ? "on track" : plan.delta > 0 ? `${plan.delta} ahead` : `${-plan.delta} behind`}
            accent={plan.delta < 0 ? "text-red-400" : "text-indigo-400"}
          />
          <Row label="Today" value={`watch ${plan.todayGoal} · review ${due} cards`} />
        </div>
      )}
      {plan.active && plan.done && (
        <p className="text-sm text-indigo-400">Course complete. Nothing left to schedule.</p>
      )}

      {/* Reminders */}
      <div className="pt-2 border-t border-white/10 space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <span className="text-sm text-slate-300">Desktop reminders</span>
            <p className="text-xs text-slate-500">Windows notifications with today's goal and cards due.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.remindersEnabled}
            onChange={(e) => updateSettings({ remindersEnabled: e.target.checked, lastReminderAt: null })}
            className="w-4 h-4"
          />
        </label>

        {settings.remindersEnabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-slate-300">Schedule</span>
                <select
                  value={settings.reminderMode}
                  onChange={(e) =>
                    updateSettings({
                      reminderMode: e.target.value as UserSettings["reminderMode"],
                      lastReminderAt: null,
                    })
                  }
                  className={field}
                >
                  <option value="daily">Once a day at a set time</option>
                  <option value="interval">Every few hours</option>
                </select>
              </label>
              {settings.reminderMode === "daily" ? (
                <label className="block">
                  <span className="text-sm text-slate-300">Time</span>
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => e.target.value && updateSettings({ reminderTime: e.target.value, lastReminderAt: null })}
                    className={field}
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="text-sm text-slate-300">Every (hours)</span>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={settings.reminderIntervalHours}
                    onChange={(e) =>
                      updateSettings({
                        reminderIntervalHours: Math.max(1, Math.min(24, Number(e.target.value) || 1)),
                      })
                    }
                    className={field}
                  />
                </label>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.runInBackground}
                onChange={(e) => updateSettings({ runInBackground: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-300">Keep running in the tray when the window is closed</span>
            </label>
            <p className="text-xs text-slate-500">
              Reminders only fire while StudyGuide is running. With this on, closing the window hides it to the
              system tray; use the tray icon to reopen or quit.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={sendTest}
                disabled={testState === "sending"}
                className="px-3 py-1.5 text-sm border border-white/20 rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                {testState === "sending" ? "Sending…" : "Send test notification"}
              </button>
              {testState === "sent" && <span className="text-xs text-indigo-400">Sent</span>}
              {testState === "failed" && <span className="text-xs text-red-400">{testError}</span>}
            </div>
            <p className="text-xs text-slate-500">Preview: “{reminderBody(plan, due)}”</p>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className={`font-medium ${accent ?? ""}`}>{value}</span>
    </div>
  );
}
