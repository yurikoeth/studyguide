import { useRef, useState } from "react";
import { useUserStore } from "../../stores/user-store";
import { useAppearanceStore } from "../../stores/appearance-store";
import {
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  DEFAULT_SETTINGS,
  encodeWallpaper,
  normalizeHex,
} from "../../theme";

export function AppearanceSettings() {
  const settings = useUserStore((s) => s.settings);
  const updateSettings = useUserStore((s) => s.updateSettings);
  const wallpaper = useAppearanceStore((s) => s.wallpaper);
  const setWallpaper = useAppearanceStore((s) => s.setWallpaper);

  const fileInput = useRef<HTMLInputElement>(null);
  const [hexDraft, setHexDraft] = useState(settings.accentColor);
  const [bgDraft, setBgDraft] = useState(settings.backgroundColor);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickAccent(value: string) {
    const hex = normalizeHex(value);
    if (!hex) return;
    setHexDraft(hex);
    updateSettings({ accentColor: hex });
  }

  function pickBackground(value: string) {
    const hex = normalizeHex(value);
    if (!hex) return;
    setBgDraft(hex);
    updateSettings({ backgroundColor: hex });
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setWallpaper(await encodeWallpaper(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load that image");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function reset() {
    setWallpaper(null);
    setHexDraft(DEFAULT_SETTINGS.accentColor);
    setBgDraft(DEFAULT_SETTINGS.backgroundColor);
    updateSettings({
      accentColor: DEFAULT_SETTINGS.accentColor,
      backgroundColor: DEFAULT_SETTINGS.backgroundColor,
      wallpaperDim: DEFAULT_SETTINGS.wallpaperDim,
      wallpaperBlur: DEFAULT_SETTINGS.wallpaperBlur,
    });
  }

  const hexValid = normalizeHex(hexDraft) !== null;
  const bgValid = normalizeHex(bgDraft) !== null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Appearance</h3>
        <button
          onClick={reset}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          Reset to defaults
        </button>
      </div>

      {/* Accent colour */}
      <div className="space-y-2">
        <span className="text-sm text-slate-300">Accent color</span>
        <div className="flex items-center gap-2 flex-wrap">
          {ACCENT_PRESETS.map((p) => {
            const active = p.value === settings.accentColor;
            return (
              <button
                key={p.value}
                title={p.name}
                aria-label={p.name}
                onClick={() => pickAccent(p.value)}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  active ? "border-white scale-110" : "border-white/20"
                }`}
                style={{ backgroundColor: p.value }}
              />
            );
          })}
          <label className="relative w-7 h-7 rounded-full border-2 border-dashed border-white/30 cursor-pointer overflow-hidden" title="Custom">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => pickAccent(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-300">+</span>
          </label>
          <input
            type="text"
            value={hexDraft}
            onChange={(e) => {
              setHexDraft(e.target.value);
              pickAccent(e.target.value);
            }}
            spellCheck={false}
            className={`ml-1 w-24 px-2 py-1 bg-slate-900 border rounded-lg text-sm font-mono focus:outline-none transition-colors ${
              hexValid ? "border-slate-600 focus:border-indigo-500" : "border-red-500"
            }`}
          />
        </div>
      </div>

      {/* Background colour */}
      <div className="space-y-2">
        <span className="text-sm text-slate-300">Background</span>
        <div className="flex items-center gap-2 flex-wrap">
          {BACKGROUND_PRESETS.map((p) => {
            const active = p.value === settings.backgroundColor;
            return (
              <button
                key={p.value}
                title={p.name}
                aria-label={`Background ${p.name}`}
                onClick={() => pickBackground(p.value)}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  active ? "border-indigo-400 scale-110" : "border-white/20"
                }`}
                style={{ backgroundColor: p.value }}
              />
            );
          })}
          <label className="relative w-7 h-7 rounded-full border-2 border-dashed border-white/30 cursor-pointer overflow-hidden" title="Custom">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => pickBackground(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-300">+</span>
          </label>
          <input
            type="text"
            value={bgDraft}
            onChange={(e) => {
              setBgDraft(e.target.value);
              pickBackground(e.target.value);
            }}
            spellCheck={false}
            className={`ml-1 w-24 px-2 py-1 bg-slate-900 border rounded-lg text-sm font-mono focus:outline-none transition-colors ${
              bgValid ? "border-slate-600 focus:border-indigo-500" : "border-red-500"
            }`}
          />
        </div>
        <p className="text-xs text-slate-500">
          Shown when no wallpaper is set. Panels and text adjust to stay readable on any shade.
        </p>
      </div>

      {/* Wallpaper */}
      <div className="space-y-3">
        <span className="text-sm text-slate-300">Wallpaper</span>
        <div className="flex items-center gap-3">
          <div
            className="w-24 h-14 rounded-lg border border-white/10 bg-slate-900 bg-cover bg-center shrink-0"
            style={wallpaper ? { backgroundImage: `url("${wallpaper}")` } : undefined}
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileInput.current?.click()}
              disabled={busy}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-accent-fg rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {busy ? "Loading…" : wallpaper ? "Change image" : "Choose image"}
            </button>
            {wallpaper && (
              <button
                onClick={() => setWallpaper(null)}
                className="px-3 py-1.5 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <p className="text-xs text-slate-500">
          Stored inside the app database, resized to at most 2560px wide.
        </p>

        {wallpaper && (
          <div className="grid grid-cols-2 gap-4 pt-1">
            <label className="block">
              <span className="text-xs text-slate-400">Dim · {settings.wallpaperDim}%</span>
              <input
                type="range"
                min={0}
                max={95}
                value={settings.wallpaperDim}
                onChange={(e) => updateSettings({ wallpaperDim: Number(e.target.value) })}
                className="mt-1 w-full"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-400">Blur · {settings.wallpaperBlur}px</span>
              <input
                type="range"
                min={0}
                max={30}
                value={settings.wallpaperBlur}
                onChange={(e) => updateSettings({ wallpaperBlur: Number(e.target.value) })}
                className="mt-1 w-full"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
