import { GroupAvatar, SocialPageHead, Toggle } from "@/components/social/social-bits";
import { fontFamily, space } from "@/constants/theme";
import { NOTIF_GROUPS } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotifPrefs() {
  const { colors } = useTheme();
  const [push, setPush] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SocialPageHead title="Notifications" />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={[styles.masterRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <View style={styles.flex}>
            <Text style={[styles.title, { color: colors.fgPrimary }]}>Push notifications</Text>
            <Text style={[styles.sub, { color: colors.fgTertiary }]}>Master switch for all group activity</Text>
          </View>
          <Toggle on={push} onToggle={() => setPush((v) => !v)} />
        </View>

        <Text style={[styles.section, { color: colors.fgTertiary }]}>Per Group</Text>
        {NOTIF_GROUPS.map((g) => (
          <View key={g.name} style={[styles.groupRow, { borderBottomColor: colors.borderDefault }]}>
            <GroupAvatar group={{ avatar: g.avatar, color: g.color }} size={40} />
            <Text style={[styles.groupName, { color: colors.fgPrimary }]} numberOfLines={1}>{g.name}</Text>
            <View style={[styles.modeChip, { backgroundColor: g.mode === "Off" ? colors.bgSurface : colors.secondaryMuted, borderColor: g.mode === "Off" ? colors.borderDefault : colors.secondary }]}>
              <Text style={[styles.modeText, { color: g.mode === "Off" ? colors.fgTertiary : colors.secondary }]}>{g.mode}</Text>
              <Ionicons name="chevron-down" size={8} color={g.mode === "Off" ? colors.fgTertiary : colors.secondary} />
            </View>
          </View>
        ))}

        <View style={styles.reminderRow}>
          <View style={styles.flex}>
            <Text style={[styles.title, { color: colors.fgPrimary }]}>Event reminders</Text>
            <Text style={[styles.sub, { color: colors.fgTertiary }]}>24h before events you&apos;re going to</Text>
          </View>
          <Toggle on={reminders} onToggle={() => setReminders((v) => !v)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  body: { padding: space.lg },
  masterRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, marginBottom: 18 },
  title: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  sub: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
  section: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 },
  groupRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 11, borderBottomWidth: 1 },
  groupName: { flex: 1, fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  modeChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  modeText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 14 },
});
