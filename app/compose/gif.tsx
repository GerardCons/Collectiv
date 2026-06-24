import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily, space } from "@/constants/theme";
import { GIF_TAGS, GRID_COLORS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Staggered tile heights for the masonry-ish grid.
const TILES = [
  { c: GRID_COLORS[1], h: 90 },
  { c: GRID_COLORS[3], h: 118 },
  { c: GRID_COLORS[4], h: 118 },
  { c: GRID_COLORS[2], h: 90 },
  { c: GRID_COLORS[0], h: 104 },
  { c: GRID_COLORS[5], h: 104 },
];

export default function GifPicker() {
  const { colors } = useTheme();
  const [tag, setTag] = useState(0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      {/* search header */}
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <View style={[styles.search, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="search" size={14} color={colors.fgTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.fgPrimary }]}
            defaultValue="nice pull"
            placeholder="Search GIFs"
            placeholderTextColor={colors.fgTertiary}
          />
          <Text style={[styles.gifTag, { color: colors.fgTertiary }]}>GIF</Text>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.cancel, { color: colors.fgSecondary }]}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags} style={styles.tagsRow}>
        {GIF_TAGS.map((t, i) => {
          const on = i === tag;
          return (
            <Pressable
              key={t}
              onPress={() => setTag(i)}
              style={[styles.tagChip, { backgroundColor: on ? colors.primary : colors.bgSurface, borderColor: on ? colors.primary : colors.borderDefault }]}
            >
              <Text style={[styles.tagText, { color: on ? "#fff" : colors.fgSecondary }]}>{t}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        <View style={styles.col}>
          {TILES.filter((_, i) => i % 2 === 0).map((t, i) => (
            <GifTile key={i} color={t.c} height={t.h} />
          ))}
        </View>
        <View style={styles.col}>
          {TILES.filter((_, i) => i % 2 === 1).map((t, i) => (
            <GifTile key={i} color={t.c} height={t.h} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function GifTile({ color, height }: { color: string; height: number }) {
  return (
    <View style={styles.tile}>
      <GradientThumb accent={color} width="100%" height={height} radius={10} />
      <View style={styles.gifLabel}>
        <Text style={styles.gifLabelText}>GIF</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: space.lg, paddingBottom: 12, borderBottomWidth: 1 },
  search: { flex: 1, flexDirection: "row", alignItems: "center", gap: 9, height: 40, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  searchInput: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  gifTag: { fontFamily: fontFamily.socialBold, fontSize: 10 },
  cancel: { fontFamily: fontFamily.socialSemibold, fontSize: 13 },

  tagsRow: { flexGrow: 0 },
  tags: { gap: 7, paddingHorizontal: space.lg, paddingVertical: 10 },
  tagChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  tagText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  grid: { flexDirection: "row", gap: 8, paddingHorizontal: space.lg, paddingBottom: space.lg },
  col: { flex: 1, gap: 8 },
  tile: { borderRadius: 10, overflow: "hidden" },
  gifLabel: { position: "absolute", bottom: 6, left: 6, backgroundColor: "rgba(14,13,12,0.55)", paddingHorizontal: 6, paddingVertical: 1.5, borderRadius: 4 },
  gifLabelText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8, color: "#fff" },
});
