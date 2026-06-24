/**
 * Local sample data for the Map tab — sellers / vendors / events around
 * Edmonton, plotted on a real react-native-maps canvas. Design/placeholder data.
 */

export const EDMONTON = { latitude: 53.5461, longitude: -113.4938, latitudeDelta: 0.14, longitudeDelta: 0.14 };

const C = { coral: "#E76F51", purple: "#7C3AED", green: "#10B981", amber: "#f59e0b", blue: "#2563eb" };

export type Seller = {
  id: string; kind: "seller"; name: string; handle: string; av: string;
  cards: number; area: string; dist: string; rating: string; reviews: number;
  desc: string; color: string; lat: number; lng: number;
};
export type Vendor = {
  id: string; kind: "vendor"; name: string; handle: string; listings: number; reviews: number;
  area: string; dist: string; rating: string; hours: string; open: boolean; desc: string; lat: number; lng: number;
};
export type MapEvent = {
  id: string; kind: "event"; title: string; m: string; d: string; loc: string; addr: string;
  host: string; dateLong: string; going: number; type: string; time: string; tags: string[];
  about: string; color: string; lat: number; lng: number;
};
export type MapItem = Seller | Vendor | MapEvent;

export const SELLERS: Seller[] = [
  { id: "s1", kind: "seller", name: "Marcus Chen", handle: "mchen_cards", av: "M", cards: 12, area: "Downtown", dist: "2.4 km", rating: "4.9", reviews: 48, desc: "NBA & vintage hoops collector. Mostly graded singles — PSA/BGS. Happy to meet downtown or near Whyte Ave for local pickups. No shipping.", color: C.coral, lat: 53.5444, lng: -113.4909 },
  { id: "s2", kind: "seller", name: "Ava Rodriguez", handle: "avapulls", av: "A", cards: 7, area: "Oliver", dist: "5.8 km", rating: "4.8", reviews: 22, desc: "Pokémon & TCG singles. Quick local meetups around Oliver and downtown.", color: C.coral, lat: 53.5466, lng: -113.5176 },
  { id: "s3", kind: "seller", name: "Jordan Blake", handle: "jblake_psa", av: "J", cards: 21, area: "Whyte Ave", dist: "7.2 km", rating: "5.0", reviews: 61, desc: "Graded slabs only. Meet near Whyte Ave.", color: C.coral, lat: 53.5176, lng: -113.5012 },
  { id: "s4", kind: "seller", name: "Priya Nair", handle: "priya_breaks", av: "P", cards: 5, area: "Sherwood Park", dist: "8.9 km", rating: "4.7", reviews: 14, desc: "Break leftovers and rookies. Sherwood Park meetups.", color: C.coral, lat: 53.5351, lng: -113.4118 },
  { id: "s5", kind: "seller", name: "Diego Santos", handle: "dsantos_rc", av: "D", cards: 9, area: "West End", dist: "11 km", rating: "4.9", reviews: 33, desc: "Soccer & baseball RCs. West-end pickups.", color: C.coral, lat: 53.5298, lng: -113.5772 },
  { id: "s6", kind: "seller", name: "Kayla Brooks", handle: "kb_collects", av: "K", cards: 14, area: "Mill Woods", dist: "5.4 km", rating: "4.8", reviews: 27, desc: "Mixed sports lots. Mill Woods meetups, evenings best.", color: C.coral, lat: 53.4668, lng: -113.4533 },
];

export const VENDORS: Vendor[] = [
  { id: "v1", kind: "vendor", name: "Sportscards YEG", handle: "sportscards_yeg", listings: 48, reviews: 126, area: "104 St & Jasper Ave, Edmonton, AB", dist: "2.4 km", rating: "4.9", hours: "10 AM – 7 PM", open: true, desc: "Edmonton's go-to shop for graded singles, sealed wax, and supplies. Walk-ins welcome — on-site PSA submission every Saturday.", lat: 53.5430, lng: -113.4980 },
  { id: "v2", kind: "vendor", name: "Graded Gems Co.", handle: "graded_gems_co", listings: 31, reviews: 54, area: "Whyte Ave, Edmonton, AB", dist: "5.8 km", rating: "4.8", hours: "11 AM – 6 PM", open: false, desc: "Boutique graded-card shop on Whyte. Premium slabs and consignment.", lat: 53.5181, lng: -113.4951 },
];

export const MAP_EVENTS: MapEvent[] = [
  { id: "e1", kind: "event", title: "Edmonton Card Show 2026", m: "JUN", d: "14", loc: "Edmonton EXPO Centre", addr: "7515 118 Ave NW, Edmonton, AB T5B 0V3", host: "Edmonton Card Collectors", dateLong: "Saturday, June 14, 2026", going: 142, type: "Card Show", time: "8:00 AM – 5:00 PM", tags: ["Sports", "Vintage", "Graded"], about: "Western Canada's biggest sports-card show returns. 120+ tables, on-site PSA grading, live breaks and dealer trades all day.", color: C.green, lat: 53.5712, lng: -113.4527 },
  { id: "e2", kind: "event", title: "Trade Night Meetup", m: "JUN", d: "27", loc: "Sherwood Park Mall", addr: "2020 Sherwood Dr, Sherwood Park, AB", host: "Edmonton Card Collectors", dateLong: "Saturday, June 27, 2026", going: 24, type: "Meetup", time: "6:00 PM – 9:00 PM", tags: ["Sports", "Casual"], about: "Low-key weekly trade night for local collectors. Bring your binders and trade bait — all sports welcome.", color: C.green, lat: 53.5089, lng: -113.4220 },
];

const BY_ID: Record<string, MapItem> = {};
[...SELLERS, ...VENDORS, ...MAP_EVENTS].forEach((p) => { BY_ID[p.id] = p; });
export function getMapItem(id: string): MapItem | null {
  return BY_ID[id] ?? null;
}

export type MapFilter = "Sellers" | "Vendors" | "Events";
export const FILTER_ACCENT: Record<MapFilter, string> = { Sellers: C.coral, Vendors: C.purple, Events: C.green };
export const FILTER_ICON: Record<MapFilter, string> = { Sellers: "👤", Vendors: "🏪", Events: "📅" };
export const COUNTS: Record<MapFilter, { count: string; label: string }> = {
  Sellers: { count: "32", label: "sellers nearby" },
  Vendors: { count: "9", label: "vendors nearby" },
  Events: { count: "7", label: "events nearby" },
};
export function filterItems(f: MapFilter): MapItem[] {
  return f === "Vendors" ? VENDORS : f === "Events" ? MAP_EVENTS : SELLERS;
}

export const RADII = ["10 km", "25 km", "50 km"];

// Preview content
export const SELLER_LISTINGS = [
  { name: "LeBron James", price: "$12.5k", color: C.coral },
  { name: "Luka Dončić", price: "$4.1k", color: C.blue },
  { name: "S. Curry", price: "$1.4k", color: C.green },
  { name: "Kobe", price: "$2.1k", color: C.amber },
  { name: "Mahomes", price: "$2.8k", color: C.coral },
  { name: "Ohtani", price: "$890", color: C.blue },
];
export const VENDOR_LISTINGS = [
  { name: "Jordan RC", price: "$8.2k", color: C.coral },
  { name: "Wemby", price: "$3.6k", color: C.blue },
  { name: "Wembanyama", price: "$5.1k", color: C.green },
  { name: "Jokic", price: "$1.9k", color: C.amber },
  { name: "Dončić", price: "$4.1k", color: C.coral },
  { name: "Edwards", price: "$760", color: C.blue },
];
export const SELLER_REVIEWS = [
  { initial: "A", color: C.purple, name: "Ava Rodriguez", rating: 5, text: "Smooth meetup downtown, card exactly as described. Would buy again!", time: "2d" },
  { initial: "D", color: C.green, name: "Diego Santos", rating: 5, text: "Fair price and quick to respond. Trusted local seller.", time: "1w" },
  { initial: "K", color: C.amber, name: "Kayla Brooks", rating: 4, text: "Good condition, meetup was a little late but all good.", time: "3w" },
];
export const VENDOR_REVIEWS = [
  { initial: "M", color: C.coral, name: "Marcus Chen", rating: 5, text: "Great shop, huge graded selection. Staff helped me submit to PSA on-site.", time: "3d" },
  { initial: "P", color: C.blue, name: "Priya Nair", rating: 5, text: "Fair prices and legit. My go-to for sealed wax in YEG.", time: "1w" },
  { initial: "D", color: C.green, name: "Diego Santos", rating: 4, text: "Solid inventory, can get busy on weekends but worth it.", time: "2w" },
];

export type SearchResult = { type: "recent" | "seller" | "vendor" | "event" | "place"; title: string; sub: string; dist: string; tag?: string; av?: string };
export const MAP_SEARCH_RESULTS: SearchResult[] = [
  { type: "recent", title: "Mill Woods Town Centre", sub: "66 Street NW, Edmonton, AB", dist: "5.4 km" },
  { type: "vendor", title: "Sportscards YEG", sub: "104 St & Jasper Ave, Edmonton", dist: "2.4 km", tag: "Vendor" },
  { type: "seller", title: "Kayla Brooks", sub: "Meets near Mill Woods", dist: "5.4 km", tag: "Seller", av: "K" },
  { type: "event", title: "Edmonton Card Show 2026", sub: "Edmonton EXPO Centre", dist: "6.6 km", tag: "Event" },
  { type: "place", title: "Mill Woods", sub: "Edmonton, AB", dist: "5.1 km" },
  { type: "place", title: "Mill Woods Recreation Centre", sub: "28 Avenue NW, Edmonton, AB", dist: "5.4 km" },
  { type: "place", title: "Mill Woods Transit Centre", sub: "Edmonton, AB", dist: "5.6 km" },
];
