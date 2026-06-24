import { FeedNav } from "@/components/home/feed-nav";
import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { FEED_COLORS, Notif, NOTIFICATIONS, NotifKind } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const KIND: Record<NotifKind, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  like: { icon: "heart", color: FEED_COLORS.coral },
  comment: { icon: "chatbubble", color: FEED_COLORS.blue },
  follow: { icon: "person-add", color: FEED_COLORS.purple },
  offer: { icon: "pricetag", color: FEED_COLORS.coral },
  event: { icon: "calendar", color: FEED_COLORS.blue },
  sale: { icon: "swap-horizontal", color: FEED_COLORS.green },
};

export default function NotificationsScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <FeedNav title="Notifications" right={<Ionicons name="settings-outline" size={18} color={colors.fgPrimary} />} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section label="Today" rows={NOTIFICATIONS.today} />
        <Section label="This week" rows={NOTIFICATIONS.week} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label, rows }: { label: string; rows: Notif[] }) {
  const { colors } = useTheme();
  return (
    <>
      <Text style={[styles.section, { color: colors.fgTertiary, backgroundColor: colors.bgSurface }]}>{label}</Text>
      {rows.map((n) => (
        <NotifRow key={n.id} notif={n} />
      ))}
    </>
  );
}

function NotifRow({ notif }: { notif: Notif }) {
  const { colors } = useTheme();
  const k = KIND[notif.kind];
  return (
    <View style={[styles.row, { borderBottomColor: colors.borderDefault, backgroundColor: notif.unread ? colors.primaryMuted : "transparent" }]}>
      <View style={styles.avatarWrap}>
        <Avatar name={notif.initial} size={40} color={notif.color} />
        <View style={[styles.iconBadge, { backgroundColor: k.color, borderColor: colors.bgBase }]}>
          <Ionicons name={k.icon} size={8} color="#fff" />
        </View>
      </View>
      <View style={styles.flex}>
        <Text style={[styles.text, { color: colors.fgPrimary }]}>{notif.text}</Text>
        <Text style={[styles.time, { color: colors.fgTertiary }]}>{notif.time}</Text>
      </View>
      {notif.thumb ? <GradientThumb accent={notif.thumb} width={34} height={48} radius={6} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  section: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: 10.5,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: 7,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: space.lg, paddingVertical: 12, borderBottomWidth: 1 },
  avatarWrap: { position: "relative" },
  iconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontFamily: fontFamily.body, fontSize: 12.5, lineHeight: 18 },
  time: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 2 },
});
