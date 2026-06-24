import { GroupAvatar, SocialPageHead } from "@/components/social/social-bits";
import { fontFamily, space } from "@/constants/theme";
import { INVITES_RECEIVED } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Invites() {
  const { colors } = useTheme();
  const [tab, setTab] = useState(0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SocialPageHead title="Invites" />
      <View style={[styles.tabs, { borderBottomColor: colors.borderDefault }]}>
        {["Received", "Sent"].map((t, i) => {
          const on = tab === i;
          return (
            <Pressable key={t} onPress={() => setTab(i)} style={styles.tab}>
              <Text style={[styles.tabText, { color: on ? colors.fgPrimary : colors.fgTertiary }]}>
                {t}{i === 0 ? <Text style={{ color: colors.secondary }}>  2</Text> : null}
              </Text>
              <View style={[styles.tabUnderline, { backgroundColor: on ? colors.secondary : "transparent" }]} />
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {tab === 0 ? (
          INVITES_RECEIVED.map((inv) => (
            <View key={inv.group} style={[styles.card, { borderBottomColor: colors.borderDefault }]}>
              <View style={styles.cardHead}>
                <GroupAvatar group={{ avatar: inv.avatar, color: inv.accent }} />
                <View style={styles.flex}>
                  <Text style={[styles.groupName, { color: colors.fgPrimary }]}>{inv.group}</Text>
                  <Text style={[styles.meta, { color: colors.fgTertiary }]}>
                    <Text style={[styles.metaBold, { color: colors.fgSecondary }]}>{inv.who}</Text> invited you · {inv.members}
                  </Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Pressable style={[styles.accept, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.acceptText}>Accept</Text>
                </Pressable>
                <Pressable style={[styles.decline, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
                  <Text style={[styles.declineText, { color: colors.fgSecondary }]}>Decline</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text style={[styles.empty, { color: colors.fgTertiary }]}>No pending sent invites.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  tabs: { flexDirection: "row", gap: 22, paddingHorizontal: space.xl, borderBottomWidth: 1 },
  tab: { alignItems: "center", paddingTop: 12, gap: 9 },
  tabText: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  tabUnderline: { height: 2.5, width: "100%", borderRadius: 2 },
  list: { padding: space.lg },
  card: { paddingVertical: 12, borderBottomWidth: 1 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 10 },
  groupName: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  meta: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
  metaBold: { fontFamily: fontFamily.socialBold },
  actions: { flexDirection: "row", gap: 9 },
  accept: { flex: 1, paddingVertical: 9, borderRadius: 999, alignItems: "center" },
  acceptText: { fontFamily: fontFamily.socialBold, fontSize: 12.5, color: "#fff" },
  decline: { flex: 1, paddingVertical: 9, borderRadius: 999, alignItems: "center", borderWidth: 1 },
  declineText: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  empty: { fontFamily: fontFamily.body, fontSize: 13, textAlign: "center", paddingTop: 40 },
});
