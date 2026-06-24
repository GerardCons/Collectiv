import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Pill chip for filters / sorts / genres.
 *  - default: selected = solid coral, unselected = surface + border
 *  - "soft":  selected = coral-tinted with coral border + coral text
 *             (used for the Market location / sort chips)
 */
export function Chip({
  label,
  active = false,
  onPress,
  variant = "default",
  leading,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: "default" | "soft";
  leading?: React.ReactNode;
}) {
  const { colors } = useTheme();

  let bg = colors.bgSurface;
  let border = colors.borderDefault;
  let fg = colors.fgSecondary;

  if (variant === "soft" && active) {
    bg = colors.primaryMuted;
    border = colors.primary;
    fg = colors.primary;
  } else if (active) {
    bg = colors.primary;
    border = colors.primary;
    fg = colors.fgOnAccent;
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: bg, borderColor: border }]}
    >
      {leading != null ? <View style={styles.leading}>{leading}</View> : null}
      <Text style={[styles.text, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  leading: { marginRight: 1 },
  text: { fontFamily: fontFamily.bodySemibold, fontSize: fontSizes.sm },
});
