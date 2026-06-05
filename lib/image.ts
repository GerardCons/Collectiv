import * as ImagePicker from "expo-image-picker";

export type PickedImage = { uri: string; base64: string };
export type ImageSource = "camera" | "library";

/**
 * Request the right permission, launch the camera or library, and return the
 * picked image's local uri + base64 (or null if the user cancelled). Throws a
 * friendly Error if permission is denied.
 */
export async function pickImage(
  source: ImageSource,
): Promise<PickedImage | null> {
  if (source === "camera") {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new Error("Camera permission is required.");
  } else {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) throw new Error("Photo library permission is required.");
  }

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [3, 4], // trading-card ratio
    quality: 0.7,
    base64: true,
  };

  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  if (!asset.base64) throw new Error("Couldn't read the image data.");
  return { uri: asset.uri, base64: asset.base64 };
}
