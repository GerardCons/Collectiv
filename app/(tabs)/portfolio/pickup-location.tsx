import { Button } from "@/components/ui/button";
import { Field } from "@/components/form/field";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useUpdatePickupLocation } from "@/hooks/use-map";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_REGION: Region = {
  latitude: 53.5461,
  longitude: -113.4938,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

export default function PickupLocationScreen() {
  const mapRef = useRef<MapView>(null);
  const updatePickupLocation = useUpdatePickupLocation();

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [city, setCity] = useState("");
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [locating, setLocating] = useState(false);

  function cancel() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }

  async function useCurrentLocation() {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location denied",
          "Enable location in Settings to use your current position.",
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const next: Region = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      };
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);

      // Reverse-geocode to prefill the city field
      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (place) {
        const parts = [place.city, place.region].filter(Boolean);
        if (parts.length > 0) setCity(parts.join(", "));
      }
    } finally {
      setLocating(false);
    }
  }

  async function save() {
    try {
      await updatePickupLocation.mutateAsync({
        lat: region.latitude,
        lng: region.longitude,
        city: city.trim() || undefined,
        radiusKm,
      });
      cancel();
    } catch (err) {
      Alert.alert(
        "Couldn't save location",
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header leftText="Skip" onBack={cancel} title="Pickup location" />

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {/* Map picker */}
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={DEFAULT_REGION}
            onRegionChangeComplete={setRegion}
          />
          {/* Fixed center pin */}
          <View style={styles.centerPin} pointerEvents="none">
            <View style={styles.pinHead}>
              <Ionicons name="location" size={28} color={colors.accent} />
            </View>
          </View>

          {/* "Use my location" button overlaid on the map */}
          <Pressable
            style={styles.locateBtn}
            onPress={useCurrentLocation}
            disabled={locating}
          >
            <Ionicons
              name={locating ? "hourglass" : "locate"}
              size={18}
              color={colors.text}
            />
            <Text style={styles.locateBtnText}>
              {locating ? "Locating…" : "Use my location"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Drag the map to position the pin at your preferred meet-up area. This
          location is shared with buyers when you have active listings.
        </Text>

        {/* City field */}
        <Field
          label="CITY / AREA"
          value={city}
          onChangeText={setCity}
          placeholder="Edmonton, AB"
        />

        {/* Travel radius chips */}
        <View style={styles.radiusSection}>
          <Text style={styles.label}>MAX TRAVEL DISTANCE</Text>
          <View style={styles.radiusRow}>
            {RADIUS_OPTIONS.map((km) => (
              <Pressable
                key={km}
                style={[styles.radiusChip, radiusKm === km && styles.radiusChipActive]}
                onPress={() => setRadiusKm(km)}
              >
                <Text style={[styles.radiusText, radiusKm === km && styles.radiusTextActive]}>
                  {km} km
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Button
          title="Save location"
          onPress={save}
          loading={updatePickupLocation.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.xl, gap: spacing.xl },

  mapWrapper: {
    height: 260,
    borderRadius: radius.lg,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.surface,
  },
  map: { ...StyleSheet.absoluteFillObject },

  centerPin: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28, // offset so pin tip aligns with center
  },
  pinHead: {
    // shadow so the pin is visible on light map tiles
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },

  locateBtn: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  locateBtnText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },

  hint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  label: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  radiusSection: { gap: 0 },
  radiusRow: { flexDirection: "row", gap: spacing.sm },
  radiusChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  radiusChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  radiusText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary },
  radiusTextActive: { color: colors.accent },
});
