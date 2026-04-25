import { useEffect, useState } from "react";
import type { Achievement } from "@comptia-study/shared/types";

interface Props {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-indigo-900 border-2 border-indigo-500 rounded-xl p-4 shadow-xl shadow-indigo-900/50 min-w-64">
        <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wide">
          Achievement Unlocked!
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="font-bold">{achievement.name}</p>
            <p className="text-sm text-slate-400">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
