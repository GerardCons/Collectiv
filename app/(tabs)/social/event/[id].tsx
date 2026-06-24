import { Avatar } from "@/components/ui/avatar";
import { ActionSheet } from "@/components/ui/action-sheet";
import { fontFamily, space } from "@/constants/theme";
import { EVENT_GENRES, getEvent, getGroup, GOING_AVATARS, MUTUAL_FRIENDS, SUGGESTED_EVENTS } from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventDetail() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = getEvent(id ?? "e1");
  const host = getGroup(event.hostId);

  const [interested, setInterested] = useState(event.isInterested);
  const [going, setGoing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [invited, setInvited] = useState<Record<string, boolean>>({});

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }
  function directions() {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(event.address)}`).catch(() => {});
  }
  async function share() {
    try {
      await Share.share({ message: `${event.title} · ${event.month} ${event.day} · ${event.loc}` });
    } catch {
      /* dismissed */
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      {/* Poster */}
      <View style={styles.poster}>
        <LinearGradient colors={["#1a1210", event.color]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.4 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={["transparent", "rgba(14,10,8,0.7)"]} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={["top"]} style={styles.posterNav}>
          <Pressable style={styles.posterBtn} onPress={back} hitSlop={6}>
            <Ionicons name="arrow-back" size={17} color="#fff" />
          </Pressable>
          <Pressable style={styles.posterBtn} onPress={() => Alert.alert("Edit event")} hitSlop={6}>
            <Ionicons name="create-outline" size={15} color="#fff" />
          </Pressable>
        </SafeAreaView>
        <View style={styles.posterCaption}>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{event.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.posterTitle}>{event.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Date / location */}
        <View style={styles.dtRow}>
          <View style={[styles.dateBlock, { borderColor: colors.borderDefault }]}>
            <Text style={[styles.dateMonth, { backgroundColor: event.color }]}>{event.month}</Text>
            <Text style={[styles.dateDay, { color: colors.fgPrimary }]}>{event.day}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={[styles.dtTitle, { color: colors.fgPrimary }]}>Saturday, June {event.day}, 2026</Text>
            <Text style={[styles.dtSub, { color: colors.fgSecondary }]}>🕐 8:00 AM – 5:00 PM</Text>
          </View>
        </View>
        <View style={styles.dtRow}>
          <View style={[styles.locTile, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <Text style={{ fontSize: 17 }}>📍</Text>
          </View>
          <View style={styles.flex}>
            <Text style={[styles.dtTitle, { color: colors.fgPrimary }]}>{event.loc}</Text>
            <Text style={[styles.dtSub, { color: colors.fgSecondary }]} numberOfLines={1}>{event.address}</Text>
            <Pressable onPress={directions} hitSlop={6}>
              <Text style={[styles.directions, { color: colors.secondary }]}>Get directions →</Text>
            </Pressable>
          </View>
        </View>

        {/* Interested / Going / ··· */}
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.rsvpBtn, interested ? { backgroundColor: colors.secondary } : { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault }]}
            onPress={() => setInterested((v) => !v)}
          >
            <Text style={[styles.rsvpText, { color: interested ? "#fff" : colors.fgPrimary }]}>★ Interested</Text>
          </Pressable>
          <Pressable
            style={[styles.rsvpBtn, going ? { backgroundColor: colors.secondary } : { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault }]}
            onPress={() => setGoing((v) => !v)}
          >
            <Text style={[styles.rsvpText, { color: going ? "#fff" : colors.fgPrimary }]}>✓ Going</Text>
          </Pressable>
          <Pressable style={[styles.moreBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => setMenuOpen(true)}>
            <Ionicons name="ellipsis-horizontal" size={15} color={colors.fgPrimary} />
          </Pressable>
        </View>

        {/* Going row */}
        <View style={[styles.goingRow, { backgroundColor: colors.secondaryMuted }]}>
          <View style={styles.dots}>
            {GOING_AVATARS.map((c, i) => (
              <View key={i} style={[styles.goingDot, { backgroundColor: c, borderColor: colors.bgBase, marginLeft: i > 0 ? -9 : 0 }]} />
            ))}
          </View>
          <Text style={[styles.goingText, { color: colors.secondary }]}>{event.going} going · {event.interested} interested</Text>
        </View>

        {/* Genre */}
        <View style={styles.genres}>
          {EVENT_GENRES.map((g) => (
            <View key={g} style={[styles.genreChip, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
              <Text style={[styles.genreText, { color: colors.fgSecondary }]}>{g}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>About this event</Text>
        <Text style={[styles.about, { color: colors.fgSecondary }]}>{event.about}</Text>

        {/* Host */}
        <Pressable
          style={[styles.host, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
          onPress={() => router.push({ pathname: "/(tabs)/social/[id]", params: { id: host.id, joined: host.joined ? "1" : "0" } })}
        >
          <Avatar name={host.name} size={34} color={event.color} />
          <View style={styles.flex}>
            <Text style={[styles.hostName, { color: colors.fgPrimary }]}>Hosted by {host.name}</Text>
            <Text style={[styles.hostMeta, { color: colors.fgTertiary }]}>{host.members} members · Group</Text>
          </View>
          <View style={[styles.viewPill, { backgroundColor: colors.secondaryMuted, borderColor: colors.secondary }]}>
            <Text style={[styles.viewText, { color: colors.secondary }]}>View</Text>
          </View>
        </Pressable>

        {/* Go with friends */}
        <Text style={[styles.sectionTitle, { color: colors.fgPrimary, marginTop: 14 }]}>Go with friends</Text>
        <Text style={[styles.hint, { color: colors.fgTertiary }]}>You can invite people you follow each other with.</Text>
        {MUTUAL_FRIENDS.map((f) => {
          const inv = invited[f.handle];
          return (
            <View key={f.handle} style={[styles.friendRow, { borderBottomColor: colors.borderDefault }]}>
              <Avatar name={f.name} size={36} color={f.color} />
              <Text style={[styles.friendName, { color: colors.fgPrimary }]}>{f.name}</Text>
              <Pressable
                style={[styles.inviteFriend, { backgroundColor: inv ? colors.secondary : colors.secondaryMuted }]}
                onPress={() => setInvited((p) => ({ ...p, [f.handle]: !p[f.handle] }))}
              >
                <Text style={[styles.inviteFriendText, { color: inv ? "#fff" : colors.secondary }]}>{inv ? "Invited" : "Invite"}</Text>
              </Pressable>
            </View>
          );
        })}
        <Pressable style={[styles.inviteAll, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => router.push("/(tabs)/social/invite")}>
          <Ionicons name="person-add-outline" size={15} color={colors.fgPrimary} />
          <Text style={[styles.inviteAllText, { color: colors.fgPrimary }]}>Invite friends</Text>
        </Pressable>

        {/* Suggested */}
        <View style={styles.suggestHead}>
          <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>Suggested events</Text>
          <Text style={[styles.seeAll, { color: colors.secondary }]}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestRow}>
          {SUGGESTED_EVENTS.map((s, i) => (
            <View key={i} style={[styles.suggestCard, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }]}>
              <View style={styles.suggestBanner}>
                <LinearGradient colors={["#1a1210", s.color]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.6 }} style={StyleSheet.absoluteFill} />
                <View style={styles.suggestDate}>
                  <Text style={[styles.suggestMonth, { backgroundColor: s.color }]}>{s.month}</Text>
                  <Text style={styles.suggestDay}>{s.day}</Text>
                </View>
              </View>
              <View style={styles.suggestMeta}>
                <Text style={[styles.suggestTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{s.title}</Text>
                <Text style={[styles.suggestSub, { color: colors.fgTertiary }]}>{s.sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* ··· event menu */}
      <ActionSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        header={{ title: event.title, subtitle: `Public · ${event.going} going` }}
        actions={[
          { icon: "person-add-outline", label: "Invite people", onPress: () => router.push("/(tabs)/social/invite") },
          { icon: "share-social-outline", label: "Share", onPress: share },
          { icon: "calendar-outline", label: "Add to calendar", onPress: () => {} },
          { icon: "bookmark-outline", label: "Save", onPress: () => {} },
          { icon: "link-outline", label: "Copy event link", onPress: () => {} },
          { icon: "alert-circle-outline", label: "Find support or report event", danger: true, onPress: () => {} },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  dots: { flexDirection: "row" },

  poster: { height: 208 },
  posterNav: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: space.lg, paddingTop: 4 },
  posterBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  posterCaption: { position: "absolute", left: space.lg, right: space.lg, bottom: 14 },
  typePill: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.92)", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginBottom: 7 },
  typePillText: { fontFamily: fontFamily.socialExtrabold, fontSize: 9, color: "#1a1210", letterSpacing: 0.4 },
  posterTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 21, color: "#fff", lineHeight: 24 },

  body: { padding: space.lg, paddingBottom: 32 },
  dtRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 11 },
  dateBlock: { width: 42, borderRadius: 9, overflow: "hidden", borderWidth: 1, alignItems: "stretch" },
  dateMonth: { fontFamily: fontFamily.socialExtrabold, fontSize: 8, color: "#fff", textAlign: "center", paddingVertical: 2 },
  dateDay: { fontFamily: fontFamily.socialExtrabold, fontSize: 16, textAlign: "center", paddingVertical: 2 },
  locTile: { width: 42, height: 42, borderRadius: 9, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  dtTitle: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  dtSub: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 1 },
  directions: { fontFamily: fontFamily.socialBold, fontSize: 11, marginTop: 2 },

  actionsRow: { flexDirection: "row", gap: 8, marginTop: 4, marginBottom: 14 },
  rsvpBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center" },
  rsvpText: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  moreBtn: { width: 46, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  goingRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 11, paddingHorizontal: 13, borderRadius: 12, marginBottom: 14 },
  goingDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
  goingText: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },

  genres: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  genreChip: { paddingHorizontal: 11, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  genreText: { fontFamily: fontFamily.socialSemibold, fontSize: 10 },

  sectionTitle: { fontFamily: fontFamily.socialBold, fontSize: 12.5, marginBottom: 6 },
  about: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 19, marginBottom: 14 },

  host: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  hostName: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  hostMeta: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  viewPill: { paddingHorizontal: 13, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  viewText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  hint: { fontFamily: fontFamily.body, fontSize: 10, marginBottom: 8 },
  friendRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 8, borderBottomWidth: 1 },
  friendName: { flex: 1, fontFamily: fontFamily.socialSemibold, fontSize: 13 },
  inviteFriend: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 },
  inviteFriendText: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  inviteAll: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10, paddingVertical: 11, borderRadius: 12, borderWidth: 1 },
  inviteAllText: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },

  suggestHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },
  seeAll: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  suggestRow: { gap: 10 },
  suggestCard: { width: 152, borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  suggestBanner: { height: 78 },
  suggestDate: { position: "absolute", top: 8, left: 8, width: 34, borderRadius: 7, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.95)" },
  suggestMonth: { fontFamily: fontFamily.socialExtrabold, fontSize: 7, color: "#fff", textAlign: "center", paddingVertical: 1.5 },
  suggestDay: { fontFamily: fontFamily.socialExtrabold, fontSize: 13, color: "#1a1210", textAlign: "center" },
  suggestMeta: { padding: 8, paddingHorizontal: 10 },
  suggestTitle: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  suggestSub: { fontFamily: fontFamily.body, fontSize: 9.5, marginTop: 2 },
});
