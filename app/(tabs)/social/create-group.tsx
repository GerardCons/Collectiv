import { fontFamily, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateGroup() {
  const { colors } = useTheme();
  const [name, setName] = useState("Edmonton Rookie Card Investors");
  const [about, setAbout] = useState(
    "A community for serious rookie-card investors in the Edmonton area — share pickups, grade talk, and trade locally.",
  );
  const [privacy, setPrivacy] = useState<"public" | "private">("public");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top", "bottom"]}>
      <View style={[styles.nav, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.navSide}>
          <Ionicons name="close" size={22} color={colors.fgPrimary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.fgPrimary }]}>Create Group</Text>
        <Pressable onPress={() => router.back()} hitSlop={8} style={[styles.navSide, styles.navRight]}>
          <Text style={[styles.navAction, { color: colors.secondary }]}>Create</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={[styles.cover, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
          <Text style={{ fontSize: 20 }}>🖼</Text>
          <Text style={[styles.coverText, { color: colors.secondary }]}>Add cover photo</Text>
        </View>

        {/* Icon + name */}
        <View style={styles.iconNameRow}>
          <View style={[styles.iconTile, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
            <Text style={{ fontSize: 20 }}>📷</Text>
          </View>
          <View style={styles.flex}>
            <Label text="GROUP NAME" hint="Required" />
            <View style={[styles.input, { backgroundColor: colors.bgBase, borderColor: colors.secondary }]}>
              <TextInput style={[styles.inputText, { color: colors.fgPrimary }]} value={name} onChangeText={setName} />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.field}>
          <Label text="ABOUT THIS GROUP" hint={`${about.length}/250`} />
          <View style={[styles.textarea, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <TextInput
              style={[styles.inputText, { color: colors.fgSecondary, minHeight: 54 }]}
              value={about}
              onChangeText={(t) => setAbout(t.slice(0, 250))}
              multiline
            />
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.field}>
          <Label text="PRIVACY" />
          {([["public", "🌐", "Public", "Anyone can see who's in the group and what they post."], ["private", "🔒", "Private", "Only members can see who's in the group and what they post."]] as const).map(([v, icon, label, sub]) => {
            const on = privacy === v;
            return (
              <Pressable
                key={v}
                onPress={() => setPrivacy(v)}
                style={[styles.privacyRow, { backgroundColor: on ? colors.secondaryMuted : colors.bgSurface, borderColor: on ? colors.secondary : colors.borderDefault }]}
              >
                <Text style={{ fontSize: 17 }}>{icon}</Text>
                <View style={styles.flex}>
                  <Text style={[styles.privacyLabel, { color: on ? colors.secondary : colors.fgPrimary }]}>{label}</Text>
                  <Text style={[styles.privacySub, { color: colors.fgTertiary }]}>{sub}</Text>
                </View>
                <View style={[styles.radio, { borderColor: on ? colors.secondary : colors.borderDefault }]}>
                  {on ? <View style={[styles.radioDot, { backgroundColor: colors.secondary }]} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Label text="LOCATION" hint="Optional" />
          <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Text style={{ fontSize: 13 }}>📍</Text>
            <Text style={[styles.inputText, { color: colors.fgPrimary, flex: 1 }]}>Edmonton, AB</Text>
            <Ionicons name="chevron-down" size={12} color={colors.fgTertiary} />
          </View>
        </View>

        {/* Invite members */}
        <View style={styles.field}>
          <Label text="INVITE MEMBERS" hint="Optional" />
          <Pressable
            style={[styles.inviteRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
            onPress={() => router.push("/(tabs)/social/invite")}
          >
            <View style={[styles.inviteIcon, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
              <Ionicons name="add" size={18} color={colors.secondary} />
            </View>
            <View style={styles.flex}>
              <Text style={[styles.inviteLabel, { color: colors.fgPrimary }]}>Invite members</Text>
              <Text style={[styles.inviteSub, { color: colors.fgTertiary }]}>No one invited yet · add from your followers</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.fgTertiary} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.borderDefault }]}>
        <Pressable style={[styles.cta, { backgroundColor: colors.secondary }]} onPress={() => router.back()}>
          <Text style={styles.ctaText}>Create Group</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Label({ text, hint }: { text: string; hint?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.labelRow}>
      <Text style={[styles.label, { color: colors.fgTertiary }]}>{text}</Text>
      {hint ? <Text style={[styles.labelHint, { color: colors.fgTertiary }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  nav: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingBottom: 12, paddingTop: 2, borderBottomWidth: 1 },
  navSide: { width: 50 },
  navRight: { alignItems: "flex-end" },
  navTitle: { flex: 1, textAlign: "center", fontFamily: fontFamily.socialExtrabold, fontSize: 15 },
  navAction: { fontFamily: fontFamily.socialBold, fontSize: 13 },

  body: { padding: space.lg, gap: 16 },
  cover: { height: 96, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 4 },
  coverText: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  iconNameRow: { flexDirection: "row", alignItems: "flex-end", gap: 12 },
  iconTile: { width: 56, height: 56, borderRadius: 15, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },

  field: { gap: 0 },
  labelRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 },
  label: { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" },
  labelHint: { fontFamily: fontFamily.body, fontSize: 9.5 },
  input: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5 },
  inputText: { fontFamily: fontFamily.bodySemibold, fontSize: 13, padding: 0 },
  textarea: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, borderWidth: 1 },

  privacyRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 11, paddingHorizontal: 13, borderRadius: 12, borderWidth: 1.5, marginBottom: 8 },
  privacyLabel: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  privacySub: { fontFamily: fontFamily.body, fontSize: 9.5, marginTop: 1, lineHeight: 13 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 9, height: 9, borderRadius: 5 },

  inviteRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 13, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderStyle: "dashed" },
  inviteIcon: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  inviteLabel: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  inviteSub: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },

  footer: { padding: space.lg, paddingBottom: 24, borderTopWidth: 1 },
  cta: { paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  ctaText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
