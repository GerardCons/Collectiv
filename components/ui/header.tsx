import { fontFamily, fontSizes, space, text } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
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
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <View style={[styles.side, styles.sideLeft]}>
        {onBack ? (
          leftText ? (
            <Pressable onPress={onBack} hitSlop={8}>
              <Text style={[styles.leftText, { color: colors.fgPrimary }]}>{leftText}</Text>
            </Pressable>
          ) : (
            <Pressable onPress={onBack} hitSlop={8}>
              <Ionicons name="chevron-back" size={26} color={colors.fgPrimary} />
            </Pressable>
          )
        ) : null}
      </View>

      {title ? (
        <Text style={[styles.title, { color: colors.fgPrimary }]} numberOfLines={1}>
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
    paddingHorizontal: space.lg,
    height: 52,
  },
  side: { minWidth: 64, justifyContent: "center" },
  sideLeft: { alignItems: "flex-start" },
  sideRight: { alignItems: "flex-end" },
  title: { ...text.headingMd },
  leftText: { fontFamily: fontFamily.body, fontSize: fontSizes.md },
});
