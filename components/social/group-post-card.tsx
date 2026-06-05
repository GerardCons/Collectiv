import { Avatar } from "@/components/ui/avatar";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { GroupPost, GroupPostType } from "@/hooks/use-group-posts";
import { timeAgo } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TYPE_CONFIG: Record<
  GroupPostType,
  { label: string; bg: string; fg: string }
> = {
  discussion: { label: "Discussion", bg: colors.surface, fg: colors.textSecondary },
  giveaway: { label: "Giveaway", bg: colors.accentSoft, fg: colors.accent },
  announcement: { label: "Announcement", bg: colors.text, fg: colors.textInverse },
};

export function PostTypeBadge({ type }: { type: GroupPostType }) {
  const c = TYPE_CONFIG[type];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{c.label}</Text>
    </View>
  );
}

export function GroupPostCard({
  post,
  onPress,
}: {
  post: GroupPost;
  onPress: () => void;
}) {
  const url = cardPhotoUrl(post.photo_path);
  const name = post.author?.display_name || post.author?.username || "Member";
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.head}>
        <Avatar name={name} size={36} />
        <View style={styles.flex}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
        </View>
        <PostTypeBadge type={post.post_type} />
      </View>

      <Text style={styles.body}>{post.body}</Text>
      {url ? (
        <Image source={{ uri: url }} style={styles.photo} contentFit="cover" />
      ) : null}

      <Text style={styles.viewComments}>View & comment →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
  name: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  time: { fontSize: fontSize.xs, color: colors.textTertiary },
  body: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  viewComments: { fontSize: fontSize.xs, color: colors.accent, fontWeight: "600" },

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
});
