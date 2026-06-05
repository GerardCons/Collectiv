/** Shared card vocabulary so add-card, edit-card and the portfolio sort agree. */
export const CONDITIONS = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Good",
  "Light Played",
  "Played",
] as const;

export const CONDITION_RANK: Record<string, number> = {
  Mint: 0,
  "Near Mint": 1,
  Excellent: 2,
  Good: 3,
  "Light Played": 4,
  Played: 5,
};

/** Hobby genres, shared by collections and groups. */
export const GENRES = [
  "Pokémon",
  "Sports",
  "One Piece",
  "Yu-Gi-Oh!",
  "Other",
] as const;
