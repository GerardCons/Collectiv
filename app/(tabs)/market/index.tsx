import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  ListingWithDetails,
  useActiveListings,
} from "@/hooks/use-listings";
import { formatPrice } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MarketBrowse() {
  const { data: listings, isLoading, isError, refetch, isRefetching } =
    useActiveListings();
  const [query, setQuery] = useState("");
  const [vendorsOnly, setVendorsOnly] = useState(false);

  const visible = useMemo(() => {
    let all = listings ?? [];
    if (vendorsOnly) all = all.filter((l) => l.seller?.is_vendor);
    const q = query.trim().toLowerCase();
    if (q) all = all.filter((l) => l.card?.title.toLowerCase().includes(q));
    return all;
  }, [listings, query, vendorsOnly]);

  // Pad to an even count so the last row's card doesn't stretch.
  const data = useMemo(
    () =>
      visible.length % 2 === 1
        ? [...visible, null]
        : visible,
    [visible],
  );

  function openListing(id: string) {
    router.push({ pathname: "/(tabs)/market/[id]", params: { id } });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => router.push("/chat")} hitSlop={8}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={colors.text}
            />
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/market/dashboard")}
            hitSlop={8}
          >
            <Ionicons name="receipt-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.input}
          placeholder="Search listings"
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.filterRow}>
        <Pressable
          style={[styles.chip, vendorsOnly && styles.chipActive]}
          onPress={() => setVendorsOnly((v) => !v)}
        >
          <Ionicons
            name="storefront-outline"
            size={14}
            color={vendorsOnly ? colors.accent : colors.textSecondary}
          />
          <Text style={[styles.chipText, vendorsOnly && styles.chipTextActive]}>
            Vendors only
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load the marketplace.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons
                name="pricetags-outline"
                size={32}
                color={colors.textTertiary}
              />
              <Text style={styles.muted}>
                {query ? "No listings match your search." : "No active listings yet."}
              </Text>
            </View>
          }
          renderItem={({ item }) =>
            item ? (
              <ListingCell listing={item} onPress={() => openListing(item.id)} />
            ) : (
              <View style={styles.cellSpacer} />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

function ListingCell({
  listing,
  onPress,
}: {
  listing: ListingWithDetails;
  onPress: () => void;
}) {
  const url = cardPhotoUrl(listing.card?.primary_photo_path);
  return (
    <Pressable style={styles.cell} onPress={onPress}>
      <View style={styles.photo}>
        {url ? (
          <Image source={{ uri: url }} style={styles.photoImg} contentFit="cover" />
        ) : (
          <Ionicons name="image-outline" size={28} color={colors.textTertiary} />
        )}
      </View>
      <Text style={styles.price}>{formatPrice(listing.price_cents)}</Text>
      <Text style={styles.cellTitle} numberOfLines={1}>
        {listing.card?.title ?? "Card"}
      </Text>
      <View style={styles.sellerRow}>
        <Text style={styles.seller} numberOfLines={1}>
          @{listing.seller?.username ?? "seller"}
        </Text>
        {listing.seller?.is_vendor ? (
          <Ionicons name="storefront" size={12} color={colors.accent} />
        ) : null}
      </View>
    </Pressable>
  );
}

const GAP = spacing.md;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.sm, paddingTop: spacing.xxl },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  title: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: spacing.lg },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.text },

  filterRow: { flexDirection: "row", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  chipTextActive: { color: colors.accent, fontWeight: "700" },

  grid: { padding: spacing.lg, gap: GAP },
  row: { gap: GAP },
  cell: { flex: 1, gap: 2 },
  cellSpacer: { flex: 1 },
  photo: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  photoImg: { width: "100%", height: "100%" },
  price: { fontSize: fontSize.md, fontWeight: "800", color: colors.accent },
  cellTitle: { fontSize: fontSize.sm, color: colors.text, fontWeight: "600" },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  seller: { fontSize: fontSize.xs, color: colors.textSecondary, flexShrink: 1 },
});
