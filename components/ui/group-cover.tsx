import { fontFamily } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { cardPhotoUrl } from "@/lib/storage";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

/** Square group thumbnail — cover image, or the group's initial. */
export function GroupCover({
  name,
  coverPath,
  size = 48,
}: {
  name: string;
  coverPath?: string | null;
  size?: number;
}) {
  const { colors } = useTheme();
  const url = cardPhotoUrl(coverPath);
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderRadius: size * 0.22, backgroundColor: colors.secondaryMuted },
      ]}
    >
      {url ? (
        <Image source={{ uri: url }} style={styles.img} contentFit="cover" />
      ) : (
        <Text style={[styles.letter, { fontSize: size * 0.42, color: colors.secondary }]}>
          {name.trim()[0]?.toUpperCase() ?? "#"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  letter: { fontFamily: fontFamily.socialExtrabold },
});
