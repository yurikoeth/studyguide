import { useUserStore } from "../../stores/user-store";
import { useStudyStore } from "../../stores/study-store";
import { dueCardCount, planFor } from "../../reminders";

function prettyDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "Today's plan" summary; renders nothing when no plan is set. */
export function PlanCard() {
  const settings = useUserStore((s) => s.settings);
  const watched = useStudyStore((s) => s.watchedVideos.length);
  const srsCards = useStudyStore((s) => s.srsCards);
  const setActiveTab = useStudyStore((s) => s.setActiveTab);

  const plan = planFor(settings, watched);
  if (!plan.active) return null;
  const due = dueCardCount(srsCards);

  const status =
    plan.done
      ? "Course complete"
      : plan.delta < 0
        ? `${-plan.delta} behind`
        : plan.delta > 0
          ? `${plan.delta} ahead`
          : "On track";
  const statusColor = plan.delta < 0 ? "text-red-400" : "text-indigo-400";

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Today's plan</h3>
        <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
      </div>
      {plan.done ? (
        <p className="text-sm text-slate-400">All {watched} videos watched. Keep reviewing cards to lock it in.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat label="Watch today" value={plan.todayGoal} />
          <Stat label="Cards due" value={due} />
          <Stat
            label={settings.planMode === "date" ? "Days left" : "Finish by"}
            value={
              settings.planMode === "date"
                ? Math.max(0, plan.daysLeft ?? 0)
                : plan.projectedFinish
                  ? prettyDate(plan.projectedFinish)
                  : "—"
            }
          />
        </div>
      )}
      {!plan.done && (
        <p className="text-xs text-slate-500 mt-3">
          {plan.remaining} videos left · {plan.videosPerDay.toFixed(1)} per day
          {plan.projectedFinish && settings.planMode === "date"
            ? ` · target ${prettyDate(plan.projectedFinish)}`
            : ""}
          <button onClick={() => setActiveTab("settings")} className="ml-2 text-indigo-400 hover:underline">
            Edit plan
          </button>
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
