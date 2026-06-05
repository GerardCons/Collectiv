import { supabase } from "@/lib/supabase";
import { Profile } from "./use-profile";
import { useQuery } from "@tanstack/react-query";

const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/** Returns true if the profile broadcasts presence and was seen within 5 min. */
export function isProfileOnline(profile: Pick<Profile, "broadcast_presence" | "last_seen_at"> | null | undefined): boolean {
  if (!profile?.broadcast_presence) return false;
  if (!profile.last_seen_at) return false;
  return Date.now() - new Date(profile.last_seen_at).getTime() < ONLINE_THRESHOLD_MS;
}

/** Count of opted-in collectors active in the last 30 minutes. */
export function useActiveCollectorCount() {
  return useQuery({
    queryKey: ["active-collector-count"],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc("active_collector_count");
      if (error) throw error;
      return Number(data ?? 0);
    },
    staleTime: 2 * 60 * 1000, // refresh every 2 min
  });
}
