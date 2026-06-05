import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { ProfileLite, useFollowers, useFollowing } from "@/hooks/use-follows";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "followers" | "following";

export default function FollowsScreen() {
  const { userId, mode } = useLocalSearchParams<{ userId: string; mode: Mode }>();
  const isFollowers = mode !== "following";

  const followers = useFollowers(isFollowers ? userId : undefined);
  const following = useFollowing(!isFollowers ? userId : undefined);
  const query = isFollowers ? followers : following;

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title={isFollowers ? "Followers" : "Following"} onBack={back} />

      {query.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={query.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isFollowers ? "No followers yet." : "Not following anyone yet."}
            </Text>
          }
          renderItem={({ item }) => <Row profile={item} onPress={back} />}
        />
      )}
    </SafeAreaView>
  );
}

function Row({ profile, onPress }: { profile: ProfileLite; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => {
        router.push({ pathname: "/profile/[id]", params: { id: profile.id } });
      }}
    >
      <Avatar name={profile.display_name || profile.username} size={44} />
      <View style={styles.flex}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.display_name || profile.username}
          </Text>
          {profile.is_vendor ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>VENDOR</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.handle}>@{profile.username}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  flex: { flex: 1 },
  list: { paddingHorizontal: spacing.lg },
  empty: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xxl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowPressed: { opacity: 0.6 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  handle: { fontSize: fontSize.sm, color: colors.textSecondary },
  badge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: colors.accent },
});
