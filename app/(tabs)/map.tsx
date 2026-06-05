import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { MapPin, PinType, useMapPins } from "@/hooks/use-map";
import { cardPhotoUrl } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

// Edmonton, AB — sensible default for first launch before location is granted
const DEFAULT_REGION: Region = {
  latitude: 53.5461,
  longitude: -113.4938,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

const PIN_COLORS: Record<PinType, string> = {
  seller: colors.accent,
  vendor: colors.success,
  event: "#8B5CF6",
};

const PIN_ICONS: Record<PinType, React.ComponentProps<typeof Ionicons>["name"]> = {
  seller: "person",
  vendor: "storefront",
  event: "calendar",
};

type FilterType = "all" | PinType;
const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "seller", label: "Sellers" },
  { key: "vendor", label: "Vendors" },
  { key: "event", label: "Events" },
];

export default function MapTab() {
  const mapRef = useRef<MapView>(null);
  const { data: pins, isLoading, refetch } = useMapPins();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selected, setSelected] = useState<MapPin | null>(null);

  // Request location permission and pan to user on first load
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        600,
      );
    })();
  }, []);

  const goToMyLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    mapRef.current?.animateToRegion(
      {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      600,
    );
  }, []);

  const filteredPins = (pins ?? []).filter(
    (p) => filter === "all" || p.pin_type === filter,
  );

  function navigateToPin(pin: MapPin) {
    setSelected(null);
    if (pin.route_hint === "profile") {
      router.push({ pathname: "/profile/[id]", params: { id: pin.id } });
    } else if (pin.route_hint === "storefront") {
      router.push({ pathname: "/profile/storefront", params: { id: pin.id } });
    } else {
      router.push({ pathname: "/(tabs)/social/event/[id]", params: { id: pin.id } });
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => setSelected(null)}
      >
        {filteredPins.map((pin) => (
          <PinMarker key={pin.id} pin={pin} onPress={() => setSelected(pin)} />
        ))}
      </MapView>

      {/* Filter chips */}
      <SafeAreaView edges={["top"]} style={styles.filterContainer} pointerEvents="box-none">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          pointerEvents="auto"
        >
          {FILTERS.map(({ key, label }) => (
            <Pressable
              key={key}
              style={[styles.chip, filter === key && styles.chipActive]}
              onPress={() => setFilter(key)}
            >
              <Text style={[styles.chipText, filter === key && styles.chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* My location button */}
      <Pressable style={styles.locationBtn} onPress={goToMyLocation}>
        <Ionicons name="locate" size={22} color={colors.text} />
      </Pressable>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      {/* Pin detail bottom sheet */}
      <BottomSheet
        visible={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <PinDetail pin={selected} onView={() => navigateToPin(selected)} />
        ) : null}
      </BottomSheet>
    </View>
  );
}

function PinMarker({ pin, onPress }: { pin: MapPin; onPress: () => void }) {
  const color = PIN_COLORS[pin.pin_type];
  const icon = PIN_ICONS[pin.pin_type];
  return (
    <Marker
      coordinate={{ latitude: pin.lat, longitude: pin.lng }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={[styles.markerOuter, { backgroundColor: color }]}>
        <Ionicons name={icon} size={14} color="#fff" />
      </View>
      <View style={[styles.markerTail, { borderTopColor: color }]} />
    </Marker>
  );
}

function PinDetail({ pin, onView }: { pin: MapPin; onView: () => void }) {
  const color = PIN_COLORS[pin.pin_type];
  const icon = PIN_ICONS[pin.pin_type];
  const imgUrl = pin.image_path ? cardPhotoUrl(pin.image_path) : null;

  return (
    <View style={styles.detail}>
      <View style={styles.detailRow}>
        {imgUrl ? (
          <Image source={{ uri: imgUrl }} style={styles.detailAvatar} contentFit="cover" />
        ) : (
          <View style={[styles.detailAvatarFallback, { backgroundColor: color + "22" }]}>
            <Ionicons name={icon} size={22} color={color} />
          </View>
        )}
        <View style={styles.detailText}>
          <View style={styles.detailTitleRow}>
            <Text style={styles.detailTitle} numberOfLines={1}>{pin.title}</Text>
            <View style={[styles.badge, { backgroundColor: color + "22" }]}>
              <Text style={[styles.badgeText, { color }]}>
                {pin.pin_type.charAt(0).toUpperCase() + pin.pin_type.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.detailSub} numberOfLines={1}>{pin.subtitle}</Text>
        </View>
      </View>
      <Button title="View" onPress={onView} style={styles.viewBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  filterContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  chipActive: { backgroundColor: colors.accent },
  chipText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  chipTextActive: { color: "#fff" },

  locationBtn: {
    position: "absolute",
    bottom: 120,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  loadingOverlay: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Marker styles
  markerOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  markerTail: {
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  // Bottom sheet detail
  detail: { gap: spacing.lg },
  detailRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  detailAvatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  detailAvatarFallback: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: { flex: 1 },
  detailTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  detailTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flexShrink: 1 },
  detailSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: "700" },
  viewBtn: { marginTop: spacing.sm },
});
