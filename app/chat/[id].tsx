import { Avatar } from "@/components/ui/avatar";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  Message,
  appendDedupe,
  messagesKey,
  useConversationPartner,
  useMarkConversationRead,
  useMessages,
  useSendMessage,
} from "@/hooks/use-chat";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConversationScreen() {
  const { id, prefill } = useLocalSearchParams<{ id: string; prefill?: string }>();
  const { session } = useAuth();
  const myId = session?.user.id;
  const queryClient = useQueryClient();

  const { data: partner } = useConversationPartner(id);
  const { data: messages, isLoading } = useMessages(id);
  const sendMessage = useSendMessage(id ?? "");
  const markRead = useMarkConversationRead();

  const [text, setText] = useState(prefill ?? "");

  // Keep a stable ref so effects can mark-read without re-subscribing.
  const markReadRef = useRef(markRead);
  markReadRef.current = markRead;

  // Mark read when opening.
  useEffect(() => {
    if (id) markReadRef.current.mutate(id);
  }, [id]);

  // Realtime: append incoming messages (deduped against our own echoes).
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`messages:${id}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          queryClient.setQueryData<Message[]>(messagesKey(id), (old) =>
            appendDedupe(old, msg),
          );
          if (msg.sender_id !== myId) markReadRef.current.mutate(id);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, myId, queryClient]);

  // Inverted list wants newest first.
  const inverted = useMemo(
    () => [...(messages ?? [])].reverse(),
    [messages],
  );

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/chat");
  }

  function send() {
    const body = text.trim();
    if (!body || sendMessage.isPending) return;
    setText("");
    sendMessage.mutate(body, { onError: () => setText(body) });
  }

  const name = partner?.display_name || partner?.username || "Collector";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={back} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Avatar name={name} size={32} />
        <Text style={styles.headerName} numberOfLines={1}>
          {name}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <FlatList
            data={inverted}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={styles.messages}
            ListEmptyComponent={
              <Text style={styles.empty}>Say hello 👋</Text>
            }
            renderItem={({ item }) => {
              const mine = item.sender_id === myId;
              return (
                <View
                  style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}
                >
                  <View
                    style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}
                  >
                    <Text style={mine ? styles.textMine : styles.textTheirs}>
                      {item.body}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Message…"
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={setText}
            multiline
          />
          <Pressable
            style={[styles.send, !text.trim() && styles.sendDisabled]}
            onPress={send}
            disabled={!text.trim() || sendMessage.isPending}
          >
            <Ionicons name="arrow-up" size={20} color={colors.textInverse} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },

  messages: { padding: spacing.lg, gap: spacing.sm, flexGrow: 1, justifyContent: "flex-end" },
  empty: { textAlign: "center", color: colors.textTertiary, fontSize: fontSize.sm },

  bubbleRow: { flexDirection: "row" },
  rowMine: { justifyContent: "flex-end" },
  rowTheirs: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  bubbleMine: { backgroundColor: colors.accent, borderBottomRightRadius: radius.sm },
  bubbleTheirs: { backgroundColor: colors.surface, borderBottomLeftRadius: radius.sm },
  textMine: { color: colors.textInverse, fontSize: fontSize.md },
  textTheirs: { color: colors.text, fontSize: fontSize.md },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.md,
    color: colors.text,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: { opacity: 0.4 },
});
