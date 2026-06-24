import { fontFamily } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, TextStyle } from "react-native";

/**
 * Price in the DM Serif Display collector face, coral by default. Pass a
 * preformatted string ("$12,500") or a number (rendered as "$1,234").
 */
export function PriceText({
  value,
  size = 20,
  color,
  style,
}: {
  value: string | number;
  size?: number;
  color?: string;
  style?: TextStyle;
}) {
  const { colors } = useTheme();
  const label =
    typeof value === "number" ? `$${value.toLocaleString("en-US")}` : value;
  return (
    <Text style={[styles.text, { fontSize: size, color: color ?? colors.primary }, style]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: fontFamily.display },
});
