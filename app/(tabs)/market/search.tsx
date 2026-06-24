import { MarketCard } from "@/components/market/market-card";
import { fontFamily, space } from "@/constants/theme";
import { LISTINGS, SEARCH_SUGGESTIONS } from "@/lib/market-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MarketSearch() {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState(0);

  const state = submitted ? "results" : query.trim() ? "typing" : "empty";

  const suggestions = useMemo(
    () => SEARCH_SUGGESTIONS.filter((s) => s.q.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  const gridData = useMemo(() => {
    const pad = (3 - (LISTINGS.length % 3)) % 3;
    return [...LISTINGS, ...Array<null>(pad).fill(null)];
  }, []);

  function submit(q?: string) {
    if (q) setQuery(q);
    if ((q ?? query).trim()) setSubmitted(true);
  }

  function clear() {
    setQuery("");
    setSubmitted(false);
  }

  const focused = state !== "results";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBox,
            focused
              ? { backgroundColor: colors.bgBase, borderColor: colors.primary, borderWidth: 1.5 }
              : { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault, borderWidth: 1 },
          ]}
        >
          <Ionicons name="search" size={14} color={focused ? colors.primary : colors.fgTertiary} />
          <TextInput
            style={[styles.input, { color: colors.fgPrimary }]}
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              setSubmitted(false);
            }}
            onSubmitEditing={() => submit()}
            placeholder="Search cards, sellers…"
            placeholderTextColor={colors.fgTertiary}
            autoFocus
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={clear} hitSlop={8}>
              <Ionicons name="close" size={13} color={colors.fgTertiary} />
            </Pressable>
          ) : null}
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.cancel, { color: colors.primary }]}>Cancel</Text>
        </Pressable>
      </View>

      {/* ── Empty ── */}
      {state === "empty" ? (
        <>
          <View style={[styles.tabs, { borderBottomColor: colors.borderDefault }]}>
            {["Recent Searches", "Saved Searches"].map((label, i) => {
              const on = tab === i;
              return (
                <Pressable key={label} style={styles.tab} onPress={() => setTab(i)}>
                  <Text style={[styles.tabText, { color: on ? colors.primary : colors.fgTertiary }]}>{label}</Text>
                  <View style={[styles.tabUnderline, { backgroundColor: on ? colors.primary : "transparent" }]} />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.emptyBody}>
            <Ionicons name={tab === 0 ? "time-outline" : "bookmark-outline"} size={40} color={colors.fgTertiary} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyTitle, { color: colors.fgSecondary }]}>
              {tab === 0 ? "No recent searches" : "No saved searches"}
            </Text>
            <Text style={[styles.emptyText, { color: colors.fgTertiary }]}>
              {tab === 0 ? "Your recent searches will appear here once you start searching" : "Save a search to get notified about new matching listings"}
            </Text>
          </View>
        </>
      ) : null}

      {/* ── Typing ── */}
      {state === "typing" ? (
        <ScrollView keyboardShouldPersistTaps="handled">
          {suggestions.map((s) => (
            <Pressable
              key={s.q}
              style={[styles.suggestRow, { borderBottomColor: colors.borderDefault }]}
              onPress={() => submit(s.q)}
            >
              <Ionicons name="search" size={15} color={colors.fgTertiary} />
              <View style={styles.flex}>
                <Text style={[styles.suggestText, { color: colors.fgPrimary }]} numberOfLines={1}>
                  <Text style={{ color: colors.primary, fontFamily: fontFamily.bodyBold }}>{query.trim()}</Text>
                  {s.q.toLowerCase().startsWith(query.trim().toLowerCase()) ? s.q.slice(query.trim().length) : ` · ${s.q}`}
                </Text>
                <Text style={[styles.suggestSub, { color: colors.fgTertiary }]}>{s.sub}</Text>
              </View>
              <Ionicons name="arrow-up-outline" size={13} color={colors.fgTertiary} style={{ transform: [{ rotate: "45deg" }] }} />
            </Pressable>
          ))}
          <Pressable style={styles.suggestRow} onPress={() => submit()}>
            <Ionicons name="search" size={15} color={colors.primary} />
            <Text style={[styles.searchAll, { color: colors.primary }]}>Search &quot;{query.trim()}&quot; in all categories</Text>
          </Pressable>
        </ScrollView>
      ) : null}

      {/* ── Results ── */}
      {state === "results" ? (
        <FlatList
          data={gridData}
          keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.resultsHead}>
                <View style={[styles.sortChip, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
                  <Text style={[styles.sortText, { color: colors.primary }]}>Suggested</Text>
                  <Ionicons name="chevron-down" size={10} color={colors.primary} />
                </View>
                <View style={[styles.circle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
                  <Ionicons name="options-outline" size={15} color={colors.fgSecondary} />
                </View>
                <View style={[styles.circle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
                  <Ionicons name="bookmark-outline" size={14} color={colors.fgSecondary} />
                </View>
              </View>
              <Text style={[styles.resultsCount, { color: colors.fgTertiary }]}>143 results · within 25 km</Text>
            </View>
          }
          renderItem={({ item }) =>
            item ? (
              <MarketCard listing={item} onPress={() => router.push({ pathname: "/(tabs)/market/[id]", params: { id: item.id } })} />
            ) : (
              <View style={styles.spacer} />
            )
          }
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: space.lg, paddingTop: 4, paddingBottom: 12 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, height: 40, paddingHorizontal: 12, borderRadius: 12 },
  input: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  cancel: { fontFamily: fontFamily.socialSemibold, fontSize: 13 },

  tabs: { flexDirection: "row", borderBottomWidth: 1.5 },
  tab: { flex: 1, alignItems: "center", paddingTop: 10, gap: 9 },
  tabText: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  tabUnderline: { height: 2, width: "60%", borderRadius: 2 },
  emptyBody: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontFamily: fontFamily.socialSemibold, fontSize: 13 },
  emptyText: { fontFamily: fontFamily.body, fontSize: 11, textAlign: "center", lineHeight: 17 },

  suggestRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: space.lg, paddingVertical: 11, borderBottomWidth: 1 },
  suggestText: { fontFamily: fontFamily.body, fontSize: 13 },
  suggestSub: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  searchAll: { fontFamily: fontFamily.socialSemibold, fontSize: 13 },

  resultsHead: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 4, paddingBottom: 10 },
  sortChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  sortText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  circle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  resultsCount: { fontFamily: fontFamily.body, fontSize: 11, paddingHorizontal: 4, paddingBottom: 8 },

  grid: { paddingHorizontal: 12, paddingBottom: 16, gap: 6 },
  gridRow: { gap: 6 },
  spacer: { flex: 1 },
});
