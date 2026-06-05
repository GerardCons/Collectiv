import { Avatar } from "@/components/ui/avatar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  TargetType,
  commentsKey,
  likedByKey,
  reactionsKey,
  useAddComment,
  useComments,
  useLikedBy,
  useReactionSummary,
  useToggleLike,
} from "@/hooks/use-social";
import { timeAgo } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

/**
 * Likes + comments for a listing or showcased card. Realtime keeps the like
 * count and comment thread live. Drops into a detail screen's ScrollView.
 */
export function SocialSection({
  targetType,
  targetId,
}: {
  targetType: TargetType;
  targetId: string;
}) {
  const queryClient = useQueryClient();
  const reactions = useReactionSummary(targetType, targetId);
  const toggleLike = useToggleLike();
  const comments = useComments(targetType, targetId);
  const addComment = useAddComment(targetType, targetId);
  const [likedByOpen, setLikedByOpen] = useState(false);
  const likedBy = useLikedBy(targetType, targetId, likedByOpen);
  const [text, setText] = useState("");

  useEffect(() => {
    // Unique suffix so we never re-attach handlers to an already-subscribed
    // channel (that throws "cannot add postgres_changes callbacks after subscribe").
    const channel = supabase
      .channel(`social:${targetType}:${targetId}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `target_id=eq.${targetId}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: commentsKey(targetType, targetId),
          }),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reactions",
          filter: `target_id=eq.${targetId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: reactionsKey(targetType, targetId),
          });
          queryClient.invalidateQueries({
            queryKey: likedByKey(targetType, targetId),
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetType, targetId, queryClient]);

  const liked = reactions.data?.likedByMe ?? false;
  const likeCount = reactions.data?.count ?? 0;
  const commentCount = comments.data?.length ?? 0;

  function submit() {
    const body = text.trim();
    if (!body || addComment.isPending) return;
    setText("");
    addComment.mutate(body, { onError: () => setText(body) });
  }

  return (
    <View style={styles.section}>
      <View style={styles.bar}>
        <Pressable
          style={styles.barItem}
          onPress={() => toggleLike.mutate({ targetType, targetId, liked })}
          hitSlop={6}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? colors.accent : colors.text}
          />
        </Pressable>
        <Pressable
          onPress={() => likeCount > 0 && setLikedByOpen(true)}
          hitSlop={6}
        >
          <Text style={styles.count}>
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </Text>
        </Pressable>
        <View style={styles.barItem}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
          <Text style={styles.count}>{commentCount}</Text>
        </View>
      </View>

      <View style={styles.comments}>
        {comments.data?.map((c) => (
          <View key={c.id} style={styles.comment}>
            <Avatar name={c.author?.display_name || c.author?.username} size={32} />
            <View style={styles.flex}>
              <Text style={styles.commentMeta}>
                <Text style={styles.commentName}>
                  {c.author?.display_name || c.author?.username || "Collector"}
                </Text>
                {"  "}
                {timeAgo(c.created_at)}
              </Text>
              <Text style={styles.commentBody}>{c.body}</Text>
            </View>
          </View>
        ))}
        {commentCount === 0 ? (
          <Text style={styles.muted}>No comments yet — say something.</Text>
        ) : null}
      </View>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment…"
          placeholderTextColor={colors.textTertiary}
          value={text}
          onChangeText={setText}
        />
        <Pressable
          style={[styles.send, !text.trim() && styles.sendDisabled]}
          onPress={submit}
          disabled={!text.trim() || addComment.isPending}
        >
          <Ionicons name="arrow-up" size={18} color={colors.textInverse} />
        </Pressable>
      </View>

      <BottomSheet
        visible={likedByOpen}
        onClose={() => setLikedByOpen(false)}
        title={`Liked by ${likeCount}`}
      >
        <ScrollView style={styles.likedList}>
          {likedBy.data?.map((p) => (
            <Pressable
              key={p.id}
              style={styles.likerRow}
              onPress={() => {
                setLikedByOpen(false);
                router.push({ pathname: "/profile/[id]", params: { id: p.id } });
              }}
            >
              <Avatar name={p.display_name || p.username} size={40} />
              <View style={styles.flex}>
                <Text style={styles.likerName}>
                  {p.display_name || p.username}
                </Text>
                <Text style={styles.likerHandle}>@{p.username}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  flex: { flex: 1 },
  muted: { color: colors.textTertiary, fontSize: fontSize.sm },

  bar: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  barItem: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  count: { fontSize: fontSize.sm, color: colors.text, fontWeight: "600" },

  comments: { gap: spacing.md },
  comment: { flexDirection: "row", gap: spacing.sm },
  commentMeta: { fontSize: fontSize.xs, color: colors.textTertiary },
  commentName: { color: colors.text, fontWeight: "700", fontSize: fontSize.sm },
  commentBody: { fontSize: fontSize.sm, color: colors.text, marginTop: 2, lineHeight: 19 },

  composer: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.md,
    color: colors.text,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: { opacity: 0.4 },

  likedList: { maxHeight: 360 },
  likerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  likerName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  likerHandle: { fontSize: fontSize.sm, color: colors.textSecondary },
});
