import { useEffect } from "react";
import { useUserStore } from "../stores/user-store";
import { useAppearanceStore } from "../stores/appearance-store";
import { applyAppearance } from "../theme";

/**
 * Applies accent / wallpaper settings to CSS variables and renders the
 * wallpaper layer behind the app. Mount once, anywhere inside App.
 */
export function AppearanceLayer() {
  const settings = useUserStore((s) => s.settings);
  const wallpaper = useAppearanceStore((s) => s.wallpaper);

  useEffect(() => {
    applyAppearance(settings, wallpaper !== null);
  }, [settings.accentColor, settings.backgroundColor, settings.wallpaperDim, settings.wallpaperBlur, wallpaper, settings]);

  if (!wallpaper) return null;
  return <div aria-hidden className="wallpaper" style={{ backgroundImage: `url("${wallpaper}")` }} />;
}
