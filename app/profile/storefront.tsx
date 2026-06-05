import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { ListingWithDetails, useSellerListings } from "@/hooks/use-listings";
import { useProfileById } from "@/hooks/use-profile";
import {
  useSetVendorReview,
  useVendorProfile,
  useVendorReviews,
} from "@/hooks/use-vendor";
import { formatPrice } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Inventory", "Reviews"] as const;
type Tab = (typeof TABS)[number];

function openExternal(url: string) {
  Linking.openURL(url).catch(() => Alert.alert("Couldn't open that link."));
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function VendorStorefrontScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { data: profile, isLoading } = useProfileById(id);
  const { data: vendor } = useVendorProfile(id);
  const { data: listings } = useSellerListings(id);
  const { data: reviews } = useVendorReviews(id);
  const setReview = useSetVendorReview();
  const [tab, setTab] = useState<Tab>("Inventory");

  const isOwn = !!session && session.user.id === id;
  const name = vendor?.business_name || profile?.display_name || profile?.username || "Storefront";
  const bannerUri = cardPhotoUrl(vendor?.banner_path);
  const logoUri = cardPhotoUrl(vendor?.logo_path);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/market");
  }

  const contacts = [
    vendor?.phone && { icon: "call" as const, url: `tel:${vendor.phone.replace(/[^0-9+]/g, "")}`, label: "Call" },
    vendor?.email && { icon: "mail" as const, url: `mailto:${vendor.email}`, label: "Email" },
    vendor?.instagram && {
      icon: "logo-instagram" as const,
      url: `https://instagram.com/${vendor.instagram.replace(/^@/, "")}`,
      label: "Instagram",
    },
    vendor?.website && {
      icon: "globe-outline" as const,
      url: /^https?:\/\//.test(vendor.website) ? vendor.website : `https://${vendor.website}`,
      label: "Website",
    },
  ].filter(Boolean) as { icon: keyof typeof Ionicons.glyphMap; url: string; label: string }[];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onBack={back} title="Storefront" />

      {isLoading || !profile ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          {/* Banner + logo */}
          <View style={styles.banner}>
            {bannerUri ? (
              <Image source={{ uri: bannerUri }} style={styles.bannerImg} contentFit="cover" />
            ) : (
              <View style={styles.bannerEmpty} />
            )}
            <View style={styles.logo}>
              {logoUri ? (
                <Image source={{ uri: logoUri }} style={styles.logoImg} contentFit="cover" />
              ) : (
                <Ionicons name="storefront" size={26} color={colors.accent} />
              )}
            </View>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>
              <View style={styles.badge}>
                <Ionicons name="checkmark-circle" size={13} color={colors.accent} />
                <Text style={styles.badgeText}>VENDOR</Text>
              </View>
            </View>
            {vendor?.hours ? <Text style={styles.meta}>{vendor.hours}</Text> : null}
            {vendor?.address ? <Text style={styles.meta}>{vendor.address}</Text> : null}
            {vendor?.description ? (
              <Text style={styles.description}>{vendor.description}</Text>
            ) : null}

            {/* Contact CTAs */}
            {contacts.length ? (
              <View style={styles.contacts}>
                {contacts.map((c) => (
                  <Pressable key={c.label} style={styles.contactBtn} onPress={() => openExternal(c.url)}>
                    <Ionicons name={c.icon} size={18} color={colors.accent} />
                    <Text style={styles.contactText}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map((t) => (
              <Pressable
                key={t}
                style={[styles.tab, tab === t && styles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          {tab === "Inventory" ? (
            (listings?.length ?? 0) === 0 ? (
              <View style={styles.tabEmpty}>
                <Ionicons name="pricetags-outline" size={28} color={colors.textTertiary} />
                <Text style={styles.muted}>No active listings.</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {chunk(listings ?? [], 2).map((row, ri) => (
                  <View key={ri} style={styles.gridRow}>
                    {row.map((l) => (
                      <InventoryCell key={l.id} listing={l} />
                    ))}
                    {row.length < 2 ? <View style={styles.flex} /> : null}
                  </View>
                ))}
              </View>
            )
          ) : (
            <View style={styles.reviews}>
              <View style={styles.tallyRow}>
                <View style={styles.tally}>
                  <Ionicons name="thumbs-up" size={20} color={colors.success} />
                  <Text style={styles.tallyNum}>{reviews?.up ?? 0}</Text>
                </View>
                <View style={styles.tally}>
                  <Ionicons name="thumbs-down" size={20} color={colors.danger} />
                  <Text style={styles.tallyNum}>{reviews?.down ?? 0}</Text>
                </View>
              </View>

              {isOwn ? (
                <Text style={styles.muted}>Buyers can rate your storefront here.</Text>
              ) : (
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Your rating:</Text>
                  <Pressable
                    style={[styles.rateBtn, reviews?.myReview === true && styles.rateUp]}
                    onPress={() =>
                      id &&
                      setReview.mutate({
                        vendorId: id,
                        value: reviews?.myReview === true ? null : true,
                      })
                    }
                  >
                    <Ionicons
                      name="thumbs-up"
                      size={20}
                      color={reviews?.myReview === true ? colors.textInverse : colors.text}
                    />
                  </Pressable>
                  <Pressable
                    style={[styles.rateBtn, reviews?.myReview === false && styles.rateDown]}
                    onPress={() =>
                      id &&
                      setReview.mutate({
                        vendorId: id,
                        value: reviews?.myReview === false ? null : false,
                      })
                    }
                  >
                    <Ionicons
                      name="thumbs-down"
                      size={20}
                      color={reviews?.myReview === false ? colors.textInverse : colors.text}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function InventoryCell({ listing }: { listing: ListingWithDetails }) {
  const url = cardPhotoUrl(listing.card?.primary_photo_path);
  return (
    <Pressable
      style={styles.cell}
      onPress={() =>
        router.push({ pathname: "/(tabs)/market/[id]", params: { id: listing.id } })
      }
    >
      <View style={styles.cellPhoto}>
        {url ? (
          <Image source={{ uri: url }} style={styles.cellImg} contentFit="cover" />
        ) : (
          <Ionicons name="image-outline" size={24} color={colors.textTertiary} />
        )}
      </View>
      <Text style={styles.cellPrice}>{formatPrice(listing.price_cents)}</Text>
      <Text style={styles.cellTitle} numberOfLines={1}>
        {listing.card?.title ?? "Card"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  flex: { flex: 1 },
  body: { paddingBottom: spacing.xxl },

  banner: { width: "100%", height: 140, backgroundColor: colors.surface, marginBottom: 36 },
  bannerImg: { width: "100%", height: "100%" },
  bannerEmpty: { flex: 1, backgroundColor: colors.surface },
  logo: {
    position: "absolute",
    left: spacing.xl,
    bottom: -28,
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.background,
  },
  logoImg: { width: "100%", height: "100%" },

  headerInfo: { paddingHorizontal: spacing.xl, gap: spacing.xs },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: colors.accent },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary },
  description: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20, marginTop: spacing.xs },

  contacts: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactText: { fontSize: fontSize.sm, color: colors.accent, fontWeight: "600" },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
  tabEmpty: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xxl },

  grid: { padding: spacing.lg, gap: spacing.md },
  gridRow: { flexDirection: "row", gap: spacing.md },
  cell: { flex: 1, gap: 2 },
  cellPhoto: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  cellImg: { width: "100%", height: "100%" },
  cellPrice: { fontSize: fontSize.md, fontWeight: "800", color: colors.accent },
  cellTitle: { fontSize: fontSize.sm, color: colors.text, fontWeight: "600" },

  reviews: { padding: spacing.xl, gap: spacing.lg },
  tallyRow: { flexDirection: "row", gap: spacing.xxl, justifyContent: "center" },
  tally: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  tallyNum: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  rateRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, justifyContent: "center" },
  rateLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  rateBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  rateUp: { backgroundColor: colors.success, borderColor: colors.success },
  rateDown: { backgroundColor: colors.danger, borderColor: colors.danger },
});
