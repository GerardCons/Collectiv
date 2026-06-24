import { darkColors, lightColors, type ThemeColors } from "@/constants/theme";
import { useColorScheme } from "react-native";
import { create } from "zustand";

/**
 * Appearance preference. Defaults to "light": most screens are not dark-ready
 * yet, so we ship light regardless of the device setting until screens are
 * migrated. Flip the default to "system" once the restyle pass is complete.
 * (In-memory for now — persist via AsyncStorage when the Settings → Appearance
 * row is wired up.)
 */
export type Appearance = "system" | "light" | "dark";

type AppearanceState = {
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
};

export const useAppearanceStore = create<AppearanceState>((set) => ({
  appearance: "light",
  setAppearance: (appearance) => set({ appearance }),
}));

export type Theme = {
  colors: ThemeColors;
  scheme: "light" | "dark";
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
};

/**
 * Mode-aware theme accessor. Migrated components read colors from here so they
 * respond to light/dark; un-migrated screens keep importing the static `colors`
 * (light) alias from constants/theme.
 */
export function useTheme(): Theme {
  const system = useColorScheme() ?? "light";
  const appearance = useAppearanceStore((s) => s.appearance);
  const setAppearance = useAppearanceStore((s) => s.setAppearance);
  const scheme = appearance === "system" ? system : appearance;
  return {
    colors: scheme === "dark" ? darkColors : lightColors,
    scheme,
    appearance,
    setAppearance,
  };
}
