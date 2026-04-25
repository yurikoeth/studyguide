import { useStudyStore } from "./stores/study-store";
import { useUserStore } from "./stores/user-store";
import { CourseOverview } from "./components/course/CourseOverview";
import { StudySession } from "./components/study/StudySession";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AchievementList } from "./components/achievements/AchievementList";
import { Settings } from "./components/settings/Settings";
import { XPBar } from "./components/dashboard/XPBar";
import { StreakDisplay } from "./components/dashboard/StreakDisplay";

const TABS = [
  { id: "course" as const, label: "Course", icon: "📚" },
  { id: "study" as const, label: "Study", icon: "🧠" },
  { id: "dashboard" as const, label: "Stats", icon: "📊" },
  { id: "achievements" as const, label: "Badges", icon: "🏆" },
  { id: "settings" as const, label: "Settings", icon: "⚙️" },
];

export default function App() {
  const activeTab = useStudyStore((s) => s.activeTab);
  const setActiveTab = useStudyStore((s) => s.setActiveTab);
  const totalXP = useUserStore((s) => s.totalXP);
  const levelTitle = useUserStore((s) => s.levelTitle);
  const level = useUserStore((s) => s.level);
  const currentStreak = useUserStore((s) => s.currentStreak);

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-black/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-indigo-400">CompTIA A+ Study</h1>
          <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
            Lv.{level} {levelTitle}
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
      <nav className="flex border-t border-slate-700/50 bg-black/80 backdrop-blur-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              activeTab === tab.id
                ? "text-indigo-400 bg-slate-700/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
