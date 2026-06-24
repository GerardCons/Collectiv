import { fontFamily, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Composer top bar: Cancel · centered title · coral action pill (Post / Next). */
export function ComposerBar({
  title,
  action,
  onCancel,
}: {
  title: string;
  action: { label: string; onPress: () => void };
  onCancel?: () => void;
}) {
  const { colors } = useTheme();
  function cancel() {
    if (onCancel) return onCancel();
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }
  return (
    <View style={[styles.bar, { borderBottomColor: colors.borderDefault }]}>
      <Pressable onPress={cancel} hitSlop={8} style={styles.side}>
        <Text style={[styles.cancel, { color: colors.fgSecondary }]}>Cancel</Text>
      </Pressable>
      <Text style={[styles.title, { color: colors.fgPrimary }]}>{title}</Text>
      <Pressable onPress={action.onPress} style={[styles.action, { backgroundColor: colors.primary }]}>
        <Text style={styles.actionText}>{action.label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    paddingTop: space.xs,
    borderBottomWidth: 1,
  },
  side: { minWidth: 56 },
  cancel: { fontFamily: fontFamily.socialSemibold, fontSize: 13 },
  title: { fontFamily: fontFamily.socialExtrabold, fontSize: 14 },
  action: { minWidth: 56, alignItems: "center", paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999 },
  actionText: { fontFamily: fontFamily.socialBold, fontSize: 12.5, color: "#fff" },
});
