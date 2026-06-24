import { StepScaffold } from "@/components/onboarding/step-scaffold";
import { radii } from "@/constants/theme";
import { useFinishOnboarding } from "@/hooks/use-onboarding";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function OnboardingFirstCard() {
  const { colors } = useTheme();
  const finishOnboarding = useFinishOnboarding();
  const [busy, setBusy] = useState(false);

  // Finish onboarding, then drop the user into the real add-card flow.
  async function addCard() {
    setBusy(true);
    await finishOnboarding();
    router.replace("/add-card/scan");
  }

  const cards = [
    { rot: "-12deg", x: -28, bg: colors.bgSurface },
    { rot: "-4deg", x: -10, bg: colors.bgElevated },
    { rot: "4deg", x: 8, bg: colors.primary },
  ];

  return (
    <StepScaffold
      step={4}
      onBack={() => router.back()}
      eyebrow="Step 4 of 5"
      title={"Add your\nfirst card"}
      subtitle="Start your collection. Scan with your camera or upload from your gallery."
      cta={{ label: "Add my first card", onPress: addCard, loading: busy }}
      secondary={{ label: "Skip for now — I'll add cards later", onPress: () => router.push("/onboarding/all-set") }}
    >
      <View style={styles.illustration}>
        {cards.map((c, i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: c.bg, transform: [{ rotate: c.rot }, { translateX: c.x }], zIndex: i },
            ]}
          >
            {i === 2 ? <View style={styles.cardInner} /> : null}
          </View>
        ))}
        <View style={[styles.plus, { backgroundColor: colors.primary, borderColor: colors.bgBase }]}>
          <Ionicons name="add" size={22} color={colors.fgOnAccent} />
        </View>
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  illustration: { height: 200, alignItems: "center", justifyContent: "center" },
  card: {
    position: "absolute",
    width: 116,
    height: 162,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInner: {
    width: "60%",
    height: "75%",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  plus: {
    position: "absolute",
    bottom: 6,
    right: 40,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
