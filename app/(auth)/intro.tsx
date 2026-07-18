import { fontFamily } from "@/constants/theme";
import { useOnboardingFlags } from "@/hooks/use-onboarding";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
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
import Svg, { G, Line, Path, Rect } from "react-native-svg";

/**
 * Onboarding tour — 4 paged slides recreated from the design source
 * (design_handoff_collectiv/screens-auth.jsx · AU_Intro1–4). Each slide pages a
 * 400px hero illustration; the footer (progress bars / heading / body / CTA)
 * stays put and cross-updates from the active index.
 */

const AU = {
  coral: "#E76F51",
  purple: "#7C3AED",
  green: "#10B981",
  amber: "#f59e0b",
  blue: "#2563eb",
  text: "#1a1210",
  ter: "#aa9a90",
};

// Gradient placeholders for the card tiles (matches AU_GRAD).
const GRAD: Record<string, [string, string]> = {
  coral: ["#f6b49a", "#E76F51"],
  blue: ["#9db8ee", "#3f6fd6"],
  green: ["#7fd9b4", "#10B981"],
  purple: ["#b89af0", "#7C3AED"],
  amber: ["#f4cd86", "#f59e0b"],
};

type Slide = {
  accent: string;
  heading: string;
  body: string;
  cta: string;
  Hero: () => React.ReactElement;
};

// ── Gradient listing card ───────────────────────────────────────────────────
type GCardProps = {
  grad: keyof typeof GRAD;
  cat?: string;
  grade?: string;
  name: string;
  price?: string;
  meta?: string;
  flag?: string;
  flagC?: string;
  w?: number;
  tile: number;
  rot?: number;
  x: number;
  y: number;
  z?: number;
  big?: boolean;
  noPrice?: boolean;
  tag?: string;
};

function GCard({ grad, cat, grade, name, price, meta, flag, flagC, w = 104, tile, rot = 0, x, y, z, big, noPrice, tag }: GCardProps) {
  return (
    <View
      style={[
        styles.card,
        big ? styles.cardShadowBig : styles.cardShadow,
        { left: x, top: y, width: w, zIndex: z, transform: [{ rotate: `${rot}deg` }] },
      ]}
    >
      <View style={[styles.tile, { height: tile }]}>
        <LinearGradient colors={GRAD[grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0)"]} start={{ x: 0, y: 0 }} end={{ x: 0.55, y: 0.55 }} style={StyleSheet.absoluteFill} />
        {grade ? (
          <View style={[styles.badge, styles.badgeTR, { backgroundColor: "rgba(255,255,255,0.88)" }]}>
            <Text style={[styles.badgeText, { color: AU.text }]}>{grade}</Text>
          </View>
        ) : null}
        {flag ? (
          <View style={[styles.badge, styles.badgeTL, { backgroundColor: flagC }]}>
            <Text style={[styles.badgeText, { color: "#fff" }]}>{flag}</Text>
          </View>
        ) : null}
        {cat ? (
          <View style={styles.catTag}>
            <Text style={styles.catText}>{cat}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <Text numberOfLines={2} style={[styles.cardName, { fontSize: big ? 5.5 : 5, lineHeight: (big ? 5.5 : 5) * 1.45 }]}>
          {name}
        </Text>
        {tag ? (
          <Text numberOfLines={1} style={styles.cardTag}>
            {tag}
          </Text>
        ) : null}
        {!noPrice ? (
          <View style={styles.priceRow}>
            <Text style={[styles.price, { fontSize: big ? 7 : 6 }]}>{price}</Text>
            {meta ? (
              <Text numberOfLines={1} style={styles.priceMeta}>
                {meta.split("·")[0].trim()}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ── Slide 1 · Collect & Showcase ────────────────────────────────────────────
function Hero1() {
  return (
    <View style={{ width: 250, height: 206 }}>
      <GCard grad="blue" cat="MLB" grade="BGS 8.5" name="Mike Trout 2011 Topps Update Rookie" tag="Near Mint" w={90} tile={104} rot={-13} x={6} y={44} z={1} noPrice />
      <GCard grad="green" cat="NFL" grade="PSA 10" name="Patrick Mahomes 2017 Panini Prizm Rookie" tag="Mint" w={90} tile={104} rot={13} x={150} y={42} z={1} noPrice />
      <GCard grad="coral" cat="NBA" grade="PSA 10" name="LeBron James 2003 Topps Base Rookie" tag="Gem Mint" w={108} tile={128} rot={-2} x={68} y={14} z={2} big noPrice />
    </View>
  );
}

// ── Slide 2 · List, Buy & Trade ─────────────────────────────────────────────
function Hero2() {
  return (
    <View style={{ width: 256, height: 236 }}>
      <GCard grad="amber" cat="SOCCER" grade="PSA 9" name="Lionel Messi 2004 Megacracks RC" price="$1,950" meta="Near Mint · 4.1 km" w={84} tile={94} rot={-17} x={2} y={62} z={1} />
      <GCard grad="green" cat="NHL" grade="BGS 9.5" name="Connor McDavid 2015 Young Guns" price="$2,400" meta="Mint · 6.8 km" flag="HOT" flagC={AU.coral} w={84} tile={94} rot={14} x={168} y={12} z={2} />
      <GCard grad="purple" cat="POKÉMON" name="Mew Holo · Wizards Promo" price="$680" meta="Raw · 2.3 km" flag="NEW" flagC={AU.purple} w={80} tile={86} rot={10} x={6} y={-8} z={2} />
      <GCard grad="coral" cat="MLB" grade="PSA 10" name="Shohei Ohtani 2018 Topps Update RC" price="$340" meta="Gem Mint · 3.2 km" w={104} tile={118} rot={-3} x={78} y={50} z={4} big />
      <GCard grad="blue" cat="NFL" grade="PSA 8" name="Tom Brady 2000 Bowman Rookie" price="$5,100" meta="Excellent · 9 km" w={84} tile={94} rot={11} x={166} y={150} z={3} />
      <GCard grad="green" cat="POKÉMON" grade="PSA 10" name="Pikachu VMAX · Vivid Voltage" price="$95" meta="Gem Mint · 1.4 km" flag="NEW" flagC={AU.purple} w={80} tile={86} rot={-12} x={40} y={158} z={3} />
    </View>
  );
}

// ── Slide 3 · Join the Community ────────────────────────────────────────────
function Hero3() {
  return (
    <View style={{ width: 244, gap: 9 }}>
      {/* group header pill */}
      <View style={styles.groupPill}>
        <LinearGradient colors={[AU.green, AU.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.groupIcon}>
          <Text style={{ fontSize: 12 }}>💎</Text>
        </LinearGradient>
        <View>
          <Text style={styles.groupName}>PSA 10 Hunters</Text>
          <Text style={styles.groupMeta}>8,120 members · active now</Text>
        </View>
      </View>

      {/* shared showcase (left) */}
      <View style={[styles.msgLeft, { maxWidth: 188 }]}>
        <View style={[styles.chatAvatar, { backgroundColor: AU.coral }]}>
          <Text style={styles.chatAvatarText}>M</Text>
        </View>
        <View style={styles.bubbleLeft}>
          <Text style={[styles.sharedLabel, { color: AU.coral }]}>Marcus shared a showcase ✨</Text>
          <View style={styles.sharedRow}>
            <View style={[styles.miniCard, { width: 28, height: 38 }]}>
              <LinearGradient colors={GRAD.coral} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.sharedName}>LeBron James 2003 Topps RC</Text>
              <Text style={styles.sharedSub}>PSA 10 · Grail pull 🔥</Text>
            </View>
          </View>
        </View>
      </View>

      {/* reply (right) */}
      <View style={[styles.bubbleRight, { backgroundColor: AU.green }]}>
        <Text style={styles.replyWhite}>That centering is insane 🔥</Text>
      </View>

      {/* reply (left) */}
      <View style={[styles.bubbleReplyLeft]}>
        <Text style={styles.replyDark}>Count me in — see you there! 🙌</Text>
      </View>

      {/* shared event (left) */}
      <View style={[styles.msgLeft, { maxWidth: 194 }]}>
        <View style={[styles.chatAvatar, { backgroundColor: AU.amber }]}>
          <Text style={styles.chatAvatarText}>D</Text>
        </View>
        <View style={styles.bubbleLeft}>
          <Text style={[styles.sharedLabel, { color: AU.purple }]}>Diego shared an event 📅</Text>
          <View style={[styles.sharedRow, { gap: 7 }]}>
            <View style={styles.dateTile}>
              <Text style={styles.dateMonth}>JUN</Text>
              <Text style={styles.dateDay}>14</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.sharedName}>Edmonton Card Show 2026</Text>
              <Text style={styles.sharedSub}>👥 142 going · Who&apos;s in?</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Slide 4 · Find Local Stores & Events ────────────────────────────────────
const MAP_W = 236;
const MAP_H = 212;

type PinProps = { xPct: number; yPct: number; color?: string; dot?: boolean; label?: string; z?: number };

function MapPin({ xPct, yPct, color, dot, label, z }: PinProps) {
  const px = (xPct / 100) * MAP_W;
  const py = (yPct / 100) * MAP_H;
  if (dot) {
    return (
      <View style={[styles.dotPin, { left: px - 15, top: py - 15, zIndex: z }]}>
        <View style={styles.dotHalo} />
        <View style={styles.dotCore} />
      </View>
    );
  }
  return (
    <View style={[styles.pin, { left: px - 11, top: py - 27, zIndex: z }]}>
      <View style={[styles.pinCircle, { backgroundColor: color }]}>
        <Text style={styles.pinLabel}>{label}</Text>
      </View>
      <View style={styles.pinTriangle} />
    </View>
  );
}

function Hero4() {
  return (
    <View style={styles.mapBox}>
      <Svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
        <Rect width={MAP_W} height={MAP_H} fill="#ece1d4" />
        <G fill="#e4d7c7">
          <Rect x={20} y={18} width={30} height={24} />
          <Rect x={58} y={18} width={30} height={24} />
          <Rect x={152} y={30} width={34} height={26} />
          <Rect x={194} y={30} width={30} height={26} />
          <Rect x={24} y={120} width={28} height={24} />
          <Rect x={170} y={150} width={34} height={28} />
        </G>
        <Rect x={150} y={96} width={74} height={50} rx={7} fill="#d6e3c8" />
        <G stroke="#f6eee4" strokeWidth={3}>
          <Line x1={0} y1={50} x2={236} y2={50} />
          <Line x1={0} y1={92} x2={236} y2={92} />
          <Line x1={0} y1={150} x2={236} y2={150} />
          <Line x1={0} y1={186} x2={236} y2={186} />
          <Line x1={50} y1={0} x2={50} y2={212} />
          <Line x1={96} y1={0} x2={96} y2={212} />
          <Line x1={190} y1={0} x2={190} y2={212} />
        </G>
        <G stroke="#fff" strokeWidth={6}>
          <Line x1={0} y1={120} x2={236} y2={120} />
          <Line x1={142} y1={0} x2={142} y2={212} />
        </G>
        <Path d="M-10 196 C70 184 150 176 246 190" fill="none" stroke="#cedcea" strokeWidth={11} />
      </Svg>
      <MapPin xPct={22} yPct={30} color={AU.coral} label="M" z={3} />
      <MapPin xPct={63} yPct={22} color={AU.coral} label="A" z={3} />
      <MapPin xPct={40} yPct={54} color={AU.coral} label="J" z={3} />
      <MapPin xPct={82} yPct={66} color={AU.coral} label="K" z={3} />
      <MapPin xPct={76} yPct={33} color={AU.purple} label="🏪" z={4} />
      <MapPin xPct={30} yPct={78} color={AU.purple} label="🏪" z={4} />
      <MapPin xPct={66} yPct={50} color={AU.green} label="📅" z={4} />
      <MapPin xPct={16} yPct={60} color={AU.green} label="📅" z={4} />
      <MapPin xPct={48} yPct={73} dot z={5} />
    </View>
  );
}

const SLIDES: Slide[] = [
  {
    accent: AU.coral,
    heading: "Collect & Showcase\nYour Cards",
    body: "Create your personal digital binder and showcase your favorite cards. Display your biggest hits, discover other collectors, and connect with a community that shares your passion.",
    cta: "Next",
    Hero: Hero1,
  },
  {
    accent: AU.purple,
    heading: "Buy, Sell &\nTrade Locally",
    body: "Connect with collectors near you, list cards effortlessly, and find great deals, trades, and new additions for your collection.",
    cta: "Next",
    Hero: Hero2,
  },
  {
    accent: AU.green,
    heading: "Join & Explore\nCommunities",
    body: "Discover groups that match your interests, connect with collectors nearby, and explore communities beyond your favorite hobbies. Join private groups, attend local events, or create your own for friends and fellow collectors.",
    cta: "Next",
    Hero: Hero3,
  },
  {
    accent: AU.blue,
    heading: "Explore the Hobby\nNear You",
    body: "Discover sellers, card shops, and events on an interactive map. Find nearby meetup spots, local vendors, and upcoming shows to buy, sell, trade, and connect.",
    cta: "Get started",
    Hero: Hero4,
  },
];

export default function IntroScreen() {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const markIntroSeen = useOnboardingFlags((s) => s.markIntroSeen);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  // Scale the hero with the screen so the heading + full description + CTA always
  // fit beneath it. A fixed 400px band squeezed the body off shorter devices.
  const heroH = Math.max(240, Math.min(400, height - 360));

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flexGrow: 0, height: heroH }}
      >
        {SLIDES.map((s, i) => {
          const Hero = s.Hero;
          return (
            <View key={i} style={[styles.slide, { width }]}>
              <View style={[styles.hero, { height: heroH }]}>
                <LinearGradient
                  colors={[`${s.accent}1f`, `${s.accent}0a`, colors.bgBase]}
                  locations={[0, 0.55, 1]}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[styles.heroGlow, { backgroundColor: `${s.accent}14` }]} />
                <View style={[styles.heroRing, { borderColor: `${s.accent}2e` }]} />
                <View style={styles.heroArt}>
                  <Hero />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.bars}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  flex: i <= index ? 2.4 : 1,
                  backgroundColor: i <= index ? slide.accent : colors.borderDefault,
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.heading, { color: colors.fgPrimary }]}>{slide.heading}</Text>
        <Text style={[styles.body, { color: colors.fgSecondary }]}>{slide.body}</Text>

        <View style={styles.spacer} />

        <View style={styles.actions}>
          {!isLast ? (
            <Pressable onPress={finish} hitSlop={8}>
              <Text style={[styles.skip, { color: colors.fgTertiary }]}>Skip</Text>
            </Pressable>
          ) : null}
          <Pressable style={[styles.cta, { backgroundColor: slide.accent }]} onPress={next}>
            <Text style={styles.ctaText}>{slide.cta}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  slide: { flex: 1 },

  hero: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heroGlow: { position: "absolute", width: 300, height: 300, borderRadius: 150 },
  heroRing: { position: "absolute", width: 250, height: 250, borderRadius: 125, borderWidth: 1 },
  heroArt: { zIndex: 1, alignItems: "center", justifyContent: "center" },

  // gradient card
  card: { position: "absolute", borderRadius: 14, backgroundColor: "#fff", padding: 7 },
  cardShadow: { shadowColor: "#1a1210", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 13, elevation: 8 },
  cardShadowBig: { shadowColor: "#1a1210", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.26, shadowRadius: 20, elevation: 12 },
  tile: { borderRadius: 9, overflow: "hidden", position: "relative" },
  badge: { position: "absolute", paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 999 },
  badgeTR: { top: 6, right: 6 },
  badgeTL: { top: 6, left: 6 },
  badgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 5 },
  catTag: { position: "absolute", bottom: 6, left: 6, paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 4, backgroundColor: "rgba(26,18,16,0.55)" },
  catText: { fontFamily: fontFamily.socialExtrabold, fontSize: 5, letterSpacing: 0.3, color: "#fff" },
  cardBody: { paddingHorizontal: 5, paddingTop: 6, paddingBottom: 3 },
  cardName: { fontFamily: fontFamily.socialExtrabold, color: "#1a1210", letterSpacing: 0.15 },
  cardTag: { fontFamily: fontFamily.bodySemibold, fontSize: 5.5, color: AU.ter, marginTop: 2 },
  priceRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 4, marginTop: 3 },
  price: { fontFamily: fontFamily.socialExtrabold, color: AU.coral },
  priceMeta: { fontFamily: fontFamily.bodySemibold, fontSize: 5, color: AU.ter },

  // chat preview
  groupPill: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 5, paddingLeft: 6, paddingRight: 12, borderRadius: 999, backgroundColor: "#fff", shadowColor: "#1a1210", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 4 },
  groupIcon: { width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  groupName: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, color: "#1a1210" },
  groupMeta: { fontFamily: fontFamily.bodySemibold, fontSize: 6, color: AU.ter, marginTop: 1.5 },
  msgLeft: { alignSelf: "flex-start", flexDirection: "row", gap: 6, alignItems: "flex-end" },
  chatAvatar: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  chatAvatarText: { fontFamily: fontFamily.socialBold, fontSize: 8, color: "#fff" },
  bubbleLeft: { backgroundColor: "#fff", borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 12, borderBottomLeftRadius: 3, padding: 6, shadowColor: "#1a1210", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 3 },
  sharedLabel: { fontFamily: fontFamily.socialBold, fontSize: 7, marginBottom: 3, paddingLeft: 2 },
  sharedRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  miniCard: { borderRadius: 5, overflow: "hidden" },
  sharedName: { fontFamily: fontFamily.socialExtrabold, fontSize: 7, color: "#1a1210", lineHeight: 9 },
  sharedSub: { fontFamily: fontFamily.bodySemibold, fontSize: 6, color: AU.ter, marginTop: 2 },
  bubbleRight: { alignSelf: "flex-end", paddingVertical: 7, paddingHorizontal: 11, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 3, borderBottomLeftRadius: 12, shadowColor: "#10B981", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 3 },
  replyWhite: { fontFamily: fontFamily.socialBold, fontSize: 7, color: "#fff" },
  bubbleReplyLeft: { alignSelf: "flex-start", marginLeft: 26, backgroundColor: "#fff", paddingVertical: 7, paddingHorizontal: 11, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 12, borderBottomLeftRadius: 3, shadowColor: "#1a1210", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 14, elevation: 3 },
  replyDark: { fontFamily: fontFamily.bodySemibold, fontSize: 7, color: "#1a1210" },
  dateTile: { width: 30, borderRadius: 6, overflow: "hidden", borderWidth: 1, borderColor: "#f0ddd0", alignItems: "center" },
  dateMonth: { fontFamily: fontFamily.socialExtrabold, fontSize: 5.5, color: "#fff", backgroundColor: "#7C3AED", alignSelf: "stretch", textAlign: "center", paddingVertical: 1.5 },
  dateDay: { fontFamily: fontFamily.socialExtrabold, fontSize: 11, color: "#1a1210", paddingVertical: 1 },

  // map
  mapBox: { width: MAP_W, height: MAP_H, borderRadius: 20, overflow: "hidden", borderWidth: 3, borderColor: "#fff", shadowColor: "#1a1210", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 8 },
  pin: { position: "absolute", width: 22, alignItems: "center" },
  pinCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#fff", alignItems: "center", justifyContent: "center" },
  pinLabel: { fontFamily: fontFamily.socialExtrabold, fontSize: 10, color: "#fff" },
  pinTriangle: { width: 0, height: 0, marginTop: -1, borderLeftWidth: 3.5, borderRightWidth: 3.5, borderTopWidth: 5, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#fff" },
  dotPin: { position: "absolute", width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  dotHalo: { position: "absolute", width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(37,99,235,0.18)" },
  dotCore: { width: 11, height: 11, borderRadius: 5.5, backgroundColor: "#2563eb", borderWidth: 2.5, borderColor: "#fff" },

  // footer
  footer: { flex: 1, paddingHorizontal: 28, paddingTop: 20 },
  bars: { flexDirection: "row", gap: 6, marginBottom: 16 },
  bar: { height: 4, borderRadius: 3 },
  heading: { fontFamily: fontFamily.socialExtrabold, fontSize: 29, letterSpacing: -0.5, lineHeight: 34, marginBottom: 10 },
  body: { fontFamily: fontFamily.body, fontSize: 14.5, lineHeight: 23 },
  spacer: { flex: 1, minHeight: 16 },
  actions: { flexDirection: "row", alignItems: "center", gap: 16, paddingBottom: 16, marginTop: 14 },
  skip: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  cta: { flex: 1, paddingVertical: 15, borderRadius: 999, alignItems: "center" },
  ctaText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
