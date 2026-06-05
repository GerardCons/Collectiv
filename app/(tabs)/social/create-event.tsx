import { Field } from "@/components/form/field";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { EventType, useCreateEvent } from "@/hooks/use-events";
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

const TYPES: { key: EventType; label: string }[] = [
  { key: "meetup", label: "Meetup" },
  { key: "tournament", label: "Tournament" },
  { key: "convention", label: "Convention" },
  { key: "other", label: "Other" },
];

export default function CreateEventScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const create = useCreateEvent();

  const [name, setName] = useState("");
  const [eventType, setEventType] = useState<EventType>("meetup");
  const [genre, setGenre] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [cover, setCover] = useState<PickedImage | null>(null);
  const [nameError, setNameError] = useState<string>();
  const [dateError, setDateError] = useState<string>();
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

  /** Parse "Jun 14 2026" + "2:00 PM" into a Date (timezone-aware: uses device locale). */
  function parseDatetime(): Date | null {
    const combined = `${dateStr.trim()} ${timeStr.trim()}`;
    const d = new Date(combined);
    return isNaN(d.getTime()) ? null : d;
  }

  async function submit() {
    let valid = true;
    if (!name.trim()) { setNameError("Give the event a name."); valid = false; }
    else setNameError(undefined);
    const startsAt = parseDatetime();
    if (!startsAt) { setDateError("Enter a valid date like 'Jun 14 2026' and time like '2:00 PM'."); valid = false; }
    else setDateError(undefined);
    if (!valid || !startsAt || !userId) return;

    setSubmitting(true);
    try {
      let coverPath: string | null = null;
      if (cover) {
        coverPath = await uploadCardImage(userId, `event-${Date.now()}`, "cover", cover.base64);
      }
      const ev = await create.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        eventType,
        genre,
        startsAt,
        endsAt: null,
        address: address.trim() || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees, 10) : null,
        coverPath,
      });
      router.replace({ pathname: "/(tabs)/social/event/[id]", params: { id: ev.id } });
    } catch (err) {
      Alert.alert("Couldn't create event", err instanceof Error ? err.message : "Something went wrong.");
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
          title="New event"
          right={
            <Pressable onPress={submit} hitSlop={8} disabled={submitting}>
              {submitting
                ? <ActivityIndicator color={colors.accent} />
                : <Text style={styles.create}>Create</Text>}
            </Pressable>
          }
        />
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.cover} onPress={pickCover}>
            {cover
              ? <Image source={{ uri: cover.uri }} style={styles.coverImg} />
              : <View style={styles.coverEmpty}>
                  <Ionicons name="image-outline" size={26} color={colors.textTertiary} />
                  <Text style={styles.coverText}>Add cover image (optional)</Text>
                </View>}
          </Pressable>

          <Field
            label="NAME"
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder="Edmonton Pokémon Trade Meetup"
            autoCapitalize="words"
          />

          <View>
            <Text style={styles.label}>TYPE</Text>
            <View style={styles.chips}>
              {TYPES.map((t) => {
                const active = eventType === t.key;
                return (
                  <Pressable
                    key={t.key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setEventType(t.key)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={styles.label}>GENRE (OPTIONAL)</Text>
            <View style={styles.chips}>
              {GENRES.map((g) => {
                const active = genre === g;
                return (
                  <Pressable
                    key={g}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setGenre(active ? null : g)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{g}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Field
            label="DATE"
            value={dateStr}
            onChangeText={setDateStr}
            error={dateError}
            placeholder="Jun 14 2026"
            autoCapitalize="words"
          />
          <Field
            label="TIME"
            value={timeStr}
            onChangeText={setTimeStr}
            placeholder="2:00 PM"
            autoCapitalize="characters"
          />
          <Field
            label="LOCATION / ADDRESS (OPTIONAL)"
            value={address}
            onChangeText={setAddress}
            placeholder="Whyte Ave Card Shop, Edmonton AB"
            autoCapitalize="words"
          />
          <Field
            label="DESCRIPTION (OPTIONAL)"
            value={description}
            onChangeText={setDescription}
            placeholder="What to expect…"
            multiline
          />
          <Field
            label="MAX ATTENDEES (OPTIONAL)"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            placeholder="e.g. 30"
            keyboardType="number-pad"
          />
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
  label: {
    fontSize: fontSize.xs, fontWeight: "700", letterSpacing: 1,
    color: colors.textTertiary, marginBottom: spacing.sm,
  },
  cover: {
    width: "100%", height: 130, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  coverImg: { width: "100%", height: "100%" },
  coverEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xs },
  coverText: { fontSize: fontSize.sm, color: colors.textTertiary },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  chipTextActive: { color: colors.accent, fontWeight: "700" },
});
