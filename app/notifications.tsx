import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, spacing } from "@/constants/theme";
import {
  AppNotification,
  useMarkNotificationsRead,
  useNotifications,
} from "@/hooks/use-notifications";
import { timeAgo } from "@/lib/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON: Record<AppNotification["notification_type"], keyof typeof Ionicons.glyphMap> = {
  follow: "person-add",
  comment: "chatbubble-ellipses",
  like: "heart",
  group_post: "people",
  rsvp: "calendar",
};

function subjectNoun(t: string | null): string {
  if (t === "group_post") return "post";
  return t ?? "item";
}

function describe(n: AppNotification): string {
  const who = n.actor?.display_name || n.actor?.username || "Someone";
  if (n.notification_type === "follow") return `${who} started following you`;
  if (n.notification_type === "group_post")
    return `${who} posted in a group you're in`;
  if (n.notification_type === "rsvp") return `${who} RSVPed to your event`;
  if (n.notification_type === "like")
    return `${who} liked your ${subjectNoun(n.subject_type)}`;
  return `${who} commented on your ${subjectNoun(n.subject_type)}`;
}

export default function NotificationsScreen() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const markReadRef = useRef(markRead);
  markReadRef.current = markRead;

  // Mark everything read on open.
  useEffect(() => {
    markReadRef.current.mutate();
  }, []);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }

  function open(n: AppNotification) {
    // `withAnchor` includes the tab's index route beneath the pushed detail in
    // a SINGLE navigation — so the stack is [index, detail] (Back/tab behave)
    // and only the detail renders (no Community flash).
    if (n.notification_type === "follow" && n.actor) {
      router.push({ pathname: "/profile/[id]", params: { id: n.actor.id } });
    } else if (n.subject_type === "listing" && n.subject_id) {
      router.push(
        { pathname: "/(tabs)/market/[id]", params: { id: n.subject_id } },
        { withAnchor: true },
      );
    } else if (n.subject_type === "card" && n.subject_id) {
      router.push(
        { pathname: "/(tabs)/portfolio/card/[id]", params: { id: n.subject_id } },
        { withAnchor: true },
      );
    } else if (n.subject_type === "group" && n.subject_id) {
      router.push(
        { pathname: "/(tabs)/social/[id]", params: { id: n.subject_id } },
        { withAnchor: true },
      );
    } else if (n.subject_type === "group_post" && n.subject_id) {
      router.push(
        { pathname: "/(tabs)/social/post/[id]", params: { id: n.subject_id } },
        { withAnchor: true },
      );
    } else if (n.subject_type === "event" && n.subject_id) {
      router.push(
        { pathname: "/(tabs)/social/event/[id]", params: { id: n.subject_id } },
        { withAnchor: true },
      );
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Notifications" onBack={back} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={notifications ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="notifications-outline" size={32} color={colors.textTertiary} />
              <Text style={styles.muted}>No notifications yet.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                !item.read_at && styles.rowUnread,
                pressed && styles.rowPressed,
              ]}
              onPress={() => open(item)}
            >
              <View style={styles.avatarWrap}>
                <Avatar
                  name={item.actor?.display_name || item.actor?.username}
                  size={44}
                />
                <View style={styles.iconBadge}>
                  <Ionicons name={ICON[item.notification_type]} size={12} color={colors.textInverse} />
                </View>
              </View>
              <Text style={styles.text}>{describe(item)}</Text>
              <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.sm, paddingTop: spacing.xxl },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },

  list: { paddingHorizontal: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  rowUnread: { backgroundColor: colors.accentSoft },
  rowPressed: { opacity: 0.6 },
  avatarWrap: { position: "relative" },
  iconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  text: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  time: { fontSize: fontSize.xs, color: colors.textTertiary },
});
