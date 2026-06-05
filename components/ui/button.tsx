import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "dark";

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "dark" && styles.dark,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "dark"
              ? colors.textInverse
              : colors.text
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "primary" || variant === "dark"
              ? styles.textPrimary
              : styles.textDark,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.accent },
  secondary: { borderWidth: 1, borderColor: colors.border },
  ghost: {},
  dark: { backgroundColor: colors.text },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  text: { fontSize: fontSize.md, fontWeight: "700" },
  textPrimary: { color: colors.textInverse },
  textDark: { color: colors.text },
});
