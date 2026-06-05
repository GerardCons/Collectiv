import { colors, radius } from "@/constants/theme";
import { Card } from "@/hooks/use-cards";
import { cardPhotoUrl } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

/**
 * Card image (or placeholder) with a small corner glyph for its state —
 * $ = listed, ★ = showcased, private = no glyph (matches the grid sketch).
 */
export function CardThumb({
  card,
  onPress,
  style,
}: {
  card: Card;
  onPress: () => void;
  style?: object;
}) {
  const url = cardPhotoUrl(card.primary_photo_path);
  return (
    <Pressable onPress={onPress} style={[styles.cell, style]}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={28} color={colors.textTertiary} />
        </View>
      )}

      {card.state !== "private" ? (
        <View style={styles.glyph}>
          <Ionicons
            name={card.state === "listed" ? "pricetag" : "star"}
            size={12}
            color={colors.accent}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  glyph: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
