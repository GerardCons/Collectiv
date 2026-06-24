import { BottomSheet } from "@/components/ui/bottom-sheet";
import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { PortfolioCollection } from "@/lib/portfolio-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Collection switcher sheet (COL_Switcher). The sheet *is* the collections
 *  list — tap one to make it active, or create a new one. */
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
  collections: PortfolioCollection[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewCollection: () => void;
}) {
  const { colors } = useTheme();
  return (
    <BottomSheet visible={visible} onClose={onClose} title="My Collections">
      {collections.map((c) => {
        const active = c.id === activeId;
        return (
          <Pressable
            key={c.id}
            style={[styles.row, { borderBottomColor: colors.borderDefault }]}
            onPress={() => {
              onSelect(c.id);
              onClose();
            }}
          >
            <View style={[styles.tile, { backgroundColor: `${c.color}22` }]}>
              <Text style={styles.tileGlyph}>📁</Text>
            </View>
            <View style={styles.flex}>
              <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{c.name}</Text>
              <Text style={[styles.meta, { color: colors.fgSecondary }]}>
                {c.cards.length} cards{active ? " · Active" : ""}
              </Text>
            </View>
            {active ? (
              <View style={[styles.check, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={13} color="#fff" />
              </View>
            ) : null}
          </Pressable>
        );
      })}

      <Pressable style={styles.row} onPress={onNewCollection}>
        <View style={[styles.tileDashed, { borderColor: colors.borderDefault }]}>
          <Ionicons name="add" size={20} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text style={[styles.name, { color: colors.primary }]}>Create New Collection</Text>
          <Text style={[styles.meta, { color: colors.fgSecondary }]}>Organize by set, game, or theme</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.fgTertiary} />
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: space.md,
    borderBottomWidth: 1,
  },
  tile: { width: 36, height: 36, borderRadius: radii.md, alignItems: "center", justifyContent: "center" },
  tileGlyph: { fontSize: 17 },
  tileDashed: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontFamily: fontFamily.socialBold, fontSize: fontSizes.base },
  meta: { fontFamily: fontFamily.body, fontSize: fontSizes.xs, marginTop: 1 },
  check: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
});
