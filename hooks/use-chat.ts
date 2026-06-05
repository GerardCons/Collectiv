import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
};

export type ChatPartner = {
  id: string;
  username: string;
  display_name: string | null;
  is_vendor: boolean;
};

export type ConversationSummary = {
  id: string;
  last_message_at: string;
  other: ChatPartner | null;
  lastMessage: { body: string; created_at: string; sender_id: string } | null;
  unread: boolean;
};

export const messagesKey = (conversationId: string | undefined) =>
  ["messages", conversationId] as const;
export const conversationsKey = (userId: string | undefined) =>
  ["conversations", userId] as const;

// --- Raw shapes of the embedded selects (mapped into the clean types above) ---
type RawParticipant = {
  user_id: string;
  last_read_at: string | null;
  profiles: ChatPartner | null;
};
type RawMessage = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
};
type RawConversation = {
  id: string;
  last_message_at: string;
  conversation_participants: RawParticipant[];
  messages: RawMessage[];
};

/** Append a message to a cached list, skipping duplicates (Realtime echoes). */
export function appendDedupe(
  list: Message[] | undefined,
  msg: Message,
): Message[] {
  const arr = list ?? [];
  if (arr.some((m) => m.id === msg.id)) return arr;
  return [...arr, msg];
}

/** The signed-in user's conversations, most-recent first. */
export function useConversations() {
  const { session } = useAuth();
  const myId = session?.user.id;

  return useQuery({
    queryKey: conversationsKey(myId),
    enabled: !!myId,
    queryFn: async (): Promise<ConversationSummary[]> => {
      // RLS already scopes conversations to ones I'm a participant of.
      const { data, error } = await supabase
        .from("conversations")
        .select(
          "id, last_message_at, " +
            "conversation_participants(user_id, last_read_at, profiles(id, username, display_name, is_vendor)), " +
            "messages(id, body, created_at, sender_id)",
        )
        .order("last_message_at", { ascending: false });
      if (error) throw error;

      const rows = (data ?? []) as unknown as RawConversation[];
      return rows.map((c) => {
        const otherPart = c.conversation_participants.find(
          (p) => p.user_id !== myId,
        );
        const myPart = c.conversation_participants.find(
          (p) => p.user_id === myId,
        );
        const last =
          [...c.messages].sort((a, b) =>
            b.created_at.localeCompare(a.created_at),
          )[0] ?? null;
        const unread =
          !!last &&
          last.sender_id !== myId &&
          (!myPart?.last_read_at || last.created_at > myPart.last_read_at);

        return {
          id: c.id,
          last_message_at: c.last_message_at,
          other: otherPart?.profiles ?? null,
          lastMessage: last,
          unread,
        };
      });
    },
  });
}

/** The other participant of a 1-on-1 conversation (for the chat header). */
export function useConversationPartner(conversationId: string | undefined) {
  const { session } = useAuth();
  const myId = session?.user.id;

  return useQuery({
    queryKey: ["conversation-partner", conversationId],
    enabled: !!conversationId && !!myId,
    queryFn: async (): Promise<ChatPartner | null> => {
      const { data, error } = await supabase
        .from("conversation_participants")
        .select("user_id, profiles(id, username, display_name, is_vendor)")
        .eq("conversation_id", conversationId!);
      if (error) throw error;
      const rows = data as unknown as RawParticipant[];
      return rows.find((r) => r.user_id !== myId)?.profiles ?? null;
    },
  });
}

/** Messages in a conversation, oldest first. */
export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: messagesKey(conversationId),
    enabled: !!conversationId,
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
  });
}

/** Send a message; the row also arrives via Realtime (deduped on id). */
export function useSendMessage(conversationId: string) {
  const { session } = useAuth();
  const myId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: string): Promise<Message> => {
      const { data, error } = await supabase
        .from("messages")
        .insert({ conversation_id: conversationId, sender_id: myId!, body })
        .select()
        .single();
      if (error) throw error;
      return data as Message;
    },
    onSuccess: (msg) => {
      queryClient.setQueryData<Message[]>(messagesKey(conversationId), (old) =>
        appendDedupe(old, msg),
      );
      queryClient.invalidateQueries({ queryKey: conversationsKey(myId) });
    },
  });
}

/** Mark a conversation read up to now (clears the unread indicator). */
export function useMarkConversationRead() {
  const { session } = useAuth();
  const myId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await supabase
        .from("conversation_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("user_id", myId!);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: conversationsKey(myId) }),
  });
}

/** Find-or-create the 1-on-1 conversation with another user (via RPC). */
export async function startConversation(
  otherUserId: string,
  listingId?: string | null,
): Promise<string> {
  const { data, error } = await supabase.rpc("get_or_create_conversation", {
    p_other_user: otherUserId,
    p_listing_id: listingId ?? null,
  });
  if (error) throw error;
  return data as string;
}
