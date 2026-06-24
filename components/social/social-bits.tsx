import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily } from "@/constants/theme";
import { EventItem, Group, GroupPost } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Rounded-square group icon with a gradient + emoji. */
export function GroupAvatar({ group, size = 46 }: { group: Pick<Group, "avatar" | "color">; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.28, overflow: "hidden" }}>
      <LinearGradient colors={[group.color, `${group.color}bb`]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.center}>
        <Text style={{ fontSize: size * 0.46 }}>{group.avatar}</Text>
      </View>
    </View>
  );
}

/** Group list row (joined → chevron, else → Join button). */
export function GroupRow({ group }: { group: Group }) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={styles.row}
      onPress={() => router.push({ pathname: "/(tabs)/social/[id]", params: { id: group.id, joined: group.joined ? "1" : "0" } })}
    >
      <GroupAvatar group={group} />
      <View style={styles.flex}>
        <Text style={[styles.groupName, { color: colors.fgPrimary }]} numberOfLines={1}>{group.name}</Text>
        <View style={styles.metaRow}>
          {group.live ? <View style={[styles.dot, { backgroundColor: colors.success }]} /> : null}
          <Text style={[styles.meta, { color: group.live ? colors.success : colors.fgTertiary }]} numberOfLines={1}>
            {group.members} members · {group.activity}
          </Text>
        </View>
      </View>
      {group.joined ? (
        <Ionicons name="chevron-forward" size={18} color={colors.fgTertiary} />
      ) : (
        <View style={[styles.joinBtn, { backgroundColor: colors.secondary }]}>
          <Text style={styles.joinText}>Join</Text>
        </View>
      )}
    </Pressable>
  );
}

/** Compact event card (date column + detail + interested star). */
export function EventCard({ event, onToggleInterested }: { event: EventItem; onToggleInterested?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[styles.eventCard, { backgroundColor: colors.bgBase, borderLeftColor: event.color }, cardShadow]}
      onPress={() => router.push({ pathname: "/(tabs)/social/event/[id]", params: { id: event.id } })}
    >
      <View style={styles.dateCol}>
        <Text style={[styles.dateMonth, { color: event.color }]}>{event.month}</Text>
        <Text style={[styles.dateDay, { color: colors.fgPrimary }]}>{event.day}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.borderDefault }]} />
      <View style={styles.flex}>
        <Text style={[styles.eventTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{event.title}</Text>
        <View style={styles.eventLoc}>
          <Text style={styles.locGlyph}>📍</Text>
          <Text style={[styles.locText, { color: colors.fgSecondary }]} numberOfLines={1}>{event.loc}</Text>
        </View>
        <View style={styles.eventMetaRow}>
          <View style={[styles.typeBadge, { backgroundColor: colors.bgSurface }]}>
            <Text style={[styles.typeText, { color: colors.fgSecondary }]}>{event.type}</Text>
          </View>
          <Text style={[styles.going, { color: colors.fgTertiary }]}>👥 {event.going} going</Text>
        </View>
      </View>
      <Pressable
        onPress={onToggleInterested}
        hitSlop={6}
        style={[
          styles.star,
          event.isInterested
            ? { backgroundColor: colors.secondary }
            : { backgroundColor: colors.secondaryMuted, borderWidth: 1, borderColor: colors.secondary },
        ]}
      >
        <Text style={[styles.starText, { color: event.isInterested ? "#fff" : colors.secondary }]}>★</Text>
      </Pressable>
    </Pressable>
  );
}

/** A post inside a group discussion. */
export function GroupPostCard({ post }: { post: GroupPost }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.post, { borderBottomColor: colors.borderDefault }]}>
      {post.pinned ? (
        <View style={styles.pinned}>
          <Text style={styles.pinGlyph}>📌</Text>
          <Text style={[styles.pinText, { color: colors.warning }]}>Pinned by admin</Text>
        </View>
      ) : null}
      <View style={styles.postHead}>
        <Avatar name={post.name} size={38} color={post.color} />
        <View style={styles.flex}>
          <Text style={[styles.postName, { color: colors.fgPrimary }]}>{post.name}</Text>
          <Text style={[styles.postTime, { color: colors.fgTertiary }]}>{post.time}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={16} color={colors.fgTertiary} />
      </View>
      <Text style={[styles.postText, { color: colors.fgPrimary }]}>{post.text}</Text>
      {post.cardColor ? (
        <View style={[styles.postCard, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }, cardShadow]}>
          <GradientThumb accent={post.cardColor} width={48} height={67} radius={6} />
          <View style={styles.flex}>
            <Text style={[styles.postCardTitle, { color: colors.fgPrimary }]}>Luka Dončić — &apos;18-19 RC</Text>
            <Text style={[styles.postCardSub, { color: colors.fgTertiary }]}>Panini Prizm · PSA 10</Text>
            <Text style={[styles.postCardPrice, { color: colors.primary }]}>$4,100</Text>
          </View>
        </View>
      ) : null}
      <View style={styles.postActions}>
        <Text style={[styles.postAction, { color: colors.fgTertiary }]}>♡ {post.likes}</Text>
        <Text style={[styles.postAction, { color: colors.fgTertiary }]}>💬 {post.comments}</Text>
        <Text style={[styles.postAction, { color: colors.fgTertiary }]}>↗ Share</Text>
      </View>
    </View>
  );
}

/** Back ‹ + centered title + optional right action, for social sub-pages. */
export function SocialPageHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.pageHead, { borderBottomColor: colors.borderDefault }]}>
      <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/social"))} hitSlop={8} style={styles.pageSide}>
        <Ionicons name="chevron-back" size={26} color={colors.fgPrimary} />
      </Pressable>
      <Text style={[styles.pageTitle, { color: colors.fgPrimary }]}>{title}</Text>
      <Pressable onPress={onAction} hitSlop={8} style={[styles.pageSide, styles.pageRight]}>
        {action ? <Text style={[styles.pageAction, { color: colors.secondary }]}>{action}</Text> : null}
      </Pressable>
    </View>
  );
}

/** Purple switch toggle. */
export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onToggle} style={[styles.toggle, { backgroundColor: on ? colors.secondary : colors.borderDefault }]}>
      <View style={[styles.knob, { left: on ? 19 : 2.5 }]} />
    </Pressable>
  );
}

const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 1,
};

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1, minWidth: 0 },

  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9 },
  groupName: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  meta: { fontFamily: fontFamily.body, fontSize: 10.5 },
  joinBtn: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 999 },
  joinText: { fontFamily: fontFamily.socialBold, fontSize: 11, color: "#fff" },

  eventCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 11, paddingHorizontal: 12, borderRadius: 14, borderLeftWidth: 3, marginBottom: 10 },
  dateCol: { width: 44, alignItems: "center" },
  dateMonth: { fontFamily: fontFamily.socialExtrabold, fontSize: 9, letterSpacing: 0.5 },
  dateDay: { fontFamily: fontFamily.socialExtrabold, fontSize: 22, lineHeight: 24 },
  divider: { width: 1, alignSelf: "stretch" },
  eventTitle: { fontFamily: fontFamily.socialBold, fontSize: 13.5, marginBottom: 3 },
  eventLoc: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  locGlyph: { fontSize: 9 },
  locText: { fontFamily: fontFamily.body, fontSize: 10, flexShrink: 1 },
  eventMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  typeBadge: { paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999 },
  typeText: { fontFamily: fontFamily.socialBold, fontSize: 9.5 },
  going: { fontFamily: fontFamily.body, fontSize: 9.5 },
  star: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  starText: { fontSize: 15 },

  post: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  pinned: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 8 },
  pinGlyph: { fontSize: 11 },
  pinText: { fontFamily: fontFamily.socialBold, fontSize: 10 },
  postHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 9 },
  postName: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  postTime: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  postText: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 20 },
  postCard: { flexDirection: "row", gap: 11, padding: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginTop: 10, alignItems: "center" },
  postCardTitle: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  postCardSub: { fontFamily: fontFamily.body, fontSize: 9.5, marginTop: 1 },
  postCardPrice: { fontFamily: fontFamily.socialExtrabold, fontSize: 13, marginTop: 4 },
  postActions: { flexDirection: "row", gap: 20, marginTop: 11 },
  postAction: { fontFamily: fontFamily.bodySemibold, fontSize: 11.5 },

  pageHead: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: 1 },
  pageSide: { width: 60, justifyContent: "center" },
  pageRight: { alignItems: "flex-end" },
  pageTitle: { flex: 1, textAlign: "center", fontFamily: fontFamily.socialExtrabold, fontSize: 15 },
  pageAction: { fontFamily: fontFamily.socialBold, fontSize: 13 },

  toggle: { width: 42, height: 25, borderRadius: 999, justifyContent: "center" },
  knob: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" },
});
