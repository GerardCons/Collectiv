import { GradientThumb } from "@/components/home/gradient-thumb";
import { Button } from "@/components/ui/button";
import { fontFamily, radii, space } from "@/constants/theme";
import { SEARCH_RESULTS, SearchResult } from "@/lib/add-card-mock";
import { useAddCardDraft } from "@/lib/add-card-store";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState("Charizard");
  const [selected, setSelected] = useState<SearchResult | null>(SEARCH_RESULTS[0]);

  const results = SEARCH_RESULTS.filter((r) =>
    query.trim() ? r.name.toLowerCase().includes(query.trim().toLowerCase()) : true,
  );

  function select() {
    if (!selected) return;
    useAddCardDraft.getState().patch({
      source: "search",
      frontUri: null,
      backUri: null,
      referenceAccent: selected.accent,
      name: selected.name,
    });
    router.push("/add-card/confirm");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <View style={styles.searchRow}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={[styles.backCircle, { backgroundColor: colors.bgSurface }]}>
          <Ionicons name="arrow-back" size={16} color={colors.fgPrimary} />
        </Pressable>
        <View style={[styles.searchBox, { backgroundColor: colors.bgSurface, borderColor: colors.primary }]}>
          <Ionicons name="search" size={14} color={colors.fgTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.fgPrimary }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or set"
            placeholderTextColor={colors.fgTertiary}
            autoFocus
          />
          {query ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close" size={13} color={colors.fgTertiary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <Text style={[styles.count, { color: colors.fgTertiary }]}>{results.length} Results Found</Text>

      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {results.map((r) => {
          const on = selected?.id === r.id;
          return (
            <Pressable
              key={r.id}
              onPress={() => setSelected(r)}
              style={[styles.row, { backgroundColor: on ? colors.primaryMuted : colors.bgSurface, borderColor: on ? colors.primary : colors.borderDefault }]}
            >
              <GradientThumb accent={r.accent} width={44} height={62} radius={6} />
              <View style={styles.flex}>
                <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{r.name}</Text>
                <Text style={[styles.set, { color: colors.fgSecondary }]} numberOfLines={1}>{r.set}</Text>
              </View>
              {on ? (
                <View style={[styles.check, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={13} color="#fff" />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Select This Card →" onPress={select} disabled={!selected} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: space.lg, paddingTop: 4, paddingBottom: 12 },
  backCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radii.full, borderWidth: 1.5 },
  searchInput: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  count: { fontFamily: fontFamily.socialBold, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", paddingHorizontal: space.lg, paddingBottom: 10 },
  list: { paddingHorizontal: space.lg, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 10, paddingHorizontal: 12, borderRadius: radii.md, borderWidth: 1.5 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  set: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 2 },
  check: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  footer: { padding: space.lg, paddingBottom: space.sm },
});
