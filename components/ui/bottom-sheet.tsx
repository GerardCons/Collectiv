import { space, text } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Lightweight bottom sheet built on React Native's Modal — no extra dependency.
 * Tap the dimmed backdrop or hardware back to dismiss. 22px top radius + a
 * drag-handle pill, matching the Coral Core sheet spec.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
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
          {title ? (
            <Text style={[styles.title, { color: colors.fgPrimary }]}>{title}</Text>
          ) : null}
          {children}
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
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space["3xl"],
    maxHeight: "85%",
  },
  handle: {
    alignSelf: "center",
    width: 38,
    height: 4.5,
    borderRadius: 3,
    marginBottom: space.md,
  },
  title: { ...text.headingLg, marginBottom: space.md },
});
