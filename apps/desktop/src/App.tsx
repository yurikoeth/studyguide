import { useEffect } from "react";
import { useStudyStore } from "./stores/study-store";
import { useUserStore } from "./stores/user-store";
import { CourseOverview } from "./components/course/CourseOverview";
import { StudySession } from "./components/study/StudySession";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AchievementList } from "./components/achievements/AchievementList";
import { AchievementToast } from "./components/achievements/AchievementToast";
import { Settings } from "./components/settings/Settings";
import { XPBar } from "./components/dashboard/XPBar";
import { StreakDisplay } from "./components/dashboard/StreakDisplay";
import { AppearanceLayer } from "./components/AppearanceLayer";
import { ReminderAgent } from "./components/ReminderAgent";
import { BookIcon, BrainIcon, ChartIcon, TrophyIcon, GearIcon } from "./components/icons";

const TABS = [
  { id: "course" as const, label: "Course", Icon: BookIcon },
  { id: "study" as const, label: "Study", Icon: BrainIcon },
  { id: "dashboard" as const, label: "Stats", Icon: ChartIcon },
  { id: "achievements" as const, label: "Badges", Icon: TrophyIcon },
  { id: "settings" as const, label: "Settings", Icon: GearIcon },
];

export default function App() {
  const activeTab = useStudyStore((s) => s.activeTab);
  const setActiveTab = useStudyStore((s) => s.setActiveTab);
  const totalXP = useUserStore((s) => s.totalXP);
  const levelTitle = useUserStore((s) => s.levelTitle);
  const level = useUserStore((s) => s.level);
  const currentStreak = useUserStore((s) => s.currentStreak);
  const pendingToast = useUserStore((s) => s.pendingAchievementToasts[0]);
  const dismissAchievementToast = useUserStore((s) => s.dismissAchievementToast);
  const backfillAchievements = useUserStore((s) => s.backfillAchievements);

  useEffect(() => {
    backfillAchievements();
  }, [backfillAchievements]);

  return (
    <div className="flex flex-col h-screen">
      <AppearanceLayer />
      <ReminderAgent />
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-black border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="level-badge">
            <span className="level-badge-num">Lv.{level}</span>
            <span className="level-badge-title">{levelTitle}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <StreakDisplay streak={currentStreak} />
          <XPBar totalXP={totalXP} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4">
        {activeTab === "course" && <CourseOverview />}
        {activeTab === "study" && <StudySession />}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "achievements" && <AchievementList />}
        {activeTab === "settings" && <Settings />}
      </main>

      {/* Bottom nav */}
      <nav className="flex border-t border-white/10 bg-black px-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-current={active ? "page" : undefined}
              className={`relative flex-1 flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium tracking-wide transition-colors ${
                active ? "text-indigo-400" : "text-slate-500 hover:text-slate-200"
              }`}
            >
              <span
                className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-7 rounded-full bg-indigo-400 transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              <tab.Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.2 : 1.6} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {pendingToast && (
        <AchievementToast
          key={pendingToast.id}
          achievement={pendingToast}
          onDismiss={() => dismissAchievementToast(pendingToast.id)}
        />
      )}
    </div>
  );
}
