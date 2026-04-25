export function StreakDisplay({ streak }: { streak: number }) {
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-red-400 text-lg">🔥</span>
      <span className="text-red-400 font-bold">{streak}</span>
      <span className="text-slate-400">day{streak !== 1 ? "s" : ""}</span>
    </div>
  );
}
