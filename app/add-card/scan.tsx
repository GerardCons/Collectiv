import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useAddCardDraft } from "@/lib/add-card-store";
import { ImageSource, pickImage } from "@/lib/image";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const { colors } = useTheme();
  const draft = useAddCardDraft();

  // Fresh draft each time the flow opens.
  useEffect(() => {
    useAddCardDraft.getState().reset();
  }, []);

  async function capture(slot: "front" | "back", source: ImageSource) {
    try {
      const img = await pickImage(source);
      if (!img) return;
      useAddCardDraft.getState().patch(slot === "front" ? { frontUri: img.uri } : { backUri: img.uri });
    } catch (err) {
      Alert.alert("Photo", err instanceof Error ? err.message : "Couldn't add photo.");
    }
  }

  function next() {
    if (!draft.frontUri) return;
    useAddCardDraft.getState().patch({ source: "camera" });
    router.push("/add-card/confirm");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <View style={[styles.bar, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.side}>
          <Text style={[styles.cancel, { color: colors.fgSecondary }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.barTitle, { color: colors.fgPrimary }]}>Add Card</Text>
        <Pressable onPress={next} hitSlop={8} style={[styles.side, styles.right]} disabled={!draft.frontUri}>
          <Text style={[styles.nextText, { color: draft.frontUri ? colors.primary : colors.fgTertiary }]}>Next</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View>
          <Text style={[styles.heading, { color: colors.fgPrimary }]}>Upload Your Card</Text>
          <Text style={[styles.sub, { color: colors.fgSecondary }]}>
            Scan with your camera or pick from your gallery — front required, back optional.
          </Text>
        </View>

        <View style={styles.slots}>
          <CaptureSlot
            label="Front (required)"
            required
            uri={draft.frontUri}
            onCapture={() => capture("front", "camera")}
            onLibrary={() => capture("front", "library")}
          />
          <CaptureSlot
            label="Back (optional)"
            uri={draft.backUri}
            onCapture={() => capture("back", "camera")}
            onLibrary={() => capture("back", "library")}
          />
        </View>

        <View style={styles.orRow}>
          <View style={[styles.line, { backgroundColor: colors.borderDefault }]} />
          <Text style={[styles.or, { color: colors.fgTertiary }]}>or</Text>
          <View style={[styles.line, { backgroundColor: colors.borderDefault }]} />
        </View>

        <Pressable
          style={[styles.searchBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
          onPress={() => router.push("/add-card/search")}
        >
          <Ionicons name="search" size={15} color={colors.primary} />
          <Text style={[styles.searchText, { color: colors.primary }]}>Search by Name or Set</Text>
          <Ionicons name="arrow-forward" size={15} color={colors.primary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function CaptureSlot({
  label,
  required,
  uri,
  onCapture,
  onLibrary,
}: {
  label: string;
  required?: boolean;
  uri: string | null;
  onCapture: () => void;
  onLibrary: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.slotWrap}>
      <Pressable
        onPress={onCapture}
        style={[
          styles.slot,
          required
            ? { borderColor: colors.primary, backgroundColor: colors.primaryMuted }
            : { borderColor: colors.borderDefault, backgroundColor: colors.bgSurface },
        ]}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.slotImg} contentFit="cover" />
        ) : (
          <View style={styles.slotEmpty}>
            <View
              style={[
                styles.camCircle,
                required
                  ? { borderColor: colors.primary, backgroundColor: colors.primaryMuted }
                  : { borderColor: colors.borderDefault, backgroundColor: colors.bgSurface, opacity: 0.5 },
              ]}
            >
              <Ionicons name="camera" size={20} color={required ? colors.primary : colors.fgTertiary} />
            </View>
            <Text style={[styles.tapText, { color: required ? colors.primary : colors.fgSecondary }]}>Tap to capture</Text>
            <Text style={[styles.slotLabel, { color: required ? colors.primary : colors.fgTertiary }]}>{label}</Text>
          </View>
        )}
      </Pressable>
      <Pressable onPress={onLibrary} hitSlop={6}>
        <Text style={[styles.libraryLink, { color: required ? colors.primary : colors.fgSecondary }]}>
          {uri ? "Replace from library" : "Choose from library"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingBottom: 12, paddingTop: 4, borderBottomWidth: 1 },
  side: { minWidth: 56 },
  right: { alignItems: "flex-end" },
  cancel: { fontFamily: fontFamily.socialSemibold, fontSize: 14 },
  barTitle: { fontFamily: fontFamily.socialBold, fontSize: 15 },
  nextText: { fontFamily: fontFamily.socialBold, fontSize: 14 },

  body: { flex: 1, padding: space.lg, gap: 16 },
  heading: { fontFamily: fontFamily.socialBold, fontSize: 22, marginBottom: 4 },
  sub: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19 },

  slots: { flexDirection: "row", gap: 14 },
  slotWrap: { flex: 1, alignItems: "center", gap: 8 },
  slot: { width: "100%", aspectRatio: 3 / 4, borderRadius: radii.lg, borderWidth: 2, borderStyle: "dashed", overflow: "hidden" },
  slotImg: { width: "100%", height: "100%" },
  slotEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  camCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  tapText: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  slotLabel: { fontFamily: fontFamily.body, fontSize: 10 },
  libraryLink: { fontFamily: fontFamily.socialSemibold, fontSize: 11 },

  orRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  line: { flex: 1, height: 1 },
  or: { fontFamily: fontFamily.body, fontSize: fontSizes.xs },

  searchBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: radii.full, borderWidth: 1 },
  searchText: { fontFamily: fontFamily.socialBold, fontSize: 14 },
});
