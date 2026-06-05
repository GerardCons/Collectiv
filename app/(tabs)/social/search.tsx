import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useSearchProfiles } from "@/hooks/use-profile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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

export default function FindCollectorsScreen() {
  const [query, setQuery] = useState("");
  const { data: results, isFetching } = useSearchProfiles(query);
  const active = query.trim().length >= 2;

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/social");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Find collectors" onBack={back} />

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.input}
          placeholder="Search by @username"
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
      </View>

      {!active ? (
        <Text style={styles.note}>Type at least 2 characters to search.</Text>
      ) : isFetching ? (
        <ActivityIndicator color={colors.accent} style={styles.loading} />
      ) : (
        <FlatList
          data={results ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No collectors found.</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() =>
                router.push({ pathname: "/profile/[id]", params: { id: item.id } })
              }
            >
              <Avatar name={item.display_name || item.username} size={44} />
              <View style={styles.flex}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.display_name || item.username}
                  </Text>
                  {item.is_vendor ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>VENDOR</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.handle}>@{item.username}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.text },
  note: { fontSize: fontSize.sm, color: colors.textTertiary, padding: spacing.lg },
  loading: { marginTop: spacing.xl },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  empty: { textAlign: "center", color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xl },
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  rowPressed: { opacity: 0.6 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  handle: { fontSize: fontSize.sm, color: colors.textSecondary },
  badge: { backgroundColor: colors.accentSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  badgeText: { fontSize: 10, fontWeight: "800", color: colors.accent },
});
