import { useOnboardingStatus } from "@/hooks/use-onboarding";
import { Redirect, Stack, useSegments } from "expo-router";

// Resets on every full JS reload (Expo Go refresh / cold start). Lets us force
// the intro carousel once per launch while logged out — even when the router
// restores a deeper auth route (welcome / sign-in) on reload instead of booting
// through index. See memory `logout-resets-onboarding` (revert before launch).
let bootedThisSession = false;

export default function AuthLayout() {
  const status = useOnboardingStatus();
  const segments = useSegments();

  // A signed-in user who lands on an auth route is bounced forward: into
  // onboarding if it isn't finished, otherwise into the app. No-session users
  // (including the OTP verify step) see the auth stack.
  if (status === "loading") return null;
  if (status === "needs-onboarding") return <Redirect href="/onboarding/profile" />;
  if (status === "done") return <Redirect href="/(tabs)" />;

  // QA replay: on the first render after a launch/reload while logged out, jump
  // to the intro. Flipped immediately so forward navigation (intro → welcome →
  // sign-in) re-renders with the flag set and is NOT trapped back at the intro.
  if (!bootedThisSession) {
    bootedThisSession = true;
    if (segments[segments.length - 1] !== "intro") {
      return <Redirect href="/(auth)/intro" />;
    }
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
