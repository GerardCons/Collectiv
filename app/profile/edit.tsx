import { Field } from "@/components/form/field";
import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, spacing } from "@/constants/theme";
import { Profile, useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { PickedImage, pickImage } from "@/lib/image";
import { cardPhotoUrl, uploadCardImage } from "@/lib/storage";
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
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BIO_MAX = 150;
const USERNAME_RE = /^[a-z0-9_]+$/;

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useProfile();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isLoading || !profile ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        // Keyed by id so the form's initial state is set once the row is loaded.
        <EditProfileForm key={profile.id} profile={profile} />
      )}
    </SafeAreaView>
  );
}

function EditProfileForm({ profile }: { profile: Profile }) {
  const updateProfile = useUpdateProfile();
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [locationCity, setLocationCity] = useState(profile.location_city ?? "");
  const [link, setLink] = useState(
    profile.links?.instagram ?? profile.links?.website ?? "",
  );
  const [usernameError, setUsernameError] = useState<string>();
  const [avatarImage, setAvatarImage] = useState<PickedImage | null>(null);

  function cancel() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  async function save() {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setUsernameError("Username can't be empty.");
      return;
    }
    if (!USERNAME_RE.test(cleanUsername)) {
      setUsernameError("Lowercase letters, numbers, and underscores only.");
      return;
    }
    setUsernameError(undefined);

    const trimmedLink = link.trim();
    try {
      let avatarPath = profile.avatar_path;
      if (avatarImage) {
        avatarPath = await uploadCardImage(
          profile.id,
          `avatar-${Date.now()}`,
          "avatar",
          avatarImage.base64,
        );
      }
      await updateProfile.mutateAsync({
        display_name: displayName.trim() || null,
        username: cleanUsername,
        bio: bio.trim() || null,
        location_city: locationCity.trim() || null,
        links: trimmedLink ? { website: trimmedLink } : {},
        avatar_path: avatarPath,
      });
      cancel();
    } catch (err) {
      // 23505 = unique_violation → the username is taken.
      const code = (err as { code?: string })?.code;
      if (code === "23505") {
        setUsernameError("That username is already taken.");
        return;
      }
      const message =
        err instanceof Error ? err.message : "Couldn't save your profile.";
      Alert.alert("Save failed", message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        leftText="Cancel"
        onBack={cancel}
        title="Edit profile"
        right={
          <Pressable onPress={save} hitSlop={8} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <Text style={styles.save}>Save</Text>
            )}
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarRow}>
          <Avatar
            name={displayName || username}
            size={88}
            uri={avatarImage?.uri ?? cardPhotoUrl(profile.avatar_path)}
          />
          <Pressable
            onPress={async () => {
              try {
                const img = await pickImage("library");
                if (img) setAvatarImage(img);
              } catch (err) {
                Alert.alert("Photo", err instanceof Error ? err.message : "Couldn't select photo.");
              }
            }}
            hitSlop={8}
          >
            <Text style={styles.changePhoto}>
              {avatarImage ? "Photo selected — tap to change" : "Change photo"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <Field
            label="DISPLAY NAME"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="alex.c"
            helper="Shown to other collectors."
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Field
            label="USERNAME"
            value={username}
            onChangeText={setUsername}
            error={usernameError}
            helper="Your unique handle — used in your profile link."
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Field
            label="BIO"
            value={bio}
            onChangeText={(t) => setBio(t.slice(0, BIO_MAX))}
            placeholder="Vintage WOTC + One Piece. Always sleeved."
            helper={`${bio.length}/${BIO_MAX}`}
            multiline
          />

          <Field
            label="LOCATION"
            value={locationCity}
            onChangeText={setLocationCity}
            placeholder="Edmonton, AB"
            helper="City only — never your exact address."
            autoCapitalize="words"
          />

          <Field
            label="LINKS (OPTIONAL)"
            value={link}
            onChangeText={setLink}
            placeholder="instagram.com/yourhandle"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  save: { fontSize: fontSize.md, fontWeight: "700", color: colors.accent },
  body: { padding: spacing.xl, gap: spacing.xl },
  avatarRow: { alignItems: "center", gap: spacing.sm },
  changePhoto: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
  form: { gap: spacing.lg },
});
