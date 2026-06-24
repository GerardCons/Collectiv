import { Card, SectionLabel, SettingRow, SettingsNav } from "@/components/settings/settings-bits";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { useProfile } from "@/hooks/use-profile";
import { useAppearanceStore, useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const APPEARANCE_LABEL: Record<string, string> = { system: "System", light: "Light", dark: "Dark" };

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const { data: profile } = useProfile();
  const appearance = useAppearanceStore((s) => s.appearance);
  const setAppearance = useAppearanceStore((s) => s.setAppearance);
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  const name = profile?.display_name || profile?.username || "You";
  const handle = profile?.username ?? "you";

  function soon(label: string) {
    Alert.alert(label, "Coming soon.");
  }
  function confirmSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => supabase.auth.signOut() },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SettingsNav title="Settings" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Profile summary */}
        <Pressable style={[styles.profile, { borderBottomColor: colors.borderDefault }]} onPress={() => router.push("/profile/edit")}>
          <Avatar name={name} size={52} color={colors.primary} />
          <View style={styles.flex}>
            <Text style={[styles.profileName, { color: colors.fgPrimary }]}>{name}</Text>
            <Text style={[styles.profileHandle, { color: colors.fgTertiary }]}>@{handle}</Text>
          </View>
          <Text style={[styles.editLink, { color: colors.primary }]}>Edit</Text>
        </Pressable>

        <SectionLabel>Account</SectionLabel>
        <Card>
          <SettingRow icon="create-outline" iconBg={colors.primaryMuted} iconColor={colors.primary} label="Edit Profile" onPress={() => router.push("/profile/edit")} />
          <SettingRow icon="mail-outline" label="Email" value={session?.user.email ?? "—"} onPress={() => soon("Change email")} />
          <SettingRow icon="lock-closed-outline" label="Password" onPress={() => router.push("/(auth)/forgot-password")} />
          <SettingRow icon="call-outline" label="Phone number" value="+1 (780) •••••67" onPress={() => soon("Phone number")} last />
        </Card>

        <SectionLabel>Marketplace</SectionLabel>
        <Card>
          <SettingRow icon="pricetag-outline" label="Selling preferences" onPress={() => soon("Selling preferences")} />
          <SettingRow icon="storefront-outline" iconBg={colors.secondaryMuted} iconColor={colors.secondary} label="Vendor / business" value={profile?.is_vendor ? "On" : "Off"} onPress={() => router.push("/settings/vendor")} last />
        </Card>

        <SectionLabel>Preferences</SectionLabel>
        <Card>
          <SettingRow icon="notifications-outline" iconBg={colors.primaryMuted} iconColor={colors.primary} label="Notifications" onPress={() => router.push("/(tabs)/social/notif-prefs")} />
          <SettingRow icon="shield-outline" iconBg={colors.secondaryMuted} iconColor={colors.secondary} label="Privacy & visibility" onPress={() => router.push("/settings/privacy")} />
          <SettingRow icon="color-palette-outline" iconBg={colors.successMuted} iconColor={colors.success} label="Appearance" value={APPEARANCE_LABEL[appearance]} onPress={() => setAppearanceOpen(true)} last />
        </Card>

        <SectionLabel>Support</SectionLabel>
        <Card>
          <SettingRow icon="help-circle-outline" label="Help & support" onPress={() => soon("Help & support")} />
          <SettingRow icon="document-text-outline" label="Privacy Policy" onPress={() => Linking.openURL("https://collectiv.app/privacy")} />
          <SettingRow icon="shield-checkmark-outline" label="Terms of Service" onPress={() => Linking.openURL("https://collectiv.app/terms")} />
          <SettingRow icon="information-circle-outline" label="About Collectiv" value="v1.0" chevron={false} last />
        </Card>

        <View style={styles.logoutWrap}>
          <Pressable style={[styles.logout, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }]} onPress={confirmSignOut}>
            <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Appearance picker */}
      <ActionSheet
        visible={appearanceOpen}
        onClose={() => setAppearanceOpen(false)}
        header={{ title: "Appearance", subtitle: "Choose how Collectiv looks" }}
        actions={[
          { icon: "phone-portrait-outline", label: "System", sub: "Match your device", onPress: () => setAppearance("system") },
          { icon: "sunny-outline", label: "Light", onPress: () => setAppearance("light") },
          { icon: "moon-outline", label: "Dark", onPress: () => setAppearance("dark") },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  profile: { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1 },
  profileName: { fontFamily: fontFamily.socialExtrabold, fontSize: 16 },
  profileHandle: { fontFamily: fontFamily.body, fontSize: 12, marginTop: 1 },
  editLink: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  logoutWrap: { padding: space.lg, paddingTop: space["2xl"] },
  logout: { paddingVertical: 13, borderRadius: 999, borderWidth: 1, alignItems: "center" },
  logoutText: { fontFamily: fontFamily.socialBold, fontSize: 14 },
});
