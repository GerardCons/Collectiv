import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Card, cardKey, showcasedKey } from "./use-cards";
import { Profile } from "./use-profile";

export type ListingStatus = "active" | "sold" | "cancelled";

export type Listing = {
  id: string;
  card_id: string;
  seller_id: string;
  price_cents: number;
  currency: string;
  description: string | null;
  shipping_info: string | null;
  status: ListingStatus;
  sold_to_user_id: string | null;
  listed_at: string;
  sold_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ListingCard = Pick<
  Card,
  "id" | "title" | "set_name" | "condition" | "primary_photo_path" | "owner_id" | "collection_id"
>;
export type ListingSeller = Pick<
  Profile,
  "id" | "username" | "display_name" | "is_vendor" | "location_city" | "pickup_city"
>;
export type ListingWithDetails = Listing & {
  card: ListingCard | null;
  seller: ListingSeller | null;
};

// Embed card (single FK) + seller (disambiguated FK, since listings has two
// FKs to profiles: seller_id and sold_to_user_id).
const DETAIL_SELECT =
  "*, " +
  "card:cards(id,title,set_name,condition,primary_photo_path,owner_id,collection_id), " +
  "seller:profiles!listings_seller_id_fkey(id,username,display_name,is_vendor,location_city,pickup_city)";

/** All active marketplace listings, newest first. */
export function useActiveListings() {
  return useQuery({
    queryKey: ["listings", "active"],
    queryFn: async (): Promise<ListingWithDetails[]> => {
      const { data, error } = await supabase
        .from("listings")
        .select(DETAIL_SELECT)
        .eq("status", "active")
        .order("listed_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ListingWithDetails[];
    },
  });
}

/** A single listing with card + seller. */
export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ["listing", id],
    enabled: !!id,
    queryFn: async (): Promise<ListingWithDetails> => {
      const { data, error } = await supabase
        .from("listings")
        .select(DETAIL_SELECT)
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as unknown as ListingWithDetails;
    },
  });
}

/** The active listing for a card (if any) — used by the card detail screen. */
export function useActiveListingForCard(cardId: string | undefined) {
  return useQuery({
    queryKey: ["listing-for-card", cardId],
    enabled: !!cardId,
    queryFn: async (): Promise<Listing | null> => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("card_id", cardId!)
        .eq("status", "active")
        .maybeSingle();
      if (error) throw error;
      return (data as Listing) ?? null;
    },
  });
}

/** A seller's active listings (for their vendor storefront inventory). */
export function useSellerListings(sellerId: string | undefined) {
  return useQuery({
    queryKey: ["seller-listings", sellerId],
    enabled: !!sellerId,
    queryFn: async (): Promise<ListingWithDetails[]> => {
      const { data, error } = await supabase
        .from("listings")
        .select(DETAIL_SELECT)
        .eq("seller_id", sellerId!)
        .eq("status", "active")
        .order("listed_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ListingWithDetails[];
    },
  });
}

/** The signed-in user's own listings (all statuses) for the seller dashboard. */
export function useMyListings() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ["my-listings", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ListingWithDetails[]> => {
      const { data, error } = await supabase
        .from("listings")
        .select(DETAIL_SELECT)
        .eq("seller_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ListingWithDetails[];
    },
  });
}

function invalidateListingCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string | undefined,
  cardId: string,
) {
  queryClient.invalidateQueries({ queryKey: ["listings"] });
  queryClient.invalidateQueries({ queryKey: ["my-listings", userId] });
  queryClient.invalidateQueries({ queryKey: ["listing-for-card", cardId] });
  queryClient.invalidateQueries({ queryKey: cardKey(cardId) });
  queryClient.invalidateQueries({ queryKey: showcasedKey(userId) });
  queryClient.invalidateQueries({ queryKey: ["cards"] }); // any collection list
}

export type CreateListingInput = {
  cardId: string;
  priceCents: number;
  currency: string;
  description: string | null;
  shippingInfo: string | null;
};

/** Create a listing and flip the card to 'listed'. */
export function useCreateListing() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateListingInput): Promise<Listing> => {
      const { data: listing, error } = await supabase
        .from("listings")
        .insert({
          card_id: input.cardId,
          seller_id: userId!,
          price_cents: input.priceCents,
          currency: input.currency,
          description: input.description,
          shipping_info: input.shippingInfo,
        })
        .select()
        .single();
      if (error) throw error;

      const { error: cardError } = await supabase
        .from("cards")
        .update({ state: "listed" })
        .eq("id", input.cardId);
      if (cardError) throw cardError;

      return listing as Listing;
    },
    onSuccess: (listing) =>
      invalidateListingCaches(queryClient, userId, listing.card_id),
  });
}

/** Mark sold or cancel a listing, reverting its card to 'showcased'. */
export function useResolveListing() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      listing: Listing;
      status: "sold" | "cancelled";
    }) => {
      const patch =
        input.status === "sold"
          ? { status: "sold", sold_at: new Date().toISOString() }
          : { status: "cancelled", cancelled_at: new Date().toISOString() };

      const { error } = await supabase
        .from("listings")
        .update(patch)
        .eq("id", input.listing.id);
      if (error) throw error;

      // No longer actively for sale → back to showcased.
      const { error: cardError } = await supabase
        .from("cards")
        .update({ state: "showcased" })
        .eq("id", input.listing.card_id);
      if (cardError) throw cardError;
    },
    onSuccess: (_data, input) =>
      invalidateListingCaches(queryClient, userId, input.listing.card_id),
  });
}
