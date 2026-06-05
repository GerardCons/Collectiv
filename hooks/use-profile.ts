import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Phase 1 shape of a row in public.profiles. (In Phase 2 we replace this with
 * generated types from the Supabase CLI.)
 */
export type Profile = {
  id: string;
  display_name: string | null;
  username: string;
  bio: string | null;
  avatar_path: string | null;
  location_city: string | null;
  links: Record<string, string>;
  is_vendor: boolean;
  business_name: string | null;
  // Phase 8 — Maps
  pickup_location: string | null; // WKB hex from PostGIS; non-null means location is set
  pickup_city: string | null;
  max_travel_radius_km: number | null;
  // Phase 9 — Presence
  last_seen_at: string | null;
  presence_status: string;
  broadcast_presence: boolean;
  broadcast_approximate_location: boolean;
  show_on_nearby_map: boolean;
  created_at: string;
  updated_at: string;
};

/** Columns the Edit Profile / Vendor screens are allowed to write. */
export type ProfilePatch = Partial<
  Pick<
    Profile,
    | "display_name"
    | "username"
    | "bio"
    | "location_city"
    | "links"
    | "is_vendor"
    | "business_name"
    | "last_seen_at"
    | "presence_status"
    | "broadcast_presence"
    | "broadcast_approximate_location"
    | "show_on_nearby_map"
  >
>;

export const profileKey = (userId: string | undefined) =>
  ["profile", userId] as const;

/** The signed-in user's own profile. */
export function useProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: profileKey(userId),
    enabled: !!userId,
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

/** Any user's public profile by id (shares the cache key with useProfile). */
export function useProfileById(userId: string | undefined) {
  return useQuery({
    queryKey: profileKey(userId),
    enabled: !!userId,
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export type ProfileSearchResult = Pick<
  Profile,
  "id" | "display_name" | "username" | "is_vendor" | "business_name"
>;

/** Find collectors by username (min 2 chars). Temporary Phase-2 discovery. */
export function useSearchProfiles(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: ["profile-search", q],
    enabled: q.length >= 2,
    queryFn: async (): Promise<ProfileSearchResult[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, username, is_vendor, business_name")
        .ilike("username", `%${q}%`)
        .limit(20);
      if (error) throw error;
      return data as ProfileSearchResult[];
    },
  });
}

/** Update the signed-in user's profile and refresh the cache. */
export function useUpdateProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patch: ProfilePatch): Promise<Profile> => {
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", userId!)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (updated) => {
      // Write the fresh row straight into the cache so every screen that reads
      // the profile (Profile, Settings, Portfolio header) updates immediately.
      queryClient.setQueryData(profileKey(userId), updated);
    },
  });
}
