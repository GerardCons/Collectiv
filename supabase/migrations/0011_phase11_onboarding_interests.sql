-- ============================================================================
-- Migration 0011 — Phase 11: Onboarding interests
-- ============================================================================
-- Adds:
--   * profiles.interests — genres picked during the Step 2 interests screen
--     (text[]; values come from lib/card-constants GENRES + onboarding sub-genres)
--
-- Safe to run repeatedly. Pairs with the new (onboarding) flow. Until this is
-- deployed the client writes interests best-effort and never blocks onboarding.
-- ============================================================================

alter table public.profiles
  add column if not exists interests text[] not null default '{}';
