import { decode } from "base64-arraybuffer";
import { supabase } from "./supabase";

const BUCKET = "card-photos";

/** Resolve a stored path to a public CDN URL (paths live in the DB, not URLs). */
export function cardPhotoUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Upload a base64 JPEG to the card-photos bucket and return its storage path.
 * Path is namespaced by user id ("{userId}/{folder}/{slot}.jpg") to satisfy the
 * storage RLS insert policy.
 */
export async function uploadCardImage(
  userId: string,
  folder: string,
  slot: string,
  base64: string,
): Promise<string> {
  const path = `${userId}/${folder}/${slot}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, decode(base64), {
      contentType: "image/jpeg",
      upsert: true,
    });
  if (error) throw error;
  return path;
}
