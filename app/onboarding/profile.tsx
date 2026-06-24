import { StepScaffold } from "@/components/onboarding/step-scaffold";
import { Field } from "@/components/form/field";
import { fontFamily, fontSizes, space } from "@/constants/theme";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { PickedImage, pickImage } from "@/lib/image";
import { cardPhotoUrl, uploadCardImage } from "@/lib/storage";
import { getInitials } from "@/components/ui/avatar";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const USERNAME_RE = /^[a-z0-9_]+$/;

export default function OnboardingProfile() {
  const { colors } = useTheme();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [avatarImage, setAvatarImage] = useState<PickedImage | null>(null);
  const [usernameError, setUsernameError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const avatarUri = avatarImage?.uri ?? cardPhotoUrl(profile?.avatar_path);

  async function pickAvatar() {
    try {
      const img = await pickImage("library");
      if (img) setAvatarImage(img);
    } catch (err) {
      Alert.alert("Photo", err instanceof Error ? err.message : "Couldn't select photo.");
    }
  }

  async function next() {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setUsernameError("Pick a username.");
      return;
    }
    if (!USERNAME_RE.test(cleanUsername)) {
      setUsernameError("Lowercase letters, numbers, and underscores only.");
      return;
    }
    setUsernameError(undefined);
    setSaving(true);
    try {
      let avatarPath = profile?.avatar_path;
      if (avatarImage && profile) {
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
        avatar_path: avatarPath,
      });
      router.push("/onboarding/interests");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "23505") {
        setUsernameError("That username is already taken.");
        return;
      }
      Alert.alert("Couldn't save", err instanceof Error ? err.message : "Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StepScaffold
      step={1}
      eyebrow="Step 1 of 5"
      title={"Set up your\ncollector profile"}
      subtitle="This is how other collectors will know you."
      cta={{ label: "Continue", onPress: next, loading: saving }}
    >
      <View style={styles.avatarWrap}>
        <Pressable onPress={pickAvatar}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <Text style={[styles.avatarInitials, { color: colors.primary }]}>
                {getInitials(displayName || username)}
              </Text>
            )}
          </View>
          <View style={[styles.addBadge, { backgroundColor: colors.primary, borderColor: colors.bgBase }]}>
            <Ionicons name="camera" size={14} color={colors.fgOnAccent} />
          </View>
        </Pressable>
        <Pressable onPress={pickAvatar} hitSlop={8}>
          <Text style={[styles.addPhoto, { color: colors.primary }]}>
            {avatarImage ? "Photo selected" : "Add photo"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <Field
          label="DISPLAY NAME"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          autoCapitalize="words"
        />
        <Field
          label="USERNAME"
          value={username}
          onChangeText={setUsername}
          error={usernameError}
          helper="Your unique handle."
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignItems: "center", gap: space.md, marginBottom: space["2xl"] },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: 88, height: 88, borderRadius: 44 },
  avatarInitials: { fontFamily: fontFamily.bodyExtrabold, fontSize: 30 },
  addBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  addPhoto: { fontFamily: fontFamily.socialBold, fontSize: fontSizes.sm },
  form: { gap: space.lg },
});
