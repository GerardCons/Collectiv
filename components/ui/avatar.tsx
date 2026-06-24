import { fontFamily } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

/** "alex.c" → "AC", "Trig Test" → "TT", "alex" → "AL". */
export function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Avatar({
  name,
  size = 64,
  uri,
  online = false,
  color,
}: {
  name?: string | null;
  size?: number;
  uri?: string | null;
  online?: boolean;
  /** Solid background (white initials) — used by the color-coded social feed. */
  color?: string;
}) {
  const { colors } = useTheme();
  const dotSize = Math.max(10, Math.round(size * 0.28));
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color ?? colors.primaryMuted,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            contentFit="cover"
          />
        ) : (
          <Text
            style={[
              styles.text,
              { fontSize: size * 0.36, color: color ? "#fff" : colors.primary },
            ]}
          >
            {getInitials(name)}
          </Text>
        )}
      </View>
      {online ? (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              bottom: 0,
              right: 0,
              borderWidth: Math.max(2, dotSize * 0.2),
              backgroundColor: colors.success,
              borderColor: colors.bgBase,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  text: { fontFamily: fontFamily.bodyBold },
  dot: { position: "absolute" },
});
