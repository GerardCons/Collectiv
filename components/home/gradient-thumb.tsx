import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, ViewStyle } from "react-native";

/**
 * Placeholder card art: a soft diagonal gradient from the surface tone into an
 * accent, with a glossy highlight. Stands in for real card photography in the
 * sample feed.
 */
export function GradientThumb({
  accent,
  width,
  height,
  radius = 7,
  style,
}: {
  accent: string;
  width: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  return (
    <View style={[{ width, height, borderRadius: radius, overflow: "hidden" }, style]}>
      <LinearGradient
        colors={[colors.bgSurface, accent]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.22)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
