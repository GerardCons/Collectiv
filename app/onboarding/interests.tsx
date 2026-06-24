import { StepScaffold } from "@/components/onboarding/step-scaffold";
import { fontFamily, fontSizes, radii } from "@/constants/theme";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Variant = "main" | "sports" | "others";

// [emoji, label, expands-to?]
const SETS: Record<Variant, [string, string, Variant?][]> = {
  main: [
    ["🃏", "Pokémon TCG"],
    ["🏀", "Sports", "sports"],
    ["🔮", "Magic: The Gathering"],
    ["⚓", "One Piece"],
    ["🐉", "Yu-Gi-Oh!"],
    ["✨", "Disney Lorcana"],
    ["🥖", "Digimon"],
    ["➕", "Others / More", "others"],
  ],
  sports: [
    ["🏀", "Basketball"],
    ["🏈", "Football"],
    ["⚾", "Baseball"],
    ["🏒", "Hockey"],
    ["⚽", "Soccer"],
    ["🏎", "Racing"],
    ["🥊", "UFC"],
    ["🤼", "Wrestling"],
  ],
  others: [
    ["🌀", "Riftbound"],
    ["🔥", "Flesh and Blood"],
    ["🚀", "Star Wars"],
    ["🦸", "Marvel"],
    ["🏰", "Disney"],
    ["🐲", "Dragon Ball"],
    ["🧩", "SpongeBob"],
    ["🗑", "Garbage Pail Kids"],
  ],
};

const TITLES: Record<Variant, string> = {
  main: "What do you\ncollect?",
  sports: "Which sports\ndo you collect?",
  others: "More universes\nto explore",
};

export default function OnboardingInterests() {
  const { colors } = useTheme();
  const updateProfile = useUpdateProfile();
  const [variant, setVariant] = useState<Variant>("main");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const items = SETS[variant];
  const count = selected.size;

  function toggle(label: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function back() {
    if (variant !== "main") setVariant("main");
    else router.back();
  }

  async function next() {
    setSaving(true);
    try {
      // Best-effort — needs migration 0011. Onboarding continues regardless.
      await updateProfile.mutateAsync({ interests: Array.from(selected) });
    } catch {
      // interests column not deployed yet; ignore and move on.
    } finally {
      setSaving(false);
      router.push("/onboarding/location");
    }
  }

  return (
    <StepScaffold
      step={2}
      onBack={back}
      eyebrow={variant === "main" ? "Step 2 of 5" : "Back to categories"}
      title={TITLES[variant]}
      subtitle={
        variant === "main"
          ? "Pick as many as you like. We'll tune your feed."
          : "Tap a category to add it to your feed."
      }
      cta={{
        label: count ? `Continue · ${count} selected` : "Continue",
        onPress: next,
        loading: saving,
      }}
    >
      <View style={styles.grid}>
        {items.map(([icon, label, expand]) => {
          const on = selected.has(label);
          return (
            <Pressable
              key={label}
              onPress={() => (expand ? setVariant(expand) : toggle(label))}
              style={[
                styles.tile,
                {
                  backgroundColor: on ? colors.primaryMuted : colors.bgSurface,
                  borderColor: on ? colors.primary : colors.borderDefault,
                },
              ]}
            >
              <View style={[styles.iconTile, { backgroundColor: on ? colors.primaryMuted : colors.bgRecessed }]}>
                <Text style={styles.icon}>{icon}</Text>
              </View>
              <Text
                style={[styles.label, { color: on ? colors.fgPrimary : colors.fgSecondary }]}
                numberOfLines={2}
              >
                {label}
              </Text>
              {expand ? (
                <Ionicons name="chevron-forward" size={15} color={colors.fgTertiary} style={styles.corner} />
              ) : on ? (
                <View style={[styles.check, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={11} color={colors.fgOnAccent} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "47.5%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    padding: 13,
    borderRadius: radii.lg,
    borderWidth: 1.5,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 18 },
  label: { flex: 1, fontFamily: fontFamily.bodySemibold, fontSize: fontSizes.sm, lineHeight: 16 },
  corner: { position: "absolute", top: "50%", right: 10, marginTop: -7 },
  check: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
