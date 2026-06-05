import { CardCameraModal } from "@/components/portfolio/card-camera-modal";
import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { CardState, useCreateCard } from "@/hooks/use-cards";
import { useCollections } from "@/hooks/use-collections";
import { CONDITIONS } from "@/lib/card-constants";
import { ImageSource, PickedImage, pickImage } from "@/lib/image";
import { uploadCardImage } from "@/lib/storage";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
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

const VISIBILITY: { key: Exclude<CardState, "listed">; label: string }[] = [
  { key: "private", label: "Private" },
  { key: "showcased", label: "Showcase" },
];

export default function AddCardScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  const { data: collections } = useCollections();
  const createCard = useCreateCard();

  const collectionName =
    collections?.find((c) => c.id === collectionId)?.name ?? "this collection";

  const [step, setStep] = useState<1 | 2>(1);
  const [front, setFront] = useState<PickedImage | null>(null);
  const [back, setBack] = useState<PickedImage | null>(null);
  const [cameraSlot, setCameraSlot] = useState<"front" | "back" | null>(null);

  const [title, setTitle] = useState("");
  const [setName, setSetName] = useState("");
  const [condition, setCondition] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [visibility, setVisibility] =
    useState<Exclude<CardState, "listed">>("private");
  const [titleError, setTitleError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }

  async function runPick(slot: "front" | "back", source: ImageSource) {
    try {
      const img = await pickImage(source);
      if (!img) return;
      if (slot === "front") setFront(img);
      else setBack(img);
    } catch (err) {
      Alert.alert(
        "Photo",
        err instanceof Error ? err.message : "Couldn't add photo.",
      );
    }
  }

  async function save() {
    if (!title.trim()) {
      setTitleError("Give the card a name.");
      return;
    }
    setTitleError(undefined);
    if (!collectionId || !userId) return;

    setSubmitting(true);
    try {
      const folder = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      let primaryPhotoPath: string | null = null;
      const photos: { path: string; position: number }[] = [];

      if (front) {
        primaryPhotoPath = await uploadCardImage(
          userId,
          folder,
          "front",
          front.base64,
        );
      }
      if (back) {
        const backPath = await uploadCardImage(
          userId,
          folder,
          "back",
          back.base64,
        );
        photos.push({ path: backPath, position: 1 });
      }

      await createCard.mutateAsync({
        collectionId,
        title: title.trim(),
        setName: setName.trim() || null,
        condition,
        notes: notes.trim() || null,
        state: visibility,
        primaryPhotoPath,
        photos,
      });
      close();
    } catch (err) {
      Alert.alert(
        "Couldn't save card",
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
        {step === 1 ? (
          <>
            <Header
              leftText="Cancel"
              onBack={close}
              title="Add card"
              right={
                <Pressable
                  onPress={() => setStep(2)}
                  hitSlop={8}
                  disabled={!front}
                >
                  <Text style={[styles.next, !front && styles.nextDisabled]}>
                    Next
                  </Text>
                </Pressable>
              }
            />
            <ScrollView contentContainerStyle={styles.body}>
              <Text style={styles.heading}>Scan your card</Text>
              <Text style={styles.sub}>
                Line up the front (required). Back is optional.
              </Text>

              <View style={styles.slots}>
                <PhotoSlot
                  label="Front"
                  image={front}
                  onScan={() => setCameraSlot("front")}
                  onLibrary={() => runPick("front", "library")}
                  onClear={() => setFront(null)}
                />
                <PhotoSlot
                  label="Back"
                  image={back}
                  onScan={() => setCameraSlot("back")}
                  onLibrary={() => runPick("back", "library")}
                  onClear={() => setBack(null)}
                />
              </View>

              <Pressable onPress={() => setStep(2)} style={styles.manual}>
                <Text style={styles.manualText}>Enter details without a photo</Text>
              </Pressable>
            </ScrollView>
          </>
        ) : (
          <>
            <Header
              leftText="Back"
              onBack={() => setStep(1)}
              title="Confirm"
              right={
                <Pressable onPress={save} hitSlop={8} disabled={submitting}>
                  <Text style={styles.next}>Save</Text>
                </Pressable>
              }
            />
            <ScrollView
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
            >
              {(front || back) && (
                <View style={styles.thumbs}>
                  {front && (
                    <Image source={{ uri: front.uri }} style={styles.thumb} />
                  )}
                  {back && (
                    <Image source={{ uri: back.uri }} style={styles.thumb} />
                  )}
                </View>
              )}

              <View style={styles.form}>
                <Field
                  label="CARD NAME"
                  value={title}
                  onChangeText={setTitle}
                  error={titleError}
                  placeholder="Charizard"
                  autoCapitalize="words"
                />
                <Field
                  label="SET"
                  value={setName}
                  onChangeText={setSetName}
                  placeholder="Base Set"
                  autoCapitalize="words"
                />

                <View>
                  <Text style={styles.label}>CONDITION</Text>
                  <View style={styles.chips}>
                    {CONDITIONS.map((c) => {
                      const active = condition === c;
                      return (
                        <Pressable
                          key={c}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => setCondition(active ? null : c)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {c}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <Field
                  label="NOTES (OPTIONAL)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Pulled from a 1st-ed booster…"
                  multiline
                />

                <View>
                  <Text style={styles.label}>VISIBILITY</Text>
                  <View style={styles.segment}>
                    {VISIBILITY.map((v) => {
                      const active = visibility === v.key;
                      return (
                        <Pressable
                          key={v.key}
                          style={[
                            styles.segmentItem,
                            active && styles.segmentItemActive,
                          ]}
                          onPress={() => setVisibility(v.key)}
                        >
                          <Text
                            style={[
                              styles.segmentText,
                              active && styles.segmentTextActive,
                            ]}
                          >
                            {v.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={styles.visHint}>
                    {visibility === "private"
                      ? `Only you can see this card in ${collectionName}.`
                      : "Showcased cards appear on your public profile."}
                  </Text>
                </View>

                <Button
                  title="Save card"
                  onPress={save}
                  loading={submitting}
                  style={styles.saveBtn}
                />
              </View>
            </ScrollView>
          </>
        )}
      </KeyboardAvoidingView>

      <CardCameraModal
        visible={cameraSlot !== null}
        slotLabel={cameraSlot === "back" ? "Back" : "Front"}
        onClose={() => setCameraSlot(null)}
        onCapture={(img) => {
          if (cameraSlot === "back") setBack(img);
          else setFront(img);
        }}
      />
    </SafeAreaView>
  );
}

function PhotoSlot({
  label,
  image,
  onScan,
  onLibrary,
  onClear,
}: {
  label: string;
  image: PickedImage | null;
  onScan: () => void;
  onLibrary: () => void;
  onClear: () => void;
}) {
  return (
    <View style={styles.slotWrap}>
      <Pressable style={styles.slot} onPress={onScan}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.slotImage} />
        ) : (
          <View style={styles.slotEmpty}>
            <Ionicons name="scan-outline" size={28} color={colors.textTertiary} />
            <Text style={styles.slotLabel}>Scan {label.toLowerCase()}</Text>
          </View>
        )}
      </Pressable>
      {image ? (
        <Pressable onPress={onClear} style={styles.clear} hitSlop={8}>
          <Ionicons name="close-circle" size={22} color={colors.text} />
        </Pressable>
      ) : (
        <Pressable onPress={onLibrary} hitSlop={6}>
          <Text style={styles.libraryLink}>Choose from library</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  next: { fontSize: fontSize.md, fontWeight: "700", color: colors.accent },
  nextDisabled: { color: colors.textTertiary },
  body: { padding: spacing.xl, gap: spacing.lg },
  heading: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  sub: { fontSize: fontSize.sm, color: colors.textSecondary },

  slots: { flexDirection: "row", gap: spacing.lg, marginTop: spacing.sm },
  slotWrap: { flex: 1, alignItems: "center", gap: spacing.xs },
  slot: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  slotImage: { width: "100%", height: "100%" },
  slotEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xs },
  slotLabel: { fontSize: fontSize.sm, color: colors.textTertiary },
  libraryLink: { fontSize: fontSize.xs, color: colors.accent, fontWeight: "600" },
  clear: { position: "absolute", top: spacing.xs, right: spacing.xs },

  manual: { alignItems: "center", paddingVertical: spacing.md },
  manualText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },

  thumbs: { flexDirection: "row", gap: spacing.md, justifyContent: "center" },
  thumb: {
    width: 96,
    height: 128,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  form: { gap: spacing.lg, marginTop: spacing.sm },
  label: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  chipTextActive: { color: colors.accent, fontWeight: "700" },

  segment: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  segmentItemActive: { backgroundColor: colors.background },
  segmentText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: "600" },
  segmentTextActive: { color: colors.text },
  visHint: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: spacing.sm },

  saveBtn: { marginTop: spacing.sm },
});
