import { Field } from "@/components/form/field";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useCreateGroup } from "@/hooks/use-groups";
import { GENRES } from "@/lib/card-constants";
import { PickedImage, pickImage } from "@/lib/image";
import { uploadCardImage } from "@/lib/storage";
import { useAuth } from "@/providers/auth-provider";
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
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateGroupScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const createGroup = useCreateGroup();

  const [name, setName] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<PickedImage | null>(null);
  const [nameError, setNameError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  function cancel() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }

  async function pickCover() {
    try {
      const img = await pickImage("library");
      if (img) setCover(img);
    } catch (err) {
      Alert.alert("Photo", err instanceof Error ? err.message : "Couldn't add image.");
    }
  }

  async function create() {
    if (!name.trim()) {
      setNameError("Name your group.");
      return;
    }
    setNameError(undefined);
    if (!userId) return;
    setSubmitting(true);
    try {
      let coverPath: string | null = null;
      if (cover) {
        const folder = `group-${Date.now()}`;
        coverPath = await uploadCardImage(userId, folder, "cover", cover.base64);
      }
      const group = await createGroup.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        genre,
        coverPath,
      });
      router.replace({ pathname: "/(tabs)/social/[id]", params: { id: group.id } });
    } catch (err) {
      Alert.alert(
        "Couldn't create group",
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
          title="New group"
          right={
            <Pressable onPress={create} hitSlop={8} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Text style={styles.create}>Create</Text>
              )}
            </Pressable>
          }
        />

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.cover} onPress={pickCover}>
            {cover ? (
              <Image source={{ uri: cover.uri }} style={styles.coverImg} />
            ) : (
              <View style={styles.coverEmpty}>
                <Ionicons name="image-outline" size={28} color={colors.textTertiary} />
                <Text style={styles.coverText}>Add cover image (optional)</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.form}>
            <Field
              label="NAME"
              value={name}
              onChangeText={setName}
              error={nameError}
              placeholder="Pokémon Collectors Edmonton"
              autoCapitalize="words"
            />

            <View>
              <Text style={styles.label}>GENRE</Text>
              <View style={styles.chips}>
                {GENRES.map((g) => {
                  const active = genre === g;
                  return (
                    <Pressable
                      key={g}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setGenre(active ? null : g)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {g}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Field
              label="DESCRIPTION (OPTIONAL)"
              value={description}
              onChangeText={setDescription}
              placeholder="What's this group about?"
              multiline
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  create: { fontSize: fontSize.md, fontWeight: "700", color: colors.accent },
  body: { padding: spacing.xl, gap: spacing.xl },

  cover: {
    width: "100%",
    height: 140,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  coverImg: { width: "100%", height: "100%" },
  coverEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xs },
  coverText: { fontSize: fontSize.sm, color: colors.textTertiary },

  form: { gap: spacing.lg },
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
});
