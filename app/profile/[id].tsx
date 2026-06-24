import { ProfileView } from "@/components/profile/profile-view";
import { useLocalSearchParams } from "expo-router";

/** Another collector's profile, or a vendor storefront when `?variant=vendor`. */
export default function PublicProfile() {
  const { variant } = useLocalSearchParams<{ variant?: string }>();
  return <ProfileView variant={variant === "vendor" ? "vendor" : "user"} />;
}
