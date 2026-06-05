import { supabase } from "@/lib/supabase";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuth } from "./auth-provider";

/**
 * Keeps profiles.last_seen_at + presence_status current for the signed-in user.
 *
 * - On foreground: marks the user 'online' and stamps last_seen_at.
 * - On background/inactive: marks the user 'offline'.
 * - Throttled to one DB write per minute to avoid excessive traffic.
 *
 * Renders nothing — mount once inside the auth provider.
 */
export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const lastWriteRef = useRef<number>(0);
  const THROTTLE_MS = 60_000;

  async function markOnline() {
    const userId = session?.user.id;
    if (!userId) return;
    const now = Date.now();
    if (now - lastWriteRef.current < THROTTLE_MS) return;
    lastWriteRef.current = now;
    await supabase
      .from("profiles")
      .update({
        last_seen_at: new Date().toISOString(),
        presence_status: "online",
      })
      .eq("id", userId);
  }

  async function markOffline() {
    const userId = session?.user.id;
    if (!userId) return;
    lastWriteRef.current = 0; // allow an immediate write next time app comes foreground
    await supabase
      .from("profiles")
      .update({ presence_status: "offline" })
      .eq("id", userId);
  }

  useEffect(() => {
    if (!session) return;

    // Mark online immediately when the provider mounts with an active session
    markOnline();

    const sub = AppState.addEventListener(
      "change",
      (next: AppStateStatus) => {
        if (next === "active") markOnline();
        else markOffline();
      },
    );

    return () => {
      sub.remove();
      markOffline();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  return <>{children}</>;
}
