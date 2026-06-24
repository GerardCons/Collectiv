import { Avatar } from "@/components/ui/avatar";
import { fontFamily } from "@/constants/theme";
import { CONTACTS } from "@/lib/chat-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewMessage() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <View style={[styles.nav, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.navSide}>
          <Ionicons name="chevron-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.fgPrimary }]}>New Message</Text>
        <Pressable hitSlop={8} style={[styles.navSide, styles.navRight]}>
          <Text style={[styles.next, { color: colors.primary }]}>Next</Text>
        </Pressable>
      </View>

      <View style={[styles.toRow, { borderBottomColor: colors.borderDefault }]}>
        <Text style={[styles.toLabel, { color: colors.fgSecondary }]}>To:</Text>
        <View style={[styles.toField, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Text style={[styles.toPlaceholder, { color: colors.fgTertiary }]}>Search collectors &amp; vendors…</Text>
        </View>
      </View>

      <Text style={[styles.section, { color: colors.fgTertiary }]}>Recents</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {CONTACTS.map((c) => (
          <Pressable key={c.id} style={[styles.row, { borderBottomColor: colors.borderDefault }]} onPress={() => router.replace({ pathname: "/chat/[id]", params: { id: c.id } })}>
            <View>
              <Avatar name={c.name} size={44} color={c.color} />
              {c.online ? <View style={[styles.onlineDot, { backgroundColor: colors.success, borderColor: colors.bgBase }]} /> : null}
            </View>
            <View style={styles.flex}>
              <Text style={[styles.name, { color: colors.fgPrimary }]}>{c.name}</Text>
              {c.vendor ? (
                <Text style={[styles.vendorTag, { color: colors.success }]}>✓ Verified vendor</Text>
              ) : c.handle ? (
                <Text style={[styles.handle, { color: colors.fgTertiary }]}>@{c.handle}</Text>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.fgTertiary} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  nav: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingBottom: 12, paddingTop: 2, borderBottomWidth: 1 },
  navSide: { minWidth: 50, justifyContent: "center" },
  navRight: { alignItems: "flex-end" },
  navTitle: { flex: 1, textAlign: "center", fontFamily: fontFamily.socialExtrabold, fontSize: 16 },
  next: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  toRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 1 },
  toLabel: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  toField: { flex: 1, height: 38, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, justifyContent: "center" },
  toPlaceholder: { fontFamily: fontFamily.body, fontSize: 13 },
  section: { fontFamily: fontFamily.socialExtrabold, fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase", paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "transparent" },
  row: { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 1 },
  onlineDot: { position: "absolute", bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, borderWidth: 2 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  handle: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 1 },
  vendorTag: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 1 },
});
