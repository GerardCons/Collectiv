import { Stack } from "expo-router";

export const unstable_settings = { initialRouteName: "index" };

export default function PortfolioLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-card" options={{ presentation: "modal" }} />
      <Stack.Screen name="card/[id]" />
      <Stack.Screen name="edit-card" options={{ presentation: "modal" }} />
      <Stack.Screen name="list-card" options={{ presentation: "modal" }} />
    </Stack>
  );
}
