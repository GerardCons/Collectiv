import { Button } from "@/components/ui/button";
import { fontFamily, fontSizes, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Progress dots — filled (wide) for completed steps, dot for the rest. */
function ProgressDots({ step, total }: { step: number; total: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < step
              ? { width: 20, backgroundColor: colors.primary }
              : { width: 6, backgroundColor: colors.borderDefault },
          ]}
        />
      ))}
    </View>
  );
}

/**
 * Shared chrome for the 5 onboarding steps: back control + progress dots, a
 * coral eyebrow, a DM-Serif-free Sora title, optional subtitle, a scrollable
 * body, and a sticky bottom CTA (+ optional ghost action under it).
 */
export function StepScaffold({
  step,
  total = 5,
  onBack,
  eyebrow,
  title,
  subtitle,
  children,
  cta,
  secondary,
  scroll = true,
}: {
  step: number;
  total?: number;
  onBack?: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  cta: { label: string; onPress: () => void; loading?: boolean; disabled?: boolean };
  secondary?: { label: string; onPress: () => void };
  scroll?: boolean;
}) {
  const { colors } = useTheme();
  const Body = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} hitSlop={10} disabled={!onBack} style={styles.back}>
          {onBack ? <Ionicons name="chevron-back" size={26} color={colors.fgPrimary} /> : null}
        </Pressable>
        <ProgressDots step={step} total={total} />
        <View style={styles.back} />
      </View>

      <Body
        style={styles.flex}
        contentContainerStyle={scroll ? styles.bodyContent : undefined}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.head}>
          {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
          <Text style={[styles.title, { color: colors.fgPrimary }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.fgSecondary }]}>{subtitle}</Text> : null}
        </View>
        {children}
      </Body>

      <View style={styles.footer}>
        <Button title={cta.label} onPress={cta.onPress} loading={cta.loading} disabled={cta.disabled} />
        {secondary ? (
          <Pressable onPress={secondary.onPress} style={styles.secondary} hitSlop={8}>
            <Text style={[styles.secondaryText, { color: colors.fgSecondary }]}>{secondary.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingTop: space.xs,
  },
  back: { width: 40, height: 32, justifyContent: "center" },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: { height: 6, borderRadius: 3 },

  bodyContent: { paddingHorizontal: space["2xl"], paddingBottom: space.xl },
  head: { marginTop: space.lg, marginBottom: space["2xl"] },
  eyebrow: {
    fontFamily: fontFamily.socialBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes.xl,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.sm,
    marginTop: 8,
    lineHeight: 20,
  },

  footer: { paddingHorizontal: space["2xl"], paddingTop: space.sm, gap: space.xs },
  secondary: { alignItems: "center", paddingVertical: space.md },
  secondaryText: { fontFamily: fontFamily.bodySemibold, fontSize: fontSizes.sm },
});
