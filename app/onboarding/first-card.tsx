import { StepScaffold } from "@/components/onboarding/step-scaffold";
import { fontFamily } from "@/constants/theme";
import { useFinishOnboarding } from "@/hooks/use-onboarding";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Fanned card stack behind the "+" button (back → front).
const CARDS = [
  { rot: "-12deg", x: -28, color: "surface" },
  { rot: "-5deg", x: -12, color: "#f0e4d4" },
  { rot: "3deg", x: 4, color: "primary" },
] as const;

export default function OnboardingFirstCard() {
  const { colors } = useTheme();
  const finishOnboarding = useFinishOnboarding();
  const [busy, setBusy] = useState(false);

  // Both entries finish onboarding first, then drop into the real add-card flow.
  async function go(where: "scan" | "search") {
    if (busy) return;
    setBusy(true);
    await finishOnboarding();
    if (where === "scan") router.replace("/add-card/scan");
    else router.replace("/add-card/search");
  }

  const cardColor = (c: string) => (c === "surface" ? colors.bgSurface : c === "primary" ? colors.primary : c);

  return (
    <StepScaffold
      step={4}
      onBack={() => router.back()}
      eyebrow="Step 4 of 5"
      title={"Add your\nfirst card"}
      subtitle="Start your collection. Scan with your camera, upload from your gallery, or search by name."
      secondary={{ label: "Skip for now — I'll add cards later", onPress: () => router.push("/onboarding/all-set") }}
    >
      {/* card illustration */}
      <View style={styles.illustration}>
        {CARDS.map((c, i) => {
          const base = cardColor(c.color);
          return (
            <View key={i} style={[styles.card, { transform: [{ rotate: c.rot }, { translateX: c.x }], zIndex: i }]}>
              <LinearGradient colors={[base, `${base}bb`]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
              {i === 2 ? <View style={[styles.cardInner, { backgroundColor: colors.bgBase }]} /> : null}
            </View>
          );
        })}
        <View style={[styles.plus, { backgroundColor: colors.primary, borderColor: colors.bgBase }]}>
          <Text style={[styles.plusGlyph, { color: colors.fgPrimary }]}>+</Text>
        </View>
      </View>

      {/* action rows */}
      <View style={styles.rows}>
        <Pressable
          style={[styles.row, styles.rowPrimary, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
          onPress={() => go("scan")}
          disabled={busy}
        >
          <View style={[styles.rowIcon, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
            <Text style={styles.rowEmoji}>📷</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.rowTitleLight}>Upload a card</Text>
            <Text style={styles.rowSubLight}>Scan with camera or pick from gallery</Text>
          </View>
          <Text style={styles.chevLight}>›</Text>
        </Pressable>

        <Pressable
          style={[styles.row, { backgroundColor: colors.bgSurface, borderWidth: 1.5, borderColor: colors.borderDefault }]}
          onPress={() => go("search")}
          disabled={busy}
        >
          <View style={[styles.rowIcon, { backgroundColor: colors.primaryMuted }]}>
            <Text style={styles.rowEmoji}>🔍</Text>
          </View>
          <View style={styles.flex}>
            <Text style={[styles.rowTitle, { color: colors.fgPrimary }]}>Search by name</Text>
            <Text style={[styles.rowSub, { color: colors.fgTertiary }]}>LeBron, Mahomes, Ohtani…</Text>
          </View>
          <Text style={[styles.chev, { color: colors.fgTertiary }]}>›</Text>
        </Pressable>
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  illustration: { height: 180, marginBottom: 24, alignItems: "center", justifyContent: "center" },
  card: {
    position: "absolute",
    width: 116,
    height: 162,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1a1210",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  cardInner: { width: "60%", height: "75%", borderRadius: 5, opacity: 0.18 },
  plus: {
    position: "absolute",
    bottom: 0,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E76F51",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
  plusGlyph: { fontSize: 22, fontFamily: fontFamily.body, lineHeight: 26 },

  rows: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 18 },
  rowPrimary: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 4 },
  rowIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  rowEmoji: { fontSize: 21 },
  rowTitle: { fontFamily: fontFamily.socialBold, fontSize: 14 },
  rowTitleLight: { fontFamily: fontFamily.socialBold, fontSize: 14, color: "#fff" },
  rowSub: { fontFamily: fontFamily.body, fontSize: 11.5, marginTop: 1 },
  rowSubLight: { fontFamily: fontFamily.body, fontSize: 11.5, marginTop: 1, color: "rgba(255,255,255,0.75)" },
  chev: { fontSize: 18 },
  chevLight: { fontSize: 18, color: "rgba(255,255,255,0.7)" },
});
