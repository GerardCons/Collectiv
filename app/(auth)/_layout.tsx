import { useAuth } from "@/providers/auth-provider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session, isLoading } = useAuth();

  // Defense in depth: if a signed-in user somehow navigates to an auth route,
  // bounce them. This protects against deep links or stale navigation state.
  if (isLoading) return null;
  if (session) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
