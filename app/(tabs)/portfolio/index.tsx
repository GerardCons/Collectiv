import { FilterSheet } from "@/components/portfolio/filter-sheet";
import { NewCollectionSheet } from "@/components/portfolio/new-collection-modal";
import { PortfolioCardCell } from "@/components/portfolio/portfolio-card";
import { SwitchCollectionSheet } from "@/components/portfolio/switch-collection-sheet";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import {
  activePills,
  applyFilters,
  COLLECTIONS,
  DEFAULT_FILTERS,
  PortfolioCollection,
  PortfolioFilters,
} from "@/lib/portfolio-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CORAL = "#E76F51";

export default function PortfolioTab() {
  const { colors } = useTheme();
  const [collections, setCollections] = useState<PortfolioCollection[]>(COLLECTIONS);
  const [activeId, setActiveId] = useState(COLLECTIONS[0].id);
  const [filters, setFilters] = useState<PortfolioFilters>(DEFAULT_FILTERS);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const active = collections.find((c) => c.id === activeId) ?? collections[0];
  const pills = activePills(filters);
  const hasFilters = pills.length > 0;
  const visible = useMemo(() => applyFilters(active.cards, filters), [active, filters]);

  const gridData = useMemo(() => {
    const pad = (3 - (visible.length % 3)) % 3;
    return [...visible, ...Array<null>(pad).fill(null)];
  }, [visible]);

  const subtitle =
    active.visibility === "private"
      ? "@jakescollects · Private"
      : `@jakescollects · ${active.followers ?? 0} followers`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={[styles.title, { color: colors.fgPrimary }]} numberOfLines={1}>{active.name}</Text>
          <Text style={[styles.subtitle, { color: colors.fgSecondary }]}>{subtitle}</Text>
        </View>
        <Pressable
          style={[styles.addPill, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}
          onPress={() => router.push("/add-card/scan")}
        >
          <Ionicons name="add" size={14} color={colors.primary} />
          <Text style={[styles.addText, { color: colors.primary }]}>Add</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/profile")} hitSlop={6}>
          <Avatar name="Jake" size={32} color={CORAL} />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        {[
          { v: active.stats.value, l: "Total Value", accent: true },
          { v: active.stats.cards, l: "Cards" },
          { v: active.stats.sets, l: "Sets" },
        ].map((s, i) => (
          <View key={s.l} style={[styles.stat, i > 0 && { borderLeftWidth: 1, borderLeftColor: colors.borderDefault, paddingLeft: 14, alignItems: "center" }]}>
            <Text style={[styles.statValue, { color: s.accent ? colors.primary : colors.fgPrimary }]}>{s.v}</Text>
            <Text style={[styles.statLabel, { color: colors.fgTertiary }]}>{s.l}</Text>
          </View>
        ))}
      </View>

      {/* Collection chips */}
      <View style={styles.chipRow}>
        <Pressable
          style={[styles.colChip, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
          onPress={() => setSwitchOpen(true)}
        >
          <Text style={styles.folder}>📁</Text>
          <Text style={[styles.colChipText, { color: colors.fgPrimary }]} numberOfLines={1}>{active.name}</Text>
          <Ionicons name="chevron-down" size={11} color={colors.fgTertiary} />
        </Pressable>

        {hasFilters ? (
          <Pressable
            style={[styles.filterChip, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}
            onPress={() => setFilters(DEFAULT_FILTERS)}
          >
            <Ionicons name="options-outline" size={12} color={colors.primary} />
            <Text style={[styles.filterChipText, { color: colors.primary }]}>{pills.length} active</Text>
            <Ionicons name="close" size={11} color={colors.primary} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.addColChip, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}
            onPress={() => setNewOpen(true)}
          >
            <Ionicons name="add" size={13} color={colors.primary} />
            <Text style={[styles.addText, { color: colors.primary }]}>Collection</Text>
          </Pressable>
        )}

        <Pressable style={styles.filterBtn} onPress={() => setFilterOpen(true)} hitSlop={6}>
          <Ionicons name="options-outline" size={22} color={colors.fgPrimary} />
        </Pressable>
      </View>

      {/* Active filter pills */}
      {hasFilters ? (
        <View style={styles.pills}>
          {pills.map((p) => (
            <View key={p.key} style={[styles.pill, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
              <Text style={[styles.pillText, { color: colors.secondary }]}>{p.label} ✕</Text>
            </View>
          ))}
          <Pressable onPress={() => setFilters(DEFAULT_FILTERS)} style={[styles.pill, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Text style={[styles.pillText, { color: colors.fgTertiary }]}>Clear All</Text>
          </Pressable>
        </View>
      ) : null}

      {hasFilters ? (
        <Text style={[styles.matchLabel, { color: colors.fgTertiary }]}>{visible.length} Cards Matching</Text>
      ) : null}

      {/* Grid / empty */}
      {active.cards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyGlyph}>📦</Text>
          <Text style={[styles.emptyTitle, { color: colors.fgPrimary }]}>Empty Collection</Text>
          <Text style={[styles.emptyText, { color: colors.fgSecondary }]}>
            Start adding cards to your {active.name} collection
          </Text>
          <Pressable style={[styles.emptyBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/add-card/scan")}>
            <Text style={styles.emptyBtnText}>+ Add First Card</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={gridData}
          keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            item ? (
              <PortfolioCardCell
                card={item}
                onPress={() => router.push({ pathname: "/(tabs)/portfolio/card/[id]", params: { id: item.id } })}
              />
            ) : (
              <View style={styles.spacer} />
            )
          }
        />
      )}

      {/* Sheets */}
      <SwitchCollectionSheet
        visible={switchOpen}
        onClose={() => setSwitchOpen(false)}
        collections={collections}
        activeId={active.id}
        onSelect={setActiveId}
        onNewCollection={() => {
          setSwitchOpen(false);
          setNewOpen(true);
        }}
      />
      <NewCollectionSheet
        visible={newOpen}
        onClose={() => setNewOpen(false)}
        onCreate={(name, color, vis) => {
          const id = `col-${Date.now()}`;
          setCollections((prev) => [
            ...prev,
            { id, name, color, visibility: vis, followers: null, stats: { value: "$—", cards: "0", sets: "0" }, cards: [] },
          ]);
          setActiveId(id);
        }}
      />
      <FilterSheet visible={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onApply={setFilters} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },

  header: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: space.lg, paddingTop: 2, paddingBottom: 10 },
  title: { fontFamily: fontFamily.socialBold, fontSize: 20 },
  subtitle: { fontFamily: fontFamily.socialMedium, fontSize: 11, marginTop: 1 },
  addPill: { flexDirection: "row", alignItems: "center", gap: 2, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  addText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  stats: { flexDirection: "row", paddingHorizontal: space.lg, paddingBottom: 12 },
  stat: { flex: 1 },
  statValue: { fontFamily: fontFamily.bodyBold, fontSize: 18 },
  statLabel: { fontFamily: fontFamily.bodySemibold, fontSize: 9, marginTop: 2 },

  chipRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: space.lg, paddingBottom: 12 },
  colChip: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999, borderWidth: 1, maxWidth: 200 },
  folder: { fontSize: 12 },
  colChipText: { fontFamily: fontFamily.socialSemibold, fontSize: 13, flexShrink: 1 },
  addColChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1.5 },
  filterChipText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  filterBtn: { marginLeft: "auto" },

  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: space.lg, paddingBottom: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  pillText: { fontFamily: fontFamily.socialBold, fontSize: 10 },
  matchLabel: { fontFamily: fontFamily.socialBold, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", paddingHorizontal: space.lg, paddingBottom: 8 },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 12 },
  emptyGlyph: { fontSize: 56 },
  emptyTitle: { fontFamily: fontFamily.socialBold, fontSize: 18 },
  emptyText: { fontFamily: fontFamily.body, fontSize: 13, textAlign: "center", lineHeight: 20 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, marginTop: 4 },
  emptyBtnText: { fontFamily: fontFamily.socialBold, fontSize: 14, color: "#fff" },

  grid: { paddingHorizontal: 12, paddingBottom: 16, gap: 6 },
  gridRow: { gap: 6 },
  spacer: { flex: 1 },
});
