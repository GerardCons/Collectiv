import { GradientThumb } from "@/components/home/gradient-thumb";
import { FlipCard } from "@/components/portfolio/flip-card";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, radii, space } from "@/constants/theme";
import { CardMode, getCardDetail } from "@/lib/portfolio-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STACK_COLORS = ["#E76F51", "#7C3AED", "#10B981", "#f59e0b"];

export default function CardDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = getCardDetail(id ?? "c1");

  const [mode, setMode] = useState<CardMode>(detail.mode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visOpen, setVisOpen] = useState(false);

  const isMarket = mode === "market";
  const isShowcase = mode === "showcased";
  const isPrivate = mode === "private";

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }

  const stats: [string, string][] = isMarket
    ? [["Watching", String(detail.watching)], ["Offers", String(detail.offers)], ["Listed", detail.listed]]
    : [["Genre", detail.genre], ["Condition", detail.condition], ["Added", detail.added]];

  const statusPill = isMarket
    ? { bg: "rgba(0,0,0,0.5)", text: `🔥 ${detail.watching} watching` }
    : isShowcase
      ? { bg: "rgba(124,58,237,0.65)", text: "⭐ Showcased" }
      : { bg: "rgba(0,0,0,0.5)", text: "🔒 Private" };

  // ── ··· menu actions per mode ──
  const menuActions =
    mode === "market"
      ? [
          { icon: "create-outline" as const, label: "Edit Listing", onPress: () => Alert.alert("Edit Listing") },
          { icon: "checkmark-done-outline" as const, label: "Mark as Sold", sub: "Close this listing", onPress: markSold },
          { icon: "share-social-outline" as const, label: "Share card", onPress: () => {} },
          { icon: "copy-outline" as const, label: "Copy card details", onPress: () => {} },
          { icon: "trash-outline" as const, label: "Delete listing", danger: true, onPress: () => {} },
        ]
      : mode === "showcased"
        ? [
            { icon: "create-outline" as const, label: "Edit Showcase", onPress: () => Alert.alert("Edit Showcase") },
            { icon: "eye-outline" as const, label: "Change Visibility", sub: "Private or list for sale", onPress: () => setVisOpen(true) },
            { icon: "share-social-outline" as const, label: "Share card", onPress: () => {} },
            { icon: "copy-outline" as const, label: "Copy card details", onPress: () => {} },
            { icon: "trash-outline" as const, label: "Delete card", danger: true, onPress: () => {} },
          ]
        : [
            { icon: "create-outline" as const, label: "Edit Details", onPress: () => Alert.alert("Edit Details") },
            { icon: "eye-outline" as const, label: "Change Visibility", sub: "Showcase or list for sale", onPress: () => setVisOpen(true) },
            { icon: "share-social-outline" as const, label: "Share card", onPress: () => {} },
            { icon: "copy-outline" as const, label: "Copy card details", onPress: () => {} },
            { icon: "trash-outline" as const, label: "Delete card", danger: true, onPress: () => {} },
          ];

  function markSold() {
    Alert.alert("Mark as Sold", `Mark "${detail.title}" as sold?`, [
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
        <Text style={[styles.navTitle, { color: colors.fgPrimary }]}>Card Detail</Text>
        <Pressable onPress={() => setMenuOpen(true)} style={[styles.navCircle, { backgroundColor: colors.bgSurface }]} hitSlop={6}>
          <Ionicons name="ellipsis-horizontal" size={16} color={colors.fgPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Photo */}
        {detail.photoType === "reference" ? (
          <View style={styles.refWrap}>
            <View style={[styles.refOutline, { borderColor: colors.warning }]}>
              <GradientThumb accent={detail.frontAccent} width={154} height={216} radius={12} />
            </View>
            <View style={[styles.refBadge, { backgroundColor: colors.warning }]}>
              <Text style={styles.refBadgeText}>🔍 REFERENCE PHOTO</Text>
            </View>
            <Text style={[styles.refNote, { color: colors.fgTertiary }]}>Added via search · Not your actual card</Text>
            {isPrivate ? (
              <Pressable style={[styles.ownPhotoBtn, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]} onPress={() => Alert.alert("Add your own photo")}>
                <Ionicons name="camera" size={12} color={colors.primary} />
                <Text style={[styles.ownPhotoText, { color: colors.primary }]}>Add your own photo</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.photoWrap}>
            <FlipCard
              width={172}
              height={241}
              radius={14}
              front={
                <View style={styles.fill}>
                  <GradientThumb accent={detail.frontAccent} width="100%" height={241} radius={0} />
                  {detail.grade ? (
                    <View style={[styles.gradeBadge, { backgroundColor: colors.successMuted }]}>
                      <Text style={[styles.gradeText, { color: colors.success }]}>✓ {detail.grade}</Text>
                    </View>
                  ) : null}
                  <View style={[styles.statusPill, { backgroundColor: statusPill.bg }]}>
                    <Text style={styles.statusText}>{statusPill.text}</Text>
                  </View>
                </View>
              }
              back={
                <View style={styles.fill}>
                  <GradientThumb accent="#b89486" width="100%" height={241} radius={0} />
                  <View style={styles.backLabel}>
                    <Text style={styles.backLabelText}>BACK</Text>
                  </View>
                </View>
              }
            />
          </View>
        )}

        {/* Title */}
        <Text style={[styles.title, { color: colors.fgPrimary }]}>{detail.title}</Text>
        <Text style={[styles.subtitle, { color: colors.fgSecondary }]}>{detail.subtitle}</Text>

        {isShowcase ? (
          <Text style={[styles.ownerLine, { color: colors.secondary }]}>In your showcase</Text>
        ) : null}

        {isPrivate ? (
          <View style={[styles.privateNote, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Text style={styles.privateGlyph}>🔒</Text>
            <Text style={[styles.privateText, { color: colors.fgSecondary }]}>Only you can see this card</Text>
          </View>
        ) : null}

        {/* Price (market) */}
        {isMarket && detail.price ? (
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>{detail.price}</Text>
            {detail.shipping ? <Text style={[styles.shipping, { color: colors.fgTertiary }]}>{detail.shipping}</Text> : null}
          </View>
        ) : null}

        {/* Social proof */}
        {isMarket ? (
          <View style={[styles.proof, { backgroundColor: colors.secondaryMuted }]}>
            <AvatarStack letters={["A", "M", "D"]} bg={colors.bgBase} />
            <Text style={[styles.proofText, { color: colors.secondary }]}>{detail.watching} watching · {detail.offers} offers received</Text>
          </View>
        ) : null}
        {isShowcase ? (
          <Pressable style={[styles.proof, { backgroundColor: colors.secondaryMuted }]} onPress={() => router.push("/feed/likes")}>
            <AvatarStack letters={["J", "M"]} bg={colors.bgBase} />
            <Text style={[styles.proofText, { color: colors.secondary }]}>{detail.friends} friends also showcase this</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.secondary} style={{ marginLeft: "auto" }} />
          </Pressable>
        ) : null}

        {/* Likes & comments (showcase) — clickable */}
        {isShowcase ? (
          <View style={[styles.engage, { borderBottomColor: colors.borderDefault }]}>
            <Pressable style={styles.engageItem} onPress={() => router.push("/feed/likes")} hitSlop={6}>
              <Ionicons name="heart" size={16} color={colors.primary} />
              <Text style={[styles.engageNum, { color: colors.fgPrimary }]}>{detail.likes}</Text>
              <Text style={[styles.engageLabel, { color: colors.fgTertiary }]}>likes</Text>
            </Pressable>
            <Pressable style={styles.engageItem} onPress={() => router.push("/feed/comments")} hitSlop={6}>
              <Ionicons name="chatbubble-outline" size={14} color={colors.fgSecondary} />
              <Text style={[styles.engageNum, { color: colors.fgPrimary }]}>{detail.comments}</Text>
              <Text style={[styles.engageLabel, { color: colors.fgTertiary }]}>comments</Text>
            </Pressable>
            <View style={{ marginLeft: "auto" }}>
              <AvatarStack letters={["A", "M", "D", "K"]} bg={colors.bgBase} size={22} />
            </View>
          </View>
        ) : null}

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map(([k, v]) => (
            <View key={k} style={[styles.statCell, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Text style={[styles.statKey, { color: colors.fgTertiary }]}>{k.toUpperCase()}</Text>
              <Text style={[styles.statVal, { color: colors.fgPrimary }]}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Owner card */}
        <OwnerCard mode={mode} onManage={() => setMenuOpen(true)} onEdit={() => Alert.alert("Edit Details")} />

        {/* Action buttons */}
        <View style={styles.actions}>
          {isMarket ? (
            <>
              <ActionBtn label="Edit Listing" variant="outline" tone={colors.primary} onPress={() => Alert.alert("Edit Listing")} />
              <ActionBtn label="Mark as Sold" variant="solid" tone={colors.primary} onPress={markSold} />
            </>
          ) : isShowcase ? (
            <>
              <ActionBtn label="Edit Showcase" variant="outline" tone={colors.secondary} onPress={() => Alert.alert("Edit Showcase")} />
              <ActionBtn label="Change Visibility" variant="solid" tone={colors.secondary} onPress={() => setVisOpen(true)} />
            </>
          ) : (
            <>
              <ActionBtn label="Edit Details" variant="outline" tone={colors.primary} onPress={() => Alert.alert("Edit Details")} />
              <ActionBtn label="Change Visibility" variant="solid" tone={colors.primary} onPress={() => setVisOpen(true)} />
            </>
          )}
        </View>
      </ScrollView>

      {/* ··· menu */}
      <ActionSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        header={{ title: detail.title, subtitle: detail.subtitle }}
        actions={menuActions}
      />

      {/* Change visibility */}
      <ActionSheet
        visible={visOpen}
        onClose={() => setVisOpen(false)}
        header={{ title: "Change visibility", subtitle: detail.title }}
        actions={[
          { icon: "lock-closed-outline", label: "Private", sub: "Only you can see it", onPress: () => setMode("private") },
          { icon: "star-outline", label: "Showcased", sub: "Show on your profile", onPress: () => setMode("showcased") },
          { icon: "pricetag-outline", label: "List on Market", sub: "Put it up for sale", onPress: () => setMode("market") },
        ]}
      />
    </SafeAreaView>
  );
}

function AvatarStack({ letters, bg, size = 20 }: { letters: string[]; bg: string; size?: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {letters.map((l, i) => (
        <View key={l} style={{ marginLeft: i > 0 ? -size * 0.28 : 0, borderRadius: size, borderWidth: 2, borderColor: bg }}>
          <Avatar name={l} size={size} color={STACK_COLORS[i % STACK_COLORS.length]} />
        </View>
      ))}
    </View>
  );
}

function OwnerCard({ mode, onManage, onEdit }: { mode: CardMode; onManage: () => void; onEdit: () => void }) {
  const { colors } = useTheme();
  if (mode === "market") {
    return (
      <View style={[styles.owner, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
        <Avatar name="J" size={30} color={colors.primary} />
        <View style={styles.flex}>
          <Text style={[styles.ownerName, { color: colors.fgPrimary }]}>@jakescollects</Text>
          <Text style={[styles.ownerMeta, { color: colors.primary }]}>🏷 Your listing · Live on Market</Text>
        </View>
        <Pressable style={[styles.ownerBtn, { backgroundColor: colors.bgBase, borderColor: colors.primary }]} onPress={onManage}>
          <Text style={[styles.ownerBtnText, { color: colors.primary }]}>Manage</Text>
        </Pressable>
      </View>
    );
  }
  if (mode === "showcased") {
    return (
      <View style={[styles.owner, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
        <Avatar name="J" size={30} color={colors.secondary} />
        <View style={styles.flex}>
          <Text style={[styles.ownerName, { color: colors.fgPrimary }]}>@jakescollects</Text>
          <Text style={[styles.ownerMeta, { color: colors.secondary }]}>⭐ Your showcase · Not for sale</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.owner, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
      <Avatar name="J" size={30} color={colors.primary} />
      <View style={styles.flex}>
        <Text style={[styles.ownerName, { color: colors.fgPrimary }]}>@jakescollects</Text>
        <Text style={[styles.ownerMeta, { color: colors.fgSecondary }]}>Your card · My Collection</Text>
      </View>
      <Pressable style={[styles.ownerBtn, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]} onPress={onEdit}>
        <Text style={[styles.ownerBtnText, { color: colors.primary }]}>Edit</Text>
      </Pressable>
    </View>
  );
}

function ActionBtn({ label, variant, tone, onPress }: { label: string; variant: "solid" | "outline"; tone: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionBtn, variant === "solid" ? { backgroundColor: tone } : { borderWidth: 1.5, borderColor: tone }]}
    >
      <Text style={[styles.actionText, { color: variant === "solid" ? "#fff" : tone }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  fill: { width: "100%", height: "100%" },

  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingBottom: 10 },
  navCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  navTitle: { fontFamily: fontFamily.socialSemibold, fontSize: 14 },

  body: { paddingHorizontal: space.lg, paddingBottom: space["3xl"] },

  photoWrap: { alignItems: "center", marginBottom: 16 },
  gradeBadge: { position: "absolute", top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  gradeText: { fontFamily: fontFamily.socialBold, fontSize: 9 },
  statusPill: { position: "absolute", bottom: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  statusText: { fontFamily: fontFamily.socialSemibold, fontSize: 9, color: "#fff" },
  backLabel: { position: "absolute", bottom: 8, left: 0, right: 0, alignItems: "center" },
  backLabelText: { fontFamily: fontFamily.socialBold, fontSize: 8, color: "rgba(255,255,255,0.85)", letterSpacing: 0.5 },

  refWrap: { alignItems: "center", marginBottom: 14, paddingTop: 4 },
  refOutline: { borderRadius: 14, padding: 3, borderWidth: 2.5 },
  refBadge: { marginTop: -10, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  refBadgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, color: "#fff", letterSpacing: 0.5 },
  refNote: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 14 },
  ownPhotoBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1, marginTop: 7 },
  ownPhotoText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  title: { fontFamily: fontFamily.socialBold, fontSize: 21, lineHeight: 26, marginBottom: 3 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 12, marginBottom: 8 },
  ownerLine: { fontFamily: fontFamily.socialSemibold, fontSize: 11, marginBottom: 8 },
  privateNote: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginBottom: 10, alignSelf: "flex-start" },
  privateGlyph: { fontSize: 11 },
  privateText: { fontFamily: fontFamily.body, fontSize: 11 },

  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 10, marginBottom: 10 },
  price: { fontFamily: fontFamily.display, fontSize: 26 },
  shipping: { fontFamily: fontFamily.body, fontSize: 11 },

  proof: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginBottom: 12 },
  proofText: { fontFamily: fontFamily.socialSemibold, fontSize: 11 },

  engage: { flexDirection: "row", alignItems: "center", gap: 18, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1 },
  engageItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  engageNum: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  engageLabel: { fontFamily: fontFamily.body, fontSize: 11 },

  statsRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  statCell: { flex: 1, padding: 8, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  statKey: { fontFamily: fontFamily.bodyBold, fontSize: 9, letterSpacing: 0.3, marginBottom: 3 },
  statVal: { fontFamily: fontFamily.socialBold, fontSize: 10.5 },

  owner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  ownerName: { fontFamily: fontFamily.socialSemibold, fontSize: 12 },
  ownerMeta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  ownerBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  ownerBtnText: { fontFamily: fontFamily.socialBold, fontSize: 10 },

  actions: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 13, borderRadius: radii.lg, alignItems: "center", justifyContent: "center" },
  actionText: { fontFamily: fontFamily.socialBold, fontSize: 13 },
});
