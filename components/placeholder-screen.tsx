import { colors, fontSize, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";

/**
 * Generic "this tab arrives in a later phase" placeholder. Keeps the five tabs
 * visually consistent until each gets its real screen.
 */
export function PlaceholderScreen({
  title,
  phase,
  icon,
  children,
}: {
  title: string;
  phase: string;
  icon: keyof typeof Ionicons.glyphMap;
  children?: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={32} color={colors.textTertiary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.phase}>{phase}</Text>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  phase: { fontSize: fontSize.sm, color: colors.textSecondary },
});
