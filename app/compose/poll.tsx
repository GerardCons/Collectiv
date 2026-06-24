import { ComposerBar } from "@/components/home/composer-bar";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, shadows, space } from "@/constants/theme";
import { FEED_COLORS, POLL_LENGTHS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PollComposer() {
  const { colors } = useTheme();
  const [options, setOptions] = useState(["Hold 💎", "Flip 💰"]);
  const [length, setLength] = useState(1);

  function setOption(i: number, v: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? v : o)));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <ComposerBar title="Create Poll" action={{ label: "Post", onPress: () => router.back() }} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.question}>
          <Avatar name="Jake" size={40} color={FEED_COLORS.coral} />
          <TextInput
            style={[styles.questionInput, { color: colors.fgPrimary }]}
            defaultValue="Hold or flip this Mahomes?"
            placeholder="Ask a question…"
            placeholderTextColor={colors.fgTertiary}
            multiline
          />
        </View>

        <Text style={[styles.label, { color: colors.fgTertiary }]}>OPTIONS</Text>
        <View style={styles.options}>
          {options.map((o, i) => (
            <View key={i} style={[styles.option, { backgroundColor: colors.bgBase, borderColor: colors.primary }, shadows.sm]}>
              <TextInput
                style={[styles.optionInput, { color: colors.fgPrimary }]}
                value={o}
                onChangeText={(v) => setOption(i, v)}
              />
              <Ionicons name="close" size={14} color={colors.fgTertiary} />
            </View>
          ))}
          <Pressable
            style={[styles.addOption, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
            onPress={() => setOptions((p) => [...p, ""])}
          >
            <Ionicons name="add" size={16} color={colors.fgTertiary} />
            <Text style={[styles.addText, { color: colors.fgTertiary }]}>Add option</Text>
          </Pressable>
        </View>

        <Text style={[styles.label, { color: colors.fgTertiary, marginTop: 18 }]}>POLL LENGTH</Text>
        <View style={styles.lengths}>
          {POLL_LENGTHS.map((d, i) => {
            const on = i === length;
            return (
              <Pressable
                key={d}
                onPress={() => setLength(i)}
                style={[
                  styles.lengthChip,
                  { borderColor: on ? colors.primary : colors.borderDefault, backgroundColor: on ? colors.primaryMuted : colors.bgSurface },
                ]}
              >
                <Text style={[styles.lengthText, { color: on ? colors.primary : colors.fgSecondary }]}>{d}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: space.lg },
  question: { flexDirection: "row", gap: 11, marginBottom: 16 },
  questionInput: { flex: 1, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 20, paddingTop: 8, padding: 0, textAlignVertical: "top" },
  label: { fontFamily: fontFamily.bodyBold, fontSize: 11, letterSpacing: 0.4, marginBottom: 8 },
  options: { gap: 9 },
  option: { flexDirection: "row", alignItems: "center", gap: 10, height: 46, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5 },
  optionInput: { flex: 1, fontFamily: fontFamily.bodySemibold, fontSize: 13.5, padding: 0 },
  addOption: { flexDirection: "row", alignItems: "center", gap: 10, height: 46, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderStyle: "dashed" },
  addText: { fontFamily: fontFamily.bodySemibold, fontSize: 13 },
  lengths: { flexDirection: "row", gap: 8 },
  lengthChip: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  lengthText: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
});
