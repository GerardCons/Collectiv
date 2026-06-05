import { GroupCover } from "@/components/ui/group-cover";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { EventWithHost, useEvents } from "@/hooks/use-events";
import { GroupWithMeta, useGroups } from "@/hooks/use-groups";
import { formatEventDate } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Section = "groups" | "events";

export default function CommunityScreen() {
  const { data: groups, isLoading: gLoading, refetch: gRefetch } = useGroups();
  const { data: events, isLoading: eLoading, refetch: eRefetch } = useEvents("upcoming");
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<Section>("groups");

  const visibleGroups = useMemo(() => {
    const all = groups ?? [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter((g) => g.name.toLowerCase().includes(q) || (g.genre ?? "").toLowerCase().includes(q))
      : all;
    return [...filtered].sort((a, b) => Number(b.isMember) - Number(a.isMember));
  }, [groups, query]);

  const visibleEvents = useMemo(() => {
    const all = events ?? [];
    const q = query.trim().toLowerCase();
    return q
      ? all.filter((e) => e.name.toLowerCase().includes(q) || (e.genre ?? "").toLowerCase().includes(q))
      : all;
  }, [events, query]);

  const isLoading = section === "groups" ? gLoading : eLoading;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Pressable onPress={() => router.push("/(tabs)/social/search")} hitSlop={8}>
          <Ionicons name="person-add-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.input}
          placeholder={section === "groups" ? "Search groups" : "Search events"}
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Section toggle */}
      <View style={styles.segment}>
        {(["groups", "events"] as Section[]).map((s) => (
          <Pressable
            key={s}
            style={[styles.segItem, section === s && styles.segItemActive]}
            onPress={() => { setSection(s); setQuery(""); }}
          >
            <Text style={[styles.segLabel, section === s && styles.segLabelActive]}>
              {s === "groups" ? "Groups" : "Events"}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : section === "groups" ? (
        <FlatList
          data={visibleGroups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={gRefetch}
          refreshing={false}
          ListHeaderComponent={
            <Pressable style={styles.createBtn} onPress={() => router.push("/(tabs)/social/create-group")}>
              <Ionicons name="add" size={20} color={colors.accent} />
              <Text style={styles.createText}>Create group</Text>
            </Pressable>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="people-outline" size={32} color={colors.textTertiary} />
              <Text style={styles.muted}>{query ? "No groups match." : "No groups yet — start one!"}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <GroupRow
              group={item}
              onPress={() => router.push({ pathname: "/(tabs)/social/[id]", params: { id: item.id } })}
            />
          )}
        />
      ) : (
        <FlatList
          data={visibleEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={eRefetch}
          refreshing={false}
          ListHeaderComponent={
            <Pressable style={styles.createBtn} onPress={() => router.push("/(tabs)/social/create-event")}>
              <Ionicons name="add" size={20} color={colors.accent} />
              <Text style={styles.createText}>Create event</Text>
            </Pressable>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="calendar-outline" size={32} color={colors.textTertiary} />
              <Text style={styles.muted}>{query ? "No events match." : "No upcoming events — create one!"}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventRow
              event={item}
              onPress={() => router.push({ pathname: "/(tabs)/social/event/[id]", params: { id: item.id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function GroupRow({ group, onPress }: { group: GroupWithMeta; onPress: () => void }) {
  const sub = [group.genre, `${group.memberCount} ${group.memberCount === 1 ? "member" : "members"}`]
    .filter(Boolean).join(" · ");
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} onPress={onPress}>
      <GroupCover name={group.name} coverPath={group.cover_path} size={52} />
      <View style={styles.flex}>
        <Text style={styles.name} numberOfLines={1}>{group.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>{sub}</Text>
      </View>
      {group.isMember
        ? <View style={styles.pill}><Text style={styles.pillText}>Joined</Text></View>
        : <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />}
    </Pressable>
  );
}

function EventRow({ event, onPress }: { event: EventWithHost; onPress: () => void }) {
  const url = cardPhotoUrl(event.cover_path);
  const isPast = new Date(event.starts_at) < new Date();
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} onPress={onPress}>
      <View style={styles.eventThumb}>
        {url
          ? <Image source={{ uri: url }} style={styles.eventThumbImg} contentFit="cover" />
          : <Ionicons name="calendar-outline" size={22} color={colors.textTertiary} />}
      </View>
      <View style={styles.flex}>
        <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>{formatEventDate(event.starts_at)}</Text>
        {event.address
          ? <Text style={styles.sub} numberOfLines={1}>{event.address}</Text>
          : null}
      </View>
      {isPast
        ? <View style={styles.pill}><Text style={styles.pillText}>Past</Text></View>
        : <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.sm, paddingTop: spacing.xxl },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  flex: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  title: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },

  searchBox: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    marginHorizontal: spacing.lg, marginBottom: spacing.sm,
    paddingHorizontal: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceMuted,
  },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.text },

  segment: {
    flexDirection: "row", marginHorizontal: spacing.lg, marginBottom: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, gap: 4,
  },
  segItem: { flex: 1, alignItems: "center", paddingVertical: spacing.sm, borderRadius: radius.sm },
  segItemActive: { backgroundColor: colors.background },
  segLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: "600" },
  segLabelActive: { color: colors.text },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  createBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: spacing.xs, paddingVertical: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.accentSoft, marginBottom: spacing.sm,
  },
  createText: { color: colors.accent, fontSize: fontSize.md, fontWeight: "700" },

  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  rowPressed: { opacity: 0.6 },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  sub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  pill: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  pillText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: "700" },

  eventThumb: {
    width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surface,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  eventThumbImg: { width: "100%", height: "100%" },
});
