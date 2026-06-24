import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { EVENT_TYPES, GROUP_GENRES } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateEvent() {
  const { colors } = useTheme();
  const [title, setTitle] = useState("Summer Trade Night");
  const [type, setType] = useState("Meetup");
  const [genres, setGenres] = useState<string[]>(["Any/All", "Sports"]);
  const [cohosts, setCohosts] = useState([{ name: "Marcus Chen", handle: "mchen_cards", color: "#2563eb" }]);

  function toggleGenre(g: string) {
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <View style={[styles.nav, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.navSide}>
          <Ionicons name="close" size={22} color={colors.fgPrimary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.fgPrimary }]}>Create Event</Text>
        <Pressable onPress={() => router.back()} hitSlop={8} style={[styles.navSide, styles.navRight]}>
          <Text style={[styles.navAction, { color: colors.secondary }]}>Publish</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={[styles.cover, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
          <Text style={{ fontSize: 20 }}>🖼</Text>
          <Text style={[styles.coverText, { color: colors.secondary }]}>Add cover image</Text>
        </View>

        <Field label="EVENT TITLE" hint="Required">
          <View style={[styles.input, { backgroundColor: colors.bgBase, borderColor: colors.secondary }]}>
            <TextInput style={[styles.inputText, { color: colors.fgPrimary, flex: 1 }]} value={title} onChangeText={setTitle} />
          </View>
        </Field>

        <View style={styles.rowFields}>
          <View style={styles.flex}>
            <Field label="DATE">
              <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
                <Text style={[styles.inputText, { color: colors.fgPrimary, flex: 1 }]}>Jul 18, 2026</Text>
                <Text style={{ fontSize: 12 }}>📅</Text>
              </View>
            </Field>
          </View>
          <View style={styles.flex}>
            <Field label="TYPE">
              <Pressable
                style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
                onPress={() => {
                  const i = EVENT_TYPES.indexOf(type);
                  setType(EVENT_TYPES[(i + 1) % EVENT_TYPES.length]);
                }}
              >
                <Text style={[styles.inputText, { color: colors.fgPrimary, flex: 1 }]}>{type}</Text>
                <Ionicons name="chevron-down" size={12} color={colors.fgTertiary} />
              </Pressable>
            </Field>
          </View>
        </View>

        <Field label="SCHEDULE">
          <View style={styles.schedule}>
            <View style={[styles.timeBox, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <View>
                <Text style={[styles.timeLabel, { color: colors.fgTertiary }]}>START</Text>
                <Text style={[styles.timeVal, { color: colors.fgPrimary }]}>8:00 AM</Text>
              </View>
              <Text style={{ fontSize: 13 }}>🕐</Text>
            </View>
            <Text style={[styles.dash, { color: colors.fgTertiary }]}>–</Text>
            <View style={[styles.timeBox, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <View>
                <Text style={[styles.timeLabel, { color: colors.fgTertiary }]}>END</Text>
                <Text style={[styles.timeVal, { color: colors.fgPrimary }]}>5:00 PM</Text>
              </View>
              <Text style={{ fontSize: 13 }}>🕔</Text>
            </View>
          </View>
        </Field>

        <Field label="PREFERRED GENRE" hint="Who it's for">
          <View style={styles.chips}>
            {GROUP_GENRES.map((g) => {
              const on = genres.includes(g);
              return (
                <Pressable
                  key={g}
                  onPress={() => toggleGenre(g)}
                  style={[styles.chip, { backgroundColor: on ? colors.secondary : colors.bgSurface, borderColor: on ? colors.secondary : colors.borderDefault }]}
                >
                  <Text style={[styles.chipText, { color: on ? "#fff" : colors.fgSecondary }]}>{g}</Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="LOCATION">
          <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Text style={{ fontSize: 13 }}>📍</Text>
            <Text style={[styles.inputText, { color: colors.fgPrimary, flex: 1 }]}>Sherwood Park Mall, AB</Text>
          </View>
        </Field>

        {/* Co-hosts */}
        <Field label="CO-HOSTS" hint="Optional">
          <Text style={[styles.cohostHint, { color: colors.fgTertiary }]}>
            Co-hosts can edit the event and invite people. You can only add people you follow each other with.
          </Text>
          <View style={[styles.cohostRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Avatar name="Jake" size={34} color="#E76F51" />
            <View style={styles.flex}>
              <Text style={[styles.cohostName, { color: colors.fgPrimary }]}>You · @jakescollects</Text>
              <Text style={[styles.ownerTag, { color: colors.secondary }]}>Owner</Text>
            </View>
          </View>
          {cohosts.map((c) => (
            <View key={c.handle} style={[styles.cohostRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Avatar name={c.name} size={34} color={c.color} />
              <View style={styles.flex}>
                <Text style={[styles.cohostName, { color: colors.fgPrimary }]}>{c.name}</Text>
                <Text style={[styles.cohostTag, { color: colors.fgTertiary }]}>Co-host · @{c.handle}</Text>
              </View>
              <Pressable onPress={() => setCohosts((prev) => prev.filter((x) => x.handle !== c.handle))} hitSlop={8}>
                <Ionicons name="close" size={16} color={colors.fgTertiary} />
              </Pressable>
            </View>
          ))}
          <Pressable style={[styles.addCohost, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => Alert.alert("Add a co-host", "Search people you follow each other with.")}>
            <View style={[styles.addCohostIcon, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
              <Ionicons name="person-add-outline" size={15} color={colors.secondary} />
            </View>
            <View style={styles.flex}>
              <Text style={[styles.cohostName, { color: colors.fgPrimary }]}>Add a co-host</Text>
              <Text style={[styles.cohostTag, { color: colors.fgTertiary }]}>Search people you follow each other with</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
          </Pressable>
        </Field>

        <Field label="DETAILS" hint="Optional">
          <View style={[styles.textarea, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <TextInput
              style={[styles.inputText, { color: colors.fgSecondary, minHeight: 54 }]}
              defaultValue="Bring your trade binders! Tables provided. Buy, sell, and trade sports cards with local collectors — all grades welcome."
              multiline
            />
          </View>
        </Field>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.borderDefault }]}>
        <Pressable style={[styles.cta, { backgroundColor: colors.secondary }]} onPress={() => router.back()}>
          <Text style={styles.ctaText}>Publish Event</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.fgTertiary }]}>{label}</Text>
        {hint ? <Text style={[styles.labelHint, { color: colors.fgTertiary }]}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  nav: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingBottom: 12, paddingTop: 2, borderBottomWidth: 1 },
  navSide: { width: 56 },
  navRight: { alignItems: "flex-end" },
  navTitle: { flex: 1, textAlign: "center", fontFamily: fontFamily.socialExtrabold, fontSize: 15 },
  navAction: { fontFamily: fontFamily.socialBold, fontSize: 13 },

  body: { padding: space.lg, gap: 16 },
  cover: { height: 96, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 4 },
  coverText: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },

  labelRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 },
  label: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" },
  labelHint: { fontFamily: fontFamily.body, fontSize: 9.5 },
  input: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5 },
  inputText: { fontFamily: fontFamily.bodySemibold, fontSize: 13, padding: 0 },
  textarea: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, borderWidth: 1 },
  rowFields: { flexDirection: "row", gap: 10 },

  schedule: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeBox: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, borderWidth: 1 },
  timeLabel: { fontFamily: fontFamily.bodyBold, fontSize: 8, letterSpacing: 0.4, textTransform: "uppercase" },
  timeVal: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  dash: { fontFamily: fontFamily.socialBold, fontSize: 13 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  chipText: { fontFamily: fontFamily.socialSemibold, fontSize: 10.5 },

  cohostHint: { fontFamily: fontFamily.body, fontSize: 10, marginTop: -2, marginBottom: 8, lineHeight: 14 },
  cohostRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 9, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  cohostName: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  cohostTag: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  ownerTag: { fontFamily: fontFamily.socialSemibold, fontSize: 10, marginTop: 1 },
  addCohost: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderStyle: "dashed" },
  addCohostIcon: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },

  footer: { padding: space.lg, paddingBottom: 24, borderTopWidth: 1 },
  cta: { paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  ctaText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
