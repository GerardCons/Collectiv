import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { ProfileLite } from "./use-follows";

export type FeedItemType = "card_showcased" | "card_listed";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  created_at: string;
  actor: ProfileLite;
  cardTitle: string;
  photoPath: string | null;
  priceCents: number | null;
  /** card id (showcased) or listing id (listed) — drives the tap target. */
  subjectId: string;
  fromFollowed: boolean;
};

type RawFeedEvent = {
  id: string;
  event_type: string;
  subject_type: string;
  subject_id: string;
  created_at: string;
  actor: ProfileLite | null;
};
type FeedCardRow = {
  id: string;
  title: string;
  primary_photo_path: string | null;
  state: string;
};
type FeedListingRow = {
  id: string;
  price_cents: number;
  status: string;
  card: { id: string; title: string; primary_photo_path: string | null } | null;
};
type FollowedRow = { followed_id: string };

/**
 * The home feed. Events are read globally, then re-checked against the live
 * card/listing (RLS hides anything now private/sold). Followed users (and you)
 * are floated to the top; everything else stays chronological.
 */
export function useFeed() {
  const { session } = useAuth();
  const me = session?.user.id;

  return useQuery({
    queryKey: ["feed", me],
    enabled: !!me,
    queryFn: async (): Promise<FeedItem[]> => {
      const { data: rawEvents, error } = await supabase
        .from("feed_events")
        .select(
          "id, event_type, subject_type, subject_id, created_at, " +
            "actor:profiles!feed_events_actor_id_fkey(id,username,display_name,is_vendor)",
        )
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;

      const events = (rawEvents ?? []) as unknown as RawFeedEvent[];
      const cardIds = events
        .filter((e) => e.subject_type === "card")
        .map((e) => e.subject_id);
      const listingIds = events
        .filter((e) => e.subject_type === "listing")
        .map((e) => e.subject_id);

      // Empty .in() lists return no rows (and no error), so these are safe.
      const [cardsRes, listingsRes, followsRes] = await Promise.all([
        supabase
          .from("cards")
          .select("id,title,primary_photo_path,state")
          .in("id", cardIds),
        supabase
          .from("listings")
          .select("id,price_cents,status, card:cards(id,title,primary_photo_path)")
          .in("id", listingIds),
        supabase.from("follows").select("followed_id").eq("follower_id", me!),
      ]);
      if (cardsRes.error) throw cardsRes.error;
      if (listingsRes.error) throw listingsRes.error;
      if (followsRes.error) throw followsRes.error;

      const cardMap = new Map(
        (cardsRes.data as FeedCardRow[]).map((c) => [c.id, c]),
      );
      const listingMap = new Map(
        (listingsRes.data as unknown as FeedListingRow[]).map((l) => [l.id, l]),
      );
      const followed = new Set([
        ...(followsRes.data as FollowedRow[]).map((f) => f.followed_id),
        me,
      ]);

      const items: FeedItem[] = [];
      for (const e of events) {
        if (!e.actor) continue;
        if (e.event_type === "card_showcased") {
          const card = cardMap.get(e.subject_id);
          if (!card || card.state !== "showcased") continue;
          items.push({
            id: e.id,
            type: "card_showcased",
            created_at: e.created_at,
            actor: e.actor,
            cardTitle: card.title,
            photoPath: card.primary_photo_path,
            priceCents: null,
            subjectId: card.id,
            fromFollowed: followed.has(e.actor.id),
          });
        } else if (e.event_type === "card_listed") {
          const listing = listingMap.get(e.subject_id);
          if (!listing || listing.status !== "active") continue;
          items.push({
            id: e.id,
            type: "card_listed",
            created_at: e.created_at,
            actor: e.actor,
            cardTitle: listing.card?.title ?? "Card",
            photoPath: listing.card?.primary_photo_path ?? null,
            priceCents: listing.price_cents,
            subjectId: listing.id,
            fromFollowed: followed.has(e.actor.id),
          });
        }
      }

      items.sort((a, b) => {
        if (a.fromFollowed !== b.fromFollowed) return a.fromFollowed ? -1 : 1;
        return b.created_at.localeCompare(a.created_at);
      });
      return items;
    },
  });
}
