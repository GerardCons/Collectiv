import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily, radii, shadows } from "@/constants/theme";
import { Listing } from "@/lib/market-mock";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Condensed 3-col marketplace grid card: price · name · type · condition + distance. */
export function MarketCard({ listing, onPress }: { listing: Listing; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.cell, { backgroundColor: colors.bgBase }, shadows.sm]} onPress={onPress}>
      <View style={styles.art}>
        <GradientThumb accent={listing.accent} width="100%" height={96} radius={0} />
        <View style={[styles.grade, { backgroundColor: colors.successMuted }]}>
          <Text style={[styles.gradeText, { color: colors.success }]}>{listing.grade}</Text>
        </View>
        {listing.vendor ? (
          <View style={styles.vendor}>
            <Text style={styles.vendorText}>VENDOR</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.meta}>
        <Text style={[styles.price, { color: colors.primary }]}>{listing.price}</Text>
        <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{listing.name}</Text>
        <Text style={[styles.type, { color: colors.fgTertiary }]} numberOfLines={1}>{listing.type}</Text>
        <View style={styles.row}>
          <Text style={[styles.cond, { color: colors.success }]} numberOfLines={1}>{listing.condition}</Text>
          <Text style={[styles.dist, { color: colors.fgTertiary }]}>{listing.distance}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, borderRadius: radii.md, overflow: "hidden" },
  art: { height: 96 },
  grade: { position: "absolute", top: 5, right: 5, paddingHorizontal: 4, paddingVertical: 1.5, borderRadius: 3 },
  gradeText: { fontFamily: fontFamily.bodyExtrabold, fontSize: 7 },
  vendor: { position: "absolute", bottom: 5, left: 5, backgroundColor: "rgba(124,58,237,0.8)", paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 3 },
  vendorText: { fontFamily: fontFamily.bodyExtrabold, fontSize: 7, color: "#fff" },
  meta: { padding: 7, paddingTop: 5 },
  price: { fontFamily: fontFamily.socialExtrabold, fontSize: 11 },
  name: { fontFamily: fontFamily.bodySemibold, fontSize: 9, marginTop: 1 },
  type: { fontFamily: fontFamily.body, fontSize: 7.5, marginTop: 1 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 4, marginTop: 2 },
  cond: { fontFamily: fontFamily.socialBold, fontSize: 7.5, flexShrink: 1 },
  dist: { fontFamily: fontFamily.body, fontSize: 7.5 },
});
