import { Composer } from "@/components/home/composer";
import { PostCard, PostHandlers } from "@/components/home/post-card";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Avatar } from "@/components/ui/avatar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { fontFamily, space } from "@/constants/theme";
import { FEED, FeedPost, SHARE_ACTIONS, SHARE_TARGETS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const { colors } = useTheme();
  const [shareOpen, setShareOpen] = useState(false);
  const [menuPost, setMenuPost] = useState<FeedPost | null>(null);

  const handlers: PostHandlers = {
    onLikes: () => router.push("/feed/likes"),
    onComments: () => router.push("/feed/comments"),
    onShare: () => setShareOpen(true),
    onMenu: (post) => setMenuPost(post),
    onOpen: () => {},
  };

  const menuAuthor =
    menuPost && "author" in menuPost ? menuPost.author : undefined;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.fgPrimary }]}>Collectiv</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={17} color={colors.fgPrimary} />
            <View style={[styles.dot, { backgroundColor: colors.primary, borderColor: colors.bgBase }]} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
            onPress={() => router.push("/chat")}
          >
            <Ionicons name="mail-outline" size={17} color={colors.fgPrimary} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={FEED}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Composer
              onOpen={() => router.push("/compose/new-post")}
              onAction={(route) => router.push(route as never)}
            />
            <View style={[styles.divider, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} />
          </>
        }
        renderItem={({ item }) => <PostCard post={item} handlers={handlers} />}
      />

      {/* Share sheet */}
      <BottomSheet visible={shareOpen} onClose={() => setShareOpen(false)} title="Share post">
        <View style={[styles.targets, { borderBottomColor: colors.borderDefault }]}>
          {SHARE_TARGETS.map((t) => (
            <View key={t.handle} style={styles.target}>
              <Avatar name={t.name} size={48} color={t.color} />
              <Text style={[styles.targetName, { color: colors.fgSecondary }]} numberOfLines={1}>{t.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.shareGrid}>
          {SHARE_ACTIONS.map((a) => (
            <View key={a.label} style={styles.shareAction}>
              <View style={[styles.shareIcon, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
                <Ionicons name={a.icon as keyof typeof Ionicons.glyphMap} size={19} color={colors.fgPrimary} />
              </View>
              <Text style={[styles.shareLabel, { color: colors.fgSecondary }]}>{a.label}</Text>
            </View>
          ))}
        </View>
      </BottomSheet>

      {/* Post ··· menu */}
      <ActionSheet
        visible={menuPost != null}
        onClose={() => setMenuPost(null)}
        header={
          menuAuthor
            ? {
                title: menuAuthor.name,
                subtitle: `@${menuAuthor.handle}`,
                avatar: <Avatar name={menuAuthor.name} size={46} color={menuAuthor.color} />,
              }
            : undefined
        }
        actions={[
          { icon: "bookmark-outline", label: "Save post", sub: "Add to your saved items", onPress: () => {} },
          { icon: "eye-off-outline", label: "Not interested", sub: "See fewer posts like this", onPress: () => {} },
          { icon: "person-add-outline", label: menuAuthor ? `Follow @${menuAuthor.handle}` : "Follow", sub: "Get their posts in your feed", onPress: () => {} },
          { icon: "notifications-off-outline", label: menuAuthor ? `Mute @${menuAuthor.handle}` : "Mute", sub: "Stop seeing their posts", onPress: () => {} },
          { icon: "link-outline", label: "Copy link", onPress: () => {} },
          { icon: "flag-outline", label: "Report post", sub: "Flag for review", danger: true, onPress: () => {} },
          { icon: "ban-outline", label: menuAuthor ? `Block @${menuAuthor.handle}` : "Block", sub: "They can't see or message you", danger: true, onPress: () => {} },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingTop: 2,
    paddingBottom: 12,
  },
  brand: { fontFamily: fontFamily.socialExtrabold, fontSize: 25, letterSpacing: -0.5 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  divider: { height: 8, borderTopWidth: 1, borderBottomWidth: 1 },

  targets: { flexDirection: "row", gap: 14, paddingVertical: space.md, paddingBottom: space.lg, borderBottomWidth: 1 },
  target: { alignItems: "center", gap: 5, width: 52 },
  targetName: { fontFamily: fontFamily.bodySemibold, fontSize: 10, maxWidth: 52 },
  shareGrid: { flexDirection: "row", flexWrap: "wrap", paddingTop: space.lg },
  shareAction: { width: "25%", alignItems: "center", gap: 7, marginBottom: space.lg },
  shareIcon: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  shareLabel: { fontFamily: fontFamily.body, fontSize: 10, textAlign: "center" },
});
