import { Card, SectionLabel, SettingsNav, ToggleRow } from "@/components/settings/settings-bits";
import { fontFamily, space } from "@/constants/theme";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const { data: profile, isLoading } = useProfile();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SettingsNav title="Privacy & visibility" />
      {isLoading || !profile ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <PrivacyForm
          key={profile.id}
          initialBroadcastPresence={profile.broadcast_presence}
          initialShowOnMap={profile.show_on_nearby_map}
          initialBroadcastLocation={profile.broadcast_approximate_location}
        />
      )}
    </SafeAreaView>
  );
}

function PrivacyForm({
  initialBroadcastPresence,
  initialShowOnMap,
  initialBroadcastLocation,
}: {
  initialBroadcastPresence: boolean;
  initialShowOnMap: boolean;
  initialBroadcastLocation: boolean;
}) {
  const { colors } = useTheme();
  const updateProfile = useUpdateProfile();
  const [presence, setPresence] = useState(initialBroadcastPresence);
  const [showOnMap, setShowOnMap] = useState(initialShowOnMap);
  const [shareLoc, setShareLoc] = useState(initialBroadcastLocation);

  async function toggle(
    field: "broadcast_presence" | "show_on_nearby_map" | "broadcast_approximate_location",
    value: boolean,
    setter: (v: boolean) => void,
  ) {
    setter(value);
    try {
      await updateProfile.mutateAsync({ [field]: value });
    } catch (err) {
      setter(!value);
      Alert.alert("Error", err instanceof Error ? err.message : "Couldn't save.");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <SectionLabel>Online status</SectionLabel>
      <Card>
        <ToggleRow
          icon="ellipse"
          title="Show my online status"
          subtitle="Others can see a green dot when you're active"
          value={presence}
          onValueChange={(v) => toggle("broadcast_presence", v, setPresence)}
          last
        />
      </Card>

      <SectionLabel>Map visibility</SectionLabel>
      <Card>
        <ToggleRow
          icon="map-outline"
          title="Show me on the collector map"
          subtitle="Your pickup location appears as a pin on the Map tab"
          value={showOnMap}
          onValueChange={(v) => toggle("show_on_nearby_map", v, setShowOnMap)}
        />
        <ToggleRow
          icon="location-outline"
          title="Share location with followers"
          subtitle="Followers can see your approximate area"
          value={shareLoc}
          onValueChange={(v) => toggle("broadcast_approximate_location", v, setShareLoc)}
          last
        />
      </Card>

      <Text style={[styles.hint, { color: colors.fgTertiary }]}>
        All privacy settings default to off. Your exact location is never shared — only the city or area you set as your pickup location.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hint: { fontFamily: fontFamily.body, fontSize: 11, lineHeight: 17, paddingHorizontal: 18, paddingTop: space.lg },
});
