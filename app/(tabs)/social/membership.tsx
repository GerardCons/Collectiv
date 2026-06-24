import { GroupAvatar, SocialPageHead } from "@/components/social/social-bits";
import { fontFamily, space } from "@/constants/theme";
import { MEMBERSHIP } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Membership() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SocialPageHead title="Membership" />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.section, { color: colors.fgTertiary }]}>Your Groups · {MEMBERSHIP.length}</Text>
        {MEMBERSHIP.map((g) => {
          const admin = g.role === "Admin";
          return (
            <View key={g.name} style={[styles.row, { borderBottomColor: colors.borderDefault }]}>
              <GroupAvatar group={g} size={44} />
              <View style={styles.flex}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{g.name}</Text>
                  {admin ? (
                    <View style={[styles.adminBadge, { backgroundColor: colors.secondaryMuted }]}>
                      <Text style={[styles.adminText, { color: colors.secondary }]}>ADMIN</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.meta, { color: colors.fgTertiary }]}>{g.members}</Text>
              </View>
              <Pressable style={[styles.btn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
                <Text style={[styles.btnText, { color: admin ? colors.fgTertiary : colors.primary }]}>{admin ? "Manage" : "Leave"}</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  body: { padding: space.lg },
  section: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 12, borderBottomWidth: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 12.5, flexShrink: 1 },
  adminBadge: { paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999 },
  adminText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5 },
  meta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 2 },
  btn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  btnText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
});
