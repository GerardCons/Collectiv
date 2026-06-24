import { lightColors } from "@/constants/theme";
import { Stack } from "expo-router";

/** Add Card flow: scan → search → confirm → added. */
export default function AddCardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: lightColors.bgBase },
      }}
    />
  );
}
