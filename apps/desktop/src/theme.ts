import type { UserSettings } from "@comptia-study/shared/types";

export const DEFAULT_SETTINGS: UserSettings = {
  apiKey: "",
  dailyGoal: 20,
  newCardsPerDay: 10,
  preferredExam: "both",
  theme: "dark",
  accentColor: "#ffffff",
  backgroundColor: "#000000",
  wallpaperDim: 70,
  wallpaperBlur: 0,
  planMode: "off",
  planTargetDate: null,
  planVideosPerWeek: 7,
  planStartedAt: null,
  planStartWatched: 0,
  remindersEnabled: false,
  reminderMode: "daily",
  reminderTime: "18:00",
  reminderIntervalHours: 4,
  runInBackground: true,
  lastReminderAt: null,
};

export const ACCENT_PRESETS: { name: string; value: string }[] = [
  { name: "White", value: "#ffffff" },
  { name: "Sky", value: "#7dd3fc" },
  { name: "Mint", value: "#6ee7b7" },
  { name: "Lavender", value: "#c4b5fd" },
  { name: "Amber", value: "#fbbf24" },
  { name: "Rose", value: "#fda4af" },
];

export const BACKGROUND_PRESETS: { name: string; value: string }[] = [
  { name: "Black", value: "#000000" },
  { name: "Charcoal", value: "#121212" },
  { name: "Slate", value: "#0f1419" },
  { name: "Navy", value: "#0b1020" },
  { name: "Forest", value: "#0b1a14" },
  { name: "Plum", value: "#170f1f" },
  { name: "Paper", value: "#f4f3ee" },
];

/** Max encoded wallpaper size we are willing to keep in SQLite. */
export const WALLPAPER_MAX_BYTES = 6 * 1024 * 1024;

const HEX_RE = /^#[0-9a-f]{6}$/i;

export function normalizeHex(input: string): string | null {
  const v = input.trim();
  if (HEX_RE.test(v)) return v.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    const [, r, g, b] = v;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

/** WCAG relative luminance of a #rrggbb colour. */
export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}

/** WCAG contrast ratio between two colours (1 = identical, 21 = black on white). */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Black or white, whichever reads better on the given colour. */
export function contrastText(hex: string): "#000000" | "#ffffff" {
  return luminance(hex) > 0.35 ? "#000000" : "#ffffff";
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));

/** Pushes the current settings into CSS variables consumed by index.css. */
export function applyAppearance(settings: UserSettings, hasWallpaper: boolean): void {
  const root = document.documentElement;
  const bg = normalizeHex(settings.backgroundColor) ?? DEFAULT_SETTINGS.backgroundColor;
  const light = contrastText(bg) === "#000000";
  const fg = light ? "#111111" : "#e8e8e8";
  root.style.setProperty("--bg", bg);
  root.style.setProperty("--fg", fg);
  root.style.colorScheme = light ? "light" : "dark";

  // An accent that barely differs from the background (white on a pale
  // background, say) is unusable, so fall back to the foreground colour.
  const chosen = normalizeHex(settings.accentColor) ?? DEFAULT_SETTINGS.accentColor;
  const accent = contrastRatio(chosen, bg) >= 1.8 ? chosen : fg;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-fg", contrastText(accent));
  root.style.setProperty("--wallpaper-dim", String(clamp(settings.wallpaperDim, 0, 95) / 100));
  root.style.setProperty("--wallpaper-blur", `${clamp(settings.wallpaperBlur, 0, 30)}px`);
  root.classList.toggle("has-wallpaper", hasWallpaper);
}

/** Re-encodes an image file as a JPEG no wider than maxWidth, returned as a data URL. */
export async function encodeWallpaper(file: File, maxWidth = 2560, quality = 0.86): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  if (dataUrl.length > WALLPAPER_MAX_BYTES) {
    throw new Error("Image is too large even after resizing. Try a smaller picture.");
  }
  return dataUrl;
}
