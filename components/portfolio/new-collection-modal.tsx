import { Field } from "@/components/form/field";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useCreateCollection } from "@/hooks/use-collections";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GENRES = ["Pokémon", "Sports", "One Piece", "Yu-Gi-Oh!", "Other"];

/**
 * Screen 10 — New collection. Presented as a slide-up modal from the switch
 * sheet's "New collection" action. On create, the new collection becomes active.
 */
export function NewCollectionModal({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const createCollection = useCreateCollection();
  const [name, setName] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string>();

  function reset() {
    setName("");
    setGenre(null);
    setDescription("");
    setError(undefined);
  }

  function cancel() {
    reset();
    onClose();
  }

  async function create() {
    if (!name.trim()) {
      setError("Name your collection.");
      return;
    }
    setError(undefined);
    try {
      const row = await createCollection.mutateAsync({
        name: name.trim(),
        genre,
        description: description.trim() || null,
      });
      reset();
      onCreated(row.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Couldn't create the collection.";
      Alert.alert("Create failed", message);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={cancel}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Header
            leftText="Cancel"
            onBack={cancel}
            title="New collection"
            right={
              <Pressable
                onPress={create}
                hitSlop={8}
                disabled={createCollection.isPending}
              >
                {createCollection.isPending ? (
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
            <Field
              label="NAME"
              value={name}
              onChangeText={setName}
              error={error}
              placeholder="Vintage WOTC"
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
                      <Text
                        style={[styles.chipText, active && styles.chipTextActive]}
                      >
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
              placeholder="What goes in this collection?"
              multiline
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  create: { fontSize: fontSize.md, fontWeight: "700", color: colors.accent },
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
});
