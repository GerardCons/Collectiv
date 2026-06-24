import { ComposerBar } from "@/components/home/composer-bar";
import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { FEED_COLORS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ATTACH: { icon: keyof typeof Ionicons.glyphMap; route?: string }[] = [
  { icon: "image-outline", route: "/compose/photo" },
  { icon: "albums-outline", route: "/compose/showcase" },
  { icon: "film-outline", route: "/compose/gif" },
  { icon: "stats-chart-outline", route: "/compose/poll" },
  { icon: "location-outline" },
];

export default function NewPostScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <ComposerBar title="New Post" action={{ label: "Post", onPress: () => router.back() }} />

      <View style={styles.body}>
        <Avatar name="Jake" size={40} color={FEED_COLORS.coral} />
        <View style={styles.flex}>
          <TextInput
            style={[styles.input, { color: colors.fgPrimary }]}
            defaultValue="Mail day! Finally landed this Curry rookie"
            placeholder="Share a pickup or post an update…"
            placeholderTextColor={colors.fgTertiary}
            multiline
            autoFocus
          />
          <View style={styles.cards}>
            <GradientThumb accent={FEED_COLORS.coral} width={78} height={104} radius={10} />
            <View style={[styles.addCard, { borderColor: colors.borderDefault }]}>
              <Ionicons name="add" size={22} color={colors.fgTertiary} />
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.toolbar, { borderTopColor: colors.borderDefault }]}>
        {ATTACH.map((a, i) => (
          <Pressable key={i} hitSlop={6} onPress={() => a.route && router.push(a.route as never)}>
            <Ionicons name={a.icon} size={21} color={colors.primary} />
          </Pressable>
        ))}
        <Text style={[styles.toolbarNote, { color: colors.fgTertiary }]}>Showcasing 1 card</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  body: { flex: 1, flexDirection: "row", gap: 11, padding: space.lg },
  input: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, padding: 0, textAlignVertical: "top" },
  cards: { flexDirection: "row", gap: 8, marginTop: 14 },
  addCard: {
    width: 78,
    height: 104,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: { flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 18, paddingVertical: 14, borderTopWidth: 1 },
  toolbarNote: { marginLeft: "auto", fontFamily: fontFamily.body, fontSize: 11 },
});
