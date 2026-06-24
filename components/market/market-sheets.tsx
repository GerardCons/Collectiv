import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { fontFamily, space } from "@/constants/theme";
import { FILTER_GROUPS, RADIUS_OPTIONS, SORTS } from "@/lib/market-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// ── Location / radius ────────────────────────────────────────
export function LocationSheet({
  visible,
  onClose,
  radius,
  onRadius,
}: {
  visible: boolean;
  onClose: () => void;
  radius: number;
  onRadius: (km: number) => void;
}) {
  const { colors } = useTheme();
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Location">
      {/* map placeholder + radius ring */}
      <View style={[styles.map, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
        <View style={[styles.ring, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]} />
        <View style={[styles.pin, { backgroundColor: colors.primary }]} />
        <Text style={[styles.mapLabel, { color: colors.fgTertiary }]}>map preview</Text>
      </View>

      {/* city row */}
      <View style={[styles.cityRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
        <Text style={styles.pinGlyph}>📍</Text>
        <View style={styles.flex}>
          <Text style={[styles.city, { color: colors.fgPrimary }]}>Edmonton, AB</Text>
          <Text style={[styles.cityMeta, { color: colors.fgTertiary }]}>Current location</Text>
        </View>
        <Text style={[styles.change, { color: colors.primary }]}>Change</Text>
      </View>

      {/* radius */}
      <View style={styles.radiusHead}>
        <Text style={[styles.label, { color: colors.fgTertiary }]}>RADIUS</Text>
        <Text style={[styles.radiusVal, { color: colors.primary }]}>{radius} km</Text>
      </View>
      <View style={styles.radiusChips}>
        {RADIUS_OPTIONS.map((km) => {
          const on = radius === km;
          return (
            <Pressable
              key={km}
              onPress={() => onRadius(km)}
              style={[styles.radiusChip, { borderColor: on ? colors.primary : colors.borderDefault, backgroundColor: on ? colors.primaryMuted : colors.bgSurface }]}
            >
              <Text style={[styles.radiusChipText, { color: on ? colors.primary : colors.fgSecondary }]}>{km}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button title="Apply · Show 132 Listings" onPress={onClose} style={{ marginTop: space.xl }} />
    </BottomSheet>
  );
}

// ── Sort ─────────────────────────────────────────────────────
export function SortSheet({
  visible,
  onClose,
  sort,
  onSort,
}: {
  visible: boolean;
  onClose: () => void;
  sort: string;
  onSort: (s: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Sort By">
      {SORTS.map((s, i) => {
        const on = s.label === sort;
        return (
          <Pressable
            key={s.label}
            onPress={() => {
              onSort(s.label);
              onClose();
            }}
            style={[styles.sortRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.borderDefault }]}
          >
            <View style={styles.flex}>
              <Text style={[styles.sortLabel, { color: on ? colors.primary : colors.fgPrimary }]}>{s.label}</Text>
              <Text style={[styles.sortSub, { color: colors.fgTertiary }]}>{s.sub}</Text>
            </View>
            {on ? (
              <View style={[styles.check, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </BottomSheet>
  );
}

// ── Filter ───────────────────────────────────────────────────
const DEFAULT_FILTER: Record<string, string> = { genre: "Sports", condition: "All", grade: "Any", seller: "All" };

export function FilterSheet({
  visible,
  onClose,
  filters,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  filters: Record<string, string>;
  onApply: (f: Record<string, string>) => void;
}) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState(filters);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.filterHead}>
        <Text style={[styles.filterTitle, { color: colors.fgPrimary }]}>Filters</Text>
        <Pressable onPress={() => setDraft(DEFAULT_FILTER)} hitSlop={8}>
          <Text style={[styles.reset, { color: colors.primary }]}>Reset All</Text>
        </Pressable>
      </View>

      {FILTER_GROUPS.map((g) => (
        <View key={g.key} style={styles.group}>
          <Text style={[styles.label, { color: colors.fgTertiary }]}>{g.label}</Text>
          <View style={styles.chips}>
            {g.options.map((o) => {
              const on = draft[g.key] === o;
              return (
                <Pressable
                  key={o}
                  onPress={() => setDraft((d) => ({ ...d, [g.key]: o }))}
                  style={[styles.chip, { backgroundColor: on ? colors.primary : colors.bgSurface, borderColor: on ? colors.primary : colors.borderDefault }]}
                >
                  <Text style={[styles.chipText, { color: on ? "#fff" : colors.fgSecondary }]}>{o}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      {/* Price range (visual) */}
      <View style={styles.group}>
        <View style={styles.priceHead}>
          <Text style={[styles.label, { color: colors.fgTertiary }]}>Price Range</Text>
          <Text style={[styles.priceVal, { color: colors.primary }]}>$0 — $15,000</Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <View style={[styles.trackFill, { backgroundColor: colors.primary }]} />
          <View style={[styles.knob, { backgroundColor: colors.primary, borderColor: colors.bgBase, left: -6 }]} />
          <View style={[styles.knob, { backgroundColor: colors.primary, borderColor: colors.bgBase, right: -6 }]} />
        </View>
      </View>

      <Button
        title="Show 132 Listings"
        onPress={() => {
          onApply(draft);
          onClose();
        }}
        style={{ marginTop: space.xl }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  label: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 7 },

  map: { height: 140, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: space.md },
  ring: { position: "absolute", width: 110, height: 110, borderRadius: 55, borderWidth: 1.5 },
  pin: { width: 12, height: 12, borderRadius: 6, borderWidth: 2.5, borderColor: "#fff" },
  mapLabel: { position: "absolute", bottom: 8, right: 10, fontFamily: fontFamily.body, fontSize: 9 },

  cityRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginBottom: space.lg },
  pinGlyph: { fontSize: 14 },
  city: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  cityMeta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  change: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  radiusHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  radiusVal: { fontFamily: fontFamily.socialExtrabold, fontSize: 12 },
  radiusChips: { flexDirection: "row", gap: 8 },
  radiusChip: { flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 999, borderWidth: 1.5 },
  radiusChipText: { fontFamily: fontFamily.socialBold, fontSize: 12 },

  sortRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  sortLabel: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  sortSub: { fontFamily: fontFamily.body, fontSize: 9.5, marginTop: 1 },
  check: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  filterHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.xs },
  filterTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 17 },
  reset: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  group: { marginTop: space.lg },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  chipText: { fontFamily: fontFamily.socialSemibold, fontSize: 10 },
  priceHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  priceVal: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  track: { height: 4, borderRadius: 2, borderWidth: 1, marginHorizontal: 6, marginTop: 6, position: "relative" },
  trackFill: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 2 },
  knob: { position: "absolute", top: -6, width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
});
