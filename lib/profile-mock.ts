/**
 * Local sample data for the Profile section — own / other-collector / vendor
 * storefront. Design/placeholder data.
 */

export type ProfileVariant = "own" | "user" | "vendor";

export type ProfilePerson = {
  variant: ProfileVariant;
  initial: string;
  emoji?: string;
  color: string;
  name: string;
  handle: string;
  verified: boolean;
  vendor?: boolean;
  bio: string;
  loc: string;
  address?: string;
  hours?: string;
  open?: boolean;
  powerVendor?: boolean;
  stats: [string, string][];
};

const C = { coral: "#E76F51", purple: "#7C3AED", green: "#10B981", amber: "#f59e0b", blue: "#2563eb" };

export const PEOPLE: Record<ProfileVariant, ProfilePerson> = {
  own: {
    variant: "own", initial: "J", color: C.coral, name: "Jake Morrison", handle: "jakescollects", verified: false,
    bio: "Vintage hoops + modern PSA hunter. Edmonton-based. Always down to trade rookies. 🏀",
    loc: "Edmonton, AB",
    stats: [["247", "Cards"], ["1.2k", "Followers"], ["389", "Following"]],
  },
  user: {
    variant: "user", initial: "M", color: C.purple, name: "Marcus Chen", handle: "mchen_cards", verified: true,
    bio: "Basketball RC specialist. Grading nerd. DM for trades — I ship fast. 📦",
    loc: "Downtown, Edmonton",
    stats: [["184", "Cards"], ["3.4k", "Followers"], ["212", "Following"]],
  },
  vendor: {
    variant: "vendor", initial: "🏪", emoji: "🏪", color: C.purple, name: "Sportscards YEG", handle: "sportscards_yeg", verified: true, vendor: true, powerVendor: true,
    bio: "Edmonton's premier card shop since 2014. Buy · Sell · Trade · On-site PSA grading.",
    loc: "104 St & Jasper Ave, Edmonton",
    address: "10412 Jasper Ave NW, Edmonton, AB T5J 1Z9",
    hours: "10 AM – 7 PM", open: true,
    stats: [["4.9★", "Rating"], ["143", "Cards Sold"], ["48", "Listings"]],
  },
};

export const TABS: Record<ProfileVariant, string[]> = {
  own: ["Showcase", "Listings", "Activity", "Reviews"],
  user: ["Showcase", "Listings", "Activity", "Reviews"],
  vendor: ["Gallery", "Listings", "Reviews"],
};

export const JOINED_GROUPS: { icon: string; name: string; color: string }[] = [
  { icon: "💎", name: "PSA 10 Hunters", color: C.coral },
  { icon: "🍁", name: "YEG Collectors", color: C.green },
  { icon: "🏀", name: "Hoops Vault", color: C.purple },
  { icon: "🎟", name: "Card Shows", color: C.blue },
];

export const SUGGEST_ACCOUNTS: { initial: string; name: string; sub: string; color: string }[] = [
  { initial: "E", name: "Official Ezra", sub: "45.5K followers", color: C.purple },
  { initial: "B", name: "Bazunes Cards", sub: "128.2K followers", color: C.amber },
  { initial: "K", name: "Kayla Brooks", sub: "12.1K followers", color: C.green },
];
export const SUGGEST_VENDORS: { name: string; sub: string; color: string }[] = [
  { name: "Graded Gems Co.", sub: "31 listings", color: C.green },
  { name: "Pacific Cards", sub: "22 listings", color: C.blue },
  { name: "Prizm King", sub: "45 listings", color: C.amber },
];

export const SHOWCASE = [
  { name: "Michael Jordan — '86 Fleer RC", sub: "PSA 9 · Crown jewel", color: C.purple },
  { name: "LeBron James — '03 RC", sub: "PSA 10 · Grail", color: C.coral },
  { name: "Kobe Bryant — '96 Chrome", sub: "PSA 8 · Vintage", color: C.amber },
  { name: "Wayne Gretzky — '79 OPC", sub: "PSA 7 · Hometown hero", color: C.blue },
];

export const LISTINGS = [
  { name: "LeBron James", sub: "'03 Chrome RC", price: "$12,500", grade: "PSA 10", color: C.coral },
  { name: "Patrick Mahomes", sub: "'17 Prizm RC", price: "$2,800", grade: "PSA 10", color: C.green },
  { name: "Stephen Curry", sub: "'09 Chrome RC", price: "$1,450", grade: "PSA 9", color: C.coral },
  { name: "Shohei Ohtani", sub: "'18 Update RC", price: "$890", grade: "PSA 10", color: C.blue },
  { name: "Luka Dončić", sub: "'18 Prizm RC", price: "$4,100", grade: "PSA 10", color: C.coral },
  { name: "Kobe Bryant", sub: "'96 Chrome RC", price: "$2,100", grade: "PSA 8", color: C.amber },
];

export const GALLERY = [C.coral, C.purple, C.green, C.amber, C.blue, C.coral, C.purple, C.green, C.amber];

export const ACTIVITY = [
  { badge: "LISTED", badgeColor: C.coral, text: "Just listed a LeBron '03 Chrome RC 👀 Comps are climbing. Looking for $12,500 OBO.", time: "12m", color: C.coral, likes: 34, comments: 8 },
  { badge: "SHOWCASED", badgeColor: C.purple, text: "Added a new grail to my showcase ⭐ The '86 Fleer Jordan finally arrived.", time: "1h", color: C.purple, likes: 418, comments: 56 },
];

export const REVIEW_FILTERS = ["Relevance", "Newest", "Highest", "Lowest"];
export const RATING_BARS: [string, number][] = [["5", 92], ["4", 6], ["3", 1], ["2", 0], ["1", 1]];
export const REVIEWS = [
  { initial: "A", handle: "avapulls", text: "Fast shipping, card exactly as described. Safely packaged and arrived within 3 days. Will buy again!", time: "2d", stars: 5, color: C.purple },
  { initial: "J", handle: "jblake_psa", text: "Smooth in-person meetup downtown. Legit graded cards, no surprises. Highly recommend.", time: "1w", stars: 5, color: C.amber },
  { initial: "D", handle: "dsantos_rc", text: "Great communication throughout, fair price on a Mahomes RC. Solid seller.", time: "2w", stars: 4, color: C.blue },
];
