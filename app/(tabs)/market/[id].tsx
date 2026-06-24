import { GradientThumb } from "@/components/home/gradient-thumb";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, radii, space } from "@/constants/theme";
import { getListing, STOREFRONT_STRIP, YOUR_LISTING_ID } from "@/lib/market-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STACK_COLORS = ["#E76F51", "#7C3AED", "#10B981", "#f59e0b"];

export default function ListingDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = getListing(id ?? "1");
  const mine = (id ?? "1") === YOUR_LISTING_ID;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/market");
  }

  async function share() {
    try {
      await Share.share({ message: `${listing.name} — ${listing.sub} · ${listing.price} on Collectiv` });
    } catch {
      /* user dismissed */
    }
  }

  function interested() {
    router.push({ pathname: "/(tabs)/market/chat", params: { id: listing.id } });
  }

  function markSold() {
    Alert.alert("Mark as Sold", `Mark "${listing.name}" as sold?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Mark Sold", onPress: back },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Nav */}
      <View style={styles.nav}>
        <Pressable onPress={back} style={[styles.navCircle, { backgroundColor: colors.bgSurface }]} hitSlop={6}>
          <Ionicons name="arrow-back" size={16} color={colors.fgPrimary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.fgPrimary }]}>{mine ? "Your Listing" : "Listing"}</Text>
        <View style={styles.navRight}>
          {mine ? (
            <>
              <NavBtn icon="share-outline" onPress={share} />
              <NavBtn icon="ellipsis-horizontal" onPress={() => setMenuOpen(true)} />
            </>
          ) : (
            <>
              <NavBtn icon={liked ? "heart" : "heart-outline"} tint={liked ? colors.primary : undefined} onPress={() => setLiked((v) => !v)} />
              <NavBtn icon="share-outline" onPress={share} />
              <NavBtn icon={saved ? "bookmark" : "bookmark-outline"} tint={saved ? colors.primary : undefined} onPress={() => setSaved((v) => !v)} />
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageWrap}>
          <View style={styles.image}>
            <GradientThumb accent={listing.accent} width={158} height={221} radius={12} />
            <View style={[styles.gradeBadge, { backgroundColor: colors.successMuted }]}>
              <Text style={[styles.gradeText, { color: colors.success }]}>✓ {listing.grade}</Text>
            </View>
            <View style={styles.watchPill}>
              <Text style={styles.watchText}>🔥 {listing.watches} watching</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <Text style={[styles.title, { color: colors.fgPrimary }]}>{listing.name} — {listing.sub}</Text>
        <Text style={[styles.subtitle, { color: colors.fgSecondary }]}>Sports · NBA · Rookie</Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>{listing.price}</Text>
          <Text style={[styles.pickup, { color: colors.fgTertiary }]}>+ pickup · {listing.distance} away</Text>
        </View>

        {/* Social proof (clickable) */}
        <Pressable
          style={[styles.proof, { backgroundColor: colors.secondaryMuted }]}
          onPress={() => router.push(mine ? { pathname: "/(tabs)/market/chat", params: { id: listing.id } } : "/feed/likes")}
        >
          <AvatarStack letters={mine ? ["A", "M", "D"] : ["J", "M", "A"]} bg={colors.bgBase} />
          <Text style={[styles.proofText, { color: colors.secondary }]}>
            {mine ? `${listing.watches} watching · 3 offers received` : "3 friends watching this card"}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.secondary} style={{ marginLeft: "auto" }} />
        </Pressable>

        {/* Stats */}
        <View style={styles.statsRow}>
          {(mine
            ? ([["Watching", String(listing.watches)], ["Offers", "3"], ["Listed", "Jun 12"]] as [string, string][])
            : ([["Genre", "Sports"], ["Sold", "24 total"], ["Last Sold", "$11,800"]] as [string, string][])
          ).map(([k, v]) => (
            <View key={k} style={[styles.statCell, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Text style={[styles.statKey, { color: colors.fgTertiary }]}>{k.toUpperCase()}</Text>
              <Text style={[styles.statVal, { color: colors.fgPrimary }]}>{v}</Text>
            </View>
          ))}
        </View>

        {mine ? (
          <>
            {/* Your listing banner */}
            <View style={[styles.banner, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
              <Avatar name="J" size={30} color={colors.primary} />
              <View style={styles.flex}>
                <Text style={[styles.bannerName, { color: colors.fgPrimary }]}>@jakescollects</Text>
                <Text style={[styles.bannerMeta, { color: colors.primary }]}>🏷 Your listing · Live on Market</Text>
              </View>
            </View>

            {/* Offers received (clickable) */}
            <Pressable
              style={[styles.offers, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
              onPress={() => router.push({ pathname: "/(tabs)/market/chat", params: { id: listing.id } })}
            >
              <AvatarStack letters={["A", "M", "D"]} bg={colors.bgBase} size={26} />
              <View style={styles.flex}>
                <Text style={[styles.offersTitle, { color: colors.fgPrimary }]}>3 offers received</Text>
                <Text style={[styles.offersSub, { color: colors.fgTertiary }]}>Highest: $11,800 · from @avapulls</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.fgTertiary} />
            </Pressable>

            {/* Manage CTAs */}
            <View style={styles.ctaRow}>
              <CtaBtn label="Edit Listing" variant="outline" tone={colors.primary} onPress={() => Alert.alert("Edit Listing")} />
              <CtaBtn label="Mark as Sold" variant="solid" tone={colors.primary} onPress={markSold} />
            </View>
          </>
        ) : (
          <>
            {/* Seller storefront */}
            <View style={[styles.shop, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Pressable style={styles.shopHead} onPress={() => router.push({ pathname: "/profile/[id]", params: { id: listing.seller, variant: "vendor" } })}>
                <View style={[styles.shopIcon, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.shopGlyph}>🏪</Text>
                </View>
                <View style={styles.flex}>
                  <View style={styles.shopNameRow}>
                    <Text style={[styles.shopName, { color: colors.fgPrimary }]}>@{listing.seller}</Text>
                    <Ionicons name="checkmark-circle" size={11} color={colors.success} />
                  </View>
                  <Text style={[styles.shopMeta, { color: colors.fgTertiary }]}>4.9★ · 143 sales · {listing.distance} away</Text>
                </View>
                <View style={[styles.viewShop, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
                  <Text style={[styles.viewShopText, { color: colors.secondary }]}>View shop ›</Text>
                </View>
              </Pressable>
              <View style={styles.strip}>
                {STOREFRONT_STRIP.map((c, i) => (
                  <GradientThumb key={i} accent={c} width="100%" height={42} radius={7} style={styles.stripItem} />
                ))}
              </View>
            </View>

            {/* Buyer CTA */}
            <View style={styles.ctaRow}>
              <Pressable style={[styles.bookmarkBtn, { borderColor: colors.borderDefault }]} onPress={() => setSaved((v) => !v)}>
                <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={17} color={saved ? colors.primary : colors.fgSecondary} />
              </Pressable>
              <Pressable style={[styles.interestBtn, { backgroundColor: colors.primary }]} onPress={interested}>
                <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
                <Text style={styles.interestText}>I&apos;m Interested</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      {/* More menu (owner) */}
      <ActionSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        header={{ title: listing.name, subtitle: listing.sub }}
        actions={[
          { icon: "share-social-outline", label: "Share card", onPress: share },
          { icon: "create-outline", label: "Edit Listing", onPress: () => Alert.alert("Edit Listing") },
          { icon: "checkmark-done-outline", label: "Mark as Sold", onPress: markSold },
          { icon: "copy-outline", label: "Copy link", onPress: () => {} },
          { icon: "trash-outline", label: "Delete listing", danger: true, onPress: () => {} },
        ]}
      />
    </SafeAreaView>
  );
}

function NavBtn({ icon, tint, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; tint?: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.navCircle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault, borderWidth: 1 }]} hitSlop={4}>
      <Ionicons name={icon} size={15} color={tint ?? colors.fgPrimary} />
    </Pressable>
  );
}

function AvatarStack({ letters, bg, size = 20 }: { letters: string[]; bg: string; size?: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {letters.map((l, i) => (
        <View key={l} style={{ marginLeft: i > 0 ? -size * 0.26 : 0, borderRadius: size, borderWidth: 2, borderColor: bg }}>
          <Avatar name={l} size={size} color={STACK_COLORS[i % STACK_COLORS.length]} />
        </View>
      ))}
    </View>
  );
}

function CtaBtn({ label, variant, tone, onPress }: { label: string; variant: "solid" | "outline"; tone: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.cta, variant === "solid" ? { backgroundColor: tone } : { borderWidth: 1.5, borderColor: tone }]}>
      <Text style={[styles.ctaText, { color: variant === "solid" ? "#fff" : tone }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },

  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingBottom: 10 },
  navCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  navTitle: { fontFamily: fontFamily.socialSemibold, fontSize: 14 },
  navRight: { flexDirection: "row", gap: 8 },

  body: { paddingHorizontal: space.lg, paddingBottom: space["3xl"] },
  imageWrap: { alignItems: "center", marginBottom: 16 },
  image: { width: 158, height: 221, borderRadius: 12, overflow: "hidden" },
  gradeBadge: { position: "absolute", top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  gradeText: { fontFamily: fontFamily.socialBold, fontSize: 9 },
  watchPill: { position: "absolute", bottom: 8, left: 8, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  watchText: { fontFamily: fontFamily.socialSemibold, fontSize: 9, color: "#fff" },

  title: { fontFamily: fontFamily.socialBold, fontSize: 19, lineHeight: 23, marginBottom: 3 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 12, marginBottom: 8 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 10, marginBottom: 12 },
  price: { fontFamily: fontFamily.display, fontSize: 32 },
  pickup: { fontFamily: fontFamily.body, fontSize: 11 },

  proof: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginBottom: 12 },
  proofText: { fontFamily: fontFamily.socialSemibold, fontSize: 11 },

  statsRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  statCell: { flex: 1, padding: 8, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  statKey: { fontFamily: fontFamily.bodyBold, fontSize: 9, letterSpacing: 0.3, marginBottom: 3 },
  statVal: { fontFamily: fontFamily.socialBold, fontSize: 10.5 },

  banner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  bannerName: { fontFamily: fontFamily.socialSemibold, fontSize: 12 },
  bannerMeta: { fontFamily: fontFamily.socialSemibold, fontSize: 10, marginTop: 1 },

  offers: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  offersTitle: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  offersSub: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },

  shop: { borderRadius: 12, borderWidth: 1, overflow: "hidden", marginBottom: 14 },
  shopHead: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, paddingHorizontal: 12 },
  shopIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  shopGlyph: { fontSize: 15 },
  shopNameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  shopName: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  shopMeta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  viewShop: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  viewShopText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  strip: { flexDirection: "row", gap: 6, paddingHorizontal: 12, paddingBottom: 11 },
  stripItem: { flex: 1 },

  ctaRow: { flexDirection: "row", gap: 10 },
  cta: { flex: 1, paddingVertical: 14, borderRadius: radii.full, alignItems: "center", justifyContent: "center" },
  ctaText: { fontFamily: fontFamily.socialBold, fontSize: 14 },
  bookmarkBtn: { width: 52, paddingVertical: 14, borderRadius: radii.full, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  interestBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: radii.full },
  interestText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
