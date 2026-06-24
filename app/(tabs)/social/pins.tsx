import { GroupAvatar, SocialPageHead } from "@/components/social/social-bits";
import { fontFamily, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Row = { id: string; avatar: string; color: string; name: string; members: string; pinned: boolean };
const INITIAL: Row[] = [
  { id: "g1", avatar: "🃏", color: "#7C3AED", name: "Edmonton Card Collectors", members: "2,431 members", pinned: true },
  { id: "g2", avatar: "💎", color: "#E76F51", name: "PSA 10 Hunters", members: "8,120 members", pinned: true },
  { id: "g3", avatar: "🏀", color: "#f59e0b", name: "Vintage Hoops Vault", members: "5,389 members", pinned: false },
];

export default function Pins() {
  const { colors } = useTheme();
  const [rows, setRows] = useState(INITIAL);
  const pinned = rows.filter((r) => r.pinned);
  const others = rows.filter((r) => !r.pinned);

  function togglePin(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, pinned: !r.pinned } : r)));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SocialPageHead title="Pinned Groups" action="Done" onAction={() => router.back()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.intro, { color: colors.fgSecondary }]}>
          Pinned groups show at the top of your Groups tab for quick access.
        </Text>

        <Text style={[styles.section, { color: colors.fgTertiary }]}>Pinned</Text>
        {pinned.map((r) => (
          <View key={r.id} style={[styles.row, { borderBottomColor: colors.borderDefault }]}>
            <Ionicons name="reorder-three-outline" size={17} color={colors.fgTertiary} />
            <GroupAvatar group={r} size={40} />
            <View style={styles.flex}>
              <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{r.name}</Text>
              <Text style={[styles.meta, { color: colors.fgTertiary }]}>{r.members}</Text>
            </View>
            <Pressable onPress={() => togglePin(r.id)} hitSlop={8}>
              <Ionicons name="star" size={18} color={colors.warning} />
            </Pressable>
          </View>
        ))}

        <Text style={[styles.section, { color: colors.fgTertiary, marginTop: 16 }]}>Your Other Groups</Text>
        {others.map((r) => (
          <View key={r.id} style={styles.row}>
            <View style={{ width: 17 }} />
            <GroupAvatar group={r} size={40} />
            <View style={styles.flex}>
              <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{r.name}</Text>
              <Text style={[styles.meta, { color: colors.fgTertiary }]}>{r.members}</Text>
            </View>
            <Pressable onPress={() => togglePin(r.id)} hitSlop={8}>
              <Ionicons name="star-outline" size={18} color={colors.fgTertiary} />
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
  intro: { fontFamily: fontFamily.body, fontSize: 11.5, lineHeight: 17, marginBottom: 16 },
  section: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 10, borderBottomWidth: 1 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  meta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
});
