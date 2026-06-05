import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  const { data: profile, isLoading } = useProfile();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Privacy"
        onBack={() => (router.canGoBack() ? router.back() : router.replace("/settings"))}
      />
      {isLoading || !profile ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
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
  const updateProfile = useUpdateProfile();
  const [broadcastPresence, setBroadcastPresence] = useState(initialBroadcastPresence);
  const [showOnMap, setShowOnMap] = useState(initialShowOnMap);
  const [broadcastLocation, setBroadcastLocation] = useState(initialBroadcastLocation);

  async function toggle(
    field: "broadcast_presence" | "show_on_nearby_map" | "broadcast_approximate_location",
    value: boolean,
    setter: (v: boolean) => void,
  ) {
    setter(value);
    try {
      await updateProfile.mutateAsync({ [field]: value });
    } catch (err) {
      setter(!value); // revert
      Alert.alert("Error", err instanceof Error ? err.message : "Couldn't save.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.section}>ONLINE STATUS</Text>
      <View style={styles.card}>
        <ToggleRow
          icon="radio-outline"
          title="Show my online status"
          subtitle="Others can see a green dot when you're active"
          value={broadcastPresence}
          onValueChange={(v) => toggle("broadcast_presence", v, setBroadcastPresence)}
        />
      </View>

      <Text style={styles.section}>MAP VISIBILITY</Text>
      <View style={styles.card}>
        <ToggleRow
          icon="map-outline"
          title="Show me on the collector map"
          subtitle="Your pickup location appears as a pin on the Maps tab"
          value={showOnMap}
          onValueChange={(v) => toggle("show_on_nearby_map", v, setShowOnMap)}
        />
        <ToggleRow
          icon="location-outline"
          title="Share location with followers"
          subtitle="Followers can see your approximate area"
          value={broadcastLocation}
          onValueChange={(v) => toggle("broadcast_approximate_location", v, setBroadcastLocation)}
          last
        />
      </View>

      <Text style={styles.hint}>
        All privacy settings default to off. Your exact location is never
        shared — only the city or area you set as your pickup location.
      </Text>
    </ScrollView>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  last = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
      <View style={styles.flex}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={colors.background}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceMuted },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  body: { padding: spacing.lg, gap: spacing.lg },
  flex: { flex: 1 },

  section: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textTertiary,
    paddingHorizontal: spacing.sm,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowTitle: { fontSize: fontSize.md, color: colors.text, fontWeight: "600" },
  rowSub: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2, lineHeight: 16 },

  hint: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
  },
});
