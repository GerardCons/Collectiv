import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily, radii, shadows } from "@/constants/theme";
import { PortfolioCard as Card } from "@/lib/portfolio-mock";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

const GLYPH: Record<Card["state"], string> = {
  private: "🔒",
  showcased: "⭐",
  listed: "🏷",
};

/** Portfolio grid cell: gradient art + grade / visibility / NEW overlays + meta. */
export function PortfolioCardCell({ card, onPress }: { card: Card; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.cell, { backgroundColor: colors.bgBase }, shadows.sm]} onPress={onPress}>
      <View style={styles.art}>
        <GradientThumb accent={card.color} width="100%" height={96} radius={0} />
        {/* visibility glyph top-left */}
        <View style={styles.glyph}>
          <Text style={styles.glyphText}>{GLYPH[card.state]}</Text>
        </View>
        {/* grade / NEW top-right */}
        <View style={styles.topRight}>
          {card.isNew ? (
            <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          ) : null}
          {card.grade ? (
            <View style={[styles.gradeBadge, { backgroundColor: colors.successMuted }]}>
              <Text style={[styles.gradeText, { color: colors.success }]}>{card.grade}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{card.name}</Text>
        {card.price ? (
          <Text style={[styles.price, { color: colors.primary }]}>{card.price}</Text>
        ) : (
          <Text style={[styles.state, { color: card.state === "showcased" ? colors.secondary : colors.fgTertiary }]}>
            {GLYPH[card.state]} {card.state === "showcased" ? "Showcased" : card.state === "listed" ? "Listed" : "Private"}
          </Text>
        )}
        <Text style={[styles.sub, { color: colors.fgTertiary }]} numberOfLines={1}>{card.genre} · {card.condition}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, borderRadius: radii.md, overflow: "hidden" },
  art: { height: 96 },
  glyph: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  glyphText: { fontSize: 9 },
  topRight: { position: "absolute", top: 5, right: 5, alignItems: "flex-end", gap: 2 },
  newBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  newText: { fontFamily: fontFamily.bodyExtrabold, fontSize: 7, color: "#fff" },
  gradeBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  gradeText: { fontFamily: fontFamily.bodyExtrabold, fontSize: 7 },
  meta: { padding: 7, paddingTop: 6, paddingBottom: 8 },
  name: { fontFamily: fontFamily.bodySemibold, fontSize: 9.5 },
  price: { fontFamily: fontFamily.display, fontSize: 12, marginTop: 1 },
  state: { fontFamily: fontFamily.body, fontSize: 8.5, marginTop: 1 },
  sub: { fontFamily: fontFamily.body, fontSize: 7.5, marginTop: 1 },
});
