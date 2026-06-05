import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { PickedImage } from "@/lib/image";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Fractional margins of the guide box (also the crop inset). Narrower on the
// sides than top/bottom so the frame reads as a portrait trading card, not a
// near-square. Crop uses the same values, so what's framed is what's saved.
const INSET_X = 0.12;
const INSET_Y = 0.05;

/**
 * Live camera viewfinder with a card-shaped guide. The preview box is locked to
 * the 3:4 card ratio (matching the captured image), so what's inside the guide
 * maps directly to the crop. On capture the photo is cropped to the guide box
 * via expo-image-manipulator and returned as { uri, base64 }.
 *
 * Note: this is a fixed-box crop, not true edge detection — align the card in
 * the frame. (Real 4-corner auto-capture needs a native dev build.)
 */
export function CardCameraModal({
  visible,
  slotLabel,
  onClose,
  onCapture,
}: {
  visible: boolean;
  slotLabel: string;
  onClose: () => void;
  onCapture: (image: PickedImage) => void;
}) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);

  // Ask for permission the first time the sheet opens.
  useEffect(() => {
    if (visible && permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  async function capture() {
    const camera = cameraRef.current;
    if (!camera || busy) return;
    setBusy(true);
    try {
      const photo = await camera.takePictureAsync({ quality: 0.9 });
      if (!photo) return;
      const { uri, width, height } = photo;

      const crop = {
        originX: Math.round(width * INSET_X),
        originY: Math.round(height * INSET_Y),
        width: Math.round(width * (1 - 2 * INSET_X)),
        height: Math.round(height * (1 - 2 * INSET_Y)),
      };

      const context = ImageManipulator.manipulate(uri);
      context.crop(crop);
      const rendered = await context.renderAsync();
      const result = await rendered.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.8,
        base64: true,
      });

      if (!result.base64) throw new Error("Couldn't read the cropped image.");
      onCapture({ uri: result.uri, base64: result.base64 });
      onClose();
    } catch (err) {
      Alert.alert(
        "Camera",
        err instanceof Error ? err.message : "Couldn't capture photo.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.topTitle}>Scan {slotLabel.toLowerCase()}</Text>
          <View style={{ width: 28 }} />
        </View>

        {!permission ? (
          <View style={styles.center}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : !permission.granted ? (
          <View style={styles.center}>
            <Ionicons name="camera-outline" size={40} color="#fff" />
            <Text style={styles.permText}>Camera access is needed to scan cards.</Text>
            <Pressable style={styles.permBtn} onPress={requestPermission}>
              <Text style={styles.permBtnText}>Grant camera access</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.previewBox}>
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing="back"
              />
              {/* Card guide */}
              <View style={styles.guide} pointerEvents="none">
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />
              </View>
            </View>

            <Text style={styles.hint}>Line the card up inside the frame.</Text>

            <View style={[styles.controls, { paddingBottom: insets.bottom + spacing.lg }]}>
              <Pressable
                style={styles.shutter}
                onPress={capture}
                disabled={busy}
              >
                {busy ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <View style={styles.shutterInner} />
                )}
              </Pressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const CORNER = 26;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  topTitle: { color: "#fff", fontSize: fontSize.md, fontWeight: "700" },

  previewBox: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: "#111",
    overflow: "hidden",
  },
  guide: {
    position: "absolute",
    top: `${INSET_Y * 100}%`,
    bottom: `${INSET_Y * 100}%`,
    left: `${INSET_X * 100}%`,
    right: `${INSET_X * 100}%`,
  },
  corner: {
    position: "absolute",
    width: CORNER,
    height: CORNER,
    borderColor: colors.accent,
  },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },

  hint: {
    color: "#fff",
    textAlign: "center",
    fontSize: fontSize.sm,
    paddingVertical: spacing.lg,
  },

  controls: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },

  permText: { color: "#fff", textAlign: "center", fontSize: fontSize.md },
  permBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  permBtnText: { color: "#fff", fontWeight: "700", fontSize: fontSize.md },
});
