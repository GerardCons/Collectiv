import { GradientThumb } from "@/components/home/gradient-thumb";
import { GroupAvatar, GroupPostCard } from "@/components/social/social-bits";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { getGroup, GROUP_EVENTS, GROUP_MEDIA, GROUP_MEMBERS, GROUP_POSTS } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Discussion", "Members", "Media", "Events"] as const;
const FRIEND_DOTS = ["#E76F51", "#7C3AED", "#10B981", "#f59e0b"];

export default function GroupDetail() {
  const { colors } = useTheme();
  const { id, joined: joinedParam } = useLocalSearchParams<{ id: string; joined?: string }>();
  const group = getGroup(id ?? "g3");

  const [joined, setJoined] = useState(joinedParam !== "0");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Discussion");
  const [menuOpen, setMenuOpen] = useState(false);
  const [justJoined, setJustJoined] = useState(false);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      {/* Cover */}
      <View style={styles.cover}>
        <LinearGradient colors={["#1a1210", group.color]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.4 }} style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={["top"]} style={styles.coverNav}>
          <Pressable style={styles.coverBtn} onPress={back} hitSlop={6}>
            <Ionicons name="arrow-back" size={17} color="#fff" />
          </Pressable>
          {joined ? (
            <View style={styles.coverRight}>
              <Pressable style={styles.coverBtn} onPress={() => router.push("/(tabs)/social/search")} hitSlop={6}>
                <Ionicons name="search" size={15} color="#fff" />
              </Pressable>
              <Pressable style={styles.coverBtn} onPress={() => setMenuOpen(true)} hitSlop={6}>
                <Ionicons name="ellipsis-horizontal" size={16} color="#fff" />
              </Pressable>
            </View>
          ) : null}
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Identity */}
        <View style={styles.identity}>
          <View style={styles.identityTop}>
            <View style={[styles.groupTile, { borderColor: colors.bgBase }]}>
              <GroupAvatar group={group} size={62} />
            </View>
            <View style={styles.identityActions}>
              {joined ? (
                <>
                  <View style={[styles.joinedPill, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
                    <Text style={[styles.joinedText, { color: colors.secondary }]}>✓ Joined</Text>
                  </View>
                  <Pressable style={[styles.smallCircle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => Alert.alert("Notifications")}>
                    <Ionicons name="notifications-outline" size={14} color={colors.fgPrimary} />
                  </Pressable>
                  <Pressable style={[styles.smallCircle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => router.push("/(tabs)/social/new-post")}>
                    <Ionicons name="add" size={16} color={colors.secondary} />
                  </Pressable>
                </>
              ) : null}
            </View>
          </View>
          <Text style={[styles.groupName, { color: colors.fgPrimary }]}>{group.name}</Text>
          <Text style={[styles.groupMeta, { color: colors.fgSecondary }]}>
            {group.privacy === "private" ? "🔒 Private" : "🌐 Public"} group · {group.members} members
          </Text>
          <View style={styles.friendsRow}>
            <View style={styles.dots}>
              {FRIEND_DOTS.map((c, i) => (
                <View key={i} style={[styles.friendDot, { backgroundColor: c, borderColor: colors.bgBase, marginLeft: i > 0 ? -8 : 0 }]} />
              ))}
            </View>
            <Text style={[styles.friendsText, { color: colors.fgTertiary }]}>Marcus, Ava + 5 friends are members</Text>
          </View>
        </View>

        {justJoined ? (
          <View style={[styles.welcome, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
            <Text style={styles.welcomeGlyph}>🎉</Text>
            <View style={styles.flex}>
              <Text style={[styles.welcomeTitle, { color: colors.secondary }]}>You&apos;re in!</Text>
              <Text style={[styles.welcomeSub, { color: colors.fgSecondary }]}>Say hi to the group or set your notifications.</Text>
            </View>
          </View>
        ) : null}

        {joined ? (
          <>
            {/* Tabs */}
            <View style={[styles.tabs, { borderBottomColor: colors.borderDefault }]}>
              {TABS.map((t) => {
                const on = t === tab;
                return (
                  <Pressable key={t} onPress={() => setTab(t)} style={styles.tab}>
                    <Text style={[styles.tabText, { color: on ? colors.fgPrimary : colors.fgTertiary }]}>{t}</Text>
                    <View style={[styles.tabUnderline, { backgroundColor: on ? colors.secondary : "transparent" }]} />
                  </Pressable>
                );
              })}
            </View>

            {tab === "Discussion" ? (
              <View>
                <Pressable style={[styles.composer, { borderBottomColor: colors.borderDefault }]} onPress={() => router.push("/(tabs)/social/new-post")}>
                  <Avatar name="Jake" size={36} color="#E76F51" />
                  <Text style={[styles.composerText, { color: colors.fgTertiary }]}>Share something with the group…</Text>
                  <Text style={styles.imgGlyph}>🖼</Text>
                </Pressable>
                {GROUP_POSTS.map((p, i) => (
                  <GroupPostCard key={i} post={p} />
                ))}
              </View>
            ) : null}

            {tab === "Members" ? (
              <View style={styles.tabBody}>
                <View style={styles.membersHead}>
                  <Text style={[styles.membersCount, { color: colors.fgPrimary }]}>{group.members} members</Text>
                  <Pressable style={[styles.inviteBtn, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]} onPress={() => router.push("/(tabs)/social/invite")}>
                    <Ionicons name="add" size={12} color={colors.secondary} />
                    <Text style={[styles.inviteText, { color: colors.secondary }]}>Invite</Text>
                  </Pressable>
                </View>
                {GROUP_MEMBERS.map((m) => (
                  <View key={m.handle} style={styles.memberRow}>
                    <Avatar name={m.name} size={40} color={m.color} />
                    <View style={styles.flex}>
                      <View style={styles.memberNameRow}>
                        <Text style={[styles.memberName, { color: colors.fgPrimary }]}>{m.name}</Text>
                        {m.role ? (
                          <View style={[styles.roleBadge, { backgroundColor: colors.secondaryMuted }]}>
                            <Text style={[styles.roleText, { color: colors.secondary }]}>{m.role}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={[styles.memberHandle, { color: colors.fgTertiary }]}>@{m.handle}{m.friend ? " · Following" : ""}</Text>
                    </View>
                    <Pressable
                      style={[styles.memberBtn, m.friend ? { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault } : { backgroundColor: colors.secondary }]}
                      onPress={() => Alert.alert(m.friend ? "Message" : "Follow", `@${m.handle}`)}
                    >
                      <Text style={[styles.memberBtnText, { color: m.friend ? colors.fgSecondary : "#fff" }]}>{m.friend ? "Message" : "Follow"}</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}

            {tab === "Media" ? (
              <View style={styles.mediaTab}>
                <Text style={[styles.mediaCount, { color: colors.fgPrimary }]}>Shared media · 248</Text>
                <View style={styles.mediaGrid}>
                  {GROUP_MEDIA.map((c, i) => (
                    <View key={i} style={styles.mediaCell}>
                      <GradientThumb accent={c} width="100%" height={92} radius={8} />
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {tab === "Events" ? (
              <View style={styles.tabBody}>
                <Text style={[styles.mediaCount, { color: colors.fgPrimary, marginBottom: 10 }]}>Upcoming · {GROUP_EVENTS.length}</Text>
                {GROUP_EVENTS.map((e, i) => (
                  <View key={i} style={[styles.geRow, { borderBottomColor: colors.borderDefault }]}>
                    <View style={[styles.geDate, { borderColor: colors.borderDefault }]}>
                      <Text style={[styles.geMonth, { backgroundColor: e.color }]}>{e.month}</Text>
                      <Text style={[styles.geDay, { color: colors.fgPrimary }]}>{e.day}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text style={[styles.geTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{e.title}</Text>
                      <Text style={[styles.geMeta, { color: colors.fgTertiary }]}>📍 {e.loc}</Text>
                      <Text style={[styles.geMeta, { color: colors.fgSecondary }]}>👥 {e.going} going</Text>
                    </View>
                    <Pressable style={[styles.rsvp, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]} onPress={() => Alert.alert("RSVP", e.title)}>
                      <Text style={[styles.rsvpText, { color: colors.secondary }]}>RSVP</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : (
          /* ── Public preview ── */
          <View style={styles.preview}>
            <View style={[styles.aboutCard, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Text style={[styles.aboutLabel, { color: colors.fgPrimary }]}>About</Text>
              <Text style={[styles.aboutText, { color: colors.fgSecondary }]}>{group.about}</Text>
            </View>
            <View style={[styles.friendsCard, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <View style={styles.dots}>
                {FRIEND_DOTS.slice(0, 3).map((c, i) => (
                  <View key={i} style={[styles.friendDot, { backgroundColor: c, borderColor: colors.bgBase, marginLeft: i > 0 ? -8 : 0 }]} />
                ))}
              </View>
              <Text style={[styles.friendsCardText, { color: colors.fgSecondary }]}>4 friends are members</Text>
            </View>
            <View style={styles.locked}>
              <View style={styles.lockedBlur} pointerEvents="none">
                <GroupPostCard post={GROUP_POSTS[1]} />
              </View>
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockGlyph}>🔒</Text>
                <Text style={[styles.lockText, { color: colors.fgSecondary }]}>Join to see posts & discussions</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Join (public) */}
      {!joined ? (
        <View style={[styles.joinBar, { backgroundColor: colors.bgBase, borderTopColor: colors.borderDefault }]}>
          <Pressable
            style={[styles.joinBtn, { backgroundColor: colors.secondary }]}
            onPress={() => {
              setJoined(true);
              setJustJoined(true);
            }}
          >
            <Text style={styles.joinBtnText}>Join Group</Text>
          </Pressable>
        </View>
      ) : null}

      {/* ··· group menu */}
      <ActionSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        header={{ title: group.name, subtitle: `${group.privacy === "private" ? "🔒 Private" : "🌐 Public"} · ${group.members} members`, avatar: <GroupAvatar group={group} size={40} /> }}
        actions={[
          { icon: "document-text-outline", label: "Manage your content", onPress: () => {} },
          { icon: "person-remove-outline", label: "Unfollow group", onPress: () => {} },
          { icon: "bookmark-outline", label: "Unpin group", onPress: () => {} },
          { icon: "person-add-outline", label: "Invite", onPress: () => router.push("/(tabs)/social/invite") },
          { icon: "share-social-outline", label: "Share", onPress: () => {} },
          { icon: "notifications-outline", label: "Manage notifications", onPress: () => router.push("/(tabs)/social/notif-prefs") },
          { icon: "flag-outline", label: "Report group", danger: true, onPress: () => {} },
          { icon: "exit-outline", label: "Leave group", danger: true, onPress: () => {} },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  cover: { height: 130 },
  coverNav: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: space.lg, paddingTop: 4 },
  coverRight: { flexDirection: "row", gap: 8 },
  coverBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },

  identity: { paddingHorizontal: space.lg, paddingBottom: 10 },
  identityTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginTop: -34 },
  groupTile: { borderRadius: 18, borderWidth: 3 },
  identityActions: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 38 },
  joinedPill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  joinedText: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  smallCircle: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  groupName: { fontFamily: fontFamily.socialExtrabold, fontSize: 20, marginTop: 9 },
  groupMeta: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 3 },
  friendsRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  dots: { flexDirection: "row" },
  friendDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  friendsText: { fontFamily: fontFamily.body, fontSize: 10.5 },

  welcome: { flexDirection: "row", alignItems: "center", gap: 11, marginHorizontal: space.lg, marginBottom: 12, padding: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  welcomeGlyph: { fontSize: 22 },
  welcomeTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 13 },
  welcomeSub: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },

  tabs: { flexDirection: "row", paddingHorizontal: space.lg, borderBottomWidth: 1, gap: 22 },
  tab: { alignItems: "center", paddingTop: 11, gap: 9 },
  tabText: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  tabUnderline: { height: 2.5, width: "100%", borderRadius: 2 },

  composer: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: space.lg, paddingVertical: 12, borderBottomWidth: 1 },
  composerText: { flex: 1, fontFamily: fontFamily.body, fontSize: 12.5 },
  imgGlyph: { fontSize: 16 },

  tabBody: { paddingHorizontal: space.lg, paddingTop: 12 },
  membersHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  membersCount: { fontFamily: fontFamily.socialExtrabold, fontSize: 12 },
  inviteBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  inviteText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9 },
  memberNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  memberName: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  roleBadge: { paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999 },
  roleText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5 },
  memberHandle: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
  memberBtn: { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 999 },
  memberBtnText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  mediaTab: { paddingTop: 12 },
  mediaCount: { fontFamily: fontFamily.socialExtrabold, fontSize: 12, paddingHorizontal: space.lg },
  mediaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 3, paddingHorizontal: 4, marginTop: 8 },
  mediaCell: { width: "32.7%" },

  geRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 11, borderBottomWidth: 1 },
  geDate: { width: 46, borderRadius: 11, overflow: "hidden", borderWidth: 1, alignItems: "stretch" },
  geMonth: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, color: "#fff", textAlign: "center", paddingVertical: 3 },
  geDay: { fontFamily: fontFamily.socialExtrabold, fontSize: 18, textAlign: "center", paddingVertical: 2 },
  geTitle: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  geMeta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 3 },
  rsvp: { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  rsvpText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  preview: { paddingHorizontal: space.lg, paddingTop: 4 },
  aboutCard: { padding: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  aboutLabel: { fontFamily: fontFamily.socialBold, fontSize: 12, marginBottom: 5 },
  aboutText: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 18 },
  friendsCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 11, paddingHorizontal: 13, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  friendsCardText: { fontFamily: fontFamily.socialSemibold, fontSize: 11 },
  locked: { position: "relative" },
  lockedBlur: { opacity: 0.35 },
  lockedOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: 4 },
  lockGlyph: { fontSize: 18 },
  lockText: { fontFamily: fontFamily.socialBold, fontSize: 12 },

  joinBar: { padding: space.lg, paddingBottom: 28, borderTopWidth: 1 },
  joinBtn: { paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  joinBtnText: { fontFamily: fontFamily.socialBold, fontSize: 15, color: "#fff" },
});
