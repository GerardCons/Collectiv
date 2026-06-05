import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { CardState } from "@/hooks/use-cards";
import { StyleSheet, Text, View } from "react-native";

const CONFIG: Record<CardState, { label: string; bg: string; fg: string }> = {
  private: { label: "PRIVATE", bg: colors.surface, fg: colors.textSecondary },
  showcased: { label: "SHOWCASED", bg: colors.accentSoft, fg: colors.accent },
  listed: { label: "LISTED", bg: colors.accent, fg: colors.textInverse },
};

export function StateBadge({ state }: { state: CardState }) {
  const c = CONFIG[state];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  text: { fontSize: fontSize.xs, fontWeight: "800", letterSpacing: 0.5 },
});
