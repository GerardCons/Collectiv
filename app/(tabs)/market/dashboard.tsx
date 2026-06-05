import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  ListingStatus,
  ListingWithDetails,
  useMyListings,
  useResolveListing,
} from "@/hooks/use-listings";
import { formatPrice } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS: ListingStatus[] = ["active", "sold", "cancelled"];
const TAB_LABEL: Record<ListingStatus, string> = {
  active: "Active",
  sold: "Sold",
  cancelled: "Cancelled",
};

export default function SellerDashboard() {
  const { data: listings, isLoading } = useMyListings();
  const resolve = useResolveListing();
  const [tab, setTab] = useState<ListingStatus>("active");

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/market");
  }

  const filtered = useMemo(
    () => (listings ?? []).filter((l) => l.status === tab),
    [listings, tab],
  );

  function confirmResolve(listing: ListingWithDetails, status: "sold" | "cancelled") {
    const verb = status === "sold" ? "Mark as sold" : "Cancel listing";
    Alert.alert(verb, `${verb} for "${listing.card?.title ?? "this card"}"?`, [
      { text: "Back", style: "cancel" },
      {
        text: verb,
        style: status === "cancelled" ? "destructive" : "default",
        onPress: () => resolve.mutate({ listing, status }),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="My listings" onBack={back} />

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
              {TAB_LABEL[t]}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No {TAB_LABEL[tab].toLowerCase()} listings.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Pressable
                style={styles.rowMain}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/market/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <Image
                  source={{ uri: cardPhotoUrl(item.card?.primary_photo_path) }}
                  style={styles.thumb}
                  contentFit="cover"
                />
                <View style={styles.flex}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.card?.title ?? "Card"}
                  </Text>
                  <Text style={styles.rowPrice}>{formatPrice(item.price_cents)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </Pressable>

              {item.status === "active" ? (
                <View style={styles.quickActions}>
                  <Pressable
                    style={styles.quickBtn}
                    onPress={() => confirmResolve(item, "sold")}
                  >
                    <Text style={styles.quickText}>Mark sold</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickBtn}
                    onPress={() => confirmResolve(item, "cancelled")}
                  >
                    <Text style={[styles.quickText, styles.quickDanger]}>Cancel</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: spacing.xxl },
  flex: { flex: 1 },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: colors.text },
  tabLabel: { fontSize: fontSize.sm, color: colors.textTertiary, fontWeight: "600" },
  tabLabelActive: { color: colors.text },

  list: { padding: spacing.lg, gap: spacing.lg },
  empty: { textAlign: "center", color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xxl },

  row: { gap: spacing.sm },
  rowMain: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  thumb: {
    width: 52,
    height: 70,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  rowTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  rowPrice: { fontSize: fontSize.sm, color: colors.accent, fontWeight: "700", marginTop: 2 },

  quickActions: { flexDirection: "row", gap: spacing.sm, paddingLeft: 64 },
  quickBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickText: { fontSize: fontSize.sm, color: colors.text, fontWeight: "600" },
  quickDanger: { color: colors.danger },
});
