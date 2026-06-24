import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { getListing, INTEREST_MESSAGE } from "@/lib/market-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MarketChat() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = getListing(id ?? "1");

  // The "I'm Interested" button seeds the thread with the auto-message.
  const [messages, setMessages] = useState<string[]>([INTEREST_MESSAGE]);
  const [draft, setDraft] = useState("");

  function send() {
    const t = draft.trim();
    if (!t) return;
    setMessages((m) => [...m, t]);
    setDraft("");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <Avatar name={listing.seller} size={34} color={colors.primary} />
        <View style={styles.flex}>
          <Text style={[styles.sellerName, { color: colors.fgPrimary }]} numberOfLines={1}>@{listing.seller}</Text>
          <Text style={[styles.online, { color: colors.success }]}>● Online</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.fgTertiary} />
      </View>

      {/* Listing context */}
      <View style={[styles.context, { backgroundColor: colors.bgSurface, borderBottomColor: colors.borderDefault }]}>
        <GradientThumb accent={listing.accent} width={34} height={48} radius={5} />
        <View style={styles.flex}>
          <Text style={[styles.ctxName, { color: colors.fgPrimary }]} numberOfLines={1}>{listing.name} · {listing.sub}</Text>
          <Text style={[styles.ctxMeta, { color: colors.fgTertiary }]}>
            Asking <Text style={{ color: colors.primary, fontFamily: fontFamily.socialBold }}>{listing.price}</Text> · {listing.grade}
          </Text>
        </View>
        <Pressable
          style={[styles.viewBtn, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}
          onPress={() => router.push({ pathname: "/(tabs)/market/[id]", params: { id: listing.id } })}
        >
          <Text style={[styles.viewText, { color: colors.primary }]}>View</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        <ScrollView contentContainerStyle={styles.thread} keyboardShouldPersistTaps="handled">
          <Text style={[styles.day, { color: colors.fgTertiary }]}>Today · 2:34 PM</Text>
          {messages.map((m, i) => (
            <View key={i} style={styles.bubbleWrap}>
              <View style={[styles.bubble, { backgroundColor: colors.primary }]}>
                <Text style={styles.bubbleText}>{m}</Text>
              </View>
              <Text style={[styles.sent, { color: colors.fgTertiary }]}>Sent · Just now</Text>
            </View>
          ))}
          <View style={[styles.systemNote, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Text style={[styles.systemText, { color: colors.fgSecondary }]}>
              Message sent to <Text style={{ color: colors.primary, fontFamily: fontFamily.socialBold }}>@{listing.seller}</Text>. They&apos;ll be notified right away.
            </Text>
          </View>
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputBar, { borderTopColor: colors.borderDefault }]}>
          <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <TextInput
              style={[styles.inputText, { color: colors.fgPrimary }]}
              value={draft}
              onChangeText={setDraft}
              placeholder="Write a message…"
              placeholderTextColor={colors.fgTertiary}
              onSubmitEditing={send}
              returnKeyType="send"
            />
          </View>
          <Pressable style={[styles.send, { backgroundColor: colors.primary }]} onPress={send}>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: space.lg, paddingBottom: 10, borderBottomWidth: 1 },
  sellerName: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  online: { fontFamily: fontFamily.body, fontSize: 10 },

  context: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: space.lg, paddingVertical: 9, borderBottomWidth: 1 },
  ctxName: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  ctxMeta: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
  viewBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  viewText: { fontFamily: fontFamily.socialBold, fontSize: 10 },

  thread: { padding: space.lg, gap: 12 },
  day: { fontFamily: fontFamily.body, fontSize: 10, textAlign: "center" },
  bubbleWrap: { alignItems: "flex-end", gap: 5 },
  bubble: { maxWidth: "80%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomRightRadius: 4 },
  bubbleText: { fontFamily: fontFamily.body, fontSize: 12.5, color: "#fff", lineHeight: 18 },
  sent: { fontFamily: fontFamily.body, fontSize: 9.5 },
  systemNote: { padding: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1 },
  systemText: { fontFamily: fontFamily.body, fontSize: 10.5, textAlign: "center", lineHeight: 16 },

  inputBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: space.lg, paddingVertical: 10, borderTopWidth: 1 },
  input: { flex: 1, height: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, justifyContent: "center" },
  inputText: { fontFamily: fontFamily.body, fontSize: 12, padding: 0 },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
});
