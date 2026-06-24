import { FlipCard } from "@/components/portfolio/flip-card";
import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily, radii, space } from "@/constants/theme";
import {
  CARD_TYPES,
  CONDITIONS,
  GENRES,
  GRADES,
  GRADING_COMPANIES,
  VISIBILITY_OPTIONS,
} from "@/lib/add-card-mock";
import { useAddCardDraft } from "@/lib/add-card-store";
import { pickImage } from "@/lib/image";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmScreen() {
  const { colors } = useTheme();
  const draft = useAddCardDraft();

  const [name, setName] = useState(draft.name);
  const [genre, setGenre] = useState(draft.genre);
  const [condition, setCondition] = useState(draft.condition);
  const [cardType, setCardType] = useState(draft.cardType);
  const [visibility, setVisibility] = useState(draft.visibility);
  const [graded, setGraded] = useState(draft.graded);
  const [company, setCompany] = useState(draft.gradingCompany);
  const [grade, setGrade] = useState(draft.grade);
  const [notes, setNotes] = useState(draft.notes);

  const ownPhoto = draft.frontUri != null;
  const fromSearchNoPhoto = draft.source === "search" && !ownPhoto;

  async function addPhoto(slot: "front" | "back") {
    try {
      const img = await pickImage("library");
      if (!img) return;
      useAddCardDraft.getState().patch(slot === "front" ? { frontUri: img.uri } : { backUri: img.uri });
    } catch (err) {
      Alert.alert("Photo", err instanceof Error ? err.message : "Couldn't add photo.");
    }
  }

  function save() {
    if (!name.trim()) {
      Alert.alert("Name required", "Give the card a name.");
      return;
    }
    useAddCardDraft.getState().patch({
      name: name.trim(),
      genre,
      condition,
      cardType,
      visibility,
      graded,
      gradingCompany: company,
      grade,
      notes: notes.trim(),
    });
    router.push("/add-card/added");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <View style={[styles.bar, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={[styles.backCircle, { backgroundColor: colors.bgSurface }]}>
          <Ionicons name="arrow-back" size={16} color={colors.fgPrimary} />
        </Pressable>
        <Text style={[styles.barTitle, { color: colors.fgPrimary }]}>Confirm Details</Text>
        <Pressable onPress={save} hitSlop={8}>
          <Text style={[styles.save, { color: colors.primary }]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Photo */}
        {fromSearchNoPhoto ? (
          <View style={styles.refWrap}>
            <View style={[styles.refCard, { borderColor: colors.warning }]}>
              <GradientThumb accent={draft.referenceAccent ?? colors.primary} width={104} height={146} radius={12} />
              <View style={[styles.refBadge, { backgroundColor: colors.warning }]}>
                <Text style={styles.refBadgeText}>🔍 REFERENCE PHOTO</Text>
              </View>
            </View>
            <Text style={[styles.refNote, { color: colors.fgTertiary }]}>Added via search · Not your actual card</Text>
            <Pressable
              style={[styles.ownPhotoBtn, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}
              onPress={() => addPhoto("front")}
            >
              <Ionicons name="camera" size={12} color={colors.primary} />
              <Text style={[styles.ownPhotoText, { color: colors.primary }]}>Add your own photo</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.ownWrap}>
            <FlipCard
              width={104}
              height={146}
              front={
                draft.frontUri ? (
                  <Image source={{ uri: draft.frontUri }} style={styles.fill} contentFit="cover" />
                ) : (
                  <GradientThumb accent={colors.primary} width="100%" height={146} radius={0} />
                )
              }
              back={draft.backUri ? <Image source={{ uri: draft.backUri }} style={styles.fill} contentFit="cover" /> : undefined}
            />
            {!draft.backUri ? (
              <Pressable style={[styles.addBack, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => addPhoto("back")}>
                <Ionicons name="add" size={22} color={colors.fgTertiary} />
                <Text style={[styles.addBackText, { color: colors.fgTertiary }]}>Add back</Text>
              </Pressable>
            ) : null}
          </View>
        )}

        {/* Card Name */}
        <Field label="CARD NAME">
          <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <TextInput
              style={[styles.inputText, { color: colors.fgPrimary }]}
              value={name}
              onChangeText={setName}
              placeholder="Card name"
              placeholderTextColor={colors.fgTertiary}
            />
            <Ionicons name="search" size={12} color={colors.fgTertiary} />
          </View>
        </Field>

        <Field label="GENRE">
          <ChipRow options={GENRES} value={genre} onChange={setGenre} />
        </Field>

        <Field label="CONDITION">
          <ChipRow options={CONDITIONS} value={condition} onChange={setCondition} />
        </Field>

        <Field label="CARD TYPE">
          <ChipRow options={CARD_TYPES} value={cardType} onChange={setCardType} />
        </Field>

        {/* Visibility */}
        <Field label="VISIBILITY">
          <View style={styles.visRow}>
            {VISIBILITY_OPTIONS.map((v) => {
              const on = visibility === v.value;
              return (
                <Pressable
                  key={v.value}
                  onPress={() => setVisibility(v.value)}
                  style={[styles.visChip, { borderColor: on ? colors.primary : colors.borderDefault, backgroundColor: on ? colors.primaryMuted : colors.bgSurface }]}
                >
                  <Text style={styles.visIcon}>{v.icon}</Text>
                  <Text style={[styles.visLabel, { color: on ? colors.primary : colors.fgSecondary }]}>{v.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.hint, { color: colors.fgTertiary }]}>Only you can see private cards.</Text>
        </Field>

        {/* Graded toggle */}
        <View style={[styles.gradedRow, { borderTopColor: colors.borderDefault }]}>
          <View style={styles.flex}>
            <Text style={[styles.gradedTitle, { color: colors.fgPrimary }]}>Graded Card?</Text>
            <Text style={[styles.hint, { color: colors.fgTertiary }]}>PSA, BGS, CGC, SGC, etc.</Text>
          </View>
          <Switch
            value={graded}
            onValueChange={setGraded}
            trackColor={{ false: colors.bgSurface, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {graded ? (
          <View style={[styles.gradeBox, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Field label="GRADING COMPANY">
              <View style={styles.companyRow}>
                {GRADING_COMPANIES.map((co) => {
                  const on = company === co;
                  return (
                    <Pressable
                      key={co}
                      onPress={() => setCompany(co)}
                      style={[styles.companyChip, { backgroundColor: on ? colors.primary : colors.bgBase, borderColor: on ? colors.primary : colors.borderDefault }]}
                    >
                      <Text style={[styles.companyText, { color: on ? "#fff" : colors.fgSecondary }]}>{co}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Field>
            <Field label="GRADE">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradeChips}>
                {GRADES.map((g) => {
                  const on = grade === g;
                  return (
                    <Pressable
                      key={g}
                      onPress={() => setGrade(g)}
                      style={[styles.gradeChip, { backgroundColor: on ? colors.primaryMuted : colors.bgBase, borderColor: on ? colors.primary : colors.borderDefault }]}
                    >
                      <Text style={[styles.gradeText, { color: on ? colors.primary : colors.fgSecondary }]}>{g}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Field>
          </View>
        ) : (
          <Field label="NOTES (OPTIONAL)">
            <View style={[styles.input, styles.notesInput, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <TextInput
                style={[styles.inputText, { color: colors.fgPrimary, height: 44 }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Pulled from a 1st-ed booster…"
                placeholderTextColor={colors.fgTertiary}
                multiline
              />
            </View>
          </Field>
        )}

        <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={save}>
          <Text style={styles.saveBtnText}>Save Card</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.fgTertiary }]}>{label}</Text>
      {children}
    </View>
  );
}

function ChipRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const on = value === o;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={[styles.chip, { backgroundColor: on ? colors.primaryMuted : colors.bgSurface, borderColor: on ? colors.primary : colors.borderDefault }]}
          >
            <Text style={[styles.chipText, { color: on ? colors.primary : colors.fgSecondary }]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  fill: { width: "100%", height: "100%" },
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingTop: 4, paddingBottom: 10, borderBottomWidth: 1 },
  backCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  barTitle: { fontFamily: fontFamily.socialBold, fontSize: 15 },
  save: { fontFamily: fontFamily.socialBold, fontSize: 14 },

  body: { padding: space.lg, gap: 12 },

  refWrap: { alignItems: "center", marginBottom: 4 },
  refCard: { borderRadius: 14, padding: 2, borderWidth: 2, marginBottom: 14 },
  refBadge: { position: "absolute", bottom: -10, alignSelf: "center", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  refBadgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, color: "#fff", letterSpacing: 0.5 },
  refNote: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 4 },
  ownPhotoBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1, marginTop: 7 },
  ownPhotoText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  ownWrap: { flexDirection: "row", gap: 14, justifyContent: "center", marginBottom: 4 },
  addBack: { width: 104, height: 146, borderRadius: 12, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 5 },
  addBackText: { fontFamily: fontFamily.bodySemibold, fontSize: 10 },

  field: { gap: 6 },
  label: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" },
  input: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radii.md, borderWidth: 1 },
  inputText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  notesInput: { alignItems: "flex-start" },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  chipText: { fontFamily: fontFamily.socialSemibold, fontSize: 10 },

  visRow: { flexDirection: "row", gap: 8 },
  visChip: { flex: 1, alignItems: "center", gap: 2, paddingVertical: 9, borderRadius: 999, borderWidth: 1.5 },
  visIcon: { fontSize: 14 },
  visLabel: { fontFamily: fontFamily.socialBold, fontSize: 9 },
  hint: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 3 },

  gradedRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, paddingTop: 10, marginTop: 2 },
  gradedTitle: { fontFamily: fontFamily.socialSemibold, fontSize: 13 },
  gradeBox: { gap: 12, padding: 12, borderRadius: radii.lg, borderWidth: 1 },
  companyRow: { flexDirection: "row", gap: 6 },
  companyChip: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  companyText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  gradeChips: { gap: 6, paddingVertical: 1 },
  gradeChip: { minWidth: 44, alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1 },
  gradeText: { fontFamily: fontFamily.socialBold, fontSize: 13 },

  saveBtn: { paddingVertical: 14, borderRadius: 999, alignItems: "center", marginTop: 6 },
  saveBtnText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
