import { OnboardingTour } from "@/components/ui/onboarding-tour";
import { colors } from "@/constants/theme";
import { useCompleteOnboarding, useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Redirect, Tabs } from "expo-router";

/**
 * 5 tabs: Home · Portfolio · Market · Social · Map.
 * Profile is NOT a tab — it is pushed from the Portfolio header avatar.
 * Settings opens from the ☰ menu on your own profile.
 */
export default function TabsLayout() {
  const { session, isLoading } = useAuth();
  const { data: profile } = useProfile();
  const completeOnboarding = useCompleteOnboarding();
  const [tourDismissed, setTourDismissed] = useState(false);

  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/welcome" />;

  const showTour =
    !tourDismissed && profile != null && !profile.onboarding_completed_at;

  return (
    <>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: "Social",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
    {showTour && (
      <OnboardingTour
        onDismiss={() => {
          setTourDismissed(true); // closes tour immediately — never blocked by DB
          completeOnboarding().catch(() => {
            // Silently ignore — most likely migration 0010 hasn't been run yet.
            // The tour stays dismissed for this session via tourDismissed state.
          });
        }}
      />
    )}
    </>
  );
}
