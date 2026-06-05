import { SocialSection } from "@/components/social/social-section";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { startConversation } from "@/hooks/use-chat";
import { useListing, useResolveListing } from "@/hooks/use-listings";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { data: listing, isLoading, isError } = useListing(id);
  const resolve = useResolveListing();

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/market");
  }

  const isSeller = !!listing && listing.seller_id === session?.user.id;
  const url = cardPhotoUrl(listing?.card?.primary_photo_path);
  const [messaging, setMessaging] = useState(false);

  function confirmResolve(status: "sold" | "cancelled") {
    if (!listing) return;
    const verb = status === "sold" ? "Mark as sold" : "Cancel listing";
    Alert.alert(verb, `${verb}?`, [
      { text: "Back", style: "cancel" },
      {
        text: verb,
        style: status === "cancelled" ? "destructive" : "default",
        onPress: () => resolve.mutate({ listing, status }),
      },
    ]);
  }

  async function messageSeller() {
    if (!listing?.seller) return;
    setMessaging(true);
    try {
      const convId = await startConversation(listing.seller.id, listing.id);
      router.push({
        pathname: "/chat/[id]",
        params: {
          id: convId,
          prefill: `Hi, I'm interested in ${listing.card?.title ?? "your card"}.`,
        },
      });
    } catch (err) {
      Alert.alert(
        "Message",
        err instanceof Error ? err.message : "Couldn't start the chat.",
      );
    } finally {
      setMessaging(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onBack={back} title="Listing" />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !listing ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load this listing.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.photoWrap}>
            {url ? (
              <Image source={{ uri: url }} style={styles.photo} contentFit="contain" />
            ) : (
              <Ionicons name="image-outline" size={40} color={colors.textTertiary} />
            )}
          </View>

          {listing.status !== "active" ? (
            <View
              style={[
                styles.statusBadge,
                listing.status === "sold" ? styles.soldBadge : styles.cancelBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {listing.status === "sold" ? "SOLD" : "CANCELLED"}
              </Text>
            </View>
          ) : null}

          <Text style={styles.price}>{formatPrice(listing.price_cents)}</Text>
          <Text style={styles.title}>{listing.card?.title ?? "Card"}</Text>

          <View style={styles.metaRow}>
            {listing.card?.set_name ? (
              <Text style={styles.meta}>{listing.card.set_name}</Text>
            ) : null}
            {listing.card?.condition ? (
              <Text style={styles.meta}>· {listing.card.condition}</Text>
            ) : null}
          </View>

          {/* Seller */}
          <Pressable
            style={styles.sellerRow}
            onPress={() =>
              listing.seller &&
              router.push({
                pathname: "/profile/[id]",
                params: { id: listing.seller.id },
              })
            }
          >
            <Avatar
              name={listing.seller?.display_name || listing.seller?.username}
              size={40}
            />
            <View style={styles.flex}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>
                  {listing.seller?.display_name || listing.seller?.username}
                </Text>
                {listing.seller?.is_vendor ? (
                  <View style={styles.vendorBadge}>
                    <Text style={styles.vendorText}>VENDOR</Text>
                  </View>
                ) : null}
              </View>
              {listing.seller?.location_city ? (
                <Text style={styles.sellerSub}>{listing.seller.location_city}</Text>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </Pressable>

          {listing.seller?.pickup_city ? (
            <View style={styles.meetupRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.meetupText}>{listing.seller.pickup_city}</Text>
            </View>
          ) : null}

          {listing.description ? (
            <Section label="DESCRIPTION" value={listing.description} />
          ) : null}
          {listing.shipping_info ? (
            <Section label="PICKUP / SHIPPING" value={listing.shipping_info} />
          ) : null}

          {/* Actions */}
          {isSeller ? (
            listing.status === "active" ? (
              <View style={styles.actions}>
                <Button
                  title="Mark as sold"
                  variant="dark"
                  loading={resolve.isPending}
                  onPress={() => confirmResolve("sold")}
                />
                <Button
                  title="Cancel listing"
                  variant="secondary"
                  onPress={() => confirmResolve("cancelled")}
                />
              </View>
            ) : (
              <Text style={styles.muted}>
                This listing is {listing.status}.
              </Text>
            )
          ) : (
            <View style={styles.actions}>
              <Button
                title="Message seller"
                variant="primary"
                onPress={messageSeller}
                loading={messaging}
                disabled={listing.status !== "active"}
              />
            </View>
          )}

          <SocialSection targetType="listing" targetId={listing.id} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  hint: { color: colors.textTertiary, fontSize: fontSize.xs },
  flex: { flex: 1 },
  body: { padding: spacing.xl, gap: spacing.md },

  photoWrap: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%" },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  soldBadge: { backgroundColor: colors.text },
  cancelBadge: { backgroundColor: colors.danger },
  statusText: { color: colors.textInverse, fontSize: fontSize.xs, fontWeight: "800" },

  price: { fontSize: fontSize.xl, fontWeight: "800", color: colors.accent },
  title: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  metaRow: { flexDirection: "row", gap: spacing.xs },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary },

  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  sellerNameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  sellerName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  sellerSub: { fontSize: fontSize.xs, color: colors.textSecondary },
  vendorBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  vendorText: { fontSize: 10, fontWeight: "800", color: colors.accent },

  section: { gap: spacing.xs, marginTop: spacing.sm },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.textTertiary,
  },
  sectionValue: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },

  actions: { gap: spacing.md, marginTop: spacing.md },

  meetupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  meetupText: { fontSize: fontSize.sm, color: colors.textSecondary },
});
