import { fontFamily } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export function SettingsNav({ title, right, onBack }: { title: string; right?: React.ReactNode; onBack?: () => void }) {
  const { colors } = useTheme();
  function back() {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace("/settings");
  }
  return (
    <View style={[styles.nav, { borderBottomColor: colors.borderDefault }]}>
      <Pressable onPress={back} hitSlop={8} style={styles.navSide}>
        <Ionicons name="chevron-back" size={24} color={colors.fgPrimary} />
      </Pressable>
      <Text style={[styles.navTitle, { color: colors.fgPrimary }]}>{title}</Text>
      <View style={[styles.navSide, styles.navRight]}>{right}</View>
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.section, { color: colors.fgTertiary }]}>{children}</Text>;
}

export function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <View style={[styles.card, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }]}>{children}</View>;
}

export function SettingRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  onPress,
  danger,
  chevron = true,
  last,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconBg?: string;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  chevron?: boolean;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
        pressed && onPress ? { backgroundColor: colors.bgSurface } : null,
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: iconBg ?? colors.bgSurface }]}>
        <Ionicons name={icon} size={15} color={danger ? colors.error : iconColor ?? colors.fgPrimary} />
      </View>
      <Text style={[styles.label, { color: danger ? colors.error : colors.fgPrimary }]}>{label}</Text>
      {value ? <Text style={[styles.value, { color: colors.fgTertiary }]} numberOfLines={1}>{value}</Text> : null}
      {chevron ? <Ionicons name="chevron-forward" size={17} color={colors.fgTertiary} /> : null}
    </Pressable>
  );
}

export function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  last,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.toggleRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault }]}>
      <View style={[styles.iconTile, { backgroundColor: colors.bgSurface }]}>
        <Ionicons name={icon} size={15} color={colors.fgPrimary} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.toggleTitle, { color: colors.fgPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[styles.toggleSub, { color: colors.fgTertiary }]}>{subtitle}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.borderDefault, true: colors.primary }} thumbColor="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  nav: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingBottom: 12, paddingTop: 2, borderBottomWidth: 1 },
  navSide: { minWidth: 50, justifyContent: "center" },
  navRight: { alignItems: "flex-end" },
  navTitle: { flex: 1, textAlign: "center", fontFamily: fontFamily.socialExtrabold, fontSize: 16 },

  section: { fontFamily: fontFamily.socialExtrabold, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8 },
  card: { marginHorizontal: 14, borderRadius: 14, borderWidth: 1, overflow: "hidden" },

  row: { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 14, paddingVertical: 12, minHeight: 54 },
  iconTile: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, fontFamily: fontFamily.bodySemibold, fontSize: 14 },
  value: { fontFamily: fontFamily.body, fontSize: 12.5, maxWidth: 150 },

  toggleRow: { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 14, paddingVertical: 12, minHeight: 60 },
  toggleTitle: { fontFamily: fontFamily.bodySemibold, fontSize: 14 },
  toggleSub: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 2, lineHeight: 15 },
});
