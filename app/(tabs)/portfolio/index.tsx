import {
  CardFilter,
  CardSort,
  CollectionView,
  FilterSheet,
} from "@/components/portfolio/filter-sheet";
import { NewCollectionModal } from "@/components/portfolio/new-collection-modal";
import { SwitchCollectionSheet } from "@/components/portfolio/switch-collection-sheet";
import { Avatar } from "@/components/ui/avatar";
import { CardThumb } from "@/components/ui/card-thumb";
import { StateBadge } from "@/components/ui/state-badge";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { Card, useCards } from "@/hooks/use-cards";
import { useCollections } from "@/hooks/use-collections";
import { useProfile } from "@/hooks/use-profile";
import { CONDITION_RANK } from "@/lib/card-constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function PortfolioTab() {
  const { data: profile } = useProfile();
  const { data: collections, isLoading, isError } = useCollections();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const [view, setView] = useState<CollectionView>("grid");
  const [filter, setFilter] = useState<CardFilter>("all");
  const [sort, setSort] = useState<CardSort>("recent");

  const active =
    collections?.find((c) => c.id === activeId) ?? collections?.[0] ?? null;
  const { data: cards } = useCards(active?.id);

  const displayName = profile?.display_name || profile?.username || "";

  // Apply Show filter + Sort to the active collection's cards.
  const visible = useMemo(() => {
    let list = cards ?? [];
    if (filter !== "all") list = list.filter((c) => c.state === filter);
    const sorted = [...list];
    if (sort === "name") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "set") {
      sorted.sort((a, b) => (a.set_name ?? "").localeCompare(b.set_name ?? ""));
    } else if (sort === "condition") {
      sorted.sort(
        (a, b) =>
          (CONDITION_RANK[a.condition ?? ""] ?? 99) -
          (CONDITION_RANK[b.condition ?? ""] ?? 99),
      );
    }
    // "recent" keeps the query's created_at-desc order.
    return sorted;
  }, [cards, filter, sort]);

  // Pad the grid so the last row's items don't stretch.
  const gridData = useMemo(() => {
    if (view !== "grid") return visible;
    const pad = (3 - (visible.length % 3)) % 3;
    return [...visible, ...Array<null>(pad).fill(null)];
  }, [visible, view]);

  const count = cards?.length ?? 0;

  function openAddCard() {
    if (!active) return;
    router.push({
      pathname: "/(tabs)/portfolio/add-card",
      params: { collectionId: active.id },
    });
  }

  function openCard(id: string) {
    router.push({ pathname: "/(tabs)/portfolio/card/[id]", params: { id } });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.titleBlock}
          onPress={() => active && setSwitchOpen(true)}
          disabled={!active}
        >
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {active?.name ?? "Portfolio"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </View>
          <Text style={styles.subtitle}>
            {count} {count === 1 ? "card" : "cards"}
          </Text>
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable onPress={() => setFilterOpen(true)} hitSlop={8} disabled={!active}>
            <Ionicons
              name="options-outline"
              size={24}
              color={active ? colors.text : colors.textTertiary}
            />
          </Pressable>
          <Pressable onPress={() => router.push("/profile")} hitSlop={8}>
            <Avatar name={displayName} size={36} />
          </Pressable>
        </View>
      </View>

      {/* Body */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !active ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load your collections.</Text>
        </View>
      ) : count === 0 ? (
        <View style={styles.empty}>
          <Pressable style={styles.emptyCard} onPress={openAddCard}>
            <Ionicons name="add" size={40} color={colors.textTertiary} />
          </Pressable>
          <Text style={styles.emptyTitle}>Add your first card</Text>
          <Text style={styles.emptyText}>
            Add a card to {active.name}. Later you can showcase or list it.
          </Text>
        </View>
      ) : visible.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.muted}>No cards match this filter.</Text>
        </View>
      ) : view === "grid" ? (
        <FlatList
          key="grid"
          data={gridData}
          keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) =>
            item ? (
              <CardThumb card={item} onPress={() => openCard(item.id)} />
            ) : (
              <View style={styles.spacer} />
            )
          }
        />
      ) : (
        <FlatList
          key="list"
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CardRow card={item} onPress={() => openCard(item.id)} />
          )}
        />
      )}

      {/* Floating add button */}
      {active && count > 0 ? (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={openAddCard}
        >
          <Ionicons name="add" size={28} color={colors.textInverse} />
        </Pressable>
      ) : null}

      {/* Sheets & modals */}
      {collections ? (
        <SwitchCollectionSheet
          visible={switchOpen}
          onClose={() => setSwitchOpen(false)}
          collections={collections}
          activeId={active?.id ?? null}
          onSelect={setActiveId}
          onNewCollection={() => {
            setSwitchOpen(false);
            setNewOpen(true);
          }}
        />
      ) : null}

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        view={view}
        onViewChange={setView}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
      />

      <NewCollectionModal
        visible={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={(id) => {
          setActiveId(id);
          setNewOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

function CardRow({ card, onPress }: { card: Card; onPress: () => void }) {
  const subtitle = [card.set_name, card.condition].filter(Boolean).join(" · ");
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.rowThumb}>
        <CardThumb card={card} onPress={onPress} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {card.title}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {subtitle || `added ${timeAgo(card.created_at)}`}
        </Text>
      </View>
      <StateBadge state={card.state} />
    </Pressable>
  );
}

const GRID_GAP = spacing.sm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  titleBlock: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  title: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary },
  headerActions: { flexDirection: "row", alignItems: "center", gap: spacing.lg },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  emptyCard: {
    width: 120,
    height: 168,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  grid: { padding: spacing.lg, gap: GRID_GAP },
  gridRow: { gap: GRID_GAP },
  spacer: { flex: 1 },

  list: { padding: spacing.lg, gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowPressed: { opacity: 0.6 },
  rowThumb: { width: 48 },
  rowTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  rowSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },

  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabPressed: { backgroundColor: colors.accentPressed },
});
