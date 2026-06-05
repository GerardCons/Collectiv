import { Field } from "@/components/form/field";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { GroupPostType, useCreateGroupPost } from "@/hooks/use-group-posts";
import { PickedImage, pickImage } from "@/lib/image";
import { uploadCardImage } from "@/lib/storage";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
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

const TYPES: { key: GroupPostType; label: string }[] = [
  { key: "discussion", label: "Discussion" },
  { key: "giveaway", label: "Giveaway" },
  { key: "announcement", label: "Announcement" },
];

export default function NewGroupPostScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { session } = useAuth();
  const userId = session?.user.id;
  const createPost = useCreateGroupPost(groupId ?? "");

  const [postType, setPostType] = useState<GroupPostType>("discussion");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<PickedImage | null>(null);
  const [bodyError, setBodyError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  function cancel() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }

  async function pickPhoto() {
    try {
      const img = await pickImage("library");
      if (img) setPhoto(img);
    } catch (err) {
      Alert.alert("Photo", err instanceof Error ? err.message : "Couldn't add image.");
    }
  }

  async function post() {
    if (!body.trim()) {
      setBodyError("Write something to post.");
      return;
    }
    setBodyError(undefined);
    if (!groupId || !userId) return;
    setSubmitting(true);
    try {
      let photoPath: string | null = null;
      if (photo) {
        const folder = `post-${Date.now()}`;
        photoPath = await uploadCardImage(userId, folder, "photo", photo.base64);
      }
      await createPost.mutateAsync({ postType, body: body.trim(), photoPath });
      cancel();
    } catch (err) {
      Alert.alert(
        "Couldn't post",
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header
          leftText="Cancel"
          onBack={cancel}
          title="New post"
          right={
            <Pressable onPress={post} hitSlop={8} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Text style={styles.post}>Post</Text>
              )}
            </Pressable>
          }
        />

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text style={styles.label}>TYPE</Text>
            <View style={styles.chips}>
              {TYPES.map((t) => {
                const active = postType === t.key;
                return (
                  <Pressable
                    key={t.key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setPostType(t.key)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Field
            label="POST"
            value={body}
            onChangeText={setBody}
            error={bodyError}
            placeholder="Share something with the group…"
            multiline
          />

          {photo ? (
            <View style={styles.photoWrap}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <Pressable style={styles.clear} onPress={() => setPhoto(null)} hitSlop={8}>
                <Ionicons name="close-circle" size={24} color={colors.text} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.addPhoto} onPress={pickPhoto}>
              <Ionicons name="image-outline" size={20} color={colors.accent} />
              <Text style={styles.addPhotoText}>Add photo (optional)</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  post: { fontSize: fontSize.md, fontWeight: "700", color: colors.accent },
  body: { padding: spacing.xl, gap: spacing.xl },
  label: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  chipTextActive: { color: colors.accent, fontWeight: "700" },

  photoWrap: { position: "relative" },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  clear: { position: "absolute", top: spacing.sm, right: spacing.sm },
  addPhoto: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  addPhotoText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
});
