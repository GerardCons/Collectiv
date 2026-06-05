import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SLIDES = [
  {
    icon: "albums-outline" as const,
    title: "Catalog your collection",
    body: "Photograph your cards front and back. Every card captured, organized, and always at your fingertips.",
  },
  {
    icon: "pricetags-outline" as const,
    title: "Showcase & sell locally",
    body: "Share your best cards with the community and list extras for local buyers — no fees, no middlemen.",
  },
  {
    icon: "people-outline" as const,
    title: "Join the community",
    body: "Groups for every genre, events in your city. Find your people and stay connected to the hobby.",
  },
  {
    icon: "map-outline" as const,
    title: "Discover locally",
    body: "See collectors, hobby shops, and upcoming events near you on a live map.",
  },
] as const;

export function OnboardingTour({ onDismiss }: { onDismiss: () => void }) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  return (
    <Modal visible animationType="fade" statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        {/* Skip */}
        <View style={styles.topBar}>
          <Pressable onPress={onDismiss} hitSlop={12} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Slide */}
        <View style={styles.slide}>
          <View style={styles.iconRing}>
            <Ionicons name={slide.icon} size={52} color={colors.accent} />
          </View>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <Pressable
            style={styles.btn}
            onPress={() => (isLast ? onDismiss() : setIndex((n) => n + 1))}
          >
            <Text style={styles.btnText}>
              {isLast ? "Get started" : "Next"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },
  topBar: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  skip: { padding: spacing.sm },
  skipText: { fontSize: fontSize.sm, color: colors.textTertiary, fontWeight: "600" },

  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl * 1.5,
    gap: spacing.xl,
  },
  iconRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  body: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.accent,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: "700",
  },
});
