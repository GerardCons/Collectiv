import { useTheme } from "@/hooks/use-theme";
import { useOnboardingStatus } from "@/hooks/use-onboarding";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

/**
 * Post-sign-up collector setup (5 steps). Requires a session; bounces to the
 * app once onboarding is complete. The steps push onto this stack in order:
 * profile → interests → location → first-card → all-set.
 */
export default function OnboardingLayout() {
  const { colors } = useTheme();
  const status = useOnboardingStatus();

  if (status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bgBase }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (status === "no-session") return <Redirect href="/(auth)/welcome" />;
  if (status === "done") return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        contentStyle: { backgroundColor: colors.bgBase },
      }}
    />
  );
}
