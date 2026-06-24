import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOOLS: (keyof typeof Ionicons.glyphMap)[] = ["image-outline", "albums-outline", "film-outline", "stats-chart-outline", "location-outline"];

export default function CreatePost() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <View style={[styles.bar, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.cancel, { color: colors.fgSecondary }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.barTitle, { color: colors.fgPrimary }]}>Create Post</Text>
        <Pressable onPress={() => router.back()} style={[styles.post, { backgroundColor: colors.secondary }]}>
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {/* Post-to selector */}
        <View style={styles.posterRow}>
          <Avatar name="Jake" size={40} color="#E76F51" />
          <View style={styles.flex}>
            <Text style={[styles.name, { color: colors.fgPrimary }]}>Jake Morrison</Text>
            <Pressable style={[styles.groupChip, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
              <Text style={styles.groupGlyph}>👥</Text>
              <Text style={[styles.groupName, { color: colors.secondary }]}>Edmonton Card Collectors</Text>
              <Ionicons name="chevron-down" size={9} color={colors.secondary} />
            </Pressable>
          </View>
        </View>

        <TextInput
          style={[styles.input, { color: colors.fgPrimary }]}
          defaultValue="Mail day! Finally landed this Curry rookie for the PC"
          placeholder="Share something with the group…"
          placeholderTextColor={colors.fgTertiary}
          multiline
          autoFocus
        />

        <View style={styles.cards}>
          <GradientThumb accent="#E76F51" width={80} height={108} radius={10} />
          <View style={[styles.addCard, { borderColor: colors.borderDefault }]}>
            <Ionicons name="add" size={24} color={colors.fgTertiary} />
          </View>
        </View>
      </View>

      <View style={[styles.toolbar, { borderTopColor: colors.borderDefault }]}>
        {TOOLS.map((t, i) => (
          <Ionicons key={i} name={t} size={19} color={colors.secondary} />
        ))}
        <Text style={[styles.toolNote, { color: colors.fgTertiary }]}>Showcasing 1 card</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingBottom: 12, paddingTop: 2, borderBottomWidth: 1 },
  cancel: { fontFamily: fontFamily.socialSemibold, fontSize: 13 },
  barTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 15 },
  post: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999 },
  postText: { fontFamily: fontFamily.socialBold, fontSize: 12.5, color: "#fff" },

  body: { flex: 1, padding: space.lg },
  posterRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  groupChip: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  groupGlyph: { fontSize: 10 },
  groupName: { fontFamily: fontFamily.socialBold, fontSize: 10.5 },
  input: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, padding: 0, textAlignVertical: "top" },
  cards: { flexDirection: "row", gap: 8, marginTop: 16 },
  addCard: { width: 80, height: 108, borderRadius: 10, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  toolbar: { flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 18, paddingVertical: 14, borderTopWidth: 1 },
  toolNote: { marginLeft: "auto", fontFamily: fontFamily.body, fontSize: 11 },
});
