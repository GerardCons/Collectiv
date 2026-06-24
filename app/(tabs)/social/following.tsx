import { SocialPageHead } from "@/components/social/social-bits";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { FOLLOWING_LIST } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Following() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SocialPageHead title="Following" />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.section, { color: colors.fgTertiary }]}>Collectors & vendors · {FOLLOWING_LIST.length}</Text>
        {FOLLOWING_LIST.map((p) => (
          <View key={p.handle} style={[styles.row, { borderBottomColor: colors.borderDefault }]}>
            <Avatar name={p.name} size={42} color={p.color} />
            <View style={styles.flex}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{p.name}</Text>
                {p.vendor ? (
                  <View style={[styles.vendorBadge, { backgroundColor: colors.secondaryMuted }]}>
                    <Text style={[styles.vendorText, { color: colors.secondary }]}>VENDOR</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.handle, { color: colors.fgTertiary }]}>@{p.handle}{p.mutual ? " · Follows you" : ""}</Text>
            </View>
            <Pressable style={[styles.btn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Ionicons name="checkmark" size={12} color={colors.fgSecondary} />
              <Text style={[styles.btnText, { color: colors.fgSecondary }]}>Following</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  body: { padding: space.lg },
  section: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13, flexShrink: 1 },
  vendorBadge: { paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999 },
  vendorText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8 },
  handle: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
  btn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  btnText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
});
