import { colors, fontSize, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Shared top bar for pushed screens: optional left (back arrow or text like
 * "Cancel"), centered title, optional right accessory (a ☰ icon, a "Save"
 * button, etc.). Screens supply their own SafeAreaView around it.
 */
export function Header({
  title,
  onBack,
  leftText,
  right,
}: {
  title?: string;
  onBack?: () => void;
  /** When set, the left control renders this text (e.g. "Cancel") instead of an arrow. */
  leftText?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={[styles.side, styles.sideLeft]}>
        {onBack ? (
          leftText ? (
            <Pressable onPress={onBack} hitSlop={8}>
              <Text style={styles.leftText}>{leftText}</Text>
            </Pressable>
          ) : (
            <Pressable onPress={onBack} hitSlop={8}>
              <Ionicons name="chevron-back" size={26} color={colors.text} />
            </Pressable>
          )
        ) : null}
      </View>

      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View />
      )}

      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  side: { minWidth: 64, justifyContent: "center" },
  sideLeft: { alignItems: "flex-start" },
  sideRight: { alignItems: "flex-end" },
  title: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  leftText: { fontSize: fontSize.md, color: colors.text },
});
