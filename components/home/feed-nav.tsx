import { fontFamily, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Centered nav bar (back chevron · title/subtitle · optional right) for the
 *  pushed social sub-screens — likes, comments, notifications. */
export function FeedNav({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const { colors } = useTheme();
  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }
  return (
    <View style={[styles.nav, { borderBottomColor: colors.borderDefault }]}>
      <Pressable onPress={back} hitSlop={10} style={styles.side}>
        <Ionicons name="chevron-back" size={26} color={colors.fgPrimary} />
      </Pressable>
      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.fgPrimary }]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={[styles.sub, { color: colors.fgTertiary }]}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    paddingBottom: 11,
    borderBottomWidth: 1,
  },
  side: { width: 40, justifyContent: "center" },
  right: { alignItems: "flex-end" },
  center: { flex: 1, alignItems: "center" },
  title: { fontFamily: fontFamily.socialExtrabold, fontSize: 15 },
  sub: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
});
