import { fontFamily, lightColors } from "@/constants/theme";
import { useOnboardingStatus } from "@/hooks/use-onboarding";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

/**
 * 5 tabs: Home · Portfolio · Market · Social · Map.
 * Profile is NOT a tab — it is pushed from the Portfolio header avatar.
 * Settings opens from the ☰ menu on your own profile.
 *
 * A signed-in user who hasn't finished onboarding is routed into the
 * (onboarding) flow before they can reach the tabs.
 */
export default function TabsLayout() {
  const status = useOnboardingStatus();

  if (status === "loading") return null;
  if (status === "no-session") return <Redirect href="/(auth)/welcome" />;
  if (status === "needs-onboarding") return <Redirect href="/onboarding/profile" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: lightColors.tabBarActive,
        tabBarInactiveTintColor: lightColors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: lightColors.tabBarBg,
          borderTopColor: lightColors.tabBarBorder,
        },
        tabBarLabelStyle: { fontFamily: fontFamily.bodyMedium, fontSize: 11 },
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
  );
}
