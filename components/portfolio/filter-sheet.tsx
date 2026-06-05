import { BottomSheet } from "@/components/ui/bottom-sheet";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type CollectionView = "grid" | "list";
export type CardFilter = "all" | "showcased" | "listed" | "private";
export type CardSort =
  | "recent"
  | "set"
  | "condition"
  | "name";

export const SORT_LABELS: Record<CardSort, string> = {
  recent: "Recently added",
  set: "Set & number",
  condition: "Condition (best → worst)",
  name: "Name A → Z",
};

const FILTERS: { key: CardFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "showcased", label: "Showcased" },
  { key: "listed", label: "Listed" },
  { key: "private", label: "Private" },
];

/**
 * Screen 11 — Filter & view. The view toggle is wired to the Portfolio layout;
 * Show / Sort are stored now and start filtering real cards in Phase 2.
 */
export function FilterSheet({
  visible,
  onClose,
  view,
  onViewChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: {
  visible: boolean;
  onClose: () => void;
  view: CollectionView;
  onViewChange: (v: CollectionView) => void;
  filter: CardFilter;
  onFilterChange: (f: CardFilter) => void;
  sort: CardSort;
  onSortChange: (s: CardSort) => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filter & view">
      <Text style={styles.label}>VIEW</Text>
      <View style={styles.segment}>
        {(["grid", "list"] as CollectionView[]).map((v) => (
          <Pressable
            key={v}
            style={[styles.segmentItem, view === v && styles.segmentItemActive]}
            onPress={() => onViewChange(v)}
          >
            <Ionicons
              name={v === "grid" ? "grid-outline" : "list-outline"}
              size={16}
              color={view === v ? colors.text : colors.textSecondary}
            />
            <Text
              style={[styles.segmentText, view === v && styles.segmentTextActive]}
            >
              {v === "grid" ? "Grid" : "List"}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>SHOW</Text>
      <View style={styles.pills}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onFilterChange(f.key)}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>SORT BY</Text>
      <View>
        {(Object.keys(SORT_LABELS) as CardSort[]).map((key) => {
          const active = sort === key;
          return (
            <Pressable
              key={key}
              style={styles.sortRow}
              onPress={() => onSortChange(key)}
            >
              <Text
                style={[styles.sortText, active && styles.sortTextActive]}
              >
                {SORT_LABELS[key]}
              </Text>
              {active ? (
                <Ionicons name="checkmark" size={20} color={colors.accent} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textTertiary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  segmentItemActive: { backgroundColor: colors.background },
  segmentText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: "600" },
  segmentTextActive: { color: colors.text },

  pills: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  pillText: { fontSize: fontSize.sm, color: colors.textSecondary },
  pillTextActive: { color: colors.accent, fontWeight: "700" },

  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sortText: { fontSize: fontSize.md, color: colors.text },
  sortTextActive: { color: colors.accent, fontWeight: "700" },
});
