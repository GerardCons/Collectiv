import { ComposerBar } from "@/components/home/composer-bar";
import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { FEED_COLORS, GRID_COLORS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOOL_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  "image-outline",
  "albums-outline",
  "film-outline",
  "stats-chart-outline",
  "location-outline",
];

export default function PhotoComposer() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <ComposerBar title="New Post" action={{ label: "Post", onPress: () => router.back() }} />

      <View style={styles.flex}>
        <View style={styles.body}>
          <Avatar name="Jake" size={40} color={FEED_COLORS.coral} />
          <View style={styles.flex}>
            <TextInput
              style={[styles.input, { color: colors.fgPrimary }]}
              defaultValue="Mail day haul 📬"
              placeholderTextColor={colors.fgTertiary}
              multiline
            />
            <View style={styles.photoGrid}>
              {[FEED_COLORS.green, FEED_COLORS.amber].map((c, i) => (
                <View key={i} style={styles.photoCell}>
                  <GradientThumb accent={c} width="100%" height={128} radius={0} />
                  <View style={styles.removeBtn}>
                    <Ionicons name="close" size={11} color="#fff" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottom}>
          {/* gallery strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
            <View style={[styles.cameraTile, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Ionicons name="camera" size={18} color={colors.primary} />
              <Text style={[styles.cameraText, { color: colors.primary }]}>Camera</Text>
            </View>
            {GRID_COLORS.map((c, i) => (
              <View key={i} style={[styles.galleryTile, i < 2 && { borderWidth: 2, borderColor: colors.primary }]}>
                <GradientThumb accent={c} width={64} height={64} radius={10} />
                {i < 2 ? (
                  <View style={[styles.pickNum, { backgroundColor: colors.primary }]}>
                    <Text style={styles.pickNumText}>{i + 1}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.toolbar, { borderTopColor: colors.borderDefault }]}>
            {TOOL_ICONS.map((icon, i) => (
              <Ionicons key={i} name={icon} size={21} color={colors.primary} />
            ))}
            <Text style={[styles.toolbarNote, { color: colors.fgTertiary }]}>2 photos</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  body: { flexDirection: "row", gap: 11, padding: space.lg },
  input: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, padding: 0, textAlignVertical: "top" },
  photoGrid: { flexDirection: "row", gap: 6, marginTop: 12, borderRadius: 12, overflow: "hidden" },
  photoCell: { flex: 1, position: "relative" },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(14,13,12,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: { marginTop: "auto" },
  strip: { gap: 6, paddingHorizontal: space.lg, paddingVertical: 10 },
  cameraTile: { width: 64, height: 64, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  cameraText: { fontFamily: fontFamily.socialBold, fontSize: 8 },
  galleryTile: { width: 64, height: 64, borderRadius: 10, overflow: "hidden", position: "relative" },
  pickNum: { position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  pickNumText: { fontFamily: fontFamily.socialExtrabold, fontSize: 9, color: "#fff" },
  toolbar: { flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 18, paddingVertical: 14, borderTopWidth: 1 },
  toolbarNote: { marginLeft: "auto", fontFamily: fontFamily.body, fontSize: 11 },
});
