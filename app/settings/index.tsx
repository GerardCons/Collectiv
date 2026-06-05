import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { session } = useAuth();
  const { data: profile } = useProfile();

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  function soon(feature: string, phase: string) {
    Alert.alert(feature, `Arrives in ${phase}.`);
  }

  function confirmSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        // Auth flows are state-driven: signOut() fires onAuthStateChange, the
        // tab guard then redirects to Welcome. We never navigate manually here.
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  }

  const displayName = profile?.display_name || profile?.username || "";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Settings" onBack={back} />

      <ScrollView contentContainerStyle={styles.body}>
        {/* Profile summary → Edit profile */}
        <Pressable
          style={styles.profileRow}
          onPress={() => router.push("/profile/edit")}
        >
          <Avatar name={displayName} size={52} />
          <View style={styles.flex}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileSub}>Edit profile · photo, bio</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </Pressable>

        <Section title="Marketplace">
          <Row
            icon="pricetag-outline"
            title="Selling preferences"
            subtitle="Pickup location, default description"
            onPress={() => soon("Selling preferences", "Phase 3")}
          />
          <Row
            icon="storefront-outline"
            title="Vendor / business"
            value={profile?.is_vendor ? "On" : "Off"}
            onPress={() => router.push("/settings/vendor")}
          />
        </Section>

        <Section title="App">
          <Row
            icon="lock-closed-outline"
            title="Privacy"
            subtitle="Online status, nearby visibility"
            onPress={() => router.push("/settings/privacy" as never)}
          />
          <Row
            icon="notifications-outline"
            title="Notifications"
            onPress={() => soon("Notifications", "Phase 4")}
          />
          <Row
            icon="ban-outline"
            title="Blocked accounts"
            onPress={() => soon("Blocked accounts", "a later phase")}
          />
        </Section>

        <Section title="Legal">
          <Row
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() => Linking.openURL("https://collectiv.app/privacy")}
          />
          <Row
            icon="shield-checkmark-outline"
            title="Terms of Service"
            onPress={() => Linking.openURL("https://collectiv.app/terms")}
          />
        </Section>

        <Section title="Account">
          <Row
            icon="mail-outline"
            title="Email & password"
            value={session?.user.email ?? ""}
            onPress={() => router.push("/(auth)/forgot-password" as never)}
          />
          <Row
            icon="help-circle-outline"
            title="Help & support"
            onPress={() => soon("Help & support", "a later phase")}
          />
          <Row
            icon="log-out-outline"
            title="Sign out"
            danger
            showChevron={false}
            onPress={confirmSignOut}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  title,
  subtitle,
  value,
  onPress,
  danger = false,
  showChevron = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? colors.danger : colors.textSecondary}
      />
      <View style={styles.flex}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {value ? (
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceMuted },
  body: { padding: spacing.lg, gap: spacing.xl },
  flex: { flex: 1 },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  profileName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  profileSub: { fontSize: fontSize.sm, color: colors.textSecondary },

  section: { gap: spacing.sm },
  sectionTitle: {
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  rowPressed: { backgroundColor: colors.surface },
  rowTitle: { fontSize: fontSize.md, color: colors.text },
  rowTitleDanger: { color: colors.danger, fontWeight: "600" },
  rowSub: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },
  rowValue: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    maxWidth: 140,
  },
});
