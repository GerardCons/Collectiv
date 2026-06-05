import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type PinType = "seller" | "vendor" | "event";
export type RouteHint = "profile" | "storefront" | "event";

export type MapPin = {
  id: string;
  pin_type: PinType;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  image_path: string | null;
  route_hint: RouteHint;
};

export function useMapPins() {
  return useQuery({
    queryKey: ["map-pins"],
    queryFn: async (): Promise<MapPin[]> => {
      const { data, error } = await supabase.rpc("map_pins");
      if (error) throw error;
      return (data ?? []) as MapPin[];
    },
    staleTime: 60_000,
  });
}

export function useUpdatePickupLocation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lat,
      lng,
      city,
      radiusKm,
    }: {
      lat: number;
      lng: number;
      city?: string;
      radiusKm?: number;
    }) => {
      const { error } = await supabase.rpc("update_pickup_location", {
        p_lat: lat,
        p_lng: lng,
        p_city: city ?? null,
        p_radius_km: radiusKm ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", session?.user.id] });
      queryClient.invalidateQueries({ queryKey: ["map-pins"] });
    },
  });
}

export function useUpdateVendorLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => {
      const { error } = await supabase.rpc("update_vendor_location", {
        p_lat: lat,
        p_lng: lng,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["map-pins"] });
    },
  });
}
