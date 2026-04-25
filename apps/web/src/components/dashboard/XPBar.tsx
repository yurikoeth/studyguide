import { getXPToNextLevel } from "@comptia-study/shared/gamification";

export function XPBar({ totalXP }: { totalXP: number }) {
  const { current, next, progress } = getXPToNextLevel(totalXP);

  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-400 text-sm font-bold">
        {totalXP.toLocaleString()} XP
      </span>
      {next && (
        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
