import { fontFamily } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

/**
 * Green verified check. With `label`, renders "✓ Verified" inline (e.g. seller
 * headers); without, just the icon (e.g. next to a username).
 */
export function VerifiedBadge({
  size = 14,
  label,
}: {
  size?: number;
  label?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Ionicons name="checkmark-circle" size={size} color={colors.success} />
      {label ? (
        <Text style={[styles.label, { fontSize: size - 1, color: colors.success }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  label: { fontFamily: fontFamily.bodySemibold },
});
