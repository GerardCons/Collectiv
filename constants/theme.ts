/**
 * Shared design tokens. Light-touch — values only, no styling abstraction layer.
 * Per the architecture doc we stay on StyleSheet for Phase 1–2; this file just
 * keeps colors/spacing consistent across screens (the coral palette from the
 * wireframes) so we are not hard-coding hex strings in 20 files.
 */

export const colors = {
  // brand
  accent: "#E76F51", // coral — primary actions, brand mark
  accentSoft: "#FBEAE3", // tinted coral — banners, selected rows
  accentPressed: "#D65F43",

  // text
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textTertiary: "#9A9A9A",
  textInverse: "#FFFFFF",

  // surfaces
  background: "#FFFFFF",
  surface: "#F4F1ED", // warm off-white (card placeholders in the sketches)
  surfaceMuted: "#FAF8F5",

  // lines + states
  border: "#E6E2DD",
  borderStrong: "#1A1A1A",
  danger: "#C1432B",
  success: "#2A9D8F", // verified badge / online dot

  // misc
  overlay: "rgba(0,0,0,0.35)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 34,
} as const;
