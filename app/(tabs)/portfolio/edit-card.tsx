import { Field } from "@/components/form/field";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  Card,
  CardPhoto,
  CardState,
  useCard,
  useCardPhotos,
  useUpdateCard,
} from "@/hooks/use-cards";
import { CONDITIONS } from "@/lib/card-constants";
import { cardPhotoUrl } from "@/lib/storage";
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

const VISIBILITY: { key: Exclude<CardState, "listed">; label: string }[] = [
  { key: "private", label: "Private" },
  { key: "showcased", label: "Showcase" },
];

export default function EditCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: card, isLoading } = useCard(id);
  const { data: photos } = useCardPhotos(id);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isLoading || !card ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <EditCardForm key={card.id} card={card} photos={photos ?? []} />
      )}
    </SafeAreaView>
  );
}

function EditCardForm({ card, photos }: { card: Card; photos: CardPhoto[] }) {
  const update = useUpdateCard();
  const [title, setTitle] = useState(card.title);
  const [setName, setSetName] = useState(card.set_name ?? "");
  const [condition, setCondition] = useState<string | null>(card.condition);
  const [notes, setNotes] = useState(card.notes ?? "");
  const [titleError, setTitleError] = useState<string>();

  const isListed = card.state === "listed";
  const [visibility, setVisibility] = useState<Exclude<CardState, "listed">>(
    card.state === "showcased" ? "showcased" : "private",
  );

  const images = [
    card.primary_photo_path,
    ...photos.map((p) => p.path),
  ].filter(Boolean) as string[];

  function cancel() {
    if (router.canGoBack()) router.back();
    else
      router.replace({
        pathname: "/(tabs)/portfolio/card/[id]",
        params: { id: card.id },
      });
  }

  async function save() {
    if (!title.trim()) {
      setTitleError("Give the card a name.");
      return;
    }
    setTitleError(undefined);
    try {
      await update.mutateAsync({
        id: card.id,
        collectionId: card.collection_id,
        title: title.trim(),
        setName: setName.trim() || null,
        condition,
        notes: notes.trim() || null,
        state: isListed ? "listed" : visibility,
      });
      cancel();
    } catch (err) {
      Alert.alert(
        "Save failed",
        err instanceof Error ? err.message : "Couldn't update the card.",
      );
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
        title="Edit card"
        right={
          <Pressable onPress={save} hitSlop={8} disabled={update.isPending}>
            {update.isPending ? (
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
        {images.length ? (
          <View style={styles.photoSection}>
            <View style={styles.thumbs}>
              {images.map((path) => (
                <Image
                  key={path}
                  source={{ uri: cardPhotoUrl(path) }}
                  style={styles.thumb}
                  contentFit="cover"
                />
              ))}
            </View>
            <Text style={styles.photoNote}>
              Photos can&apos;t be changed yet — re-add the card to replace them.
            </Text>
          </View>
        ) : null}

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
                      style={[styles.chipText, active && styles.chipTextActive]}
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

          {isListed ? (
            <Text style={styles.listedNote}>
              This card is listed — manage its visibility from the marketplace
              (Phase 3).
            </Text>
          ) : (
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
            </View>
          )}
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

  photoSection: { gap: spacing.sm, alignItems: "center" },
  thumbs: { flexDirection: "row", gap: spacing.md, justifyContent: "center" },
  thumb: {
    width: 96,
    height: 128,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  photoNote: { fontSize: fontSize.xs, color: colors.textTertiary },

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
  listedNote: { fontSize: fontSize.sm, color: colors.textSecondary },
});
