/**
 * Collectiv design tokens — mirror of design_handoff_collectiv/design-tokens.css
 * ("Coral Core v1"). This is the single source of truth for every visual value.
 *
 * Two layers live here:
 *
 *  1. NEW token set (lightColors/darkColors, space, radii, fontSizes,
 *     fontFamily, fontWeights, shadows, text presets). Mode-aware colors are
 *     resolved through `useTheme()` (hooks/use-theme.ts). Use these for all new
 *     and migrated code.
 *
 *  2. LEGACY aliases (colors / spacing / radius / fontSize) kept so the ~45
 *     screens written before the redesign keep compiling. `colors` is remapped
 *     onto the new light palette, so the whole app picks up the warm palette
 *     immediately. `spacing` / `radius` / `fontSize` keep their original values
 *     on purpose — un-migrated screens should not shift layout until each is
 *     deliberately restyled tab-by-tab.
 */

// ── Brand (mode-independent) ───────────────────────────────
const brand = {
  primary: "#E76F51",
  primaryLight: "#f4a88e",
  primaryMuted: "rgba(231, 111, 81, 0.12)",

  secondary: "#7C3AED",
  secondaryLight: "#a78bfa",
  secondaryMuted: "rgba(124, 58, 237, 0.12)",
} as const;

// ── Semantic (mode-independent) ────────────────────────────
const semantic = {
  success: "#10B981",
  successMuted: "rgba(16, 185, 129, 0.12)",
  warning: "#f59e0b",
  warningMuted: "rgba(245, 158, 11, 0.12)",
  error: "#ef4444",
  errorMuted: "rgba(239, 68, 68, 0.12)",
  info: "#60a5fa",
  infoMuted: "rgba(96, 165, 250, 0.12)",
} as const;

// Dim overlay used behind bottom sheets / action sheets.
const overlay = "rgba(14, 13, 12, 0.4)";

// ── Light palette ──────────────────────────────────────────
export const lightColors = {
  ...brand,
  ...semantic,
  overlay,

  bgBase: "#fef9f5",
  bgSurface: "#fef0e8",
  bgElevated: "#fde0d2",
  bgRecessed: "#f8ece4",
  bgInverse: "#1a1210",

  fgPrimary: "#1a1210",
  fgSecondary: "#6b5c52",
  fgTertiary: "#aa9a90",
  fgInverse: "#fef9f5",
  fgOnAccent: "#ffffff",

  borderDefault: "#f0ddd0",
  borderSubtle: "#f5e8dc",
  borderStrong: "#d4c0b2",

  tabBarBg: "#fef9f5",
  tabBarBorder: "#f0ddd0",
  tabBarInactive: "rgba(26, 18, 16, 0.35)",
  tabBarActive: brand.primary,
} as const;

export type ThemeColors = Record<keyof typeof lightColors, string>;

// ── Dark palette ───────────────────────────────────────────
export const darkColors: ThemeColors = {
  ...brand,
  ...semantic,
  overlay,

  bgBase: "#0e0d0c",
  bgSurface: "#1a1816",
  bgElevated: "#252220",
  bgRecessed: "#141210",
  bgInverse: "#f0eeea",

  fgPrimary: "#f0eeea",
  fgSecondary: "#a09890",
  fgTertiary: "#6b6360",
  fgInverse: "#0e0d0c",
  fgOnAccent: "#ffffff",

  borderDefault: "#2a2624",
  borderSubtle: "#1e1c1a",
  borderStrong: "#3a3634",

  tabBarBg: "#0e0d0c",
  tabBarBorder: "#1a1816",
  tabBarInactive: "rgba(240, 238, 234, 0.3)",
  tabBarActive: brand.primary,
};

// ── Spacing (design scale: 4 8 12 16 20 24 32 40) ──────────
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
} as const;

// ── Radius (design scale: 6 10 14 20 999) ──────────────────
export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

// ── Type scale (11 13 15 17 20 24 28 34) ───────────────────
export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 34,
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

/**
 * Loaded font-family names. Each weight is a distinct family (the names match
 * the @expo-google-fonts exports loaded in app/_layout.tsx) — set fontFamily to
 * the right weight here rather than relying on the `fontWeight` style prop,
 * which does not select weights for named custom families on Android.
 *
 * NOTE: DM Serif Display only ships weight 400 — there is no bold display face.
 * Emphasis on display text comes from size and color, not weight.
 */
export const fontFamily = {
  display: "DMSerifDisplay_400Regular",
  displayItalic: "DMSerifDisplay_400Regular_Italic",

  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodySemibold: "DMSans_600SemiBold",
  bodyBold: "DMSans_700Bold",
  bodyExtrabold: "DMSans_800ExtraBold",

  social: "Sora_400Regular",
  socialMedium: "Sora_500Medium",
  socialSemibold: "Sora_600SemiBold",
  socialBold: "Sora_700Bold",
  socialExtrabold: "Sora_800ExtraBold",
} as const;

// ── Shadows (RN shape; iOS props + Android elevation) ──────
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

/**
 * Text presets — role-based combinations of family + size + line-height so
 * screens never hand-pick fontFamily/size individually. Colors are applied
 * separately (mode-aware via useTheme).
 *
 *  display* → DM Serif Display (collection names, prices on detail pages)
 *  heading/body/label/caption → DM Sans (all UI + body)
 *  social* → Sora (feed titles, group/usernames, event titles)
 */
export const text = {
  // DM Serif Display — collector / display
  display3xl: { fontFamily: fontFamily.display, fontSize: fontSizes["3xl"], lineHeight: 40 },
  display2xl: { fontFamily: fontFamily.display, fontSize: fontSizes["2xl"], lineHeight: 34 },
  displayXl: { fontFamily: fontFamily.display, fontSize: fontSizes.xl, lineHeight: 30 },
  displayLg: { fontFamily: fontFamily.display, fontSize: fontSizes.lg, lineHeight: 26 },

  // DM Sans — UI / body
  headingLg: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.lg, lineHeight: 26 },
  headingMd: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.md, lineHeight: 22 },
  bodyBase: { fontFamily: fontFamily.body, fontSize: fontSizes.base, lineHeight: 21 },
  bodyStrong: { fontFamily: fontFamily.bodySemibold, fontSize: fontSizes.base, lineHeight: 21 },
  bodySm: { fontFamily: fontFamily.body, fontSize: fontSizes.sm, lineHeight: 18 },
  label: { fontFamily: fontFamily.bodySemibold, fontSize: fontSizes.sm, lineHeight: 18 },
  caption: { fontFamily: fontFamily.body, fontSize: fontSizes.xs, lineHeight: 15 },
  metaStrong: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.xs, lineHeight: 15 },

  // Sora — social / community
  socialLg: { fontFamily: fontFamily.socialBold, fontSize: fontSizes.lg, lineHeight: 26 },
  socialMd: { fontFamily: fontFamily.socialSemibold, fontSize: fontSizes.md, lineHeight: 22 },
  socialBase: { fontFamily: fontFamily.socialMedium, fontSize: fontSizes.base, lineHeight: 21 },
  socialSm: { fontFamily: fontFamily.socialSemibold, fontSize: fontSizes.sm, lineHeight: 18 },
} as const;

// ──────────────────────────────────────────────────────────
// LEGACY aliases — keep pre-redesign screens compiling.
// `colors` is remapped onto the new light palette (intentional global shift).
// spacing / radius / fontSize keep their ORIGINAL values so un-migrated
// screens don't move; migrate each screen to space/radii/fontSizes as restyled.
// ──────────────────────────────────────────────────────────
export const colors = {
  // brand
  accent: brand.primary,
  accentSoft: brand.primaryMuted,
  accentPressed: "#D65F43",
  accentSocial: brand.secondary, // NEW — social/community accent (purple)

  // text
  text: lightColors.fgPrimary,
  textSecondary: lightColors.fgSecondary,
  textTertiary: lightColors.fgTertiary,
  textInverse: lightColors.fgOnAccent,

  // surfaces
  background: lightColors.bgBase,
  surface: lightColors.bgSurface,
  surfaceMuted: lightColors.bgRecessed,

  // lines + states
  border: lightColors.borderDefault,
  borderStrong: lightColors.borderStrong,
  danger: semantic.error,
  success: semantic.success,

  // misc
  overlay,
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
