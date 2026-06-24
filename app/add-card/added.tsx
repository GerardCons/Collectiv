import { GradientThumb } from "@/components/home/gradient-thumb";
import { FlipCard } from "@/components/portfolio/flip-card";
import { PortfolioCardCell } from "@/components/portfolio/portfolio-card";
import { fontFamily, space } from "@/constants/theme";
import { useAddCardDraft } from "@/lib/add-card-store";
import { COLLECTIONS } from "@/lib/portfolio-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddedScreen() {
  const { colors } = useTheme();
  const draft = useAddCardDraft();

  const hasFront = draft.frontUri != null;
  const hasBack = draft.backUri != null;

  // Back-image tag.
  const tag = !hasFront
    ? { label: "Reference photo", color: colors.warning }
    : hasBack
      ? { label: "Front + Back", color: colors.success }
      : { label: "Front only", color: colors.fgTertiary };

  const otherCards = COLLECTIONS[0].cards.slice(1, 6);

  function done() {
    useAddCardDraft.getState().reset();
    router.replace("/(tabs)/portfolio");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      {/* success banner */}
      <View style={[styles.banner, { backgroundColor: colors.successMuted, borderColor: colors.success }]}>
        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
        <Text style={[styles.bannerText, { color: colors.success }]} numberOfLines={1}>
          {draft.name || "Card"} added to My Collection!
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* the new card — tap to flip */}
        <View style={styles.cardArea}>
          <FlipCard
            width={140}
            height={196}
            radius={14}
            front={
              hasFront ? (
                <Image source={{ uri: draft.frontUri! }} style={styles.fill} contentFit="cover" />
              ) : (
                <GradientThumb accent={draft.referenceAccent ?? colors.primary} width="100%" height={196} radius={0} />
              )
            }
            back={hasBack ? <Image source={{ uri: draft.backUri! }} style={styles.fill} contentFit="cover" /> : undefined}
          />
          <View style={[styles.tag, { backgroundColor: `${tag.color}1f`, borderColor: tag.color }]}>
            <Ionicons name={hasBack ? "checkmark-circle" : "image-outline"} size={11} color={tag.color} />
            <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
          </View>
          <Text style={[styles.cardName, { color: colors.fgPrimary }]} numberOfLines={1}>{draft.name || "New card"}</Text>
          <Text style={[styles.cardMeta, { color: colors.fgTertiary }]}>
            {draft.genre} · {draft.condition}
            {draft.graded ? ` · ${draft.gradingCompany} ${draft.grade}` : ""}
          </Text>
        </View>

        {/* collection preview */}
        <Text style={[styles.sectionLabel, { color: colors.fgTertiary }]}>In My Collection</Text>
        <View style={styles.grid}>
          {/* new card highlighted */}
          <View style={[styles.cell, styles.newCell, { borderColor: colors.primary }]}>
            <View style={styles.newArt}>
              {hasFront ? (
                <Image source={{ uri: draft.frontUri! }} style={styles.fill} contentFit="cover" />
              ) : (
                <GradientThumb accent={draft.referenceAccent ?? colors.primary} width="100%" height={96} radius={0} />
              )}
              <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>
            <View style={styles.newMeta}>
              <Text style={[styles.newName, { color: colors.fgPrimary }]} numberOfLines={1}>{draft.name || "New card"}</Text>
              <Text style={[styles.newSub, { color: colors.fgTertiary }]} numberOfLines={1}>{draft.genre} · {draft.condition}</Text>
            </View>
          </View>
          {otherCards.map((c) => (
            <View key={c.id} style={styles.cell}>
              <PortfolioCardCell card={c} />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={[styles.doneBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.doneText} onPress={done}>Done</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fill: { width: "100%", height: "100%" },
  banner: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: space.lg, marginTop: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  bannerText: { fontFamily: fontFamily.socialBold, fontSize: 12, flex: 1 },

  body: { padding: space.lg, paddingBottom: 8 },
  cardArea: { alignItems: "center", marginBottom: 16 },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  tagText: { fontFamily: fontFamily.socialBold, fontSize: 10 },
  cardName: { fontFamily: fontFamily.socialBold, fontSize: 15, marginTop: 10 },
  cardMeta: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 2 },

  sectionLabel: { fontFamily: fontFamily.socialBold, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  cell: { width: "31.5%" },
  newCell: { borderRadius: 10, borderWidth: 2, overflow: "hidden" },
  newArt: { height: 96 },
  newBadge: { position: "absolute", top: 5, right: 5, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  newBadgeText: { fontFamily: fontFamily.bodyExtrabold, fontSize: 7, color: "#fff" },
  newMeta: { padding: 7 },
  newName: { fontFamily: fontFamily.bodySemibold, fontSize: 9.5 },
  newSub: { fontFamily: fontFamily.body, fontSize: 7.5, marginTop: 1 },

  footer: { padding: space.lg, paddingBottom: space.sm },
  doneBtn: { paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  doneText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
