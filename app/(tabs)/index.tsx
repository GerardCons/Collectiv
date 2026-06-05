import { Avatar } from "@/components/ui/avatar";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { FeedItem, useFeed } from "@/hooks/use-feed";
import { useUnreadCount } from "@/hooks/use-notifications";
import { useActiveCollectorCount } from "@/hooks/use-presence";
import { formatPrice, timeAgo } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

export default function HomeTab() {
  const { data: feed, isLoading, refetch, isRefetching } = useFeed();
  const { data: unread = 0 } = useUnreadCount();
  const { data: activeCount = 0 } = useActiveCollectorCount();

  function openItem(item: FeedItem) {
    if (item.type === "card_listed") {
      router.push({ pathname: "/(tabs)/market/[id]", params: { id: item.subjectId } });
    } else {
      router.push({
        pathname: "/(tabs)/portfolio/card/[id]",
        params: { id: item.subjectId },
      });
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Collectiv</Text>
          {activeCount > 0 ? (
            <View style={styles.activeRow}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>{activeCount} collector{activeCount === 1 ? "" : "s"} active</Text>
            </View>
          ) : null}
        </View>
        <Pressable onPress={() => router.push("/notifications")} hitSlop={8}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {unread > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 9 ? "9+" : unread}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={feed ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="newspaper-outline" size={32} color={colors.textTertiary} />
              <Text style={styles.muted}>Your feed is quiet.</Text>
              <Text style={styles.mutedSmall}>
                Follow collectors, or showcase & list cards to fill it.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <FeedRow item={item} onPress={() => openItem(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function FeedRow({ item, onPress }: { item: FeedItem; onPress: () => void }) {
  const name = item.actor.display_name || item.actor.username;
  const verb =
    item.type === "card_listed"
      ? ` listed ${item.cardTitle}`
      : ` showcased ${item.cardTitle}`;
  const url = cardPhotoUrl(item.photoPath);

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <Pressable
        onPress={() =>
          router.push({ pathname: "/profile/[id]", params: { id: item.actor.id } })
        }
      >
        <Avatar name={name} size={40} />
      </Pressable>

      <View style={styles.flex}>
        <Text style={styles.text}>
          <Text style={styles.name}>{name}</Text>
          {verb}
          {item.type === "card_listed" && item.priceCents != null ? (
            <Text style={styles.price}> for {formatPrice(item.priceCents)}</Text>
          ) : null}
        </Text>
        <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
      </View>

      <View style={styles.thumb}>
        {url ? (
          <Image source={{ uri: url }} style={styles.thumbImg} contentFit="cover" />
        ) : (
          <Ionicons name="image-outline" size={20} color={colors.textTertiary} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  mutedSmall: { color: colors.textTertiary, fontSize: fontSize.xs, textAlign: "center" },
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brand: { fontSize: fontSize.xl, fontWeight: "800", color: colors.accent },
  activeRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: 1 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  activeText: { fontSize: fontSize.xs, color: colors.textSecondary },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.textInverse, fontSize: 10, fontWeight: "800" },

  list: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  empty: { alignItems: "center", gap: spacing.sm, paddingTop: spacing.xxl * 2 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: { opacity: 0.6 },
  text: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
  name: { fontWeight: "800" },
  price: { color: colors.accent, fontWeight: "700" },
  time: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },
  thumb: {
    width: 48,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
});
