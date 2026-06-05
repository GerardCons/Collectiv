import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/** Phase 1 shape of a row in public.collections. */
export type Collection = {
  id: string;
  owner_id: string;
  name: string;
  genre: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type NewCollectionInput = {
  name: string;
  genre: string | null;
  description: string | null;
};

export const collectionsKey = (userId: string | undefined) =>
  ["collections", userId] as const;

/** The signed-in user's collections, oldest first (so seeded "Main" leads). */
export function useCollections() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: collectionsKey(userId),
    enabled: !!userId,
    queryFn: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("owner_id", userId!)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Collection[];
    },
  });
}

/** Create a collection and refresh the list. */
export function useCreateCollection() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewCollectionInput): Promise<Collection> => {
      const { data, error } = await supabase
        .from("collections")
        .insert({
          owner_id: userId!,
          name: input.name,
          genre: input.genre,
          description: input.description,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionsKey(userId) });
    },
  });
}
