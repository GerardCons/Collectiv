import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useProfile } from "@/hooks/use-profile";
import { useFinishOnboarding } from "@/hooks/use-onboarding";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingAllSet() {
  const { data: profile } = useProfile();
  const finishOnboarding = useFinishOnboarding();
  const [busy, setBusy] = useState(false);

  const firstName = (profile?.display_name ?? "").trim().split(/\s+/)[0] || "collector";
  const summary = [profile?.location_city, ...(profile?.interests ?? [])]
    .filter(Boolean)
    .slice(0, 4)
    .join(" · ");

  async function done() {
    setBusy(true);
    await finishOnboarding();
    router.replace("/(tabs)");
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#E76F51", "#c95a3d", "#a34832"]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={styles.avatar}>
            <Text style={styles.avatarGlyph}>🎉</Text>
          </View>
          <Text style={styles.title}>You&apos;re all set,{"\n"}{firstName}!</Text>
          <Text style={styles.body}>
            Your collector profile is live.{summary ? `\n${summary}` : ""}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
          onPress={done}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#E76F51" />
          ) : (
            <Text style={styles.ctaText}>Go to my collection</Text>
          )}
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#E76F51" },
  safe: { flex: 1, paddingHorizontal: space["3xl"], paddingBottom: space.xl, justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.xl,
  },
  avatarGlyph: { fontSize: 34 },
  title: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes["2xl"],
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.base,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
    marginTop: space.md,
  },
  cta: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: radii.full,
    alignItems: "center",
  },
  ctaText: { fontFamily: fontFamily.socialExtrabold, fontSize: fontSizes.base, color: "#E76F51" },
  pressed: { opacity: 0.9 },
});
