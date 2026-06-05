import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { profileKey } from "./use-profile";

export type VendorProfile = {
  user_id: string;
  business_name: string | null;
  description: string | null;
  hours: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  website: string | null;
  address: string | null;
  banner_path: string | null;
  logo_path: string | null;
  business_location: string | null; // WKB hex — non-null means location is set
  is_featured: boolean;
  is_seeded: boolean;
  created_at: string;
  updated_at: string;
};

export const vendorProfileKey = (userId: string | undefined) =>
  ["vendor-profile", userId] as const;
export const vendorReviewsKey = (vendorId: string | undefined) =>
  ["vendor-reviews", vendorId] as const;

export type VendorReviewSummary = {
  up: number;
  down: number;
  myReview: boolean | null; // true = up, false = down, null = none
};

/** Thumbs up/down tally for a vendor, plus the signed-in user's own rating. */
export function useVendorReviews(vendorId: string | undefined) {
  const { session } = useAuth();
  const me = session?.user.id;
  return useQuery({
    queryKey: vendorReviewsKey(vendorId),
    enabled: !!vendorId,
    queryFn: async (): Promise<VendorReviewSummary> => {
      const { data, error } = await supabase
        .from("vendor_reviews")
        .select("reviewer_id, is_positive")
        .eq("vendor_id", vendorId!);
      if (error) throw error;
      const rows = data as { reviewer_id: string; is_positive: boolean }[];
      const up = rows.filter((r) => r.is_positive).length;
      const mine = rows.find((r) => r.reviewer_id === me);
      return {
        up,
        down: rows.length - up,
        myReview: mine ? mine.is_positive : null,
      };
    },
  });
}

/** Set / change / remove the signed-in user's thumbs rating for a vendor. */
export function useSetVendorReview() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { vendorId: string; value: boolean | null }) => {
      if (input.value === null) {
        const { error } = await supabase
          .from("vendor_reviews")
          .delete()
          .eq("vendor_id", input.vendorId)
          .eq("reviewer_id", me!);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("vendor_reviews")
          .upsert(
            {
              vendor_id: input.vendorId,
              reviewer_id: me!,
              is_positive: input.value,
            },
            { onConflict: "vendor_id,reviewer_id" },
          );
        if (error) throw error;
      }
    },
    onSuccess: (_data, input) =>
      queryClient.invalidateQueries({ queryKey: vendorReviewsKey(input.vendorId) }),
  });
}

/** Any user's vendor storefront detail (null if they haven't set one up). */
export function useVendorProfile(userId: string | undefined) {
  return useQuery({
    queryKey: vendorProfileKey(userId),
    enabled: !!userId,
    queryFn: async (): Promise<VendorProfile | null> => {
      const { data, error } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return (data as VendorProfile) ?? null;
    },
  });
}

export type VendorProfileInput = {
  isVendor: boolean;
  businessName: string;
  description: string | null;
  hours: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  website: string | null;
  address: string | null;
  bannerPath: string | null;
  logoPath: string | null;
};

/**
 * Save the vendor toggle + storefront. Keeps profiles.is_vendor / business_name
 * in sync (for the lightweight vendor badge) and upserts vendor_profiles when on.
 * Toggling off keeps the vendor_profiles row so it can be re-enabled.
 */
export function useUpsertVendorProfile() {
  const { session } = useAuth();
  const me = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: VendorProfileInput) => {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_vendor: input.isVendor,
          business_name: input.businessName.trim() || null,
        })
        .eq("id", me!);
      if (profileError) throw profileError;

      if (input.isVendor) {
        const { error: vendorError } = await supabase
          .from("vendor_profiles")
          .upsert({
            user_id: me!,
            business_name: input.businessName.trim() || null,
            description: input.description,
            hours: input.hours,
            phone: input.phone,
            email: input.email,
            instagram: input.instagram,
            website: input.website,
            address: input.address,
            banner_path: input.bannerPath,
            logo_path: input.logoPath,
          });
        if (vendorError) throw vendorError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKey(me) });
      queryClient.invalidateQueries({ queryKey: vendorProfileKey(me) });
    },
  });
}
