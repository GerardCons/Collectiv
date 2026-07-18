import { useOnboardingFlags, useOnboardingStatus } from "@/hooks/use-onboarding";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const status = useOnboardingStatus();
  const hydrated = useOnboardingFlags((s) => s.hydrated);

  // Wait for the profile (signed-in) or the local flags (signed-out gate).
  if (status === "loading" || (status === "no-session" && !hydrated)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "no-session") {
    // QA replay: every signed-out launch shows the intro carousel (the
    // `seenIntro ? welcome : intro` gate is intentionally bypassed). Paired with
    // the onboarding reset in useSignOut so the full intro + onboarding flow can
    // be walked repeatedly. See memory `logout-resets-onboarding` — restore the
    // seenIntro gate before launch.
    return <Redirect href="/(auth)/intro" />;
  }
  if (status === "needs-onboarding") {
    return <Redirect href="/onboarding/profile" />;
  }
  return <Redirect href="/(tabs)" />;
}
