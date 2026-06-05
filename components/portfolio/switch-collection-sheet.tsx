import { BottomSheet } from "@/components/ui/bottom-sheet";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { Collection } from "@/hooks/use-collections";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * Screen 9 — the collection switcher. This sheet *is* the collections list
 * (there is no standalone list screen). Tap a collection to make it active.
 */
export function SwitchCollectionSheet({
  visible,
  onClose,
  collections,
  activeId,
  onSelect,
  onNewCollection,
}: {
  visible: boolean;
  onClose: () => void;
  collections: Collection[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewCollection: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Your collections">
      <Text style={styles.subtitle}>
        {collections.length}{" "}
        {collections.length === 1 ? "collection" : "collections"}
      </Text>

      <ScrollView style={styles.list} bounces={false}>
        {collections.map((c, i) => {
          const isActive = c.id === activeId;
          return (
            <Pressable
              key={c.id}
              style={[styles.row, isActive && styles.rowActive]}
              onPress={() => {
                onSelect(c.id);
                onClose();
              }}
            >
              <View style={styles.thumb} />
              <View style={styles.flex}>
                <View style={styles.nameRow}>
                  <Text
                    style={[styles.name, isActive && styles.nameActive]}
                    numberOfLines={1}
                  >
                    {c.name}
                  </Text>
                  {/* The oldest collection is the seeded "Main" default. */}
                  {i === 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>DEFAULT</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.count}>0 cards</Text>
              </View>
              {isActive ? (
                <Ionicons name="checkmark" size={20} color={colors.accent} />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable style={styles.newButton} onPress={onNewCollection}>
        <Ionicons name="add" size={20} color={colors.accent} />
        <Text style={styles.newButtonText}>New collection</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  list: { flexGrow: 0 },
  flex: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  rowActive: { backgroundColor: colors.accentSoft },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  nameActive: { color: colors.accent },
  count: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  badge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.textTertiary,
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
  },
  newButtonText: { color: colors.accent, fontSize: fontSize.md, fontWeight: "700" },
});
