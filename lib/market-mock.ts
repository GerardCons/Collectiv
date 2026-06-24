/**
 * Local sample data for the Marketplace tab (home, sheets, search). Sports
 * cards near Edmonton. Design/placeholder data — swap for live listings later.
 */

export type Listing = {
  id: string;
  name: string;
  sub: string;
  type: string;
  price: string;
  grade: string;
  condition: string;
  accent: string;
  seller: string;
  distance: string;
  watches: number;
  vendor: boolean;
};

export const LISTINGS: Listing[] = [
  { id: "1", name: "LeBron James", sub: "'03-04 Topps Chrome RC", type: "Refractor Auto", price: "$12,500", grade: "PSA 10", condition: "Gem Mint", accent: "#E76F51", seller: "sportscards_yeg", distance: "2.4 km", watches: 23, vendor: true },
  { id: "2", name: "Mike Trout", sub: "2011 Topps Update RC", type: "Base Rookie", price: "$3,200", grade: "BGS 9.5", condition: "Near Mint", accent: "#2563eb", seller: "vintagepulls", distance: "4.1 km", watches: 11, vendor: false },
  { id: "3", name: "Patrick Mahomes", sub: "'17 Panini Prizm RC", type: "Silver Prizm", price: "$2,800", grade: "PSA 10", condition: "Gem Mint", accent: "#10B981", seller: "graded_gems_co", distance: "5.8 km", watches: 18, vendor: true },
  { id: "4", name: "Stephen Curry", sub: "'09-10 Topps Chrome RC", type: "Base Refractor", price: "$1,450", grade: "PSA 9", condition: "Mint", accent: "#E76F51", seller: "hoops_vault", distance: "7.2 km", watches: 7, vendor: false },
  { id: "5", name: "Shohei Ohtani", sub: "2018 Topps Update RC", type: "Base Rookie", price: "$890", grade: "PSA 10", condition: "Gem Mint", accent: "#2563eb", seller: "pacific_cards", distance: "8.9 km", watches: 14, vendor: false },
  { id: "6", name: "Luka Dončić", sub: "'18-19 Panini Prizm RC", type: "Silver Prizm", price: "$4,100", grade: "PSA 10", condition: "Gem Mint", accent: "#E76F51", seller: "prizm_king", distance: "11 km", watches: 31, vendor: true },
  { id: "7", name: "Kobe Bryant", sub: "'96-97 Topps Chrome RC", type: "Base Rookie", price: "$2,100", grade: "PSA 8", condition: "Near Mint", accent: "#f59e0b", seller: "classic_hoops", distance: "14 km", watches: 19, vendor: false },
  { id: "8", name: "Derek Jeter", sub: "1993 SP Foil RC", type: "Foil Rookie", price: "$980", grade: "BGS 9", condition: "Mint", accent: "#2563eb", seller: "vintagepulls", distance: "17 km", watches: 9, vendor: false },
  { id: "9", name: "F. Tatis Jr.", sub: "2019 Topps Chrome RC", type: "Base Refractor", price: "$560", grade: "PSA 10", condition: "Gem Mint", accent: "#2563eb", seller: "pacific_cards", distance: "21 km", watches: 8, vendor: false },
];

export const SORTS: { label: string; sub: string }[] = [
  { label: "Suggested", sub: "Active sellers & vendors prioritized" },
  { label: "Price: Low to High", sub: "Cheapest first" },
  { label: "Price: High to Low", sub: "Most valuable first" },
  { label: "Distance: Nearest", sub: "Closest to you first" },
  { label: "Date Listed: Newest", sub: "Most recent listings first" },
];

export const FILTER_GROUPS: { key: string; label: string; options: string[] }[] = [
  { key: "genre", label: "Genre", options: ["All", "Sports", "Pokémon", "Magic", "Yu-Gi-Oh!", "One Piece"] },
  { key: "condition", label: "Condition", options: ["All", "Gem Mint", "Near Mint", "Excellent", "Good"] },
  { key: "grade", label: "Grade", options: ["Any", "PSA 10", "PSA 9", "BGS 9.5", "Ungraded"] },
  { key: "seller", label: "Seller Type", options: ["All", "Vendors only", "Verified sellers"] },
];

export const RADIUS_OPTIONS = [1, 5, 25, 50, 100];

export function getListing(id: string): Listing {
  return LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];
}

/** The first listing (LeBron) is treated as the signed-in user's own listing,
 *  so tapping it opens the owner view; every other card opens the seller view. */
export const YOUR_LISTING_ID = "1";

export const STOREFRONT_STRIP = ["#E76F51", "#2563eb", "#10B981", "#f59e0b"];

/** Auto-message the "I'm Interested" button sends to the seller. */
export const INTEREST_MESSAGE =
  "Hi! I'm currently interested with your item. Is it still available?";

export const SEARCH_SUGGESTIONS: { q: string; sub: string }[] = [
  { q: "LeBron James PSA 10", sub: "847 listings nearby" },
  { q: "LeBron James Rookie", sub: "212 listings nearby" },
  { q: "LeBron James Topps", sub: "134 listings nearby" },
  { q: "LeBron James Upper Deck", sub: "89 listings nearby" },
  { q: "LeBron James Prizm", sub: "67 listings nearby" },
];
