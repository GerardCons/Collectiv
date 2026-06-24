import { Stack } from "expo-router";

export const unstable_settings = { initialRouteName: "index" };

export default function MarketLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="search" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}
