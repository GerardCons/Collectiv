import { EventCard, GroupRow } from "@/components/social/social-bits";
import { ActionSheet } from "@/components/ui/action-sheet";
import { fontFamily, space } from "@/constants/theme";
import {
  DISCOVER_GROUPS,
  EVENTS,
  EventItem,
  MANAGE_ROWS,
  NEARBY_GROUPS,
  YOUR_GROUPS,
} from "@/lib/social-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GView = "your" | "near" | "discover";
const SUBS: { id: GView; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { id: "your", icon: "people-outline", label: "Your Groups" },
  { id: "near", icon: "location-outline", label: "Near You" },
  { id: "discover", icon: "sparkles-outline", label: "Discover" },
];
const GROUP_META: Record<GView, { list: typeof YOUR_GROUPS; desc: string }> = {
  your: { list: YOUR_GROUPS, desc: "Groups you've joined" },
  near: { list: NEARBY_GROUPS, desc: "Active groups around Edmonton, AB" },
  discover: { list: DISCOVER_GROUPS, desc: "Recommended from the cards you collect" },
};
const SORTS = ["Discover", "This Week", "Interested"];

export default function SocialHome() {
  const { colors } = useTheme();
  const [view, setView] = useState<"groups" | "events">("groups");
  const [gview, setGview] = useState<GView>("your");
  const [esort, setEsort] = useState("Discover");
  const [events, setEvents] = useState<EventItem[]>(EVENTS);
  const [createOpen, setCreateOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const meta = GROUP_META[gview];
  const visibleEvents =
    esort === "This Week" ? events.filter((e) => e.week) : esort === "Interested" ? events.filter((e) => e.isInterested) : events;

  function toggleInterested(id: string) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, isInterested: !e.isInterested } : e)));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.titleBtn} onPress={() => setView((v) => (v === "groups" ? "events" : "groups"))}>
          <Text style={[styles.title, { color: colors.fgPrimary }]}>{view === "groups" ? "Groups" : "Events"}</Text>
          <View style={[styles.chevCircle, { backgroundColor: colors.secondaryMuted }]}>
            <Ionicons name={view === "groups" ? "chevron-down" : "chevron-up"} size={13} color={colors.secondary} />
          </View>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={[styles.createBtn, { backgroundColor: colors.secondary }]} onPress={() => setCreateOpen(true)}>
            <Ionicons name="add" size={20} color="#fff" />
          </Pressable>
          <Pressable style={[styles.iconCircle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={15} color={colors.fgPrimary} />
            <View style={[styles.bellDot, { backgroundColor: colors.secondary, borderColor: colors.bgBase }]} />
          </Pressable>
          <Pressable style={[styles.iconCircle, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => setManageOpen(true)}>
            <Ionicons name="person-outline" size={15} color={colors.fgSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <Pressable style={styles.searchWrap} onPress={() => router.push("/(tabs)/social/search")}>
        <View style={[styles.search, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="search" size={14} color={colors.fgTertiary} />
          <Text style={[styles.searchText, { color: colors.fgTertiary }]}>{view === "groups" ? "Search groups…" : "Search events…"}</Text>
        </View>
      </Pressable>

      {view === "groups" ? (
        <>
          <View style={styles.subToggle}>
            {SUBS.map((s) => {
              const on = s.id === gview;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setGview(s.id)}
                  style={[styles.subChip, { backgroundColor: on ? colors.secondaryMuted : colors.bgSurface, borderColor: on ? colors.secondary : colors.borderDefault }]}
                >
                  <Ionicons name={s.icon} size={13} color={on ? colors.secondary : colors.fgSecondary} />
                  <Text style={[styles.subText, { color: on ? colors.secondary : colors.fgSecondary }]}>{s.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <Text style={[styles.desc, { color: colors.fgTertiary }]}>{meta.desc}</Text>
            {meta.list.map((g) => (
              <GroupRow key={g.id} group={g} />
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.sortRow}>
            {SORTS.map((s) => {
              const on = s === esort;
              return (
                <Pressable
                  key={s}
                  onPress={() => setEsort(s)}
                  style={[styles.sortChip, { backgroundColor: on ? colors.secondaryMuted : colors.bgSurface, borderColor: on ? colors.secondary : colors.borderDefault }]}
                >
                  <Text style={[styles.sortText, { color: on ? colors.secondary : colors.fgSecondary }]}>{s === "Discover" ? "Discover (All)" : s}</Text>
                </Pressable>
              );
            })}
          </View>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {visibleEvents.map((e) => (
              <EventCard key={e.id} event={e} onToggleInterested={() => toggleInterested(e.id)} />
            ))}
          </ScrollView>
        </>
      )}

      {/* Create chooser */}
      <ActionSheet
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        actions={[
          { icon: "people-outline", label: "Create Group", sub: "Start a community", onPress: () => router.push("/(tabs)/social/create-group") },
          { icon: "calendar-outline", label: "Create Event", sub: "Host a meetup, show, or break", onPress: () => router.push("/(tabs)/social/create-event") },
          { icon: "create-outline", label: "Create Post", sub: "Share with a group", onPress: () => router.push("/(tabs)/social/new-post") },
        ]}
      />

      {/* Manage menu */}
      <ActionSheet
        visible={manageOpen}
        onClose={() => setManageOpen(false)}
        actions={MANAGE_ROWS.map((r) => ({
          icon: r.icon as keyof typeof Ionicons.glyphMap,
          label: r.title,
          sub: r.sub,
          onPress: () => router.push(r.route as never),
        }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.lg, paddingTop: 2, paddingBottom: 12 },
  titleBtn: { flexDirection: "row", alignItems: "center", gap: 9 },
  title: { fontFamily: fontFamily.socialExtrabold, fontSize: 26 },
  chevCircle: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  createBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  iconCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  bellDot: { position: "absolute", top: 1, right: 1, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },

  searchWrap: { paddingHorizontal: space.lg, paddingBottom: 12 },
  search: { flexDirection: "row", alignItems: "center", gap: 8, height: 38, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  searchText: { fontFamily: fontFamily.body, fontSize: 13 },

  subToggle: { flexDirection: "row", gap: 6, paddingHorizontal: space.lg, paddingBottom: 12 },
  subChip: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 8, borderRadius: 11, borderWidth: 1 },
  subText: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },

  sortRow: { flexDirection: "row", gap: 7, paddingHorizontal: space.lg, paddingBottom: 12 },
  sortChip: { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  sortText: { fontFamily: fontFamily.socialBold, fontSize: 11 },

  list: { paddingHorizontal: space.lg, paddingBottom: 16 },
  desc: { fontFamily: fontFamily.body, fontSize: 10.5, marginBottom: 2 },
});
