import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileLite } from "./use-follows";

export type AppNotification = {
  id: string;
  notification_type: "follow" | "comment" | "like" | "group_post" | "rsvp";
  subject_type: string | null;
  subject_id: string | null;
  read_at: string | null;
  created_at: string;
  actor: ProfileLite | null;
};

export const notificationsKey = (userId: string | undefined) =>
  ["notifications", userId] as const;
export const unreadKey = (userId: string | undefined) =>
  ["notifications-unread", userId] as const;

export function useNotifications() {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: notificationsKey(me),
    enabled: !!me,
    queryFn: async (): Promise<AppNotification[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, notification_type, subject_type, subject_id, read_at, created_at, " +
            "actor:profiles!notifications_actor_id_fkey(id,username,display_name,is_vendor)",
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as unknown as AppNotification[];
    },
  });
}

export function useUnreadCount() {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: unreadKey(me),
    enabled: !!me,
    staleTime: 0,
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", me!)
        .is("read_at", null);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export function useMarkNotificationsRead() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("recipient_id", me!)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKey(me) });
      queryClient.invalidateQueries({ queryKey: unreadKey(me) });
    },
  });
}
