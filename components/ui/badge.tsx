import { fontFamily, fontSizes, radii } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

/**
 * Small label badge used as image overlays (grade / HOT / NEW / VENDOR) and
 * inline tags. `overlay` size is tuned for dense card corners; `sm` for inline.
 */
export type BadgeTone =
  | "grade" // graded slab — green tint
  | "success"
  | "vendor" // purple, used bottom-left on listing thumbs
  | "social"
  | "hot" // coral solid
  | "new" // green solid
  | "neutral";

export function Badge({
  label,
  tone = "neutral",
  size = "sm",
  style,
}: {
  label: string;
  tone?: BadgeTone;
  size?: "overlay" | "sm";
  style?: ViewStyle;
}) {
  const { colors } = useTheme();

  const map: Record<BadgeTone, { bg: string; fg: string }> = {
    grade: { bg: colors.successMuted, fg: colors.success },
    success: { bg: colors.successMuted, fg: colors.success },
    vendor: { bg: "rgba(124,58,237,0.85)", fg: "#ffffff" },
    social: { bg: colors.secondaryMuted, fg: colors.secondary },
    hot: { bg: colors.primary, fg: colors.fgOnAccent },
    new: { bg: colors.success, fg: colors.fgOnAccent },
    neutral: { bg: colors.bgSurface, fg: colors.fgSecondary },
  };
  const c = map[tone];

  return (
    <View
      style={[
        styles.base,
        size === "overlay" ? styles.overlay : styles.sm,
        { backgroundColor: c.bg },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === "overlay" ? styles.textOverlay : styles.textSm,
          { color: c.fg },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: "flex-start", borderRadius: radii.sm },
  overlay: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  sm: { paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontFamily: fontFamily.bodyExtrabold, letterSpacing: 0.4 },
  textOverlay: { fontSize: 9 },
  textSm: { fontSize: fontSizes.xs },
});
