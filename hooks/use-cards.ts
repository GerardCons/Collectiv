import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type CardState = "private" | "showcased" | "listed";

export type Card = {
  id: string;
  collection_id: string;
  owner_id: string;
  title: string;
  set_name: string | null;
  condition: string | null;
  notes: string | null;
  primary_photo_path: string | null;
  state: CardState;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CardPhoto = {
  id: string;
  card_id: string;
  path: string;
  position: number;
  created_at: string;
};

export const cardsKey = (collectionId: string | null | undefined) =>
  ["cards", collectionId] as const;
export const cardKey = (cardId: string | undefined) => ["card", cardId] as const;
export const cardPhotosKey = (cardId: string | undefined) =>
  ["card-photos", cardId] as const;
export const showcasedKey = (userId: string | undefined) =>
  ["showcased", userId] as const;

/** Cards in one collection, newest first. */
export function useCards(collectionId: string | null | undefined) {
  return useQuery({
    queryKey: cardsKey(collectionId),
    enabled: !!collectionId,
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("collection_id", collectionId!)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Card[];
    },
  });
}

/** A single card. */
export function useCard(cardId: string | undefined) {
  return useQuery({
    queryKey: cardKey(cardId),
    enabled: !!cardId,
    queryFn: async (): Promise<Card> => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", cardId!)
        .single();
      if (error) throw error;
      return data as Card;
    },
  });
}

/** Extra photos (e.g. the back) for a card, ordered by position. */
export function useCardPhotos(cardId: string | undefined) {
  return useQuery({
    queryKey: cardPhotosKey(cardId),
    enabled: !!cardId,
    queryFn: async (): Promise<CardPhoto[]> => {
      const { data, error } = await supabase
        .from("card_photos")
        .select("*")
        .eq("card_id", cardId!)
        .order("position", { ascending: true });
      if (error) throw error;
      return data as CardPhoto[];
    },
  });
}

export type CreateCardInput = {
  collectionId: string;
  title: string;
  setName: string | null;
  condition: string | null;
  notes: string | null;
  state: CardState;
  primaryPhotoPath: string | null;
  /** Additional photos beyond the primary/front (e.g. the back at position 1). */
  photos: { path: string; position: number }[];
};

export function useCreateCard() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCardInput): Promise<Card> => {
      const { data: card, error } = await supabase
        .from("cards")
        .insert({
          collection_id: input.collectionId,
          owner_id: userId!,
          title: input.title,
          set_name: input.setName,
          condition: input.condition,
          notes: input.notes,
          state: input.state,
          primary_photo_path: input.primaryPhotoPath,
        })
        .select()
        .single();
      if (error) throw error;

      if (input.photos.length) {
        const rows = input.photos.map((p) => ({
          card_id: (card as Card).id,
          path: p.path,
          position: p.position,
        }));
        const { error: photoError } = await supabase
          .from("card_photos")
          .insert(rows);
        if (photoError) throw photoError;
      }
      return card as Card;
    },
    onSuccess: (card) => {
      queryClient.invalidateQueries({ queryKey: cardsKey(card.collection_id) });
      queryClient.invalidateQueries({ queryKey: showcasedKey(userId) });
    },
  });
}

/** Cards a user has made public (showcased or listed), newest first. */
export function useShowcasedCards(userId: string | undefined) {
  return useQuery({
    queryKey: showcasedKey(userId),
    enabled: !!userId,
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("owner_id", userId!)
        .in("state", ["showcased", "listed"])
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Card[];
    },
  });
}

export type UpdateCardInput = {
  id: string;
  collectionId: string;
  title: string;
  setName: string | null;
  condition: string | null;
  notes: string | null;
  state: CardState;
};

/** Edit a card's details + visibility. */
export function useUpdateCard() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCardInput): Promise<Card> => {
      const { data, error } = await supabase
        .from("cards")
        .update({
          title: input.title,
          set_name: input.setName,
          condition: input.condition,
          notes: input.notes,
          state: input.state,
        })
        .eq("id", input.id)
        .select()
        .single();
      if (error) throw error;
      return data as Card;
    },
    onSuccess: (card) => {
      queryClient.setQueryData(cardKey(card.id), card);
      queryClient.invalidateQueries({ queryKey: cardsKey(card.collection_id) });
      queryClient.invalidateQueries({ queryKey: showcasedKey(userId) });
    },
  });
}

/** Flip a card between private / showcased / listed. */
export function useSetCardState() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      cardId: string;
      state: CardState;
    }): Promise<Card> => {
      const { data, error } = await supabase
        .from("cards")
        .update({ state: input.state })
        .eq("id", input.cardId)
        .select()
        .single();
      if (error) throw error;
      return data as Card;
    },
    onSuccess: (card) => {
      queryClient.setQueryData(cardKey(card.id), card);
      queryClient.invalidateQueries({ queryKey: cardsKey(card.collection_id) });
      queryClient.invalidateQueries({ queryKey: showcasedKey(userId) });
    },
  });
}

/** Soft-delete a card (sets deleted_at). */
export function useDeleteCard() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (card: Card): Promise<Card> => {
      const { error } = await supabase
        .from("cards")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", card.id);
      if (error) throw error;
      return card;
    },
    onSuccess: (card) => {
      queryClient.invalidateQueries({ queryKey: cardsKey(card.collection_id) });
      queryClient.invalidateQueries({ queryKey: showcasedKey(userId) });
    },
  });
}
