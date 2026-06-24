import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily } from "@/constants/theme";
import {
  MapEvent,
  MapItem,
  Seller,
  SELLER_LISTINGS,
  SELLER_REVIEWS,
  Vendor,
  VENDOR_LISTINGS,
  VENDOR_REVIEWS,
} from "@/lib/map-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const ACCENT = { seller: "#E76F51", vendor: "#7C3AED", event: "#10B981" };

// ── Pin (Marker child) ───────────────────────────────────────
export function PinContent({ item, selected }: { item: MapItem; selected: boolean }) {
  const color = ACCENT[item.kind];
  const label = item.kind === "seller" ? item.av : item.kind === "vendor" ? "🏪" : "📅";
  const size = selected ? 40 : 34;
  return (
    <View style={{ alignItems: "center", opacity: 1 }}>
      <View style={[styles.pin, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
        {item.kind === "seller" ? (
          <Text style={[styles.pinInitial, { fontSize: selected ? 16 : 13 }]}>{label}</Text>
        ) : (
          <Text style={{ fontSize: selected ? 17 : 14 }}>{label}</Text>
        )}
      </View>
      <View style={[styles.pinTail, { borderTopColor: "#fff" }]} />
    </View>
  );
}

// ── List rows ────────────────────────────────────────────────
function VisitPill({ accent, accentM }: { accent: string; accentM: string }) {
  return (
    <View style={[styles.visit, { backgroundColor: accentM, borderColor: accent }]}>
      <Text style={[styles.visitText, { color: accent }]}>Visit</Text>
    </View>
  );
}

export function MapRow({ item, onPress }: { item: MapItem; onPress: () => void }) {
  const { colors } = useTheme();
  if (item.kind === "vendor") {
    return (
      <Pressable style={[styles.row, { borderBottomColor: colors.borderDefault }]} onPress={onPress}>
        <View style={[styles.vendorTile]}>
          <LinearGradient colors={[ACCENT.vendor, `${ACCENT.vendor}bb`]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <Text style={{ fontSize: 20 }}>🏪</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.fgPrimary }]}>{item.name}</Text>
            <Ionicons name="checkmark-circle" size={10} color={colors.success} />
          </View>
          <Text style={[styles.meta, { color: colors.fgTertiary }]}>{item.listings} listings · {item.rating}★</Text>
          <Text style={[styles.meta2, { color: colors.fgSecondary }]}>
            <Text style={{ color: item.open ? colors.success : colors.warning, fontFamily: fontFamily.socialBold }}>{item.open ? "Open" : "Closed"}</Text> · {item.hours} · {item.dist}
          </Text>
        </View>
        <VisitPill accent={colors.secondary} accentM={colors.secondaryMuted} />
      </Pressable>
    );
  }
  if (item.kind === "event") {
    return (
      <Pressable style={[styles.row, { borderBottomColor: colors.borderDefault }]} onPress={onPress}>
        <View style={[styles.eventDate, { borderColor: colors.borderDefault }]}>
          <Text style={[styles.eventMonth, { backgroundColor: item.color }]}>{item.m}</Text>
          <Text style={[styles.eventDay, { color: colors.fgPrimary }]}>{item.d}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.meta2, { color: colors.fgSecondary }]} numberOfLines={1}>📍 {item.loc}</Text>
          <View style={styles.eventTags}>
            <View style={[styles.typeTag, { backgroundColor: colors.bgSurface }]}>
              <Text style={[styles.typeTagText, { color: colors.fgSecondary }]}>{item.type}</Text>
            </View>
            <Text style={[styles.meta, { color: colors.fgTertiary }]}>👥 {item.going} going</Text>
          </View>
        </View>
        <VisitPill accent={colors.success} accentM={colors.successMuted} />
      </Pressable>
    );
  }
  return (
    <Pressable style={[styles.row, { borderBottomColor: colors.borderDefault }]} onPress={onPress}>
      <View style={[styles.sellerAv, { backgroundColor: ACCENT.seller }]}>
        <Text style={styles.sellerAvText}>{item.av}</Text>
      </View>
      <View style={styles.flex}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.fgPrimary }]}>{item.name}</Text>
          <Ionicons name="checkmark-circle" size={10} color={colors.success} />
        </View>
        <Text style={[styles.meta, { color: colors.fgTertiary }]}>{item.cards} cards · {item.rating}★</Text>
        <Text style={[styles.meta2, { color: colors.fgSecondary }]}>📍 Meets near {item.area} · {item.dist}</Text>
      </View>
      <VisitPill accent={colors.primary} accentM={colors.primaryMuted} />
    </Pressable>
  );
}

// ── Shared preview bits ──────────────────────────────────────
function Stars({ n }: { n: number }) {
  const { colors } = useTheme();
  return (
    <Text style={{ fontSize: 9.5, marginTop: 1 }}>
      <Text style={{ color: colors.warning }}>{"★".repeat(n)}</Text>
      <Text style={{ color: colors.borderStrong }}>{"★".repeat(5 - n)}</Text>
    </Text>
  );
}
function ListingsGrid({ items }: { items: { name: string; price: string; color: string }[] }) {
  const { colors } = useTheme();
  return (
    <View style={styles.grid}>
      {items.map((c, i) => (
        <View key={i} style={[styles.gridCell, { backgroundColor: colors.bgBase }]}>
          <GradientThumb accent={c.color} width="100%" height={64} radius={0} />
          <View style={styles.gridMeta}>
            <Text style={[styles.gridPrice, { color: colors.primary }]}>{c.price}</Text>
            <Text style={[styles.gridName, { color: colors.fgTertiary }]} numberOfLines={1}>{c.name}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
function ReviewsList({ reviews }: { reviews: typeof SELLER_REVIEWS }) {
  const { colors } = useTheme();
  return (
    <View>
      {reviews.map((r, i) => (
        <View key={i} style={[styles.reviewRow, { borderBottomColor: colors.borderDefault }]}>
          <View style={[styles.reviewAv, { backgroundColor: r.color }]}>
            <Text style={styles.reviewAvText}>{r.initial}</Text>
          </View>
          <View style={styles.flex}>
            <View style={styles.reviewHead}>
              <Text style={[styles.reviewName, { color: colors.fgPrimary }]}>{r.name}</Text>
              <Text style={[styles.reviewTime, { color: colors.fgTertiary }]}>{r.time}</Text>
            </View>
            <Stars n={r.rating} />
            <Text style={[styles.reviewText, { color: colors.fgSecondary }]}>{r.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
function Tabs({ tab, setTab, listingsLabel, reviewsLabel }: { tab: string; setTab: (t: string) => void; listingsLabel: string; reviewsLabel: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tabs, { borderBottomColor: colors.borderDefault }]}>
      {[["Listings", listingsLabel], ["Reviews", reviewsLabel]].map(([key, label]) => {
        const on = key === tab;
        return (
          <Pressable key={key} onPress={() => setTab(key)} style={styles.tab}>
            <Text style={[styles.tabText, { color: on ? colors.fgPrimary : colors.fgTertiary }]}>{label}</Text>
            <View style={[styles.tabUnderline, { backgroundColor: on ? colors.primary : "transparent" }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Seller preview ───────────────────────────────────────────
function SellerPreview({ s }: { s: Seller }) {
  const { colors } = useTheme();
  const [tab, setTab] = useState("Listings");
  return (
    <View style={styles.preview}>
      <View style={styles.sellerHead}>
        <View style={[styles.sellerBig, { backgroundColor: colors.primary }]}>
          <Text style={styles.sellerBigText}>{s.av}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.nameRow}>
            <Text style={[styles.headName, { color: colors.fgPrimary }]}>{s.name}</Text>
            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
          </View>
          <Text style={[styles.headMeta, { color: colors.fgTertiary }]}>@{s.handle} · {s.rating}★ ({s.reviews}) · {s.cards} cards</Text>
          <View style={[styles.meetsPill, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.meetsText, { color: colors.primary }]}>📍 Meets near {s.area} · {s.dist}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.desc, { color: colors.fgSecondary }]}>{s.desc}</Text>
      <Tabs tab={tab} setTab={setTab} listingsLabel={`Listings · ${s.cards}`} reviewsLabel={`Reviews · ${s.reviews}`} />
      <ScrollView style={styles.tabBody} showsVerticalScrollIndicator={false}>
        {tab === "Listings" ? <ListingsGrid items={SELLER_LISTINGS} /> : <ReviewsList reviews={SELLER_REVIEWS} />}
      </ScrollView>
      <View style={styles.cta}>
        <Pressable style={[styles.ctaSide, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="bookmark-outline" size={17} color={colors.fgSecondary} />
        </Pressable>
        <Pressable style={[styles.ctaMain, { backgroundColor: colors.primary }]}>
          <Ionicons name="chatbubble-ellipses" size={15} color="#fff" />
          <Text style={styles.ctaMainText}>Message Seller</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Vendor preview ───────────────────────────────────────────
function VendorPreview({ v }: { v: Vendor }) {
  const { colors } = useTheme();
  const [tab, setTab] = useState("Listings");
  function directions() {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(v.area)}`).catch(() => {});
  }
  return (
    <View style={styles.previewFlush}>
      <View style={styles.storefront}>
        <LinearGradient colors={["#3a2f2a", ACCENT.vendor]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.6 }} style={StyleSheet.absoluteFill} />
        <Text style={styles.storefrontGlyph}>🏪</Text>
        <View style={[styles.openPill, { backgroundColor: "rgba(255,255,255,0.94)" }]}>
          <View style={[styles.openDot, { backgroundColor: v.open ? colors.success : colors.warning }]} />
          <Text style={[styles.openText, { color: v.open ? colors.success : colors.warning }]}>{v.open ? "Open now" : "Closed"}</Text>
        </View>
      </View>
      <View style={styles.vendorBody}>
        <View style={styles.vendorHead}>
          <View style={styles.flex}>
            <View style={styles.nameRow}>
              <Text style={[styles.headName, { color: colors.fgPrimary }]}>{v.name}</Text>
              <Ionicons name="checkmark-circle" size={11} color={colors.success} />
            </View>
            <Text style={[styles.headMeta, { color: colors.fgTertiary }]}>@{v.handle} · {v.rating}★ ({v.reviews}) · {v.listings} cards</Text>
            <Text style={[styles.vendorAddr, { color: colors.fgSecondary }]}>📍 {v.area}</Text>
          </View>
          <Text style={[styles.vendorHours, { color: colors.fgSecondary }]}>{v.hours}</Text>
        </View>
        <Pressable style={[styles.directions, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]} onPress={directions}>
          <Ionicons name="navigate" size={13} color={colors.secondary} />
          <Text style={[styles.directionsText, { color: colors.secondary }]}>Get directions</Text>
        </Pressable>
        <Text style={[styles.desc, { color: colors.fgSecondary }]}>{v.desc}</Text>
        <Tabs tab={tab} setTab={setTab} listingsLabel={`Listings · ${v.listings}`} reviewsLabel={`Reviews · ${v.reviews}`} />
        <ScrollView style={styles.tabBody} showsVerticalScrollIndicator={false}>
          {tab === "Listings" ? <ListingsGrid items={VENDOR_LISTINGS} /> : <ReviewsList reviews={VENDOR_REVIEWS} />}
        </ScrollView>
        <View style={styles.cta}>
          <Pressable style={[styles.ctaSide, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.fgSecondary} />
          </Pressable>
          <Pressable style={[styles.ctaMain, { backgroundColor: colors.primary }]}>
            <Text style={styles.ctaMainText}>Visit Storefront</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ── Event preview ────────────────────────────────────────────
function EventPreview({ e }: { e: MapEvent }) {
  const { colors } = useTheme();
  const [interested, setInterested] = useState(false);
  const [going, setGoing] = useState(false);
  function directions() {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(e.addr)}`).catch(() => {});
  }
  return (
    <ScrollView style={styles.preview} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
      <View style={styles.poster}>
        <LinearGradient colors={["#1a1210", e.color]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.5 }} style={StyleSheet.absoluteFill} />
        <View style={styles.posterType}>
          <Text style={styles.posterTypeText}>{e.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.posterTitle}>{e.title}</Text>
      </View>
      <View style={styles.dtRow}>
        <View style={[styles.eventDate, { borderColor: colors.borderDefault }]}>
          <Text style={[styles.eventMonth, { backgroundColor: e.color }]}>{e.m}</Text>
          <Text style={[styles.eventDay, { color: colors.fgPrimary }]}>{e.d}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={[styles.dtTitle, { color: colors.fgPrimary }]}>{e.dateLong}</Text>
          <Text style={[styles.dtSub, { color: colors.fgSecondary }]}>🕐 {e.time}</Text>
        </View>
      </View>
      <View style={styles.dtRow}>
        <View style={[styles.locTile, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Text style={{ fontSize: 16 }}>📍</Text>
        </View>
        <View style={styles.flex}>
          <Text style={[styles.dtTitle, { color: colors.fgPrimary }]}>{e.loc}</Text>
          <Text style={[styles.dtSub, { color: colors.fgSecondary }]} numberOfLines={1}>{e.addr}</Text>
          <Pressable onPress={directions} hitSlop={6}>
            <Text style={[styles.dirLink, { color: colors.secondary }]}>Get directions →</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.eventActions}>
        <Pressable style={[styles.evtBtn, interested ? { backgroundColor: colors.secondary } : { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault }]} onPress={() => setInterested((v) => !v)}>
          <Text style={[styles.evtBtnText, { color: interested ? "#fff" : colors.fgPrimary }]}>★ Interested</Text>
        </Pressable>
        <Pressable style={[styles.evtBtn, going ? { backgroundColor: colors.secondary } : { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault }]} onPress={() => setGoing((v) => !v)}>
          <Text style={[styles.evtBtnText, { color: going ? "#fff" : colors.fgPrimary }]}>✓ Going</Text>
        </Pressable>
        <View style={[styles.evtMore, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="ellipsis-horizontal" size={14} color={colors.fgPrimary} />
        </View>
      </View>
      <View style={[styles.goingRow, { backgroundColor: colors.secondaryMuted }]}>
        <View style={{ flexDirection: "row" }}>
          {["#E76F51", "#7C3AED", "#10B981", "#f59e0b"].map((c, i) => (
            <View key={i} style={[styles.goingDot, { backgroundColor: c, borderColor: colors.bgBase, marginLeft: i > 0 ? -8 : 0 }]} />
          ))}
        </View>
        <Text style={[styles.goingText, { color: colors.secondary }]}>{e.going} going · 38 interested</Text>
      </View>
      <View style={styles.tagRow}>
        {e.tags.map((t) => (
          <View key={t} style={[styles.tag, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Text style={[styles.tagText, { color: colors.fgSecondary }]}>{t}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.aboutTitle, { color: colors.fgPrimary }]}>About this event</Text>
      <Text style={[styles.desc, { color: colors.fgSecondary, marginTop: 4 }]}>{e.about}</Text>
      <View style={[styles.hostRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
        <View style={[styles.hostAv, { backgroundColor: e.color }]}>
          <Text style={styles.hostAvText}>E</Text>
        </View>
        <View style={styles.flex}>
          <Text style={[styles.hostName, { color: colors.fgPrimary }]}>Hosted by {e.host}</Text>
          <Text style={[styles.hostMeta, { color: colors.fgTertiary }]}>2,431 members · Group</Text>
        </View>
        <View style={[styles.viewPill, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
          <Text style={[styles.viewText, { color: colors.secondary }]}>View</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export function MapPreview({ item }: { item: MapItem }) {
  if (item.kind === "vendor") return <VendorPreview v={item} />;
  if (item.kind === "event") return <EventPreview e={item} />;
  return <SellerPreview s={item} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pin: { alignItems: "center", justifyContent: "center", borderWidth: 2.5, borderColor: "#fff" },
  pinInitial: { fontFamily: fontFamily.socialExtrabold, color: "#fff" },
  pinTail: { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7, borderLeftColor: "transparent", borderRightColor: "transparent", marginTop: -1 },

  visit: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  visitText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 11, borderBottomWidth: 1 },
  sellerAv: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  sellerAvText: { fontFamily: fontFamily.socialExtrabold, fontSize: 18, color: "#fff" },
  vendorTile: { width: 46, height: 46, borderRadius: 13, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  eventDate: { width: 46, borderRadius: 11, overflow: "hidden", borderWidth: 1, alignItems: "stretch" },
  eventMonth: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, color: "#fff", textAlign: "center", paddingVertical: 3, letterSpacing: 0.5 },
  eventDay: { fontFamily: fontFamily.socialExtrabold, fontSize: 18, textAlign: "center", paddingVertical: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  meta: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 2 },
  meta2: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 2 },
  eventTags: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 3 },
  typeTag: { paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999 },
  typeTagText: { fontFamily: fontFamily.socialBold, fontSize: 9.5 },

  preview: { flex: 1, paddingHorizontal: 18, paddingTop: 4 },
  previewFlush: { flex: 1 },
  sellerHead: { flexDirection: "row", alignItems: "center", gap: 14, paddingRight: 34 },
  sellerBig: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  sellerBigText: { fontFamily: fontFamily.socialExtrabold, fontSize: 22, color: "#fff" },
  headName: { fontFamily: fontFamily.socialBold, fontSize: 16 },
  headMeta: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 2 },
  meetsPill: { alignSelf: "flex-start", marginTop: 6, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  meetsText: { fontFamily: fontFamily.socialBold, fontSize: 10 },
  desc: { fontFamily: fontFamily.body, fontSize: 11.5, lineHeight: 17, marginTop: 11 },

  tabs: { flexDirection: "row", gap: 24, borderBottomWidth: 1, marginTop: 13 },
  tab: { alignItems: "center", paddingBottom: 9, gap: 8 },
  tabText: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  tabUnderline: { height: 2.5, width: "100%", borderRadius: 2 },
  tabBody: { flex: 1, marginTop: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridCell: { width: "31.5%", borderRadius: 9, overflow: "hidden" },
  gridMeta: { padding: 6, paddingTop: 5 },
  gridPrice: { fontFamily: fontFamily.socialExtrabold, fontSize: 9.5 },
  gridName: { fontFamily: fontFamily.body, fontSize: 8, marginTop: 1 },

  reviewRow: { flexDirection: "row", gap: 11, paddingVertical: 9, borderBottomWidth: 1 },
  reviewAv: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  reviewAvText: { fontFamily: fontFamily.socialExtrabold, fontSize: 13, color: "#fff" },
  reviewHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  reviewName: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  reviewTime: { fontFamily: fontFamily.body, fontSize: 9.5 },
  reviewText: { fontFamily: fontFamily.body, fontSize: 11, lineHeight: 15, marginTop: 3 },

  cta: { flexDirection: "row", gap: 10, paddingTop: 14, paddingBottom: 4 },
  ctaSide: { width: 50, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  ctaMain: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 999 },
  ctaMainText: { fontFamily: fontFamily.socialBold, fontSize: 14.5, color: "#fff" },

  storefront: { height: 104, alignItems: "center", justifyContent: "center" },
  storefrontGlyph: { fontSize: 38, opacity: 0.55 },
  openPill: { position: "absolute", top: 12, left: 14, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 11, paddingVertical: 4, borderRadius: 999 },
  openDot: { width: 7, height: 7, borderRadius: 4 },
  openText: { fontFamily: fontFamily.socialExtrabold, fontSize: 10.5 },
  vendorBody: { flex: 1, paddingHorizontal: 18, paddingTop: 12 },
  vendorHead: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingRight: 30 },
  vendorAddr: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 5 },
  vendorHours: { fontFamily: fontFamily.socialBold, fontSize: 10, textAlign: "right", paddingTop: 2 },
  directions: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 11, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  directionsText: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },

  poster: { height: 120, borderRadius: 14, overflow: "hidden", justifyContent: "flex-end", padding: 12 },
  posterType: { position: "absolute", top: 10, left: 12, backgroundColor: "rgba(255,255,255,0.92)", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  posterTypeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 9, color: "#1a1210", letterSpacing: 0.4 },
  posterTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 16, color: "#fff", lineHeight: 19 },
  dtRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 13 },
  locTile: { width: 42, height: 42, borderRadius: 9, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  dtTitle: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  dtSub: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 1 },
  dirLink: { fontFamily: fontFamily.socialBold, fontSize: 11, marginTop: 2 },
  eventActions: { flexDirection: "row", gap: 8, marginTop: 13 },
  evtBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center" },
  evtBtnText: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  evtMore: { width: 46, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  goingRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 13, padding: 9, paddingHorizontal: 12, borderRadius: 12 },
  goingDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
  goingText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  tagRow: { flexDirection: "row", gap: 7, marginTop: 13, flexWrap: "wrap" },
  tag: { paddingHorizontal: 11, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  tagText: { fontFamily: fontFamily.socialBold, fontSize: 10.5 },
  aboutTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 12, marginTop: 14 },
  hostRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 13, padding: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  hostAv: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  hostAvText: { fontFamily: fontFamily.socialExtrabold, fontSize: 13, color: "#fff" },
  hostName: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  hostMeta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  viewPill: { paddingHorizontal: 13, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  viewText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
});
