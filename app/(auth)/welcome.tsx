import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandArea}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>C</Text>
        </View>
        <Text style={styles.brandName}>Collectiv</Text>
        <Text style={styles.tagline}>
          Catalog your collection. Trade locally. Find your people.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/(auth)/sign-up")}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/(auth)/sign-in")}
        >
          <Text style={styles.secondaryButtonText}>Log in</Text>
        </Pressable>

        <Text style={styles.fineprint}>
          By continuing you agree to our Terms & Privacy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    justifyContent: "space-between",
  },
  brandArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoLetter: { color: colors.textInverse, fontSize: 40, fontWeight: "800" },
  brandName: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
  actions: { paddingBottom: spacing.xl, gap: spacing.md },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  pressed: { opacity: 0.7 },
  fineprint: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
