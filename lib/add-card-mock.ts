/**
 * Sample data + option vocabulary for the redesigned Add Card flow
 * (scan → search → confirm → added). Design/placeholder data.
 */

export type SearchResult = {
  id: string;
  name: string;
  set: string;
  accent: string;
};

export const SEARCH_RESULTS: SearchResult[] = [
  { id: "s1", name: "Charizard — 1st Edition", set: "Base Set 1999 · #4/102 · Holo Rare", accent: "#E76F51" },
  { id: "s2", name: "Charizard — Shadowless", set: "Base Set 1999 · #4/102 · Holo Rare", accent: "#E76F51" },
  { id: "s3", name: "Charizard V — Alt Art", set: "Champion's Path · #074/073 · Rainbow", accent: "#f59e0b" },
  { id: "s4", name: "Charizard-GX — Shiny", set: "Hidden Fates · #SV49/SV94 · Shiny", accent: "#7C3AED" },
];

export const GENRES = ["Pokémon", "Magic: The Gathering", "Sports", "Yu-Gi-Oh!", "One Piece"];
export const CONDITIONS = ["Mint", "Near Mint", "Excellent", "Good", "Lightly Played", "Played"];
export const CARD_TYPES = ["Normal", "Holo Foil", "Reverse Holofoil", "Cosmo Holofoil", "Full Art", "Secret Rare"];
export const GRADING_COMPANIES = ["PSA", "BGS", "CGC", "SGC"];
export const GRADES = ["10", "9.5", "9", "8.5", "8", "7", "6"];

export const VISIBILITY_OPTIONS: { value: "private" | "showcased" | "listed"; icon: string; label: string }[] = [
  { value: "private", icon: "🔒", label: "Private" },
  { value: "showcased", icon: "⭐", label: "Showcased" },
  { value: "listed", icon: "🏷", label: "Market" },
];
