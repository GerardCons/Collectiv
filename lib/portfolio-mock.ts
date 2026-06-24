/**
 * Local sample data for the Portfolio tab and its sheets (switcher, new
 * collection, filter). Design/placeholder data so every state renders fully —
 * swap for live `use-collections` / `use-cards` queries later.
 */

export type Visibility = "private" | "showcased" | "listed";

export type PortfolioCard = {
  id: string;
  name: string;
  genre: string;
  condition: string;
  color: string;
  grade: string | null;
  state: Visibility;
  price: string | null;
  isNew?: boolean;
};

export type PortfolioCollection = {
  id: string;
  name: string;
  color: string;
  visibility: "private" | "public";
  followers: number | null;
  stats: { value: string; cards: string; sets: string };
  cards: PortfolioCard[];
};

const COL = {
  coral: "#E76F51",
  purple: "#7C3AED",
  green: "#10B981",
  amber: "#f59e0b",
  blue: "#2563eb",
  pink: "#ec4899",
};

const MY_CARDS: PortfolioCard[] = [
  { id: "c1", name: "Charizard 1st Ed.", genre: "Pokémon", condition: "Near Mint", color: COL.coral, grade: "PSA 9", state: "private", price: null, isNew: true },
  { id: "c2", name: "Pikachu Illustrator", genre: "Pokémon", condition: "Mint", color: COL.purple, grade: null, state: "showcased", price: null },
  { id: "c3", name: "Blastoise Base", genre: "Pokémon", condition: "Near Mint", color: COL.green, grade: null, state: "private", price: null },
  { id: "c4", name: "Mewtwo Holo", genre: "Pokémon", condition: "Excellent", color: COL.amber, grade: "PSA 10", state: "listed", price: "$1,200" },
  { id: "c5", name: "Black Lotus", genre: "Magic", condition: "Near Mint", color: COL.coral, grade: null, state: "showcased", price: null },
  { id: "c6", name: "Charizard VMAX", genre: "Pokémon", condition: "Near Mint", color: COL.purple, grade: null, state: "private", price: null },
];

export const COLLECTIONS: PortfolioCollection[] = [
  {
    id: "col-main",
    name: "My Collection",
    color: COL.coral,
    visibility: "public",
    followers: 127,
    stats: { value: "$14,820", cards: "247", sets: "12" },
    cards: MY_CARDS,
  },
  {
    id: "col-vintage",
    name: "Vintage Pokémon",
    color: COL.purple,
    visibility: "private",
    followers: null,
    stats: { value: "$—", cards: "0", sets: "0" },
    cards: [],
  },
];

export const COLLECTION_COLORS = [COL.coral, COL.purple, COL.green, COL.amber, COL.blue, COL.pink];

// ── Filter vocabulary ────────────────────────────────────────
export const STATUS_OPTIONS: { label: string; value: "all" | Visibility }[] = [
  { label: "All", value: "all" },
  { label: "🔒 Private", value: "private" },
  { label: "⭐ Showcased", value: "showcased" },
  { label: "🏷 Market", value: "listed" },
];
export const GENRE_OPTIONS = ["Pokémon", "Magic", "Sports", "Yu-Gi-Oh", "Other"];
export const CONDITION_OPTIONS = ["All", "Mint", "Near Mint", "Excellent", "Good", "Lightly Played"];
export const GRADING_OPTIONS = ["All", "Graded Only", "Ungraded Only"];

export type PortfolioFilters = {
  status: "all" | Visibility;
  genre: string | null;
  condition: string;
  grading: string;
};

export const DEFAULT_FILTERS: PortfolioFilters = {
  status: "all",
  genre: null,
  condition: "All",
  grading: "All",
};

/** Apply filters to a card list. */
export function applyFilters(cards: PortfolioCard[], f: PortfolioFilters): PortfolioCard[] {
  return cards.filter((c) => {
    if (f.status !== "all" && c.state !== f.status) return false;
    if (f.genre && c.genre !== f.genre) return false;
    if (f.condition !== "All" && c.condition !== f.condition) return false;
    if (f.grading === "Graded Only" && !c.grade) return false;
    if (f.grading === "Ungraded Only" && c.grade) return false;
    return true;
  });
}

// ── Card Detail ──────────────────────────────────────────────
export type CardMode = "market" | "showcased" | "private";

export type CardDetail = {
  id: string;
  title: string;
  subtitle: string;
  mode: CardMode;
  photoType: "real" | "reference";
  frontAccent: string;
  grade: string | null;
  price: string | null;
  shipping: string | null;
  likes: number;
  comments: number;
  friends: number;
  watching: number;
  offers: number;
  listed: string;
  genre: string;
  condition: string;
  added: string;
};

const DETAILS: Record<string, CardDetail> = {
  c1: { id: "c1", title: "Charizard — 1st Ed. Base Set", subtitle: "Pokémon · Holo Rare", mode: "private", photoType: "real", frontAccent: COL.coral, grade: "PSA 9", price: null, shipping: null, likes: 0, comments: 0, friends: 0, watching: 0, offers: 0, listed: "—", genre: "Pokémon", condition: "Near Mint", added: "Jan 2024" },
  c2: { id: "c2", title: "Pikachu Illustrator", subtitle: "Promo · Illustrator", mode: "showcased", photoType: "real", frontAccent: COL.purple, grade: "CGC 8.5", price: null, shipping: null, likes: 128, comments: 24, friends: 2, watching: 0, offers: 0, listed: "—", genre: "Pokémon", condition: "Excellent", added: "Jan 2024" },
  c3: { id: "c3", title: "Blastoise — Base Set", subtitle: "Pokémon · Holo Rare", mode: "private", photoType: "reference", frontAccent: COL.green, grade: null, price: null, shipping: null, likes: 0, comments: 0, friends: 0, watching: 0, offers: 0, listed: "—", genre: "Pokémon", condition: "Near Mint", added: "Feb 2024" },
  c4: { id: "c4", title: "Mewtwo — Base Set", subtitle: "Pokémon · Holo Rare", mode: "market", photoType: "real", frontAccent: COL.amber, grade: "PSA 10", price: "$1,200", shipping: "+ $12 shipping", likes: 0, comments: 0, friends: 0, watching: 8, offers: 3, listed: "Jan 2024", genre: "Pokémon", condition: "Excellent", added: "Jan 2024" },
  c5: { id: "c5", title: "Black Lotus", subtitle: "Magic · Alpha Rare", mode: "showcased", photoType: "real", frontAccent: COL.coral, grade: null, price: null, shipping: null, likes: 342, comments: 56, friends: 4, watching: 0, offers: 0, listed: "—", genre: "Magic", condition: "Near Mint", added: "Mar 2024" },
  c6: { id: "c6", title: "Charizard VMAX", subtitle: "Champion's Path · Rainbow", mode: "private", photoType: "real", frontAccent: COL.purple, grade: null, price: null, shipping: null, likes: 0, comments: 0, friends: 0, watching: 0, offers: 0, listed: "—", genre: "Pokémon", condition: "Near Mint", added: "Mar 2024" },
};

export function getCardDetail(id: string): CardDetail {
  return DETAILS[id] ?? DETAILS.c1;
}

/** Active filter pills (non-default selections) for the Filter Result header. */
export function activePills(f: PortfolioFilters): { key: string; label: string }[] {
  const pills: { key: string; label: string }[] = [];
  if (f.status !== "all") pills.push({ key: "status", label: STATUS_OPTIONS.find((s) => s.value === f.status)!.label.replace(/^\S+\s/, "") });
  if (f.genre) pills.push({ key: "genre", label: f.genre });
  if (f.condition !== "All") pills.push({ key: "condition", label: f.condition });
  if (f.grading !== "All") pills.push({ key: "grading", label: f.grading });
  return pills;
}
