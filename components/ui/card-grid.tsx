import { CardThumb } from "@/components/ui/card-thumb";
import { space, text } from "@/constants/theme";
import { Card } from "@/hooks/use-cards";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Simple 3-column card grid rendered as plain rows (not a FlatList) so it can
 * live inside a ScrollView — used by the Profile tabs. Last row is padded with
 * spacers so cards don't stretch.
 */
export function CardGrid({
  cards,
  onCardPress,
  emptyText,
}: {
  cards: Card[];
  onCardPress: (id: string) => void;
  emptyText: string;
}) {
  const { colors } = useTheme();

  if (cards.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="images-outline" size={28} color={colors.fgTertiary} />
        <Text style={[styles.emptyText, { color: colors.fgSecondary }]}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {chunk(cards, 3).map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((c) => (
            <CardThumb key={c.id} card={c} onPress={() => onCardPress(c.id)} />
          ))}
          {Array.from({ length: 3 - row.length }).map((_, i) => (
            <View key={`s${i}`} style={styles.spacer} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { padding: space.lg, gap: space.sm },
  row: { flexDirection: "row", gap: space.sm },
  spacer: { flex: 1 },
  empty: { alignItems: "center", gap: space.sm, paddingVertical: space["3xl"] },
  emptyText: { ...text.bodySm },
});
