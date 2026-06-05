import { AuthProvider } from "@/providers/auth-provider";
import { PresenceProvider } from "@/providers/presence-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PresenceProvider>
              {/* Routes auto-register from the file tree. (auth), (tabs),
                  profile/ and settings/ are all pushed onto this root Stack. */}
              <Stack screenOptions={{ headerShown: false }} />
            </PresenceProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
