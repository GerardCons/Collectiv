import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { CardState } from "@/hooks/use-cards";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, View } from "react-native";

export function StateBadge({ state }: { state: CardState }) {
  const { colors } = useTheme();
  const config: Record<CardState, { label: string; bg: string; fg: string }> = {
    private: { label: "PRIVATE", bg: colors.bgSurface, fg: colors.fgSecondary },
    showcased: { label: "SHOWCASED", bg: colors.primaryMuted, fg: colors.primary },
    listed: { label: "LISTED", bg: colors.primary, fg: colors.fgOnAccent },
  };
  const c = config[state];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radii.sm,
  },
  text: { fontFamily: fontFamily.bodyExtrabold, fontSize: fontSizes.xs, letterSpacing: 0.5 },
});
