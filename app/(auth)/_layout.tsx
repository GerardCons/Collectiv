import { useOnboardingStatus } from "@/hooks/use-onboarding";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const status = useOnboardingStatus();

  // A signed-in user who lands on an auth route is bounced forward: into
  // onboarding if it isn't finished, otherwise into the app. No-session users
  // (including the OTP verify step) see the auth stack.
  if (status === "loading") return null;
  if (status === "needs-onboarding") return <Redirect href="/onboarding/profile" />;
  if (status === "done") return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
