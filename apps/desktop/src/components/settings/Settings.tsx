import { useUserStore } from "../../stores/user-store";

export function Settings() {
  const settings = useUserStore((s) => s.settings);
  const updateSettings = useUserStore((s) => s.updateSettings);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* API Key */}
      <div className="bg-slate-800 rounded-xl p-6 space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">
            Anthropic API Key
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Required for AI question generation. Get yours at{" "}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              console.anthropic.com
            </a>
          </p>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => updateSettings({ apiKey: e.target.value })}
            placeholder="sk-ant-..."
            className="mt-2 w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </label>
      </div>

      {/* Study preferences */}
      <div className="bg-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Study Preferences</h3>

        <label className="block">
          <span className="text-sm text-slate-300">Daily Goal (cards/day)</span>
          <input
            type="number"
            min={5}
            max={100}
            value={settings.dailyGoal}
            onChange={(e) =>
              updateSettings({ dailyGoal: parseInt(e.target.value) || 20 })
            }
            className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">New Cards Per Session</span>
          <input
            type="number"
            min={1}
            max={50}
            value={settings.newCardsPerDay}
            onChange={(e) =>
              updateSettings({
                newCardsPerDay: parseInt(e.target.value) || 10,
              })
            }
            className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">Preferred Exam</span>
          <select
            value={settings.preferredExam}
            onChange={(e) =>
              updateSettings({
                preferredExam: e.target.value as "220-1201" | "220-1202" | "both",
              })
            }
            className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="220-1201">Core 1 (220-1201)</option>
            <option value="220-1202">Core 2 (220-1202)</option>
            <option value="both">Both</option>
          </select>
        </label>
      </div>
    </div>
  );
}
