import { StepScaffold } from "@/components/onboarding/step-scaffold";
import { Field } from "@/components/form/field";
import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useUpdatePickupLocation } from "@/hooks/use-map";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Region } from "react-native-maps";

const DEFAULT_REGION: Region = {
  latitude: 53.5461,
  longitude: -113.4938,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
const RADIUS_OPTIONS = [5, 25, 50, 100] as const;

export default function OnboardingLocation() {
  const { colors } = useTheme();
  const updatePickupLocation = useUpdatePickupLocation();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [city, setCity] = useState("");
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);

  async function useCurrentLocation() {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const next: Region = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);
      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (place) {
        const parts = [place.city, place.region].filter(Boolean);
        if (parts.length) setCity(parts.join(", "));
      }
    } finally {
      setLocating(false);
    }
  }

  async function saveAndNext() {
    setSaving(true);
    try {
      await updatePickupLocation.mutateAsync({
        lat: region.latitude,
        lng: region.longitude,
        city: city.trim() || undefined,
        radiusKm,
      });
    } catch {
      // location backing may be unavailable; continue regardless.
    } finally {
      setSaving(false);
      router.push("/onboarding/first-card");
    }
  }

  return (
    <StepScaffold
      step={3}
      onBack={() => router.back()}
      eyebrow="Step 3 of 5"
      title={"Where are\nyou based?"}
      subtitle="Find sellers, meetups & shows near you."
      cta={{ label: "Use this location", onPress: saveAndNext, loading: saving }}
      secondary={{ label: "Skip for now", onPress: () => router.push("/onboarding/first-card") }}
    >
      <View style={[styles.mapWrap, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={DEFAULT_REGION}
          onRegionChangeComplete={setRegion}
        />
        <View style={styles.centerPin} pointerEvents="none">
          <Ionicons name="location" size={30} color={colors.primary} />
        </View>
        <Pressable style={[styles.locate, { backgroundColor: colors.bgBase }]} onPress={useCurrentLocation} disabled={locating}>
          <Ionicons name={locating ? "hourglass" : "locate"} size={16} color={colors.fgPrimary} />
          <Text style={[styles.locateText, { color: colors.fgPrimary }]}>
            {locating ? "Locating…" : "Use my location"}
          </Text>
        </Pressable>
      </View>

      <Field label="CITY / AREA" value={city} onChangeText={setCity} placeholder="Edmonton, AB" autoCapitalize="words" />

      <Text style={[styles.label, { color: colors.fgSecondary }]}>SEARCH RADIUS</Text>
      <View style={styles.radiusRow}>
        {RADIUS_OPTIONS.map((km) => {
          const on = radiusKm === km;
          return (
            <Pressable
              key={km}
              onPress={() => setRadiusKm(km)}
              style={[
                styles.radiusChip,
                { borderColor: on ? colors.primary : colors.borderDefault, backgroundColor: on ? colors.primaryMuted : "transparent" },
              ]}
            >
              <Text style={[styles.radiusText, { color: on ? colors.primary : colors.fgSecondary }]}>{km} km</Text>
            </Pressable>
          );
        })}
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    height: 200,
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: space.lg,
  },
  centerPin: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  locate: {
    position: "absolute",
    bottom: space.md,
    right: space.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radii.full,
  },
  locateText: { fontFamily: fontFamily.bodySemibold, fontSize: fontSizes.sm },
  label: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: space.lg,
    marginBottom: space.sm,
  },
  radiusRow: { flexDirection: "row", gap: space.sm },
  radiusChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  radiusText: { fontFamily: fontFamily.bodySemibold, fontSize: fontSizes.sm },
});
