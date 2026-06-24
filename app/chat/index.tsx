import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { Thread, THREADS } from "@/lib/chat-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessagesInbox() {
  const { colors } = useTheme();
  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <View style={[styles.nav, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={back} hitSlop={8} style={styles.navSide}>
          <Ionicons name="chevron-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.fgPrimary }]}>Messages</Text>
        <Pressable onPress={() => router.push("/chat/new")} hitSlop={8} style={[styles.navSide, styles.navRight]}>
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <View style={[styles.search, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="search" size={14} color={colors.fgTertiary} />
          <Text style={[styles.searchText, { color: colors.fgTertiary }]}>Search messages</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {THREADS.map((t) => (
          <ThreadRow key={t.id} thread={t} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ThreadRow({ thread }: { thread: Thread }) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[styles.row, { borderBottomColor: colors.borderDefault }]}
      onPress={() => router.push({ pathname: "/chat/[id]", params: { id: thread.id } })}
    >
      <View>
        {thread.kind === "group" ? (
          <View style={[styles.groupTile, { backgroundColor: colors.secondary }]}>
            <Ionicons name="people" size={22} color="#fff" />
          </View>
        ) : (
          <Avatar name={thread.name} size={50} color={thread.color} />
        )}
        {thread.online ? <View style={[styles.onlineDot, { backgroundColor: colors.success, borderColor: colors.bgBase }]} /> : null}
      </View>
      <View style={styles.flex}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.fgPrimary, fontFamily: thread.unread ? fontFamily.socialExtrabold : fontFamily.socialBold }]} numberOfLines={1}>{thread.name}</Text>
          {thread.vendor ? <Ionicons name="checkmark-circle" size={10} color={colors.success} /> : null}
        </View>
        {thread.listing ? (
          <View style={[styles.listingChip, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <GradientThumb accent={thread.listing.color} width={22} height={30} radius={4} />
            <View style={styles.flex}>
              <Text style={[styles.listingTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{thread.listing.title}</Text>
              <Text style={[styles.listingPrice, { color: colors.primary }]}>🏷 {thread.listing.price}</Text>
            </View>
          </View>
        ) : null}
        <Text style={[styles.preview, { color: thread.unread ? colors.fgPrimary : colors.fgTertiary, fontFamily: thread.unread ? fontFamily.bodySemibold : fontFamily.body }]} numberOfLines={1}>
          {thread.msg}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={[styles.time, { color: thread.unread ? colors.primary : colors.fgTertiary }]}>{thread.time}</Text>
        {thread.unread > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{thread.unread}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  nav: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingBottom: 12, paddingTop: 2, borderBottomWidth: 1 },
  navSide: { minWidth: 50, justifyContent: "center" },
  navRight: { alignItems: "flex-end" },
  navTitle: { flex: 1, textAlign: "center", fontFamily: fontFamily.socialExtrabold, fontSize: 16 },
  searchWrap: { paddingHorizontal: space.lg, paddingVertical: 12 },
  search: { flexDirection: "row", alignItems: "center", gap: 9, height: 40, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  searchText: { fontFamily: fontFamily.body, fontSize: 13 },

  row: { flexDirection: "row", gap: 13, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  groupTile: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  onlineDot: { position: "absolute", bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, borderWidth: 2.5 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 14, flexShrink: 1 },
  listingChip: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 4, padding: 4, paddingRight: 8, borderRadius: 8, borderWidth: 1 },
  listingTitle: { fontFamily: fontFamily.socialBold, fontSize: 9.5 },
  listingPrice: { fontFamily: fontFamily.socialBold, fontSize: 9 },
  preview: { fontSize: 12, marginTop: 3 },
  meta: { alignItems: "flex-end", gap: 5 },
  time: { fontFamily: fontFamily.bodySemibold, fontSize: 10.5 },
  badge: { minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  badgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 10.5, color: "#fff" },
});
