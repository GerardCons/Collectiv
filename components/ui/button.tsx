import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "social" | "secondary" | "ghost" | "dark" | "danger";
type Size = "md" | "sm";

/**
 * Pill CTA per the Coral Core spec. `primary` = coral, `social` = purple,
 * `secondary` = coral outline, `danger` = red. Colors are theme-aware.
 */
export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const bg: Record<Variant, string> = {
    primary: colors.primary,
    social: colors.secondary,
    secondary: "transparent",
    ghost: "transparent",
    dark: colors.bgInverse,
    danger: colors.error,
  };
  const fg: Record<Variant, string> = {
    primary: colors.fgOnAccent,
    social: colors.fgOnAccent,
    secondary: colors.primary,
    ghost: colors.primary,
    dark: colors.fgInverse,
    danger: colors.fgOnAccent,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === "sm" && styles.sizeSm,
        { backgroundColor: bg[variant] },
        variant === "secondary" && { borderWidth: 1.5, borderColor: colors.primary },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <Text style={[styles.text, size === "sm" && styles.textSm, { color: fg[variant] }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: space["2xl"],
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeSm: { paddingVertical: 10, paddingHorizontal: space.lg },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  text: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.base },
  textSm: { fontSize: fontSizes.sm },
});
