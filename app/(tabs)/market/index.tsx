import { MarketCard } from "@/components/market/market-card";
import { FilterSheet, LocationSheet, SortSheet } from "@/components/market/market-sheets";
import { fontFamily, space } from "@/constants/theme";
import { Listing, LISTINGS } from "@/lib/market-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_FILTER: Record<string, string> = { genre: "Sports", condition: "All", grade: "Any", seller: "All" };

export default function MarketHome() {
  const { colors } = useTheme();
  const [sort, setSort] = useState("Suggested");
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [radius, setRadius] = useState(25);
  const [locationOpen, setLocationOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const gridData = useMemo(() => {
    const pad = (3 - (LISTINGS.length % 3)) % 3;
    return [...LISTINGS, ...Array<null>(pad).fill(null)];
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>Marketplace</Text>
        <View style={styles.headerIcons}>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => router.push("/chat")}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.fgPrimary} />
            <View style={[styles.dot, { backgroundColor: colors.primary, borderColor: colors.bgBase }]} />
          </Pressable>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => router.push("/(tabs)/market/dashboard")}>
            <Ionicons name="storefront-outline" size={16} color={colors.fgPrimary} />
          </Pressable>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => router.push("/(tabs)/market/search")}>
            <Ionicons name="search" size={17} color={colors.fgPrimary} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={gridData}
        keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Featured */}
            <View style={styles.featuredRow}>
              <Text style={[styles.featuredLabel, { color: colors.fgTertiary }]}>FEATURED</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
            </View>

            {/* Hero carousel */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hero} snapToInterval={340} decelerationRate="fast">
              {[LISTINGS[0], LISTINGS[5]].map((c) => (
                <Hero key={c.id} listing={c} onPress={() => router.push({ pathname: "/(tabs)/market/[id]", params: { id: c.id } })} />
              ))}
            </ScrollView>
            <View style={styles.dots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[i === 0 ? styles.dotActive : styles.dotInactive, { backgroundColor: i === 0 ? colors.primary : colors.borderDefault }]} />
              ))}
            </View>

            {/* Sort row */}
            <View style={styles.sortRow}>
              <Text style={[styles.todays, { color: colors.fgPrimary }]}>Today&apos;s Picks</Text>
              <View style={styles.sortControls}>
                <Pressable style={[styles.sortChip, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]} onPress={() => setSortOpen(true)}>
                  <Text style={[styles.sortText, { color: colors.primary }]}>{sort}</Text>
                  <Ionicons name="chevron-down" size={10} color={colors.primary} />
                </Pressable>
                <Pressable style={[styles.circle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => setFilterOpen(true)}>
                  <Ionicons name="options-outline" size={15} color={colors.fgSecondary} />
                </Pressable>
                <Pressable style={[styles.circle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => setLocationOpen(true)}>
                  <Ionicons name="location-outline" size={15} color={colors.fgSecondary} />
                </Pressable>
              </View>
            </View>
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

      <LocationSheet visible={locationOpen} onClose={() => setLocationOpen(false)} radius={radius} onRadius={setRadius} />
      <SortSheet visible={sortOpen} onClose={() => setSortOpen(false)} sort={sort} onSort={setSort} />
      <FilterSheet visible={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onApply={setFilters} />
    </SafeAreaView>
  );
}

function Hero({ listing, onPress }: { listing: Listing; onPress?: () => void }) {
  return (
    <Pressable style={styles.heroCard} onPress={onPress}>
      <LinearGradient colors={["#1a1210", listing.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={["rgba(26,18,16,0.86)", "rgba(26,18,16,0.15)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <View style={styles.heroThumb}>
        <View style={styles.heroThumbInner} />
      </View>
      <View style={styles.heroText}>
        <View style={styles.heroBadges}>
          <View style={styles.heroCond}>
            <Text style={styles.heroCondText}>{listing.condition}</Text>
          </View>
          <Text style={styles.heroDist}>{listing.distance.toUpperCase()} AWAY</Text>
        </View>
        <Text style={styles.heroName}>{listing.name}</Text>
        <Text style={styles.heroSub}>{listing.sub}</Text>
        <Text style={styles.heroType}>{listing.type}</Text>
        <View style={styles.heroPriceRow}>
          <Text style={styles.heroPrice}>{listing.price}</Text>
          <View style={styles.heroGrade}>
            <Text style={styles.heroGradeText}>{listing.grade}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingTop: 2, paddingBottom: 10 },
  title: { fontFamily: fontFamily.socialExtrabold, fontSize: 24 },
  headerIcons: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", top: 1, right: 1, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },

  featuredRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingBottom: 8 },
  featuredLabel: { fontFamily: fontFamily.bodyBold, fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase" },
  seeAll: { fontFamily: fontFamily.socialSemibold, fontSize: 11 },

  hero: { gap: 10, paddingLeft: 16, paddingRight: 6 },
  heroCard: { width: 330, height: 132, borderRadius: 16, overflow: "hidden" },
  heroThumb: { position: "absolute", right: 14, top: 10, bottom: 10, width: 78, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  heroThumbInner: { width: "58%", height: "76%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4 },
  heroText: { position: "absolute", left: 16, top: 13, right: 104 },
  heroBadges: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 5 },
  heroCond: { backgroundColor: "rgba(16,185,129,0.3)", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
  heroCondText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8, color: "#10B981", letterSpacing: 0.4 },
  heroDist: { fontFamily: fontFamily.socialBold, fontSize: 8, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 },
  heroName: { fontFamily: fontFamily.socialExtrabold, fontSize: 15, color: "#fff", marginBottom: 2 },
  heroSub: { fontFamily: fontFamily.body, fontSize: 9.5, color: "rgba(255,255,255,0.6)", marginBottom: 1 },
  heroType: { fontFamily: fontFamily.socialBold, fontSize: 9, color: "rgba(255,255,255,0.85)", marginBottom: 8 },
  heroPriceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroPrice: { fontFamily: fontFamily.socialExtrabold, fontSize: 14, color: "#fff" },
  heroGrade: { backgroundColor: "rgba(16,185,129,0.3)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  heroGradeText: { fontFamily: fontFamily.socialBold, fontSize: 8, color: "#10B981" },

  dots: { flexDirection: "row", gap: 5, justifyContent: "center", paddingTop: 8, paddingBottom: 10 },
  dotActive: { width: 16, height: 5, borderRadius: 3 },
  dotInactive: { width: 5, height: 5, borderRadius: 3 },

  sortRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingBottom: 10 },
  todays: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  sortControls: { flexDirection: "row", alignItems: "center", gap: 6 },
  sortChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  sortText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  circle: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  grid: { paddingHorizontal: 12, paddingBottom: 16, gap: 6 },
  gridRow: { gap: 6 },
  spacer: { flex: 1 },
});
