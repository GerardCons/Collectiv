import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
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

      {/* decorative card stack, bottom-right */}
      <View pointerEvents="none" style={[styles.card, styles.cardBack]} />
      <View pointerEvents="none" style={[styles.card, styles.cardMid]} />
      <View pointerEvents="none" style={[styles.card, styles.cardFront]}>
        <View style={styles.cardInner} />
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.brandArea}>
          <Text style={styles.brandName}>Collectiv</Text>
          <Text style={styles.tagline}>
            Trade, collect & connect with{"\n"}sports card collectors near you.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text style={styles.primaryButtonText}>Create account</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.secondaryButtonText}>Log in</Text>
          </Pressable>

          <Text style={styles.fineprint}>
            By continuing you agree to our{"\n"}
            <Text style={styles.fineprintStrong}>Terms of Service</Text> and{" "}
            <Text style={styles.fineprintStrong}>Privacy Policy</Text>
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const CARD_W = 140;
const CARD_H = 196;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#E76F51" },
  safe: { flex: 1, paddingHorizontal: space["3xl"], justifyContent: "center" },

  brandArea: { alignItems: "center", marginBottom: 48 },
  brandName: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: 38,
    color: "#fff",
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: fontFamily.body,
    fontSize: 14.5,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },

  actions: { gap: space.md },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: radii.full,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#E76F51",
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes.base,
  },
  secondaryButton: {
    paddingVertical: 15,
    borderRadius: radii.full,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.85)",
    backgroundColor: "rgba(120,40,24,0.28)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  secondaryButtonText: {
    color: "#fff",
    fontFamily: fontFamily.socialBold,
    fontSize: fontSizes.base,
  },
  pressed: { opacity: 0.85 },
  fineprint: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.xs,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: space["2xl"],
    lineHeight: 18,
  },
  fineprintStrong: { color: "rgba(255,255,255,0.8)", fontFamily: fontFamily.bodySemibold },

  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    borderRadius: 18,
  },
  cardBack: {
    bottom: 140,
    right: -20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    transform: [{ rotate: "12deg" }],
  },
  cardMid: {
    bottom: 160,
    right: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    transform: [{ rotate: "6deg" }],
  },
  cardFront: {
    bottom: 180,
    right: 36,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInner: {
    width: "60%",
    height: "80%",
    borderRadius: 8,
    backgroundColor: "rgba(231,111,81,0.35)",
  },
});
