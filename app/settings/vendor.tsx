import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { SectionLabel, SettingsNav } from "@/components/settings/settings-bits";
import { fontFamily, space } from "@/constants/theme";
import { Profile, useProfile } from "@/hooks/use-profile";
import { VendorProfile, useUpsertVendorProfile, useVendorProfile } from "@/hooks/use-vendor";
import { PickedImage, pickImage } from "@/lib/image";
import { cardPhotoUrl, uploadCardImage } from "@/lib/storage";
import { useTheme } from "@/hooks/use-theme";
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
  const { colors } = useTheme();
  const { data: profile, isLoading } = useProfile();
  const { data: vendor, isLoading: vendorLoading } = useVendorProfile(profile?.id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <SettingsNav title="Vendor / business" />
      {isLoading || vendorLoading || !profile ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <VendorForm key={profile.id} profile={profile} vendor={vendor ?? null} />
      )}
    </SafeAreaView>
  );
}

function VendorForm({ profile, vendor }: { profile: Profile; vendor: VendorProfile | null }) {
  const { colors } = useTheme();
  const upsert = useUpsertVendorProfile();
  const me = profile.id;

  const [isVendor, setIsVendor] = useState(profile.is_vendor);
  const [businessName, setBusinessName] = useState(vendor?.business_name ?? profile.business_name ?? "");
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
      if (banner) bannerPath = await uploadCardImage(me, `vendor-banner-${Date.now()}`, "banner", banner.base64);
      if (logo) logoPath = await uploadCardImage(me, `vendor-logo-${Date.now()}`, "logo", logo.base64);
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
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Vendor toggle */}
        <View style={[styles.toggleRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <View style={styles.flex}>
            <Text style={[styles.toggleTitle, { color: colors.fgPrimary }]}>I&apos;m a vendor / business</Text>
            <Text style={[styles.toggleSub, { color: colors.fgTertiary }]}>Storefront, banner, verified badge</Text>
          </View>
          <Switch value={isVendor} onValueChange={setIsVendor} trackColor={{ false: colors.borderDefault, true: colors.secondary }} thumbColor="#fff" />
        </View>

        {isVendor ? (
          <>
            <SectionLabel>Branding</SectionLabel>
            <Pressable style={[styles.banner, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => pick("banner")}>
              {bannerUri ? (
                <Image source={{ uri: bannerUri }} style={styles.bannerImg} contentFit="cover" />
              ) : (
                <View style={styles.bannerEmpty}>
                  <Ionicons name="image-outline" size={26} color={colors.fgTertiary} />
                  <Text style={[styles.pickText, { color: colors.secondary }]}>Add banner image</Text>
                </View>
              )}
            </Pressable>
            <Pressable style={styles.logoRow} onPress={() => pick("logo")}>
              <View style={[styles.logo, { backgroundColor: colors.bgSurface }]}>
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.logoImg} contentFit="cover" />
                ) : (
                  <Ionicons name="storefront-outline" size={24} color={colors.fgTertiary} />
                )}
              </View>
              <Text style={[styles.pickText, { color: colors.secondary }]}>{logoUri ? "Change logo" : "Add logo"}</Text>
            </Pressable>

            <SectionLabel>Storefront</SectionLabel>
            <View style={styles.form}>
              <Field label="BUSINESS NAME" value={businessName} onChangeText={setBusinessName} error={error} placeholder="Edmonton Card Vault" autoCapitalize="words" />
              <Field label="DESCRIPTION" value={description} onChangeText={setDescription} placeholder="What you sell, your vibe…" multiline />
              <Field label="ADDRESS" value={address} onChangeText={setAddress} placeholder="10355 Whyte Ave NW" autoCapitalize="words" />
              <Field label="HOURS" value={hours} onChangeText={setHours} placeholder="Tue–Sun · 11am–7pm" />
              <Field label="PHONE" value={phone} onChangeText={setPhone} placeholder="(780) 555-0199" keyboardType="phone-pad" />
              <Field label="EMAIL" value={email} onChangeText={setEmail} placeholder="shop@yegcards.com" autoCapitalize="none" keyboardType="email-address" />
              <Field label="INSTAGRAM" value={instagram} onChangeText={setInstagram} placeholder="@yegcards" autoCapitalize="none" />
              <Field label="WEBSITE" value={website} onChangeText={setWebsite} placeholder="yegcards.com" autoCapitalize="none" keyboardType="url" />
            </View>

            <SectionLabel>Location</SectionLabel>
            <Pressable style={[styles.locationRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => router.push("/settings/vendor-location")}>
              <View style={[styles.locationIcon, { backgroundColor: colors.successMuted }]}>
                <Ionicons name="location-outline" size={20} color={colors.success} />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.locationTitle, { color: colors.fgPrimary }]}>Business location on map</Text>
                <Text style={[styles.locationSub, { color: colors.fgTertiary }]}>
                  {vendor?.business_location ? "Location set — tap to update" : "Pin your storefront so collectors can find you"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.fgTertiary} />
            </Pressable>

            <SectionLabel>Verification</SectionLabel>
            <View style={[styles.verifyRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.fgSecondary} />
              <Text style={[styles.verifyText, { color: colors.fgPrimary }]}>Business verification</Text>
              <View style={[styles.pending, { backgroundColor: colors.bgBase }]}>
                <Text style={[styles.pendingText, { color: colors.fgSecondary }]}>Pending</Text>
              </View>
            </View>
            <Text style={[styles.hint, { color: colors.fgTertiary }]}>
              Your storefront goes live as soon as you save. The verified badge follows after a manual review.
            </Text>
          </>
        ) : null}

        <Button title="Save" onPress={save} loading={saving} style={{ marginTop: space.md }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  body: { padding: space.xl, paddingTop: space.lg },

  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: space.lg },
  toggleTitle: { fontFamily: fontFamily.socialBold, fontSize: 15 },
  toggleSub: { fontFamily: fontFamily.body, fontSize: 12, marginTop: 2 },

  banner: { width: "100%", height: 130, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  bannerImg: { width: "100%", height: "100%" },
  bannerEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: space.md },
  logo: { width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logoImg: { width: "100%", height: "100%" },
  pickText: { fontFamily: fontFamily.socialBold, fontSize: 13 },

  form: { gap: space.lg },

  locationRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: space.md },
  locationIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  locationTitle: { fontFamily: fontFamily.socialBold, fontSize: 14 },
  locationSub: { fontFamily: fontFamily.body, fontSize: 12, marginTop: 2 },

  verifyRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: space.md },
  verifyText: { flex: 1, fontFamily: fontFamily.bodySemibold, fontSize: 14 },
  pending: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  pendingText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  hint: { fontFamily: fontFamily.body, fontSize: 11, lineHeight: 17, marginTop: 4 },
});
