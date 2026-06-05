import { SocialSection } from "@/components/social/social-section";
import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { RsvpStatus, useEvent, useRsvpSummary, useSetRsvp } from "@/hooks/use-events";
import { formatEventDate } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPE_LABEL: Record<string, string> = {
  meetup: "Meetup",
  tournament: "Tournament",
  convention: "Convention",
  other: "Event",
};

const RSVP_OPTIONS: { key: RsvpStatus; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { key: "going", icon: "checkmark-circle", label: "Going" },
  { key: "interested", icon: "star", label: "Interested" },
  { key: "not_going", icon: "close-circle", label: "Can't go" },
];

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { data: event, isLoading, isError } = useEvent(id);
  const { data: rsvp } = useRsvpSummary(id);
  const setRsvp = useSetRsvp();

  const isHost = !!event && event.host_user_id === session?.user.id;
  const coverUri = cardPhotoUrl(event?.cover_path);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }

  function toggleRsvp(status: RsvpStatus) {
    if (!id) return;
    setRsvp.mutate({
      eventId: id,
      status: rsvp?.myStatus === status ? null : status,
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onBack={back} title={TYPE_LABEL[event?.event_type ?? "meetup"] ?? "Event"} />

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      ) : isError || !event ? (
        <View style={styles.center}><Text style={styles.muted}>Couldn&apos;t load this event.</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          {/* Cover */}
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.cover} contentFit="cover" />
          ) : (
            <View style={styles.coverEmpty}>
              <Ionicons name="calendar-outline" size={36} color={colors.textTertiary} />
            </View>
          )}

          {/* Info */}
          <Text style={styles.name}>{event.name}</Text>

          <View style={styles.metaList}>
            <MetaRow icon="calendar-outline" text={formatEventDate(event.starts_at)} />
            {event.address ? <MetaRow icon="location-outline" text={event.address} /> : null}
            {event.genre ? <MetaRow icon="pricetag-outline" text={event.genre} /> : null}
            {event.max_attendees ? (
              <MetaRow icon="people-outline" text={`Max ${event.max_attendees} attendees`} />
            ) : null}
          </View>

          {/* Host */}
          <Pressable
            style={styles.hostRow}
            onPress={() =>
              router.push({ pathname: "/profile/[id]", params: { id: event.host_user_id } })
            }
          >
            <Avatar name={event.host?.display_name || event.host?.username} size={40} />
            <View style={styles.flex}>
              <Text style={styles.hostLabel}>Hosted by</Text>
              <Text style={styles.hostName}>
                {event.host?.display_name || event.host?.username}
                {event.host?.is_vendor ? " · Vendor" : ""}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </Pressable>

          {event.description ? (
            <Text style={styles.description}>{event.description}</Text>
          ) : null}

          {/* RSVP buttons */}
          {!isHost ? (
            <View style={styles.rsvpRow}>
              {RSVP_OPTIONS.map((opt) => {
                const active = rsvp?.myStatus === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    style={[styles.rsvpBtn, active && styles.rsvpBtnActive]}
                    onPress={() => toggleRsvp(opt.key)}
                    disabled={setRsvp.isPending}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={active ? colors.textInverse : colors.text}
                    />
                    <Text style={[styles.rsvpLabel, active && styles.rsvpLabelActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.hostBadge}>
              <Ionicons name="star" size={16} color={colors.accent} />
              <Text style={styles.hostBadgeText}>You&apos;re hosting this event</Text>
            </View>
          )}

          {/* RSVP counts + avatars */}
          <View style={styles.counts}>
            <Text style={styles.countText}>
              <Text style={styles.countNum}>{rsvp?.going ?? 0}</Text> going  ·
              <Text style={styles.countNum}>{rsvp?.interested ?? 0}</Text> interested
            </Text>
            {(rsvp?.goingUsers.length ?? 0) > 0 ? (
              <View style={styles.avatarRow}>
                {rsvp!.goingUsers.slice(0, 6).map((u) => (
                  <View key={u.id} style={styles.avatarWrap}>
                    <Avatar name={u.display_name || u.username} size={30} />
                  </View>
                ))}
                {(rsvp?.going ?? 0) > 6 ? (
                  <View style={[styles.avatarWrap, styles.overflow]}>
                    <Text style={styles.overflowText}>+{(rsvp?.going ?? 0) - 6}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>

          {/* Discussion */}
          <SocialSection targetType="event" targetId={event.id} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function MetaRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={16} color={colors.accent} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  flex: { flex: 1 },
  body: { paddingBottom: spacing.xxl },

  cover: { width: "100%", height: 200, backgroundColor: colors.surface },
  coverEmpty: {
    width: "100%", height: 140, backgroundColor: colors.surface,
    alignItems: "center", justifyContent: "center",
  },

  name: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text, padding: spacing.xl, paddingBottom: spacing.sm },

  metaList: { paddingHorizontal: spacing.xl, gap: spacing.sm, marginBottom: spacing.md },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  metaText: { fontSize: fontSize.sm, color: colors.text },

  hostRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    marginHorizontal: spacing.xl, marginBottom: spacing.md,
    backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: spacing.md,
  },
  hostLabel: { fontSize: fontSize.xs, color: colors.textTertiary },
  hostName: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },

  description: {
    fontSize: fontSize.sm, color: colors.text, lineHeight: 20,
    paddingHorizontal: spacing.xl, marginBottom: spacing.md,
  },

  rsvpRow: {
    flexDirection: "row", gap: spacing.sm,
    paddingHorizontal: spacing.xl, marginBottom: spacing.md,
  },
  rsvpBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: spacing.xs, paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
  },
  rsvpBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  rsvpLabel: { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  rsvpLabelActive: { color: colors.textInverse },

  hostBadge: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    marginHorizontal: spacing.xl, marginBottom: spacing.md,
    backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: spacing.md,
  },
  hostBadgeText: { color: colors.accent, fontWeight: "700", fontSize: fontSize.sm },

  counts: { paddingHorizontal: spacing.xl, marginBottom: spacing.md, gap: spacing.sm },
  countText: { fontSize: fontSize.sm, color: colors.textSecondary },
  countNum: { fontWeight: "800", color: colors.text },
  avatarRow: { flexDirection: "row" },
  avatarWrap: { marginRight: -8 },
  overflow: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.surface, alignItems: "center", justifyContent: "center",
  },
  overflowText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.text },
});
