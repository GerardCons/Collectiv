import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type ProfileLite = {
  id: string;
  username: string;
  display_name: string | null;
  is_vendor: boolean;
};

/** Follower / following counts for a user. */
export function useProfileStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile-stats", userId],
    enabled: !!userId,
    queryFn: async (): Promise<{ followers: number; following: number }> => {
      const [followers, following] = await Promise.all([
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("followed_id", userId!),
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId!),
      ]);
      if (followers.error) throw followers.error;
      if (following.error) throw following.error;
      return {
        followers: followers.count ?? 0,
        following: following.count ?? 0,
      };
    },
  });
}

/** Does the signed-in user follow `targetId`? */
export function useIsFollowing(targetId: string | undefined) {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: ["is-following", me, targetId],
    enabled: !!me && !!targetId && me !== targetId,
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", me!)
        .eq("followed_id", targetId!)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
}

/** Follow / unfollow a user and refresh the affected caches. */
export function useToggleFollow() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { targetId: string; following: boolean }) => {
      if (input.following) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", me!)
          .eq("followed_id", input.targetId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: me!, followed_id: input.targetId });
        if (error) throw error;
      }
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: ["is-following", me, input.targetId],
      });
      queryClient.invalidateQueries({ queryKey: ["profile-stats", input.targetId] });
      queryClient.invalidateQueries({ queryKey: ["profile-stats", me] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["feed", me] });
    },
  });
}

type FollowerRow = { follower: ProfileLite | null };
type FollowingRow = { followed: ProfileLite | null };

/** Profiles who follow `userId`. */
export function useFollowers(userId: string | undefined) {
  return useQuery({
    queryKey: ["followers", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ProfileLite[]> => {
      const { data, error } = await supabase
        .from("follows")
        .select(
          "follower:profiles!follows_follower_id_fkey(id,username,display_name,is_vendor)",
        )
        .eq("followed_id", userId!);
      if (error) throw error;
      return (data as unknown as FollowerRow[])
        .map((r) => r.follower)
        .filter((p): p is ProfileLite => !!p);
    },
  });
}

/** Profiles `userId` follows. */
export function useFollowing(userId: string | undefined) {
  return useQuery({
    queryKey: ["following", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ProfileLite[]> => {
      const { data, error } = await supabase
        .from("follows")
        .select(
          "followed:profiles!follows_followed_id_fkey(id,username,display_name,is_vendor)",
        )
        .eq("follower_id", userId!);
      if (error) throw error;
      return (data as unknown as FollowingRow[])
        .map((r) => r.followed)
        .filter((p): p is ProfileLite => !!p);
    },
  });
}
