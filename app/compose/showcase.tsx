import { ComposerBar } from "@/components/home/composer-bar";
import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily, space } from "@/constants/theme";
import { GRID_COLORS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CARDS = [...GRID_COLORS, ...GRID_COLORS.slice(0, 3)];

export default function ShowcaseComposer() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <ComposerBar title="Showcase a Card" action={{ label: "Next", onPress: () => router.back() }} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: colors.fgPrimary }]}>Pick from your collection</Text>
        <View style={styles.grid}>
          {CARDS.map((c, i) => {
            const on = i === selected;
            return (
              <Pressable key={i} style={styles.cell} onPress={() => setSelected(i)}>
                <View style={[styles.cardWrap, on && { borderColor: colors.primary, borderWidth: 2.5 }, !on && { borderColor: colors.borderDefault, borderWidth: 1 }]}>
                  <GradientThumb accent={c} width="100%" height={112} radius={9} />
                </View>
                {on ? (
                  <View style={[styles.check, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.caption, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Text style={[styles.captionLabel, { color: colors.fgTertiary }]}>CAPTION</Text>
          <TextInput
            style={[styles.captionInput, { color: colors.fgPrimary }]}
            defaultValue="New grail added ⭐ Not for sale"
            placeholder="Say something about this card…"
            placeholderTextColor={colors.fgTertiary}
            multiline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: space.lg },
  label: { fontFamily: fontFamily.socialBold, fontSize: 12.5, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cell: { width: "31%", flexGrow: 1, position: "relative" },
  cardWrap: { borderRadius: 11, overflow: "hidden" },
  check: { position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  caption: { marginTop: 16, padding: 14, borderRadius: 14, borderWidth: 1 },
  captionLabel: { fontFamily: fontFamily.bodyBold, fontSize: 11, letterSpacing: 0.4, marginBottom: 6 },
  captionInput: { fontFamily: fontFamily.body, fontSize: 13, padding: 0, minHeight: 20 },
});
