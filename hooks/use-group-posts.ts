import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileLite } from "./use-follows";

export type GroupPostType = "discussion" | "giveaway" | "announcement";

export type GroupPost = {
  id: string;
  group_id: string;
  author_id: string;
  post_type: GroupPostType;
  body: string;
  photo_path: string | null;
  created_at: string;
  author: ProfileLite | null;
};

export type GroupPostDetail = GroupPost & {
  group: { id: string; name: string } | null;
};

export const groupPostsKey = (groupId: string | undefined) =>
  ["group-posts", groupId] as const;
export const groupPostKey = (id: string | undefined) =>
  ["group-post", id] as const;

const POST_SELECT =
  "id, group_id, author_id, post_type, body, photo_path, created_at, " +
  "author:profiles!group_posts_author_id_fkey(id,username,display_name,is_vendor)";

/** Posts in a group, newest first. */
export function useGroupPosts(groupId: string | undefined) {
  return useQuery({
    queryKey: groupPostsKey(groupId),
    enabled: !!groupId,
    queryFn: async (): Promise<GroupPost[]> => {
      const { data, error } = await supabase
        .from("group_posts")
        .select(POST_SELECT)
        .eq("group_id", groupId!)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as GroupPost[];
    },
  });
}

/** A single post (with its group) for the post detail screen. */
export function useGroupPost(id: string | undefined) {
  return useQuery({
    queryKey: groupPostKey(id),
    enabled: !!id,
    queryFn: async (): Promise<GroupPostDetail> => {
      const { data, error } = await supabase
        .from("group_posts")
        .select(`${POST_SELECT}, group:groups(id,name)`)
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as unknown as GroupPostDetail;
    },
  });
}

export function useCreateGroupPost(groupId: string) {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      postType: GroupPostType;
      body: string;
      photoPath: string | null;
    }) => {
      const { error } = await supabase.from("group_posts").insert({
        group_id: groupId,
        author_id: me!,
        post_type: input.postType,
        body: input.body,
        photo_path: input.photoPath,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: groupPostsKey(groupId) }),
  });
}
