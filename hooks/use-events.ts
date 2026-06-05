import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileLite } from "./use-follows";

export type EventType = "meetup" | "tournament" | "convention" | "other";
export type RsvpStatus = "going" | "interested" | "not_going";

export type AppEvent = {
  id: string;
  host_user_id: string;
  name: string;
  description: string | null;
  event_type: EventType;
  genre: string | null;
  starts_at: string;
  ends_at: string | null;
  address: string | null;
  max_attendees: number | null;
  cover_path: string | null;
  created_at: string;
};

export type EventWithHost = AppEvent & { host: ProfileLite | null };

export type RsvpSummary = {
  going: number;
  interested: number;
  myStatus: RsvpStatus | null;
  goingUsers: ProfileLite[];
};

export const eventsKey = (filter?: string) => ["events", filter ?? "all"] as const;
export const eventKey = (id: string | undefined) => ["event", id] as const;
export const rsvpKey = (eventId: string | undefined) => ["rsvp", eventId] as const;
export const myEventsKey = (userId: string | undefined) => ["my-events", userId] as const;

const EVENT_SELECT =
  "id, host_user_id, name, description, event_type, genre, starts_at, ends_at, " +
  "address, max_attendees, cover_path, created_at, " +
  "host:profiles!events_host_user_id_fkey(id,username,display_name,is_vendor)";

/** All upcoming events (and recent past), newest-start first. */
export function useEvents(filter?: "upcoming" | "past") {
  return useQuery({
    queryKey: eventsKey(filter),
    queryFn: async (): Promise<EventWithHost[]> => {
      const now = new Date().toISOString();
      let query = supabase
        .from("events")
        .select(EVENT_SELECT)
        .order("starts_at", { ascending: filter !== "past" });
      if (filter === "upcoming") {
        query = query.gte("starts_at", now);
      } else if (filter === "past") {
        query = query.lt("starts_at", now).limit(30);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as EventWithHost[];
    },
  });
}

/** Single event. */
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: eventKey(id),
    enabled: !!id,
    queryFn: async (): Promise<EventWithHost> => {
      const { data, error } = await supabase
        .from("events")
        .select(EVENT_SELECT)
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as unknown as EventWithHost;
    },
  });
}

/** RSVP counts + who's going + my own status. */
export function useRsvpSummary(eventId: string | undefined) {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: rsvpKey(eventId),
    enabled: !!eventId,
    queryFn: async (): Promise<RsvpSummary> => {
      const { data, error } = await supabase
        .from("event_rsvps")
        .select(
          "status, user_id, " +
            "user:profiles!event_rsvps_user_id_fkey(id,username,display_name,is_vendor)",
        )
        .eq("event_id", eventId!);
      if (error) throw error;
      type Row = { status: RsvpStatus; user_id: string; user: ProfileLite | null };
      const rows = data as unknown as Row[];
      const going = rows.filter((r) => r.status === "going");
      const interested = rows.filter((r) => r.status === "interested");
      const mine = rows.find((r) => r.user_id === me);
      return {
        going: going.length,
        interested: interested.length,
        myStatus: mine?.status ?? null,
        goingUsers: going.map((r) => r.user).filter(Boolean) as ProfileLite[],
      };
    },
  });
}

/** The signed-in user's hosted + RSVPed events. */
export function useMyEvents() {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: myEventsKey(me),
    enabled: !!me,
    queryFn: async (): Promise<{ hosting: EventWithHost[]; attending: EventWithHost[] }> => {
      const [hosted, rsvped] = await Promise.all([
        supabase.from("events").select(EVENT_SELECT).eq("host_user_id", me!),
        supabase
          .from("event_rsvps")
          .select(`event:events(${EVENT_SELECT})`)
          .eq("user_id", me!)
          .in("status", ["going", "interested"]),
      ]);
      if (hosted.error) throw hosted.error;
      if (rsvped.error) throw rsvped.error;
      type RsvpRow = { event: EventWithHost | null };
      const attending = (rsvped.data as unknown as RsvpRow[])
        .map((r) => r.event)
        .filter(Boolean) as EventWithHost[];
      return {
        hosting: hosted.data as unknown as EventWithHost[],
        attending,
      };
    },
  });
}

export type CreateEventInput = {
  name: string;
  description: string | null;
  eventType: EventType;
  genre: string | null;
  startsAt: Date;
  endsAt: Date | null;
  address: string | null;
  maxAttendees: number | null;
  coverPath: string | null;
};

/** Create an event and auto-RSVP the creator as 'going'. */
export function useCreateEvent() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEventInput): Promise<AppEvent> => {
      const { data, error } = await supabase
        .from("events")
        .insert({
          host_user_id: me!,
          name: input.name,
          description: input.description,
          event_type: input.eventType,
          genre: input.genre,
          starts_at: input.startsAt.toISOString(),
          ends_at: input.endsAt?.toISOString() ?? null,
          address: input.address,
          max_attendees: input.maxAttendees,
          cover_path: input.coverPath,
        })
        .select()
        .single();
      if (error) throw error;
      const ev = data as AppEvent;
      // Auto-RSVP the creator.
      await supabase
        .from("event_rsvps")
        .insert({ event_id: ev.id, user_id: me!, status: "going" });
      return ev;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey() });
      queryClient.invalidateQueries({ queryKey: myEventsKey(me) });
    },
  });
}

/** Upsert the signed-in user's RSVP (or remove it if status is null). */
export function useSetRsvp() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      eventId: string;
      status: RsvpStatus | null;
    }) => {
      if (input.status === null) {
        await supabase
          .from("event_rsvps")
          .delete()
          .eq("event_id", input.eventId)
          .eq("user_id", me!);
      } else {
        await supabase.from("event_rsvps").upsert(
          { event_id: input.eventId, user_id: me!, status: input.status },
          { onConflict: "event_id,user_id" },
        );
      }
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: rsvpKey(input.eventId) });
      queryClient.invalidateQueries({ queryKey: myEventsKey(me) });
    },
  });
}
