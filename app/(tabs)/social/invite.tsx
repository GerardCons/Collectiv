import { SocialPageHead } from "@/components/social/social-bits";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { INVITE_PEOPLE } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InvitePicker() {
  const { colors } = useTheme();
  const [people, setPeople] = useState(INVITE_PEOPLE);
  const [query, setQuery] = useState("");

  const count = people.filter((p) => p.selected).length;
  const visible = people.filter((p) =>
    query.trim() ? (p.name + p.handle).toLowerCase().includes(query.trim().toLowerCase()) : true,
  );

  function toggle(handle: string) {
    setPeople((prev) => prev.map((p) => (p.handle === handle ? { ...p, selected: !p.selected } : p)));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <SocialPageHead title="Invite Members" action="Done" onAction={() => router.back()} />

      <View style={styles.searchWrap}>
        <View style={[styles.search, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="search" size={14} color={colors.fgTertiary} />
          <TextInput
            style={[styles.input, { color: colors.fgPrimary }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search followers…"
            placeholderTextColor={colors.fgTertiary}
          />
        </View>
      </View>

      <Text style={[styles.section, { color: colors.fgTertiary }]}>Your Followers</Text>
      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {visible.map((p) => (
          <Pressable key={p.handle} style={[styles.row, { borderBottomColor: colors.borderDefault }]} onPress={() => toggle(p.handle)}>
            <Avatar name={p.name} size={42} color={p.color} />
            <View style={styles.flex}>
              <Text style={[styles.name, { color: colors.fgPrimary }]}>{p.name}</Text>
              <Text style={[styles.handle, { color: colors.fgTertiary }]}>@{p.handle}</Text>
            </View>
            <View style={[styles.check, p.selected ? { backgroundColor: colors.secondary } : { borderWidth: 2, borderColor: colors.borderDefault }]}>
              {p.selected ? <Ionicons name="checkmark" size={13} color="#fff" /> : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.borderDefault }]}>
        <Pressable style={[styles.cta, { backgroundColor: colors.secondary, opacity: count ? 1 : 0.5 }]} disabled={!count} onPress={() => router.back()}>
          <Text style={styles.ctaText}>Invite {count} Selected</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  searchWrap: { paddingHorizontal: space.lg, paddingTop: 14, paddingBottom: 12 },
  search: { flexDirection: "row", alignItems: "center", gap: 8, height: 38, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  input: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  section: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", paddingHorizontal: space.lg, paddingBottom: 4 },
  list: { paddingHorizontal: space.lg },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  handle: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
  check: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  footer: { padding: space.lg, paddingBottom: 24, borderTopWidth: 1 },
  cta: { paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  ctaText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
