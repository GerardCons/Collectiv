import { FeedNav } from "@/components/home/feed-nav";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { LIKERS, Person } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LikesScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <FeedNav title="Liked by" subtitle="34 people" />
      <FlatList
        data={LIKERS}
        keyExtractor={(p) => p.handle}
        renderItem={({ item }) => <PersonRow person={item} />}
      />
    </SafeAreaView>
  );
}

function PersonRow({ person }: { person: Person }) {
  const { colors } = useTheme();
  const state = person.state ?? "follow";

  let btnStyle = { backgroundColor: colors.primary };
  let btnText = { color: "#fff" };
  let label = "Follow";
  if (state === "following") {
    btnStyle = { backgroundColor: colors.bgSurface };
    btnText = { color: colors.fgSecondary };
    label = "Following";
  } else if (state === "you") {
    btnStyle = { backgroundColor: "transparent" };
    btnText = { color: colors.fgTertiary };
    label = "You";
  }

  return (
    <View style={styles.row}>
      <Avatar name={person.name} size={40} color={person.color} />
      <View style={styles.flex}>
        <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{person.name}</Text>
        <Text style={[styles.handle, { color: colors.fgTertiary }]}>@{person.handle}</Text>
      </View>
      <View
        style={[
          styles.btn,
          btnStyle,
          state === "following" && { borderWidth: 1, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.btnText, btnText]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: space.lg, paddingVertical: 10 },
  name: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  handle: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 1 },
  btn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999 },
  btnText: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
});
