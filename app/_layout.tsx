import { lightColors } from "@/constants/theme";
import { useOnboardingFlags } from "@/hooks/use-onboarding";
import { AuthProvider } from "@/providers/auth-provider";
import { PresenceProvider } from "@/providers/presence-provider";
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold, DMSans_800ExtraBold } from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular, DMSerifDisplay_400Regular_Italic } from "@expo-google-fonts/dm-serif-display";
import { Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from "@expo-google-fonts/sora";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash up until the design fonts are ready so text never flashes in
// the system font first.
SplashScreen.preventAutoHideAsync();

// Single QueryClient for the app's lifetime. Don't create inside the component —
// that would make a new client on every re-render and lose all cache.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute — most data is fresh enough this long
      retry: 1, // retry once on failure, not the default 3
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // DM Serif Display — collector/display headings (only ships weight 400)
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
    // DM Sans — all UI / body text
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
    // Sora — social / community headings
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  // Hydrate device-local onboarding flags (seen-intro / local completion fallback).
  useEffect(() => {
    useOnboardingFlags.getState().hydrate();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Hold the splash until fonts resolve (loaded or errored — never block forever).
  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: lightColors.bgBase }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PresenceProvider>
              {/* Routes auto-register from the file tree. (auth), (tabs),
                  profile/ and settings/ are all pushed onto this root Stack. */}
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: lightColors.bgBase } }} />
            </PresenceProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
