import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useConversations } from "@/hooks/use-chat";
import { timeAgo } from "@/lib/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatListScreen() {
  const { data: conversations, isLoading } = useConversations();

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/market");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Messages" onBack={back} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={conversations ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="chatbubbles-outline" size={32} color={colors.textTertiary} />
              <Text style={styles.muted}>Message a seller to start a chat.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const name =
              item.other?.display_name || item.other?.username || "Collector";
            const preview = item.lastMessage?.body ?? "No messages yet";
            return (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() =>
                  router.push({ pathname: "/chat/[id]", params: { id: item.id } })
                }
              >
                <Avatar name={name} size={48} />
                <View style={styles.flex}>
                  <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.time}>
                      {timeAgo(item.last_message_at)}
                    </Text>
                  </View>
                  <Text
                    style={[styles.preview, item.unread && styles.previewUnread]}
                    numberOfLines={1}
                  >
                    {preview}
                  </Text>
                </View>
                {item.unread ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.sm, paddingTop: spacing.xxl },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  flex: { flex: 1 },

  list: { paddingHorizontal: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowPressed: { opacity: 0.6 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },
  time: { fontSize: fontSize.xs, color: colors.textTertiary, marginLeft: spacing.sm },
  preview: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  previewUnread: { color: colors.text, fontWeight: "700" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
});
