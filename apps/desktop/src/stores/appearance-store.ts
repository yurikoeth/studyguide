import { create } from "zustand";

interface AppearanceState {
  /** Wallpaper as a data URL, or null for plain black. Persisted in the `appearance` table. */
  wallpaper: string | null;
  setWallpaper: (wallpaper: string | null) => void;
}

export const useAppearanceStore = create<AppearanceState>()((set) => ({
  wallpaper: null,
  setWallpaper: (wallpaper) => set({ wallpaper }),
}));
