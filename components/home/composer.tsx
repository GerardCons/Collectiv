import { Avatar } from "@/components/ui/avatar";
import { fontFamily, fontSizes, radii, shadows, space } from "@/constants/theme";
import { COMPOSER_ACTIONS, FEED_COLORS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Top-of-feed composer: a prompt card + the 4 quick-action chips. */
export function Composer({
  onOpen,
  onAction,
}: {
  onOpen: () => void;
  onAction: (route: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.prompt, { backgroundColor: colors.bgBase }, shadows.sm]}
        onPress={onOpen}
      >
        <Avatar name="Jake" size={40} color={FEED_COLORS.coral} />
        <Text style={[styles.placeholder, { color: colors.fgTertiary }]}>
          Share a pickup or post an update…
        </Text>
      </Pressable>

      <View style={styles.actions}>
        {COMPOSER_ACTIONS.map((a) => (
          <Pressable
            key={a.key}
            onPress={() => onAction(a.route)}
            style={[styles.chip, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
          >
            <Text style={styles.chipIcon}>{a.icon}</Text>
            <Text style={[styles.chipLabel, { color: colors.fgSecondary }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: space.md },
  prompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: radii.xl - 4,
  },
  placeholder: { flex: 1, fontFamily: fontFamily.body, fontSize: fontSizes.sm },
  actions: { flexDirection: "row", gap: 7, marginTop: space.sm },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  chipIcon: { fontSize: 12.5 },
  chipLabel: { fontFamily: fontFamily.socialBold, fontSize: 10.5 },
});
