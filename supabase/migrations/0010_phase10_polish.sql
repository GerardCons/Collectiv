-- ============================================================================
-- Migration 0010 — Phase 10: Polish
-- ============================================================================
-- Adds:
--   * profiles.onboarding_completed_at — stamped when user dismisses the tour
-- ============================================================================

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;
