import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileLite } from "./use-follows";

export type TargetType = "listing" | "card" | "group_post" | "event";

export type Comment = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  author: ProfileLite | null;
};

export const reactionsKey = (t: TargetType, id: string | undefined) =>
  ["reactions", t, id] as const;
export const commentsKey = (t: TargetType, id: string | undefined) =>
  ["comments", t, id] as const;
export const likedByKey = (t: TargetType, id: string | undefined) =>
  ["liked-by", t, id] as const;

/** Like count + whether the signed-in user has liked this target. */
export function useReactionSummary(targetType: TargetType, targetId: string | undefined) {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: reactionsKey(targetType, targetId),
    enabled: !!targetId,
    queryFn: async (): Promise<{ count: number; likedByMe: boolean }> => {
      const { data, error } = await supabase
        .from("reactions")
        .select("user_id")
        .eq("target_type", targetType)
        .eq("target_id", targetId!);
      if (error) throw error;
      const rows = data as { user_id: string }[];
      return { count: rows.length, likedByMe: rows.some((r) => r.user_id === me) };
    },
  });
}

export function useToggleLike() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      targetType: TargetType;
      targetId: string;
      liked: boolean;
    }) => {
      if (input.liked) {
        const { error } = await supabase
          .from("reactions")
          .delete()
          .eq("user_id", me!)
          .eq("target_type", input.targetType)
          .eq("target_id", input.targetId)
          .eq("reaction_type", "like");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reactions").insert({
          user_id: me!,
          target_type: input.targetType,
          target_id: input.targetId,
          reaction_type: "like",
        });
        if (error) throw error;
      }
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: reactionsKey(input.targetType, input.targetId),
      });
      queryClient.invalidateQueries({
        queryKey: likedByKey(input.targetType, input.targetId),
      });
    },
  });
}

/** Who liked this target (for the liked-by sheet). */
export function useLikedBy(
  targetType: TargetType,
  targetId: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: likedByKey(targetType, targetId),
    enabled: !!targetId && enabled,
    queryFn: async (): Promise<ProfileLite[]> => {
      const { data, error } = await supabase
        .from("reactions")
        .select(
          "user:profiles!reactions_user_id_fkey(id,username,display_name,is_vendor)",
        )
        .eq("target_type", targetType)
        .eq("target_id", targetId!);
      if (error) throw error;
      return (data as unknown as { user: ProfileLite | null }[])
        .map((r) => r.user)
        .filter((p): p is ProfileLite => !!p);
    },
  });
}

/** Comments on a target, oldest first, with author profiles. */
export function useComments(targetType: TargetType, targetId: string | undefined) {
  return useQuery({
    queryKey: commentsKey(targetType, targetId),
    enabled: !!targetId,
    queryFn: async (): Promise<Comment[]> => {
      const { data, error } = await supabase
        .from("comments")
        .select(
          "id, author_id, body, created_at, " +
            "author:profiles!comments_author_id_fkey(id,username,display_name,is_vendor)",
        )
        .eq("target_type", targetType)
        .eq("target_id", targetId!)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as unknown as Comment[];
    },
  });
}

export function useAddComment(targetType: TargetType, targetId: string) {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      const { error } = await supabase.from("comments").insert({
        author_id: me!,
        target_type: targetType,
        target_id: targetId,
        body,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: commentsKey(targetType, targetId),
      }),
  });
}
