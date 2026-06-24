import { useOnboardingFlags, useOnboardingStatus } from "@/hooks/use-onboarding";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const status = useOnboardingStatus();
  const hydrated = useOnboardingFlags((s) => s.hydrated);
  const seenIntro = useOnboardingFlags((s) => s.seenIntro);

  // Wait for the profile (signed-in) or the local flags (signed-out intro gate).
  if (status === "loading" || (status === "no-session" && !hydrated)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "no-session") {
    return <Redirect href={seenIntro ? "/(auth)/welcome" : "/(auth)/intro"} />;
  }
  if (status === "needs-onboarding") {
    return <Redirect href="/onboarding/profile" />;
  }
  return <Redirect href="/(tabs)" />;
}
