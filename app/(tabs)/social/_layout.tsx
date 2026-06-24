import { Stack } from "expo-router";

// Anchor: deep links (e.g. from notifications) land on top of the browse index,
// so Back returns to Community instead of falling through to Home.
export const unstable_settings = { initialRouteName: "index" };

export default function SocialLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="post/[id]" />
      <Stack.Screen name="event/[id]" />
      <Stack.Screen name="create-group" options={{ presentation: "modal" }} />
      <Stack.Screen name="create-event" options={{ presentation: "modal" }} />
      <Stack.Screen name="new-post" options={{ presentation: "modal" }} />
      <Stack.Screen name="search" />
      <Stack.Screen name="invite" options={{ presentation: "modal" }} />
      <Stack.Screen name="invites" />
      <Stack.Screen name="notif-prefs" />
      <Stack.Screen name="pins" />
      <Stack.Screen name="membership" />
      <Stack.Screen name="following" />
    </Stack>
  );
}
