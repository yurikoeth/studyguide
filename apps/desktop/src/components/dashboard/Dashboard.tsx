import type { ReactNode } from "react";
import { FlameIcon, StarIcon } from "../icons";
import { useUserStore } from "../../stores/user-store";
import { useStudyStore } from "../../stores/study-store";
import { getXPToNextLevel } from "@comptia-study/shared/gamification";
import { DOMAINS_220_1201, TOTAL_VIDEOS } from "@comptia-study/shared/data";
import { PlanCard } from "./PlanCard";

export function Dashboard() {
  const {
    totalXP, level, levelTitle, currentStreak, longestStreak,
    totalCardsReviewed, totalCorrect, domainCorrectCounts,
  } = useUserStore();
  const videosWatched = useStudyStore((s) => s.watchedVideos.length);
  const { current, next, progress } = getXPToNextLevel(totalXP);
  const accuracy = totalCardsReviewed > 0
    ? Math.round((totalCorrect / totalCardsReviewed) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <PlanCard />

      {/* Level & XP */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-3xl font-bold text-indigo-400">Level {level}</span>
            <span className="ml-2 text-slate-400">{levelTitle}</span>
          </div>
          <span className="text-amber-400 font-bold text-xl">
            {totalXP.toLocaleString()} XP
          </span>
        </div>
        {next && (
          <>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {Math.round(progress * 100)}% to Level {next.level} — {next.title}
            </p>
          </>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Cards Reviewed" value={totalCardsReviewed} />
        <StatCard label="Accuracy" value={`${accuracy}%`} />
        <StatCard label="Current Streak" value={`${currentStreak} days`} icon={<FlameIcon className="w-5 h-5" />} />
        <StatCard label="Longest Streak" value={`${longestStreak} days`} icon={<StarIcon className="w-5 h-5" />} />
      </div>

      {/* Course progress */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">Course Progress</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${(videosWatched / TOTAL_VIDEOS) * 100}%` }}
            />
          </div>
          <span className="text-sm text-slate-300 font-mono">
            {videosWatched}/{TOTAL_VIDEOS}
          </span>
        </div>

        {/* Per-domain progress */}
        <div className="space-y-2">
          {DOMAINS_220_1201.map((domain) => {
            const correct = domainCorrectCounts[domain.id] ?? 0;
            const mastered = correct >= 50;
            return (
              <div key={domain.id} className="flex items-center gap-2 text-sm">
                <span className="w-48 text-slate-400 truncate">
                  {domain.number}. {domain.name}
                </span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${mastered ? "bg-amber-400" : "bg-indigo-500"}`}
                    style={{ width: `${Math.min((correct / 50) * 100, 100)}%` }}
                  />
                </div>
                <span
                  className={`text-xs w-20 text-right ${mastered ? "text-amber-400 font-semibold" : "text-slate-400"}`}
                >
                  {mastered ? "Mastered ✓" : `${correct}/50`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold mt-1">
        {icon && <span className="inline-flex align-[-3px] mr-2 text-slate-300">{icon}</span>}
        {value}
      </p>
    </div>
  );
}
