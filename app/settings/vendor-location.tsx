import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useUpdateVendorLocation } from "@/hooks/use-map";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_REGION: Region = {
  latitude: 53.5461,
  longitude: -113.4938,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function VendorLocationScreen() {
  const mapRef = useRef<MapView>(null);
  const updateVendorLocation = useUpdateVendorLocation();

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [locating, setLocating] = useState(false);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/settings/vendor" as never);
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
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);
    } finally {
      setLocating(false);
    }
  }

  async function save() {
    try {
      await updateVendorLocation.mutateAsync({
        lat: region.latitude,
        lng: region.longitude,
      });
      back();
    } catch (err) {
      Alert.alert(
        "Couldn't save location",
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Business location" onBack={back} />

      {/* Map takes up most of the screen */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={DEFAULT_REGION}
          onRegionChangeComplete={setRegion}
        />
        {/* Fixed center pin */}
        <View style={styles.centerPin} pointerEvents="none">
          <View style={styles.pinShadow}>
            <Ionicons name="location" size={36} color={colors.success} />
          </View>
        </View>

        <Pressable
          style={styles.locateBtn}
          onPress={useCurrentLocation}
          disabled={locating}
        >
          <Ionicons name={locating ? "hourglass" : "locate"} size={18} color={colors.text} />
          <Text style={styles.locateBtnText}>
            {locating ? "Locating…" : "Use my location"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>
          Drag the map to pin your storefront&apos;s exact location. This places a
          vendor pin on the community map so collectors can find you.
        </Text>
        <Button
          title="Save business location"
          onPress={save}
          loading={updateVendorLocation.isPending}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  mapWrapper: {
    flex: 1,
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
    marginBottom: 36,
  },
  pinShadow: {
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

  footer: {
    padding: spacing.xl,
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  hint: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
});
