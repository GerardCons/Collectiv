import { colors } from "@/constants/theme";
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
  online = false,
}: {
  name?: string | null;
  size?: number;
  uri?: string | null;
  online?: boolean;
}) {
  const dotSize = Math.max(10, Math.round(size * 0.28));
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={[styles.text, { fontSize: size * 0.36 }]}>
          {getInitials(name)}
        </Text>
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
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  text: { color: colors.accent, fontWeight: "700" },
  dot: {
    position: "absolute",
    backgroundColor: colors.success,
    borderColor: colors.background,
  },
});
