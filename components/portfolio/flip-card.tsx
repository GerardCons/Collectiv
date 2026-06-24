import { fontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Tap-to-flip card. Shows `front`, and when `back` is provided, flips to it on
 * tap with a 3D rotateY animation (RN's built-in Animated — no worklets/babel
 * plugin needed). Renders a "Tap to flip" hint badge when a back exists.
 */
export function FlipCard({
  width,
  height,
  radius = 12,
  front,
  back,
}: {
  width: number;
  height: number;
  radius?: number;
  front: React.ReactNode;
  back?: React.ReactNode;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontRotate = anim.interpolate({ inputRange: [0, 180], outputRange: ["0deg", "180deg"] });
  const backRotate = anim.interpolate({ inputRange: [0, 180], outputRange: ["180deg", "360deg"] });

  function flip() {
    if (!back) return;
    Animated.spring(anim, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
      friction: 9,
      tension: 12,
    }).start();
    setFlipped((f) => !f);
  }

  return (
    <Pressable onPress={flip} style={{ width, height }}>
      <Animated.View
        style={[styles.face, { borderRadius: radius, transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}
      >
        {front}
      </Animated.View>
      <Animated.View
        style={[styles.face, { borderRadius: radius, transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}
      >
        {back ?? front}
      </Animated.View>

      {back ? (
        <View style={[styles.hint, { backgroundColor: "rgba(14,13,12,0.55)" }]} pointerEvents="none">
          <Ionicons name="sync-outline" size={10} color="#fff" />
          <Text style={styles.hintText}>Tap to flip</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  face: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    overflow: "hidden",
  },
  hint: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    left: 0,
    right: 0,
    marginHorizontal: "auto",
    width: 78,
    justifyContent: "center",
  },
  hintText: { fontFamily: fontFamily.socialBold, fontSize: 8, color: "#fff" },
});
