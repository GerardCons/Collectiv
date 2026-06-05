import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileLite } from "./use-follows";

export type Group = {
  id: string;
  name: string;
  description: string | null;
  genre: string | null;
  cover_path: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type GroupWithMeta = Group & {
  memberCount: number;
  isMember: boolean;
};
export type GroupMember = ProfileLite & { role: string };
export type GroupDetail = GroupWithMeta & { members: GroupMember[] };

type MemberLite = { user_id: string };
type RawGroupRow = Group & { group_members: MemberLite[] };
type MemberFull = { user_id: string; role: string; profiles: ProfileLite | null };
type RawGroupDetail = Group & { group_members: MemberFull[] };

export const groupsKey = ["groups"] as const;
export const groupKey = (id: string | undefined) => ["group", id] as const;

/** All groups with member count + whether you're in them. */
export function useGroups() {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: groupsKey,
    queryFn: async (): Promise<GroupWithMeta[]> => {
      const { data, error } = await supabase
        .from("groups")
        .select("*, group_members(user_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as RawGroupRow[]).map((g) => ({
        ...g,
        memberCount: g.group_members.length,
        isMember: g.group_members.some((m) => m.user_id === me),
      }));
    },
  });
}

/** A single group with its member list. */
export function useGroup(id: string | undefined) {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: groupKey(id),
    enabled: !!id,
    queryFn: async (): Promise<GroupDetail> => {
      const { data, error } = await supabase
        .from("groups")
        .select(
          "*, group_members(user_id, role, profiles(id,username,display_name,is_vendor))",
        )
        .eq("id", id!)
        .single();
      if (error) throw error;
      const g = data as unknown as RawGroupDetail;
      const members: GroupMember[] = g.group_members
        .filter((m) => m.profiles)
        .map((m) => ({ ...(m.profiles as ProfileLite), role: m.role }));
      return {
        ...g,
        memberCount: g.group_members.length,
        isMember: g.group_members.some((m) => m.user_id === me),
        members,
      };
    },
  });
}

export type NewGroupInput = {
  name: string;
  description: string | null;
  genre: string | null;
  coverPath: string | null;
};

/** Create a group (creator is auto-joined as owner by a DB trigger). */
export function useCreateGroup() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewGroupInput): Promise<Group> => {
      const { data, error } = await supabase
        .from("groups")
        .insert({
          name: input.name,
          description: input.description,
          genre: input.genre,
          cover_path: input.coverPath,
          created_by: me!,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupsKey }),
  });
}

/** Join / leave a group. */
export function useToggleGroupMembership() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { groupId: string; isMember: boolean }) => {
      if (input.isMember) {
        const { error } = await supabase
          .from("group_members")
          .delete()
          .eq("group_id", input.groupId)
          .eq("user_id", me!);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("group_members")
          .insert({ group_id: input.groupId, user_id: me! });
        if (error) throw error;
      }
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: groupsKey });
      queryClient.invalidateQueries({ queryKey: groupKey(input.groupId) });
    },
  });
}
