import { SocialSection } from "@/components/social/social-section";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { StateBadge } from "@/components/ui/state-badge";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  useCard,
  useCardPhotos,
  useDeleteCard,
  useSetCardState,
} from "@/hooks/use-cards";
import { useActiveListingForCard } from "@/hooks/use-listings";
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
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { data: card, isLoading, isError } = useCard(id);
  const { data: photos } = useCardPhotos(id);
  const setCardState = useSetCardState();
  const deleteCard = useDeleteCard();
  const { data: activeListing } = useActiveListingForCard(id);

  const [imgIdx, setImgIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }

  const isOwner = !!card && card.owner_id === session?.user.id;

  const images = card
    ? ([card.primary_photo_path, ...(photos?.map((p) => p.path) ?? [])].filter(
        Boolean,
      ) as string[])
    : [];
  const currentUrl = cardPhotoUrl(images[imgIdx]);

  function toggleShowcase() {
    if (!card) return;
    setCardState.mutate({
      cardId: card.id,
      state: card.state === "showcased" ? "private" : "showcased",
    });
  }

  function confirmDelete() {
    if (!card) return;
    setMenuOpen(false);
    Alert.alert("Delete card", `Delete "${card.title}"? This can't be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteCard.mutate(card, { onSuccess: back }),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        onBack={back}
        right={
          card && isOwner ? (
            <Pressable onPress={() => setMenuOpen(true)} hitSlop={8}>
              <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
            </Pressable>
          ) : null
        }
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !card ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load this card.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <StateBadge state={card.state} />

          {/* Photo */}
          <View style={styles.photoWrap}>
            {currentUrl ? (
              <Image
                source={{ uri: currentUrl }}
                style={styles.photo}
                contentFit="contain"
                transition={150}
              />
            ) : (
              <View style={styles.photoEmpty}>
                <Ionicons
                  name="image-outline"
                  size={40}
                  color={colors.textTertiary}
                />
                <Text style={styles.muted}>No photo</Text>
              </View>
            )}
          </View>

          {images.length > 1 ? (
            <View style={styles.frontBack}>
              {["Front", "Back"].map((label, i) => (
                <Pressable
                  key={label}
                  style={[styles.fbItem, imgIdx === i && styles.fbItemActive]}
                  onPress={() => setImgIdx(i)}
                >
                  <Text
                    style={[styles.fbText, imgIdx === i && styles.fbTextActive]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* Info */}
          <Text style={styles.title}>{card.title}</Text>
          <View style={styles.infoRows}>
            {card.set_name ? (
              <InfoRow label="SET" value={card.set_name} />
            ) : null}
            {card.condition ? (
              <InfoRow label="CONDITION" value={card.condition} />
            ) : null}
          </View>

          {card.notes ? (
            <View style={styles.notes}>
              <Text style={styles.notesLabel}>
                {card.state === "private" ? "PRIVATE NOTES · ONLY YOU" : "NOTES"}
              </Text>
              <Text style={styles.notesText}>{card.notes}</Text>
            </View>
          ) : null}

          {/* Actions (owner only) */}
          {isOwner ? (
            <View style={styles.actions}>
              {card.state === "listed" ? (
                <View style={styles.listedBox}>
                  <View style={styles.listedRow}>
                    <Text style={styles.listedLabel}>Live in marketplace</Text>
                    {activeListing ? (
                      <Text style={styles.listedPrice}>
                        {formatPrice(activeListing.price_cents)}
                      </Text>
                    ) : null}
                  </View>
                  <Button
                    title="View listing"
                    variant="dark"
                    onPress={() => {
                      if (activeListing)
                        router.push({
                          pathname: "/(tabs)/market/[id]",
                          params: { id: activeListing.id },
                        });
                    }}
                  />
                </View>
              ) : (
                <>
                  <Button
                    title={
                      card.state === "showcased" ? "Unshowcase" : "Showcase"
                    }
                    variant={card.state === "showcased" ? "secondary" : "dark"}
                    onPress={toggleShowcase}
                    loading={setCardState.isPending}
                  />
                  <Button
                    title="List for sale"
                    variant="primary"
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/portfolio/list-card",
                        params: { id: card.id },
                      })
                    }
                  />
                </>
              )}
            </View>
          ) : null}

          {/* Likes & comments — visible once the card is public. */}
          {card.state !== "private" ? (
            <SocialSection targetType="card" targetId={card.id} />
          ) : null}
        </ScrollView>
      )}

      {/* More-actions sheet */}
      {card && isOwner ? (
        <BottomSheet
          visible={menuOpen}
          onClose={() => setMenuOpen(false)}
          title="More actions"
        >
          <MenuRow
            icon="create-outline"
            label="Edit card"
            onPress={() => {
              setMenuOpen(false);
              router.push({
                pathname: "/(tabs)/portfolio/edit-card",
                params: { id: card.id },
              });
            }}
          />
          <MenuRow
            icon="swap-horizontal-outline"
            label="Move to collection"
            onPress={() => {
              setMenuOpen(false);
              Alert.alert("Move to collection", "Arrives in a later update.");
            }}
          />
          <MenuRow
            icon="share-outline"
            label="Share"
            onPress={() => {
              setMenuOpen(false);
              Alert.alert("Share", "Arrives in a later update.");
            }}
          />
          <MenuRow
            icon="trash-outline"
            label="Delete card"
            danger
            onPress={confirmDelete}
          />
        </BottomSheet>
      ) : null}
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? colors.danger : colors.text}
      />
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  hint: { color: colors.textTertiary, fontSize: fontSize.xs },
  body: { padding: spacing.xl, gap: spacing.lg },

  photoWrap: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%" },
  photoEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm },

  frontBack: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  fbItem: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  fbItemActive: { backgroundColor: colors.background },
  fbText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: "600" },
  fbTextActive: { color: colors.text },

  title: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  infoRows: { gap: spacing.sm },
  infoRow: { flexDirection: "row", gap: spacing.lg },
  infoLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.textTertiary,
    width: 90,
  },
  infoValue: { fontSize: fontSize.sm, color: colors.text, flex: 1 },

  notes: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  notesLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.textTertiary,
  },
  notesText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },

  actions: { gap: spacing.md, marginTop: spacing.sm },
  listedBox: {
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  listedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listedLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: "700" },
  listedPrice: { fontSize: fontSize.lg, fontWeight: "800", color: colors.accent },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  menuLabel: { fontSize: fontSize.md, color: colors.text },
  menuLabelDanger: { color: colors.danger },
});
