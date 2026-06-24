import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { GROUP_SEARCH_RESULTS } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupSearch() {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const results = GROUP_SEARCH_RESULTS.filter((r) =>
    query.trim() ? (r.name + r.text).toLowerCase().includes(query.trim().toLowerCase()) : true,
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <View style={styles.searchRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <View style={[styles.search, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="search" size={13} color={colors.fgTertiary} />
          <TextInput
            style={[styles.input, { color: colors.fgPrimary }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search in Vintage Hoops Vault"
            placeholderTextColor={colors.fgTertiary}
            autoFocus
          />
        </View>
      </View>

      {query.trim() ? (
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={[styles.section, { color: colors.fgTertiary }]}>Results in this group</Text>
          {results.map((r, i) => (
            <View key={i} style={[styles.row, { borderBottomColor: colors.borderDefault }]}>
              <Avatar name={r.name} size={38} color={r.color} />
              <View style={styles.flex}>
                <Text style={[styles.who, { color: colors.fgPrimary }]} numberOfLines={1}>
                  <Text style={styles.whoBold}>{r.name}</Text> <Text style={{ color: colors.fgTertiary }}>{r.verb}</Text>
                </Text>
                <Text style={[styles.snippet, { color: colors.fgSecondary }]} numberOfLines={1}>{r.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={[styles.empty, { color: colors.fgTertiary }]}>No recent searches</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: space.lg, paddingBottom: 12, paddingTop: 2 },
  search: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, height: 38, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  input: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  section: { fontFamily: fontFamily.socialExtrabold, fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase", paddingHorizontal: space.lg, paddingVertical: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: space.lg, paddingVertical: 10, borderBottomWidth: 1 },
  who: { fontFamily: fontFamily.body, fontSize: 12.5 },
  whoBold: { fontFamily: fontFamily.socialBold },
  snippet: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 2 },
  empty: { fontFamily: fontFamily.body, fontSize: 13, padding: 16 },
});
