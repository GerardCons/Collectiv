import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardGrid } from "@/components/ui/card-grid";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useShowcasedCards } from "@/hooks/use-cards";
import { startConversation } from "@/hooks/use-chat";
import {
  useIsFollowing,
  useProfileStats,
  useToggleFollow,
} from "@/hooks/use-follows";
import { useProfileById } from "@/hooks/use-profile";
import { isProfileOnline } from "@/hooks/use-presence";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Showcase", "Listed", "Posts"] as const;
type Tab = (typeof TABS)[number];

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { data: profile, isLoading, isError } = useProfileById(id);
  const { data: publicCards } = useShowcasedCards(id);
  const { data: stats } = useProfileStats(id);
  const { data: isFollowing } = useIsFollowing(id);
  const toggleFollow = useToggleFollow();
  const [tab, setTab] = useState<Tab>("Showcase");
  const [messaging, setMessaging] = useState(false);

  const isOwn = !!session && session.user.id === id;

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }
  function openCard(cardId: string) {
    router.push({ pathname: "/(tabs)/portfolio/card/[id]", params: { id: cardId } });
  }
  function openFollows(mode: "followers" | "following") {
    router.push({ pathname: "/profile/follows", params: { userId: id, mode } });
  }
  async function messageUser() {
    setMessaging(true);
    try {
      const convId = await startConversation(id!);
      router.push({ pathname: "/chat/[id]", params: { id: convId } });
    } catch (err) {
      Alert.alert(
        "Message",
        err instanceof Error ? err.message : "Couldn't start the chat.",
      );
    } finally {
      setMessaging(false);
    }
  }

  const displayName = profile?.display_name || profile?.username || "";
  const showcased = (publicCards ?? []).filter((c) => c.state === "showcased");
  const listed = (publicCards ?? []).filter((c) => c.state === "listed");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onBack={back} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !profile ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load this profile.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.identity}>
            <Avatar name={displayName} size={88} online={isProfileOnline(profile)} />
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.handle}>
              @{profile.username}
              {profile.location_city ? `  ·  ${profile.location_city}` : ""}
            </Text>
            {profile.is_vendor && profile.business_name ? (
              <View style={styles.vendorBadge}>
                <Ionicons name="storefront-outline" size={13} color={colors.accent} />
                <Text style={styles.vendorText}>{profile.business_name}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.stats}>
            <Stat
              value={String(stats?.following ?? 0)}
              label="Following"
              onPress={() => openFollows("following")}
            />
            <Stat
              value={String(stats?.followers ?? 0)}
              label="Followers"
              onPress={() => openFollows("followers")}
            />
            <Stat value="—" label="Rating" />
          </View>

          <View style={styles.actions}>
            {isOwn ? (
              <Button
                title="Edit profile"
                variant="dark"
                style={styles.flex}
                onPress={() => router.push("/profile/edit")}
              />
            ) : (
              <>
                <Button
                  title={isFollowing ? "Following" : "Follow"}
                  variant={isFollowing ? "secondary" : "primary"}
                  style={styles.flex}
                  loading={toggleFollow.isPending}
                  onPress={() =>
                    toggleFollow.mutate({
                      targetId: id,
                      following: !!isFollowing,
                    })
                  }
                />
                <Button
                  title="Message"
                  variant="secondary"
                  style={styles.flex}
                  loading={messaging}
                  onPress={messageUser}
                />
              </>
            )}
          </View>

          {profile.is_vendor ? (
            <View style={styles.storefront}>
              <Button
                title="View storefront"
                variant="dark"
                onPress={() =>
                  router.push({ pathname: "/profile/storefront", params: { id } })
                }
              />
            </View>
          ) : null}

          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

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

          {tab === "Showcase" ? (
            <CardGrid
              cards={showcased}
              onCardPress={openCard}
              emptyText={`${displayName} hasn't showcased any cards yet.`}
            />
          ) : tab === "Listed" ? (
            <CardGrid
              cards={listed}
              onCardPress={openCard}
              emptyText="No cards listed for sale."
            />
          ) : (
            <View style={styles.tabEmpty}>
              <Ionicons name="chatbubbles-outline" size={28} color={colors.textTertiary} />
              <Text style={styles.muted}>No posts yet.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function Stat({
  value,
  label,
  onPress,
}: {
  value: string;
  label: string;
  onPress?: () => void;
}) {
  const content = (
    <>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </>
  );
  if (onPress) {
    return (
      <Pressable style={styles.stat} onPress={onPress}>
        {content}
      </Pressable>
    );
  }
  return <View style={styles.stat}>{content}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  flex: { flex: 1 },
  body: { paddingBottom: spacing.xxl },

  identity: { alignItems: "center", paddingHorizontal: spacing.xl, gap: spacing.sm },
  name: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  handle: { fontSize: fontSize.sm, color: colors.textSecondary },
  vendorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
  },
  vendorText: { color: colors.accent, fontSize: fontSize.xs, fontWeight: "700" },

  stats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: fontSize.lg, fontWeight: "800", color: colors.text },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  actions: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  storefront: { paddingHorizontal: spacing.xl, marginTop: spacing.md },

  bio: {
    fontSize: fontSize.sm,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    lineHeight: 20,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
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

  tabEmpty: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xxl },
});
