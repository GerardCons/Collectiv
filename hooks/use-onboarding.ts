import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useAuth } from "@/providers/auth-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const SEEN_INTRO_KEY = "collectiv.seenIntro";
const ONBOARDING_DONE_KEY = "collectiv.onboardingDone";

/**
 * Device-local onboarding flags, hydrated from AsyncStorage at app boot.
 *
 *  - `seenIntro`     gates the pre-auth tutorial carousel (per device).
 *  - `onboardingDone` is a FALLBACK only: it can force "done" when the DB stamp
 *    failed to write (e.g. migration 0010 not yet deployed) so a user is never
 *    trapped in the flow. It never forces "needs onboarding" — the DB column
 *    `profiles.onboarding_completed_at` remains the source of truth.
 */
type OnboardingFlags = {
  hydrated: boolean;
  seenIntro: boolean;
  onboardingDone: boolean;
  hydrate: () => Promise<void>;
  markIntroSeen: () => void;
  markOnboardingDone: () => void;
};

export const useOnboardingFlags = create<OnboardingFlags>((set) => ({
  hydrated: false,
  seenIntro: false,
  onboardingDone: false,
  hydrate: async () => {
    try {
      const [si, od] = await Promise.all([
        AsyncStorage.getItem(SEEN_INTRO_KEY),
        AsyncStorage.getItem(ONBOARDING_DONE_KEY),
      ]);
      set({ hydrated: true, seenIntro: si === "1", onboardingDone: od === "1" });
    } catch {
      set({ hydrated: true });
    }
  },
  markIntroSeen: () => {
    AsyncStorage.setItem(SEEN_INTRO_KEY, "1").catch(() => {});
    set({ seenIntro: true });
  },
  markOnboardingDone: () => {
    AsyncStorage.setItem(ONBOARDING_DONE_KEY, "1").catch(() => {});
    set({ onboardingDone: true });
  },
}));

export type OnboardingStatus = "loading" | "no-session" | "needs-onboarding" | "done";

/**
 * Single source of truth for the entry guards (index, (auth), (tabs),
 * (onboarding)). Resolves to "loading" until both the local flags and the
 * profile row are available so guards can show a spinner instead of flickering.
 */
export function useOnboardingStatus(): OnboardingStatus {
  const { session } = useAuth();
  const hydrated = useOnboardingFlags((s) => s.hydrated);
  const localDone = useOnboardingFlags((s) => s.onboardingDone);
  const { data: profile, isLoading } = useProfile();

  if (!session) return "no-session";
  if (!hydrated) return "loading";
  if (isLoading || !profile) return "loading";
  const done = profile.onboarding_completed_at != null || localDone;
  return done ? "done" : "needs-onboarding";
}

/**
 * Finish onboarding: persist picked interests + the completion stamp (both
 * best-effort), then set the local fallback flag and route into the app.
 * Never rejects — visual completion must not depend on the DB write.
 */
export function useFinishOnboarding() {
  const updateProfile = useUpdateProfile();
  const markOnboardingDone = useOnboardingFlags((s) => s.markOnboardingDone);

  return async (interests?: string[]) => {
    markOnboardingDone();
    try {
      await updateProfile.mutateAsync({
        onboarding_completed_at: new Date().toISOString(),
        ...(interests && interests.length > 0 ? { interests } : {}),
      });
    } catch {
      // Column(s) may not exist yet (migrations 0010/0011 not deployed). The
      // local flag already lets the user through; the stamp retries next launch.
    }
  };
}
