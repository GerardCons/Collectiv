import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { COLLECTION_COLORS } from "@/lib/portfolio-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

/** New collection form (COL_Form) — name, color, visibility. */
export function NewCollectionSheet({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string, visibility: "private" | "public") => void;
}) {
  const { colors } = useTheme();
  const [name, setName] = useState("Vintage Pokémon");
  const [colorIndex, setColorIndex] = useState(0);
  const [visibility, setVisibility] = useState<"private" | "public">("private");

  function create() {
    onCreate(name.trim() || "New Collection", COLLECTION_COLORS[colorIndex], visibility);
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} title="New Collection">
      <Text style={[styles.label, { color: colors.fgTertiary }]}>COLLECTION NAME</Text>
      <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.primary }]}>
        <TextInput
          style={[styles.inputText, { color: colors.fgPrimary }]}
          value={name}
          onChangeText={setName}
          placeholder="Name your collection"
          placeholderTextColor={colors.fgTertiary}
        />
        {name ? (
          <Pressable onPress={() => setName("")} hitSlop={8}>
            <Ionicons name="close" size={14} color={colors.fgTertiary} />
          </Pressable>
        ) : null}
      </View>

      <Text style={[styles.label, { color: colors.fgTertiary, marginTop: space.lg }]}>COLOR</Text>
      <View style={styles.swatches}>
        {COLLECTION_COLORS.map((c, i) => (
          <Pressable
            key={c}
            onPress={() => setColorIndex(i)}
            style={[
              styles.swatch,
              { backgroundColor: c },
              i === colorIndex && { borderWidth: 3, borderColor: colors.fgPrimary },
            ]}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: colors.fgTertiary, marginTop: space.lg }]}>VISIBILITY</Text>
      <View style={styles.visRow}>
        {([["private", "🔒", "Private"], ["public", "🌐", "Public"]] as const).map(([v, icon, lbl]) => {
          const on = visibility === v;
          return (
            <Pressable
              key={v}
              onPress={() => setVisibility(v)}
              style={[styles.visChip, { borderColor: on ? colors.primary : colors.borderDefault, backgroundColor: on ? colors.primaryMuted : colors.bgSurface }]}
            >
              <Text style={styles.visIcon}>{icon}</Text>
              <Text style={[styles.visText, { color: on ? colors.primary : colors.fgSecondary }]}>{lbl}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button title="Create Collection" onPress={create} style={{ marginTop: space.xl }} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.xs, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 },
  input: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 11, borderRadius: radii.full, borderWidth: 1.5 },
  inputText: { flex: 1, fontFamily: fontFamily.bodySemibold, fontSize: 13, padding: 0 },
  swatches: { flexDirection: "row", gap: 10 },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  visRow: { flexDirection: "row", gap: 8 },
  visChip: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: radii.full, borderWidth: 1.5 },
  visIcon: { fontSize: 14 },
  visText: { fontFamily: fontFamily.socialBold, fontSize: 12 },
});
