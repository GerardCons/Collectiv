import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { Profile, useProfile } from "@/hooks/use-profile";
import {
  VendorProfile,
  useUpsertVendorProfile,
  useVendorProfile,
} from "@/hooks/use-vendor";
import { PickedImage, pickImage } from "@/lib/image";
import { cardPhotoUrl, uploadCardImage } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VendorScreen() {
  const { data: profile, isLoading } = useProfile();
  const { data: vendor, isLoading: vendorLoading } = useVendorProfile(profile?.id);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Vendor / business"
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace("/settings")
        }
      />
      {isLoading || vendorLoading || !profile ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <VendorForm key={profile.id} profile={profile} vendor={vendor ?? null} />
      )}
    </SafeAreaView>
  );
}

function VendorForm({
  profile,
  vendor,
}: {
  profile: Profile;
  vendor: VendorProfile | null;
}) {
  const upsert = useUpsertVendorProfile();
  const me = profile.id;

  const [isVendor, setIsVendor] = useState(profile.is_vendor);
  const [businessName, setBusinessName] = useState(
    vendor?.business_name ?? profile.business_name ?? "",
  );
  const [description, setDescription] = useState(vendor?.description ?? "");
  const [address, setAddress] = useState(vendor?.address ?? "");
  const [hours, setHours] = useState(vendor?.hours ?? "");
  const [phone, setPhone] = useState(vendor?.phone ?? "");
  const [email, setEmail] = useState(vendor?.email ?? "");
  const [instagram, setInstagram] = useState(vendor?.instagram ?? "");
  const [website, setWebsite] = useState(vendor?.website ?? "");
  const [banner, setBanner] = useState<PickedImage | null>(null);
  const [logo, setLogo] = useState<PickedImage | null>(null);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const bannerUri = banner?.uri ?? cardPhotoUrl(vendor?.banner_path);
  const logoUri = logo?.uri ?? cardPhotoUrl(vendor?.logo_path);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/settings");
  }

  async function pick(which: "banner" | "logo") {
    try {
      const img = await pickImage("library");
      if (!img) return;
      if (which === "banner") setBanner(img);
      else setLogo(img);
    } catch (err) {
      Alert.alert("Photo", err instanceof Error ? err.message : "Couldn't add image.");
    }
  }

  async function save() {
    if (isVendor && !businessName.trim()) {
      setError("Enter your business name.");
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      let bannerPath = vendor?.banner_path ?? null;
      let logoPath = vendor?.logo_path ?? null;
      if (banner) {
        bannerPath = await uploadCardImage(me, `vendor-banner-${Date.now()}`, "banner", banner.base64);
      }
      if (logo) {
        logoPath = await uploadCardImage(me, `vendor-logo-${Date.now()}`, "logo", logo.base64);
      }
      await upsert.mutateAsync({
        isVendor,
        businessName,
        description: description.trim() || null,
        address: address.trim() || null,
        hours: hours.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        instagram: instagram.trim() || null,
        website: website.trim() || null,
        bannerPath,
        logoPath,
      });
      back();
    } catch (err) {
      Alert.alert("Save failed", err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.toggleRow}>
          <View style={styles.flex}>
            <Text style={styles.toggleTitle}>I&apos;m a vendor / business</Text>
            <Text style={styles.toggleSub}>Storefront, banner, verified badge</Text>
          </View>
          <Switch
            value={isVendor}
            onValueChange={setIsVendor}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={colors.background}
          />
        </View>

        {isVendor ? (
          <>
            {/* Branding */}
            <Text style={styles.section}>BRANDING</Text>
            <Pressable style={styles.banner} onPress={() => pick("banner")}>
              {bannerUri ? (
                <Image source={{ uri: bannerUri }} style={styles.bannerImg} contentFit="cover" />
              ) : (
                <View style={styles.bannerEmpty}>
                  <Ionicons name="image-outline" size={26} color={colors.textTertiary} />
                  <Text style={styles.pickText}>Add banner image</Text>
                </View>
              )}
            </Pressable>
            <Pressable style={styles.logoRow} onPress={() => pick("logo")}>
              <View style={styles.logo}>
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.logoImg} contentFit="cover" />
                ) : (
                  <Ionicons name="storefront-outline" size={24} color={colors.textTertiary} />
                )}
              </View>
              <Text style={styles.pickText}>{logoUri ? "Change logo" : "Add logo"}</Text>
            </Pressable>

            {/* Storefront */}
            <Text style={styles.section}>STOREFRONT</Text>
            <View style={styles.form}>
              <Field
                label="BUSINESS NAME"
                value={businessName}
                onChangeText={setBusinessName}
                error={error}
                placeholder="Edmonton Card Vault"
                autoCapitalize="words"
              />
              <Field
                label="DESCRIPTION"
                value={description}
                onChangeText={setDescription}
                placeholder="What you sell, your vibe…"
                multiline
              />
              <Field
                label="ADDRESS"
                value={address}
                onChangeText={setAddress}
                placeholder="10355 Whyte Ave NW"
                autoCapitalize="words"
              />
              <Field
                label="HOURS"
                value={hours}
                onChangeText={setHours}
                placeholder="Tue–Sun · 11am–7pm"
              />
              <Field
                label="PHONE"
                value={phone}
                onChangeText={setPhone}
                placeholder="(780) 555-0199"
                keyboardType="phone-pad"
              />
              <Field
                label="EMAIL"
                value={email}
                onChangeText={setEmail}
                placeholder="shop@yegcards.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Field
                label="INSTAGRAM"
                value={instagram}
                onChangeText={setInstagram}
                placeholder="@yegcards"
                autoCapitalize="none"
              />
              <Field
                label="WEBSITE"
                value={website}
                onChangeText={setWebsite}
                placeholder="yegcards.com"
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            {/* Business location */}
            <Text style={styles.section}>LOCATION</Text>
            <Pressable
              style={styles.locationRow}
              onPress={() => router.push("/settings/vendor-location" as never)}
            >
              <View style={styles.locationIcon}>
                <Ionicons name="location-outline" size={20} color={colors.success} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.locationTitle}>Business location on map</Text>
                <Text style={styles.locationSub}>
                  {vendor?.business_location
                    ? "Location set — tap to update"
                    : "Pin your storefront so collectors can find you"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>

            {/* Verification (display-only) */}
            <Text style={styles.section}>VERIFICATION</Text>
            <View style={styles.verifyRow}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.verifyText}>Business verification</Text>
              <View style={styles.pending}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            </View>
            <Text style={styles.hint}>
              Your storefront goes live as soon as you save. The verified badge
              follows after a manual review.
            </Text>
          </>
        ) : null}

        <Button title="Save" onPress={save} loading={saving} style={styles.saveBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  body: { padding: spacing.xl, gap: spacing.lg },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  toggleTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  toggleSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },

  section: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },

  banner: {
    width: "100%",
    height: 130,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  bannerImg: { width: "100%", height: "100%" },
  bannerEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xs },
  logoRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImg: { width: "100%", height: "100%" },
  pickText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },

  form: { gap: spacing.lg },

  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  verifyText: { flex: 1, fontSize: fontSize.md, color: colors.text },
  pending: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pendingText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "700" },
  hint: { fontSize: fontSize.xs, color: colors.textTertiary, lineHeight: 18 },

  saveBtn: { marginTop: spacing.md },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.success + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  locationTitle: { fontSize: fontSize.md, fontWeight: "600", color: colors.text },
  locationSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
});
