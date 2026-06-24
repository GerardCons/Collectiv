import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export type SheetAction = {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  sub?: string;
  /** Tints the label (and, when danger, the row). */
  danger?: boolean;
  onPress: () => void;
};

/**
 * ··· action sheet: dim overlay + bottom sheet (22px radius, drag handle),
 * an optional recap header, and a list of rows. Danger rows (block / report /
 * delete / deny) are tinted with the error color on a faint red background.
 */
export function ActionSheet({
  visible,
  onClose,
  header,
  actions,
}: {
  visible: boolean;
  onClose: () => void;
  header?: { title: string; subtitle?: string; avatar?: React.ReactNode };
  actions: SheetAction[];
}) {
  const { colors } = useTheme();
  const dangerBg = "rgba(239,68,68,0.05)";
  const dangerTile = "rgba(239,68,68,0.10)";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={onClose}
        />
        <View style={[styles.sheet, { backgroundColor: colors.bgBase }]}>
          <View style={[styles.handle, { backgroundColor: colors.fgTertiary }]} />

          {header ? (
            <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
              {header.avatar}
              <View style={styles.headerText}>
                <Text style={[styles.headerTitle, { color: colors.fgPrimary }]} numberOfLines={1}>
                  {header.title}
                </Text>
                {header.subtitle ? (
                  <Text style={[styles.headerSub, { color: colors.fgSecondary }]} numberOfLines={1}>
                    {header.subtitle}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : null}

          {actions.map((a, i) => (
            <Pressable
              key={i}
              onPress={() => {
                onClose();
                a.onPress();
              }}
              style={[
                styles.row,
                { borderBottomColor: colors.borderDefault },
                a.danger && { backgroundColor: dangerBg },
              ]}
            >
              {a.icon ? (
                <View
                  style={[
                    styles.tile,
                    { backgroundColor: a.danger ? dangerTile : colors.bgSurface },
                  ]}
                >
                  <Ionicons
                    name={a.icon}
                    size={18}
                    color={a.danger ? colors.error : colors.fgPrimary}
                  />
                </View>
              ) : null}
              <View style={styles.rowText}>
                <Text
                  style={[styles.label, { color: a.danger ? colors.error : colors.fgPrimary }]}
                  numberOfLines={1}
                >
                  {a.label}
                </Text>
                {a.sub ? (
                  <Text style={[styles.sub, { color: colors.fgTertiary }]} numberOfLines={1}>
                    {a.sub}
                  </Text>
                ) : null}
              </View>
              {!a.danger ? (
                <Ionicons name="chevron-forward" size={17} color={colors.fgTertiary} />
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: space["3xl"],
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 38,
    height: 4.5,
    borderRadius: 3,
    marginTop: space.md,
    marginBottom: space.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: 18,
    paddingTop: space.sm,
    paddingBottom: space.lg,
    borderBottomWidth: 1,
  },
  headerText: { flex: 1, minWidth: 0 },
  headerTitle: { fontFamily: fontFamily.bodyExtrabold, fontSize: fontSizes.base },
  headerSub: { fontFamily: fontFamily.body, fontSize: fontSizes.xs, marginTop: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  tile: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1, minWidth: 0 },
  label: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.sm },
  sub: { fontFamily: fontFamily.body, fontSize: fontSizes.xs, marginTop: 1 },
});
