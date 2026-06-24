import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, radii, shadows, space } from "@/constants/theme";
import { FeedPost } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type PostHandlers = {
  onLikes: (post: FeedPost) => void;
  onComments: (post: FeedPost) => void;
  onShare: (post: FeedPost) => void;
  onMenu: (post: FeedPost) => void;
  onOpen: (post: FeedPost) => void;
};

export function PostCard({ post, handlers }: { post: FeedPost; handlers: PostHandlers }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.post, { borderBottomColor: colors.borderDefault }]}>
      {post.kind === "listed" && <Listed post={post} handlers={handlers} />}
      {post.kind === "user" && <UserPost post={post} handlers={handlers} />}
      {post.kind === "showcase" && <Showcase post={post} handlers={handlers} />}
      {post.kind === "sold" && <Sold post={post} handlers={handlers} />}
      {post.kind === "event" && <EventPost post={post} handlers={handlers} />}
      {post.kind === "group" && <GroupPost post={post} />}
    </View>
  );
}

// ── Author line ──────────────────────────────────────────────
function AuthorLine({
  author,
  time,
  badge,
  badgeColor,
  onMenu,
}: {
  author: { name: string; color: string; handle: string };
  time: string;
  badge?: string;
  badgeColor?: string;
  onMenu: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.author}>
      <Avatar name={author.name} size={40} color={author.color} />
      <View style={styles.flex}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>
            {author.name}
          </Text>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: `${badgeColor}1a` }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.handle, { color: colors.fgTertiary }]}>@{author.handle} · {time}</Text>
      </View>
      <Pressable onPress={onMenu} hitSlop={10}>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.fgTertiary} />
      </Pressable>
    </View>
  );
}

// ── Engagement bar ───────────────────────────────────────────
function Engagement({
  post,
  handlers,
}: {
  post: Extract<FeedPost, { likes: number }>;
  handlers: PostHandlers;
}) {
  const { colors } = useTheme();
  const liked = "liked" in post && post.liked;
  return (
    <View style={styles.engage}>
      <Pressable style={styles.engageItem} onPress={() => handlers.onLikes(post)} hitSlop={8}>
        <Ionicons name={liked ? "heart" : "heart-outline"} size={17} color={liked ? colors.primary : colors.fgTertiary} />
        <Text style={[styles.engageText, { color: liked ? colors.primary : colors.fgTertiary }]}>{post.likes}</Text>
      </Pressable>
      <Pressable style={styles.engageItem} onPress={() => handlers.onComments(post)} hitSlop={8}>
        <Ionicons name="chatbubble-outline" size={15} color={colors.fgTertiary} />
        <Text style={[styles.engageText, { color: colors.fgTertiary }]}>{post.comments}</Text>
      </Pressable>
      <Pressable style={styles.engageItem} onPress={() => handlers.onShare(post)} hitSlop={8}>
        <Ionicons name="arrow-redo-outline" size={15} color={colors.fgTertiary} />
        <Text style={[styles.engageText, { color: colors.fgTertiary }]}>Share</Text>
      </Pressable>
    </View>
  );
}

// ── Listed ───────────────────────────────────────────────────
function Listed({ post, handlers }: { post: Extract<FeedPost, { kind: "listed" }>; handlers: PostHandlers }) {
  const { colors } = useTheme();
  return (
    <>
      <AuthorLine author={post.author} time={post.time} badge="LISTED" badgeColor={colors.primary} onMenu={() => handlers.onMenu(post)} />
      <Text style={[styles.body, { color: colors.fgPrimary }]}>{post.text}</Text>
      <Pressable
        style={[styles.attachRow, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }, shadows.sm]}
        onPress={() => handlers.onOpen(post)}
      >
        <GradientThumb accent={post.card.color} width={60} height={84} />
        <View style={styles.attachBody}>
          <Text style={[styles.attachTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{post.card.title}</Text>
          <Text style={[styles.attachSub, { color: colors.fgTertiary }]}>{post.card.sub}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>{post.card.price}</Text>
            <Text style={[styles.attachSub, { color: colors.fgTertiary }]}>· {post.card.dist}</Text>
          </View>
        </View>
        <View style={[styles.viewBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.viewText}>View</Text>
        </View>
      </Pressable>
      <Engagement post={post} handlers={handlers} />
    </>
  );
}

// ── User text + photos ───────────────────────────────────────
function UserPost({ post, handlers }: { post: Extract<FeedPost, { kind: "user" }>; handlers: PostHandlers }) {
  const { colors } = useTheme();
  return (
    <>
      <AuthorLine author={post.author} time={post.time} onMenu={() => handlers.onMenu(post)} />
      <Text style={[styles.body, { color: colors.fgPrimary }]}>{post.text}</Text>
      <View style={styles.photoGrid}>
        {post.photos.map((c, i) => (
          <GradientThumb key={i} accent={c} width={post.photos.length === 1 ? "100%" : "100%"} height={150} radius={0} style={styles.photo} />
        ))}
      </View>
      <Engagement post={post} handlers={handlers} />
    </>
  );
}

// ── Showcase ─────────────────────────────────────────────────
function Showcase({ post, handlers }: { post: Extract<FeedPost, { kind: "showcase" }>; handlers: PostHandlers }) {
  const { colors } = useTheme();
  return (
    <>
      <AuthorLine author={post.author} time={post.time} badge="SHOWCASED" badgeColor={colors.secondary} onMenu={() => handlers.onMenu(post)} />
      <Text style={[styles.body, { color: colors.fgPrimary }]}>{post.text}</Text>
      <Pressable style={styles.showcase} onPress={() => handlers.onOpen(post)}>
        <LinearGradient colors={["#1a1210", post.card.color]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.4 }} style={StyleSheet.absoluteFill} />
        <View style={styles.showcaseCenter}>
          <GradientThumb accent="rgba(255,255,255,0.16)" width={116} height={162} radius={9} />
        </View>
        <View style={[styles.showcaseBadge, { backgroundColor: "rgba(124,58,237,0.85)" }]}>
          <Text style={styles.showcaseBadgeText}>⭐ SHOWCASE</Text>
        </View>
        <View style={styles.showcaseCaption}>
          <Text style={styles.showcaseTitle}>{post.card.title}</Text>
          <Text style={styles.showcaseSub}>{post.card.sub}</Text>
        </View>
      </Pressable>
      <Engagement post={post} handlers={handlers} />
    </>
  );
}

// ── Sold ─────────────────────────────────────────────────────
function Sold({ post, handlers }: { post: Extract<FeedPost, { kind: "sold" }>; handlers: PostHandlers }) {
  const { colors } = useTheme();
  return (
    <>
      <View style={[styles.dealPill, { backgroundColor: colors.successMuted }]}>
        <Text style={styles.dealEmoji}>🤝</Text>
        <Text style={[styles.dealText, { color: colors.success }]}>Deal closed on Collectiv</Text>
      </View>
      <View style={styles.soldParties}>
        <View style={styles.stackAvatars}>
          <Avatar name={post.seller.name} size={40} color={post.seller.color} />
          <View style={styles.stackSecond}>
            <Avatar name={post.buyer.name} size={40} color={post.buyer.color} />
          </View>
        </View>
        <Text style={[styles.soldLine, { color: colors.fgPrimary }]}>
          <Text style={styles.soldHandle}>@{post.seller.handle}</Text> sold to{" "}
          <Text style={styles.soldHandle}>@{post.buyer.handle}</Text>
        </Text>
      </View>
      <View style={[styles.attachRow, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }]}>
        <GradientThumb accent={post.card.color} width={50} height={70} />
        <View style={styles.attachBody}>
          <Text style={[styles.attachTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{post.card.title}</Text>
          <Text style={[styles.attachSub, { color: colors.fgTertiary }]}>{post.card.sub}</Text>
        </View>
        <View style={styles.soldFor}>
          <Text style={[styles.soldForLabel, { color: colors.fgTertiary }]}>SOLD FOR</Text>
          <Text style={[styles.soldForPrice, { color: colors.success }]}>{post.price}</Text>
        </View>
      </View>
      <Engagement post={post} handlers={handlers} />
    </>
  );
}

// ── Event ────────────────────────────────────────────────────
function EventPost({ post, handlers }: { post: Extract<FeedPost, { kind: "event" }>; handlers: PostHandlers }) {
  const { colors } = useTheme();
  return (
    <>
      <AuthorLine author={post.author} time={post.time} badge="EVENT" badgeColor={colors.info} onMenu={() => handlers.onMenu(post)} />
      <Text style={[styles.body, { color: colors.fgPrimary }]}>{post.text}</Text>
      <Pressable style={[styles.attachRow, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }, shadows.sm]} onPress={() => handlers.onOpen(post)}>
        <View style={[styles.dateBlock, { borderColor: colors.borderDefault }]}>
          <Text style={[styles.dateMonth, { backgroundColor: colors.secondary }]}>{post.event.month}</Text>
          <Text style={[styles.dateDay, { color: colors.fgPrimary }]}>{post.event.day}</Text>
        </View>
        <View style={styles.attachBody}>
          <Text style={[styles.attachTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{post.event.title}</Text>
          <Text style={[styles.eventMeta, { color: colors.fgSecondary }]}>📍 {post.event.venue}</Text>
          <Text style={[styles.attachSub, { color: colors.fgTertiary }]}>👥 {post.event.going} going · {post.event.interested} interested</Text>
        </View>
        <View style={[styles.goingPill, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
          <Text style={[styles.goingText, { color: colors.secondary }]}>★ Going</Text>
        </View>
      </Pressable>
      <Engagement post={post} handlers={handlers} />
    </>
  );
}

// ── Group activity ───────────────────────────────────────────
function GroupPost({ post }: { post: Extract<FeedPost, { kind: "group" }> }) {
  const { colors } = useTheme();
  return (
    <View style={styles.groupRow}>
      <View style={[styles.groupIcon, { backgroundColor: colors.primary }]}>
        <Text style={styles.groupGlyph}>💎</Text>
      </View>
      <View style={styles.flex}>
        <Text style={[styles.groupText, { color: colors.fgPrimary }]}>
          <Text style={styles.groupStrong}>3 people you follow</Text> joined{" "}
          <Text style={styles.groupStrong}>{post.groupName}</Text>
        </Text>
        <View style={styles.groupMembers}>
          <View style={styles.stackAvatars}>
            {post.colors.map((c, i) => (
              <View key={i} style={[styles.miniAvatar, { backgroundColor: c, borderColor: colors.bgBase, marginLeft: i > 0 ? -6 : 0 }]} />
            ))}
          </View>
          <Text style={[styles.attachSub, { color: colors.fgTertiary }]}>{post.members}</Text>
        </View>
      </View>
      <View style={[styles.joinBtn, { backgroundColor: colors.primary }]}>
        <Text style={styles.viewText}>Join</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  post: { paddingHorizontal: space.lg, paddingVertical: 14, borderBottomWidth: 1 },
  flex: { flex: 1, minWidth: 0 },

  author: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  badge: { paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: radii.full },
  badgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, letterSpacing: 0.3 },
  handle: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },

  body: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19.5, marginBottom: 11 },

  attachRow: { flexDirection: "row", gap: 12, padding: 11, paddingHorizontal: 12, borderRadius: radii.lg, borderWidth: 1, alignItems: "center" },
  attachBody: { flex: 1, minWidth: 0 },
  attachTitle: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  attachSub: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 7 },
  price: { fontFamily: fontFamily.display, fontSize: 18 },
  viewBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.full },
  viewText: { fontFamily: fontFamily.socialBold, fontSize: 11.5, color: "#fff" },

  photoGrid: { flexDirection: "row", gap: 6, borderRadius: radii.lg, overflow: "hidden" },
  photo: { flex: 1 },

  showcase: { height: 200, borderRadius: radii.xl - 4, overflow: "hidden" },
  showcaseCenter: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  showcaseBadge: { position: "absolute", top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.full },
  showcaseBadgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 9, color: "#fff", letterSpacing: 0.4 },
  showcaseCaption: { position: "absolute", bottom: 12, left: 12, right: 12 },
  showcaseTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 14, color: "#fff" },
  showcaseSub: { fontFamily: fontFamily.body, fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 1 },

  dealPill: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.full, marginBottom: 11 },
  dealEmoji: { fontSize: 13 },
  dealText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  soldParties: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 11 },
  stackAvatars: { flexDirection: "row" },
  stackSecond: { marginLeft: -12 },
  soldLine: { flex: 1, fontFamily: fontFamily.body, fontSize: 12.5, lineHeight: 18 },
  soldHandle: { fontFamily: fontFamily.socialBold },
  soldFor: { alignItems: "flex-end" },
  soldForLabel: { fontFamily: fontFamily.bodyBold, fontSize: 9 },
  soldForPrice: { fontFamily: fontFamily.display, fontSize: 16 },

  dateBlock: { width: 48, borderRadius: radii.md, overflow: "hidden", borderWidth: 1, alignItems: "stretch" },
  dateMonth: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, color: "#fff", textAlign: "center", paddingVertical: 3 },
  dateDay: { fontFamily: fontFamily.socialExtrabold, fontSize: 19, textAlign: "center", paddingVertical: 2 },
  eventMeta: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 3 },
  goingPill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: radii.full, borderWidth: 1 },
  goingText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  groupRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  groupIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  groupGlyph: { fontSize: 20 },
  groupText: { fontFamily: fontFamily.body, fontSize: 12.5, lineHeight: 18 },
  groupStrong: { fontFamily: fontFamily.socialBold },
  groupMembers: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 },
  miniAvatar: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  joinBtn: { paddingHorizontal: 15, paddingVertical: 7, borderRadius: radii.full },

  engage: { flexDirection: "row", alignItems: "center", gap: 22, marginTop: 11 },
  engageItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  engageText: { fontFamily: fontFamily.bodySemibold, fontSize: 11.5 },
});
