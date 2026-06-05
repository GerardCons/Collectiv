import { GroupPostCard } from "@/components/social/group-post-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GroupCover } from "@/components/ui/group-cover";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { groupPostsKey, useGroupPosts } from "@/hooks/use-group-posts";
import {
  GroupMember,
  useGroup,
  useToggleGroupMembership,
} from "@/hooks/use-groups";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Posts", "Members", "About"] as const;
type Tab = (typeof TABS)[number];

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group, isLoading, isError } = useGroup(id);
  const { data: posts } = useGroupPosts(id);
  const toggleMembership = useToggleGroupMembership();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("Posts");

  // Realtime: new posts in this group appear live.
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`group-posts:${id}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_posts",
          filter: `group_id=eq.${id}`,
        },
        () => queryClient.invalidateQueries({ queryKey: groupPostsKey(id) }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }
  function openPost(postId: string) {
    router.push({ pathname: "/(tabs)/social/post/[id]", params: { id: postId } });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onBack={back} title="Group" />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !group ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load this group.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.headerArea}>
            <GroupCover name={group.name} coverPath={group.cover_path} size={72} />
            <Text style={styles.name}>{group.name}</Text>
            <Text style={styles.meta}>
              {[group.genre, `${group.memberCount} ${group.memberCount === 1 ? "member" : "members"}`]
                .filter(Boolean)
                .join("  ·  ")}
            </Text>

            <Button
              title={group.isMember ? "Leave group" : "Join group"}
              variant={group.isMember ? "secondary" : "primary"}
              loading={toggleMembership.isPending}
              style={styles.joinBtn}
              onPress={() =>
                toggleMembership.mutate({
                  groupId: group.id,
                  isMember: group.isMember,
                })
              }
            />
          </View>

          <View style={styles.tabs}>
            {TABS.map((t) => (
              <Pressable
                key={t}
                style={[styles.tab, tab === t && styles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>

          {tab === "Posts" ? (
            (posts?.length ?? 0) === 0 ? (
              <View style={styles.tabBody}>
                <Ionicons name="chatbubbles-outline" size={28} color={colors.textTertiary} />
                <Text style={styles.muted}>No posts yet.</Text>
                <Text style={styles.mutedSmall}>
                  {group.isMember ? "Be the first to post." : "Join to post here."}
                </Text>
              </View>
            ) : (
              <View style={styles.posts}>
                {posts?.map((p) => (
                  <GroupPostCard key={p.id} post={p} onPress={() => openPost(p.id)} />
                ))}
              </View>
            )
          ) : tab === "Members" ? (
            <View style={styles.members}>
              {group.members.map((m) => (
                <MemberRow key={m.id} member={m} />
              ))}
            </View>
          ) : (
            <View style={styles.about}>
              {group.description ? (
                <Text style={styles.aboutText}>{group.description}</Text>
              ) : (
                <Text style={styles.muted}>No description.</Text>
              )}
              {group.genre ? (
                <AboutRow label="Genre" value={group.genre} />
              ) : null}
              <AboutRow label="Members" value={String(group.memberCount)} />
              <AboutRow
                label="Created"
                value={new Date(group.created_at).toLocaleDateString()}
              />
            </View>
          )}
        </ScrollView>
      )}

      {group?.isMember && tab === "Posts" ? (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/social/new-post",
              params: { groupId: group.id },
            })
          }
        >
          <Ionicons name="add" size={28} color={colors.textInverse} />
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

function MemberRow({ member }: { member: GroupMember }) {
  return (
    <Pressable
      style={styles.memberRow}
      onPress={() =>
        router.push({ pathname: "/profile/[id]", params: { id: member.id } })
      }
    >
      <Avatar name={member.display_name || member.username} size={40} />
      <View style={styles.flex}>
        <Text style={styles.memberName}>
          {member.display_name || member.username}
        </Text>
        <Text style={styles.memberHandle}>@{member.username}</Text>
      </View>
      {member.role === "owner" ? (
        <View style={styles.ownerBadge}>
          <Text style={styles.ownerText}>OWNER</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.aboutRow}>
      <Text style={styles.aboutLabel}>{label}</Text>
      <Text style={styles.aboutValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  mutedSmall: { color: colors.textTertiary, fontSize: fontSize.xs, textAlign: "center" },
  flex: { flex: 1 },
  body: { paddingBottom: spacing.xxl },

  headerArea: { alignItems: "center", paddingHorizontal: spacing.xl, gap: spacing.sm },
  name: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text, textAlign: "center" },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary },
  joinBtn: { alignSelf: "stretch", marginTop: spacing.sm },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: colors.text },
  tabLabel: { fontSize: fontSize.sm, color: colors.textTertiary, fontWeight: "600" },
  tabLabelActive: { color: colors.text },

  tabBody: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xxl },
  posts: { padding: spacing.lg, gap: spacing.md },
  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabPressed: { backgroundColor: colors.accentPressed },

  members: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  memberName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  memberHandle: { fontSize: fontSize.sm, color: colors.textSecondary },
  ownerBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  ownerText: { fontSize: 10, fontWeight: "800", color: colors.accent },

  about: { padding: spacing.xl, gap: spacing.md },
  aboutText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
  aboutRow: { flexDirection: "row", justifyContent: "space-between" },
  aboutLabel: { fontSize: fontSize.sm, color: colors.textTertiary },
  aboutValue: { fontSize: fontSize.sm, color: colors.text, fontWeight: "600" },
});
