import { MapPreview, MapRow, PinContent } from "@/components/map/map-bits";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily } from "@/constants/theme";
import {
  COUNTS,
  EDMONTON,
  FILTER_ACCENT,
  FILTER_ICON,
  filterItems,
  getMapItem,
  MAP_EVENTS,
  MAP_SEARCH_RESULTS,
  MapFilter,
  RADII,
  SELLERS,
  VENDORS,
} from "@/lib/map-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const SHEET_H = Math.min(540, Math.round(Dimensions.get("window").height * 0.58));
const FILTERS: MapFilter[] = ["Sellers", "Vendors", "Events"];
const ALL_ITEMS = [...SELLERS, ...VENDORS, ...MAP_EVENTS];

export default function MapTab() {
  const { colors } = useTheme();
  const mapRef = useRef<MapView>(null);
  const translateY = useRef(new Animated.Value(SHEET_H)).current;

  const [detent, setDetent] = useState<"closed" | "half">("closed");
  const [filter, setFilter] = useState<MapFilter | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [radIdx, setRadIdx] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const sel = selected ? getMapItem(selected) : null;
  const open = sel != null || detent !== "closed";

  // Visible pins: all when no filter, else the chosen kind.
  const visiblePins = useMemo(() => {
    if (!filter) return ALL_ITEMS;
    return filterItems(filter);
  }, [filter]);

  // Slide the sheet in/out smoothly.
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: open ? 0 : SHEET_H,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [open, translateY]);

  function onChip(f: MapFilter) {
    setSelected(null);
    if (filter === f) {
      setFilter(null);
      setDetent("closed");
    } else {
      setFilter(f);
      setDetent("half");
    }
  }

  function onPin(id: string) {
    setSelected(id);
    setDetent((d) => (d === "closed" ? "half" : d));
    const item = getMapItem(id);
    if (item) mapRef.current?.animateToRegion({ latitude: item.lat - 0.02, longitude: item.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 }, 400);
  }

  function closePreview() {
    setSelected(null);
    if (!filter) setDetent("closed");
  }

  function closeSheet() {
    setFilter(null);
    setSelected(null);
    setDetent("closed");
  }

  function recenter() {
    mapRef.current?.animateToRegion(EDMONTON, 500);
  }

  // ── Search screen ──
  if (searchOpen) {
    const results = MAP_SEARCH_RESULTS.filter((r) =>
      query.trim() ? (r.title + r.sub).toLowerCase().includes(query.trim().toLowerCase()) : true,
    );
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
        <View style={styles.searchScreenBar}>
          <View style={[styles.searchInputWrap, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Pressable onPress={() => setSearchOpen(false)} hitSlop={8}>
              <Ionicons name="chevron-back" size={22} color={colors.fgPrimary} />
            </Pressable>
            <TextInput
              style={[styles.searchInput, { color: colors.fgPrimary }]}
              value={query}
              onChangeText={setQuery}
              placeholder="Search Edmonton, AB"
              placeholderTextColor={colors.fgTertiary}
              autoFocus
            />
            {query ? (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.fgTertiary} />
              </Pressable>
            ) : null}
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">
          {results.map((r, i) => (
            <Pressable key={i} style={[styles.resultRow, { borderBottomColor: colors.borderDefault }]} onPress={() => setSearchOpen(false)}>
              <View style={styles.resultIconCol}>
                <ResultIcon type={r.type} av={r.av} colors={colors} />
                <Text style={[styles.resultDist, { color: colors.fgTertiary }]}>{r.dist}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={[styles.resultTitle, { color: colors.fgPrimary }]} numberOfLines={1}>
                  {r.title}
                  {r.tag ? (
                    <Text style={[styles.resultTag, { color: tagColor(r.type, colors), backgroundColor: tagBg(r.type, colors) }]}>  {r.tag}</Text>
                  ) : null}
                </Text>
                <Text style={[styles.resultSub, { color: colors.fgTertiary }]} numberOfLines={1}>{r.sub}</Text>
              </View>
              <Ionicons name="arrow-up-outline" size={15} color={colors.fgTertiary} style={{ transform: [{ rotate: "45deg" }] }} />
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={EDMONTON}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => {
          if (sel) closePreview();
        }}
      >
        {visiblePins.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => onPin(p.id)}
            tracksViewChanges={selected === p.id}
            opacity={selected && selected !== p.id ? 0.4 : 1}
          >
            <PinContent item={p} selected={selected === p.id} />
          </Marker>
        ))}
      </MapView>

      {/* Top controls */}
      <SafeAreaView edges={["top"]} style={styles.topControls} pointerEvents="box-none">
        <Pressable style={[styles.searchBar, { backgroundColor: colors.bgBase }]} onPress={() => setSearchOpen(true)}>
          <Ionicons name="search" size={15} color={colors.fgTertiary} />
          <Text style={[styles.searchBarText, { color: colors.fgSecondary }]}>Search Edmonton, AB</Text>
          <Avatar name="Jake" size={32} color={colors.primary} />
        </Pressable>
        <View style={styles.chips}>
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => onChip(f)}
                style={[styles.chip, on ? { backgroundColor: FILTER_ACCENT[f] } : { backgroundColor: colors.bgBase, borderWidth: 1, borderColor: colors.borderDefault }]}
              >
                <Text style={styles.chipIcon}>{FILTER_ICON[f]}</Text>
                <Text style={[styles.chipText, { color: on ? "#fff" : colors.fgSecondary }]}>{f}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>

      {/* Recenter */}
      {!open ? (
        <Pressable style={[styles.recenter, { backgroundColor: colors.bgBase }]} onPress={recenter}>
          <Ionicons name="locate" size={20} color={colors.primary} />
        </Pressable>
      ) : null}

      {/* Bottom sheet */}
      <Animated.View
        style={[styles.sheet, { backgroundColor: colors.bgBase, height: SHEET_H, transform: [{ translateY }] }]}
        pointerEvents={open ? "auto" : "none"}
      >
        <Pressable style={styles.handleWrap} onPress={sel ? undefined : closeSheet}>
          <View style={[styles.handle, { backgroundColor: colors.fgTertiary }]} />
        </Pressable>
        <Pressable
          style={[styles.sheetClose, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
          onPress={sel ? closePreview : closeSheet}
        >
          <Ionicons name="close" size={13} color={colors.fgSecondary} />
        </Pressable>

        {sel ? (
          <MapPreview item={sel} />
        ) : filter ? (
          <>
            <View style={styles.sheetHead}>
              <Text style={[styles.sheetCount, { color: colors.fgPrimary }]}>{COUNTS[filter].count} {COUNTS[filter].label}</Text>
              <Pressable style={[styles.radius, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => setRadIdx((i) => (i + 1) % RADII.length)}>
                <Text style={styles.radiusGlyph}>📍</Text>
                <Text style={[styles.radiusCity, { color: colors.fgSecondary }]}>Edmonton, AB</Text>
                <View style={[styles.radiusDiv, { backgroundColor: colors.borderDefault }]} />
                <Text style={[styles.radiusKm, { color: colors.primary }]}>{RADII[radIdx]}</Text>
                <Ionicons name="swap-horizontal" size={11} color={colors.primary} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filterItems(filter).map((it) => (
                <MapRow key={it.id} item={it} onPress={() => onPin(it.id)} />
              ))}
            </ScrollView>
          </>
        ) : null}
      </Animated.View>
    </View>
  );
}

function ResultIcon({ type, av, colors }: { type: string; av?: string; colors: ReturnType<typeof useTheme>["colors"] }) {
  if (type === "seller") return <View style={[styles.rIcon, { backgroundColor: colors.primary }]}><Text style={styles.rIconText}>{av}</Text></View>;
  if (type === "vendor") return <View style={[styles.rIcon, styles.rSquare, { backgroundColor: colors.secondary }]}><Text style={{ fontSize: 17 }}>🏪</Text></View>;
  if (type === "event") return <View style={[styles.rIcon, styles.rSquare, { backgroundColor: colors.success }]}><Text style={{ fontSize: 17 }}>📅</Text></View>;
  if (type === "recent") return <View style={[styles.rIcon, { backgroundColor: colors.bgSurface }]}><Ionicons name="time-outline" size={17} color={colors.fgSecondary} /></View>;
  return <View style={[styles.rIcon, { backgroundColor: colors.bgSurface }]}><Ionicons name="location-outline" size={17} color={colors.fgSecondary} /></View>;
}
function tagColor(type: string, colors: ReturnType<typeof useTheme>["colors"]) {
  return type === "vendor" ? colors.secondary : type === "event" ? colors.success : colors.primary;
}
function tagBg(type: string, colors: ReturnType<typeof useTheme>["colors"]) {
  return type === "vendor" ? colors.secondaryMuted : type === "event" ? colors.successMuted : colors.primaryMuted;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },

  topControls: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 12, gap: 9 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, height: 44, paddingLeft: 14, paddingRight: 6, borderRadius: 999, marginTop: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 14, elevation: 4 },
  searchBarText: { flex: 1, fontFamily: fontFamily.bodyMedium, fontSize: 13.5 },
  chips: { flexDirection: "row", gap: 7 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  chipIcon: { fontSize: 12 },
  chipText: { fontFamily: fontFamily.socialBold, fontSize: 12 },

  recenter: { position: "absolute", right: 14, bottom: 28, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 14, elevation: 4 },

  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopLeftRadius: 22, borderTopRightRadius: 22, shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.14, shadowRadius: 32, elevation: 12, overflow: "hidden" },
  handleWrap: { paddingTop: 9, paddingBottom: 4, alignItems: "center" },
  handle: { width: 38, height: 4.5, borderRadius: 3 },
  sheetClose: { position: "absolute", top: 12, right: 14, width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", zIndex: 3 },
  sheetHead: { paddingLeft: 18, paddingRight: 52, paddingBottom: 10 },
  sheetCount: { fontFamily: fontFamily.socialExtrabold, fontSize: 16 },
  radius: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1 },
  radiusGlyph: { fontSize: 11 },
  radiusCity: { fontFamily: fontFamily.bodySemibold, fontSize: 11 },
  radiusDiv: { width: 1, height: 11 },
  radiusKm: { fontFamily: fontFamily.socialExtrabold, fontSize: 11 },

  searchScreenBar: { paddingHorizontal: 14, paddingTop: 2, paddingBottom: 12 },
  searchInputWrap: { flexDirection: "row", alignItems: "center", gap: 10, height: 46, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1 },
  searchInput: { flex: 1, fontFamily: fontFamily.bodyMedium, fontSize: 15, padding: 0 },
  resultRow: { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 16, paddingVertical: 9, borderBottomWidth: 1 },
  resultIconCol: { alignItems: "center", gap: 3, width: 46 },
  rIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  rSquare: { borderRadius: 12 },
  rIconText: { fontFamily: fontFamily.socialExtrabold, fontSize: 16, color: "#fff" },
  resultDist: { fontFamily: fontFamily.socialBold, fontSize: 9.5 },
  resultTitle: { fontFamily: fontFamily.bodyMedium, fontSize: 14 },
  resultTag: { fontFamily: fontFamily.socialBold, fontSize: 9, overflow: "hidden" },
  resultSub: { fontFamily: fontFamily.body, fontSize: 11.5, marginTop: 2 },
});
