import { ACHIEVEMENTS } from "@comptia-study/shared/gamification";
import { useUserStore } from "../../stores/user-store";

const CATEGORY_LABELS: Record<string, string> = {
  study: "Study Milestones",
  streak: "Streaks",
  mastery: "Domain Mastery",
  quiz: "Quiz Achievements",
  course: "Course Progress",
};

export function AchievementList() {
  const unlockedAchievements = useUserStore((s) => s.unlockedAchievements);
  const categories = [...new Set(ACHIEVEMENTS.map((a) => a.category))];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <span className="text-sm text-slate-400">
          {unlockedAchievements.length}/{ACHIEVEMENTS.length} unlocked
        </span>
      </div>

      {categories.map((category) => {
        const categoryAchievements = ACHIEVEMENTS.filter(
          (a) => a.category === category
        );
        return (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3 text-slate-300">
              {CATEGORY_LABELS[category] ?? category}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {categoryAchievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isUnlocked
                        ? "bg-indigo-900/20 border-indigo-500"
                        : "bg-slate-800/50 border-slate-700 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {isUnlocked ? "🏆" : "🔒"}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{achievement.name}</p>
                        <p className="text-xs text-slate-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
