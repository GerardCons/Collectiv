import { PostTypeBadge } from "@/components/social/group-post-card";
import { SocialSection } from "@/components/social/social-section";
import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useGroupPost } from "@/hooks/use-group-posts";
import { timeAgo } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupPostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading, isError } = useGroupPost(id);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }

  const name = post?.author?.display_name || post?.author?.username || "Member";
  const url = cardPhotoUrl(post?.photo_path);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onBack={back} title={post?.group?.name ?? "Post"} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !post ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load this post.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.head}>
            <Avatar name={name} size={40} />
            <View style={styles.flex}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
            </View>
            <PostTypeBadge type={post.post_type} />
          </View>

          <Text style={styles.text}>{post.body}</Text>
          {url ? (
            <Image source={{ uri: url }} style={styles.photo} contentFit="cover" />
          ) : null}

          <SocialSection targetType="group_post" targetId={post.id} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  flex: { flex: 1 },
  body: { padding: spacing.xl, gap: spacing.md },

  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  time: { fontSize: fontSize.xs, color: colors.textTertiary },
  text: { fontSize: fontSize.md, color: colors.text, lineHeight: 22 },
  photo: {
    width: "100%",
    height: 240,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
});
