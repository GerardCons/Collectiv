import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardGrid } from "@/components/ui/card-grid";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useShowcasedCards } from "@/hooks/use-cards";
import { useProfileStats } from "@/hooks/use-follows";
import { useProfile } from "@/hooks/use-profile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Showcase", "Listed", "Posts"] as const;
type Tab = (typeof TABS)[number];

export default function ProfileScreen() {
  const { data: profile, isLoading, isError } = useProfile();
  const { data: publicCards } = useShowcasedCards(profile?.id);
  const { data: stats } = useProfileStats(profile?.id);
  const [tab, setTab] = useState<Tab>("Showcase");

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }

  function openCard(id: string) {
    router.push({ pathname: "/(tabs)/portfolio/card/[id]", params: { id } });
  }

  const displayName = profile?.display_name || profile?.username || "";
  const showcased = (publicCards ?? []).filter((c) => c.state === "showcased");
  const listed = (publicCards ?? []).filter((c) => c.state === "listed");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        onBack={back}
        right={
          <Pressable onPress={() => router.push("/settings")} hitSlop={8}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
        }
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !profile ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load your profile.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.identity}>
            <Avatar name={displayName} size={88} />
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.handle}>
              @{profile.username}
              {profile.location_city ? `  ·  ${profile.location_city}` : ""}
            </Text>
            {profile.is_vendor && profile.business_name ? (
              <View style={styles.vendorBadge}>
                <Ionicons
                  name="storefront-outline"
                  size={13}
                  color={colors.accent}
                />
                <Text style={styles.vendorText}>{profile.business_name}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.stats}>
            <Stat
              value={String(stats?.following ?? 0)}
              label="Following"
              onPress={() =>
                router.push({
                  pathname: "/profile/follows",
                  params: { userId: profile.id, mode: "following" },
                })
              }
            />
            <Stat
              value={String(stats?.followers ?? 0)}
              label="Followers"
              onPress={() =>
                router.push({
                  pathname: "/profile/follows",
                  params: { userId: profile.id, mode: "followers" },
                })
              }
            />
            <Stat value="—" label="Rating" />
          </View>

          <View style={styles.actions}>
            <Button
              title="Edit profile"
              variant="dark"
              style={styles.flex}
              onPress={() => router.push("/profile/edit")}
            />
          </View>

          {profile.bio ? (
            <Text style={styles.bio}>{profile.bio}</Text>
          ) : (
            <Text style={styles.bioEmpty}>Add a bio in Edit profile.</Text>
          )}

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
              emptyText="Showcase a card from its detail screen to feature it here."
            />
          ) : tab === "Listed" ? (
            <CardGrid
              cards={listed}
              onCardPress={openCard}
              emptyText="Cards you list for sale appear here (Phase 3)."
            />
          ) : (
            <View style={styles.tabEmpty}>
              <Ionicons
                name="chatbubbles-outline"
                size={28}
                color={colors.textTertiary}
              />
              <Text style={styles.muted}>Your posts appear here.</Text>
              <Text style={styles.mutedSmall}>Coming in Phase 4.</Text>
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
  body: { paddingBottom: spacing.xxl },
  flex: { flex: 1 },

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

  bio: {
    fontSize: fontSize.sm,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    lineHeight: 20,
  },
  bioEmpty: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    fontStyle: "italic",
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
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

  tabEmpty: { alignItems: "center", gap: spacing.xs, paddingVertical: spacing.xxl },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  mutedSmall: { color: colors.textTertiary, fontSize: fontSize.xs },
});
