import { colors, fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useOnboardingFlags } from "@/hooks/use-onboarding";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Slide = {
  accent: string;
  glyph: string;
  heading: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    accent: "#E76F51",
    glyph: "🃏",
    heading: "Collect &\nShowcase",
    body: "Build your digital binder, then share your grails with collectors who love the hobby as much as you.",
  },
  {
    accent: "#7C3AED",
    glyph: "🏷️",
    heading: "List, Buy &\nTrade",
    body: "No shop required. List a card in seconds, browse what collectors near you have, and make an offer to buy or trade locally.",
  },
  {
    accent: "#10B981",
    glyph: "💬",
    heading: "Join the\nCommunity",
    body: "Find your people across dozens of groups. Follow collectors, talk comps, and share pulls, listings, and meetups.",
  },
  {
    accent: "#2563eb",
    glyph: "📍",
    heading: "Find Local\nStores & Events",
    body: "Discover card shops, shows, and meetups near you on the map. Plan your next in-person pickup around town.",
  },
];

export default function IntroScreen() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const markIntroSeen = useOnboardingFlags((s) => s.markIntroSeen);

  const isLast = index === SLIDES.length - 1;

  function finish() {
    markIntroSeen();
    router.replace("/(auth)/welcome");
  }

  function next() {
    if (isLast) return finish();
    scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <View style={[styles.hero, { backgroundColor: `${s.accent}14` }]}>
              <View style={[styles.heroRing, { borderColor: `${s.accent}22` }]} />
              <View style={[styles.heroTile, { backgroundColor: s.accent }]}>
                <Text style={styles.heroGlyph}>{s.glyph}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.bars}>
          {SLIDES.map((s, i) => (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  flex: i === index ? 2.4 : 1,
                  backgroundColor: i <= index ? SLIDES[index].accent : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <Text style={styles.heading}>{SLIDES[index].heading}</Text>
        <Text style={styles.body}>{SLIDES[index].body}</Text>

        <View style={styles.actions}>
          {!isLast ? (
            <Pressable onPress={finish} hitSlop={8}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : null}
          <Pressable
            style={[styles.cta, { backgroundColor: SLIDES[index].accent }]}
            onPress={next}
          >
            <Text style={styles.ctaText}>{isLast ? "Get started" : "Next"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  slide: { flex: 1 },
  hero: {
    height: 400,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroRing: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
  },
  heroTile: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  heroGlyph: { fontSize: 56 },

  footer: { flex: 1, paddingHorizontal: space["3xl"], paddingTop: space.xl },
  bars: { flexDirection: "row", gap: 6, marginBottom: space.lg },
  bar: { height: 4, borderRadius: 3 },
  heading: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes.xl,
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 10,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 21,
    flex: 1,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: space.lg, paddingBottom: space.lg },
  skip: { fontFamily: fontFamily.socialBold, fontSize: fontSizes.sm, color: colors.textTertiary },
  cta: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: radii.full,
    alignItems: "center",
  },
  ctaText: { fontFamily: fontFamily.socialBold, fontSize: fontSizes.base, color: "#fff" },
});
