/**
 * Local sample data for the Social / Community section (groups, events, members,
 * invites, manage menus). Design/placeholder data — purple is the community accent.
 */

export type Group = {
  id: string;
  name: string;
  avatar: string; // emoji
  color: string;
  members: string;
  activity: string;
  live?: boolean;
  joined: boolean;
  privacy: "public" | "private";
  about: string;
};

export type EventItem = {
  id: string;
  title: string;
  month: string;
  day: string;
  loc: string;
  going: number;
  interested: number;
  type: string;
  color: string;
  isInterested: boolean;
  week: boolean;
  address: string;
  about: string;
  hostId: string;
};

export type Person = { name: string; handle: string; color: string };

const C = { coral: "#E76F51", purple: "#7C3AED", green: "#10B981", amber: "#f59e0b", blue: "#2563eb" };

export const YOUR_GROUPS: Group[] = [
  { id: "g1", name: "Edmonton Card Collectors", avatar: "🃏", color: C.purple, members: "2,431", activity: "12 new posts today", joined: true, privacy: "public", about: "The home base for Edmonton-area collectors. Share pickups, organize meetups, and talk local shows." },
  { id: "g2", name: "PSA 10 Hunters", avatar: "💎", color: C.coral, members: "8,120", activity: "5 new listings", joined: true, privacy: "public", about: "The internet's home for PSA 10 chasers. Share your gem-mint pulls, submission results, and pop-report finds. Graded comps only." },
  { id: "g3", name: "Vintage Hoops Vault", avatar: "🏀", color: C.amber, members: "5,389", activity: "Active now", live: true, joined: true, privacy: "private", about: "Welcome to the Vault! Read the pinned rules before posting. No raw-card price shilling — graded comps only." },
];

export const NEARBY_GROUPS: Group[] = [
  { id: "g4", name: "YEG Sports Cards", avatar: "📍", color: C.green, members: "891", activity: "Edmonton, AB · 4 mutuals", joined: false, privacy: "public", about: "Local sports-card community for the greater Edmonton area." },
  { id: "g5", name: "Alberta Breakers Club", avatar: "📦", color: C.blue, members: "1,204", activity: "12 km away", joined: false, privacy: "public", about: "Group breaks, box busts, and live rips across Alberta." },
];

export const DISCOVER_GROUPS: Group[] = [
  { id: "g6", name: "LeBron James Collectors", avatar: "👑", color: C.coral, members: "14.2k", activity: "You own 3 LeBron cards", joined: false, privacy: "public", about: "Everything LeBron — rookies, autos, and grails." },
  { id: "g7", name: "Rookie Card Investors", avatar: "📈", color: C.purple, members: "22.6k", activity: "Based on your collection", joined: false, privacy: "public", about: "Serious rookie-card investing — comps, trends, and grade talk." },
];

export const ALL_GROUPS = [...YOUR_GROUPS, ...NEARBY_GROUPS, ...DISCOVER_GROUPS];
export function getGroup(id: string): Group {
  return ALL_GROUPS.find((g) => g.id === id) ?? YOUR_GROUPS[0];
}

export const EVENTS: EventItem[] = [
  { id: "e1", title: "Edmonton Card Show 2026", month: "JUN", day: "14", loc: "Edmonton EXPO Centre", going: 142, interested: 38, type: "Card Show", color: C.purple, isInterested: true, week: true, address: "7515 118 Ave NW, Edmonton, AB T5B 0V3", about: "The biggest sports card show in Alberta returns. 120+ vendor tables, live group breaks, PSA on-site grading submission, and trade corners. Admission $10 at the door — kids under 12 free.", hostId: "g1" },
  { id: "e2", title: "Friday Night Group Break", month: "JUN", day: "20", loc: "The Card Vault · Online", going: 38, interested: 12, type: "Break", color: C.coral, isInterested: false, week: false, address: "Online · streamed live", about: "Weekly PSA-10-only group break. Random teams, live rips, instant shipping.", hostId: "g3" },
  { id: "e3", title: "Trade Night Meetup", month: "JUN", day: "27", loc: "Sherwood Park Mall", going: 24, interested: 9, type: "Meetup", color: C.green, isInterested: false, week: false, address: "2020 Sherwood Dr, Sherwood Park, AB", about: "Bring your trade binders! Tables provided. Buy, sell, and trade sports cards with local collectors — all grades welcome.", hostId: "g1" },
];
export function getEvent(id: string): EventItem {
  return EVENTS.find((e) => e.id === id) ?? EVENTS[0];
}

export const SUGGESTED_EVENTS = [
  { month: "JUN", day: "27", title: "YEG Nerd Sale 2026", color: C.blue, sub: "Buy · Sell · Trade" },
  { month: "JUL", day: "12", title: "Divine Pop-up Market", color: C.coral, sub: "90+ curated vendors" },
];

export const EVENT_GENRES = ["Sports", "Vintage", "All grades"];
export const GOING_AVATARS = [C.coral, C.purple, C.green, C.amber];

// Mutual-follow friends you can invite to an event.
export const MUTUAL_FRIENDS: Person[] = [
  { name: "Marcus Chen", handle: "mchen_cards", color: C.coral },
  { name: "Ava Rodriguez", handle: "avapulls", color: C.purple },
  { name: "Diego Santos", handle: "dsantos_rc", color: C.green },
];

// Followers shown in the invite-members picker.
export const INVITE_PEOPLE: (Person & { selected: boolean })[] = [
  { name: "Marcus Chen", handle: "mchen_cards", color: C.coral, selected: true },
  { name: "Ava Rodriguez", handle: "avapulls", color: C.purple, selected: true },
  { name: "Jordan Blake", handle: "jblake_psa", color: C.green, selected: false },
  { name: "Sam Whitfield", handle: "whitfield_vtg", color: C.blue, selected: false },
  { name: "Priya Nair", handle: "priya_breaks", color: C.amber, selected: false },
  { name: "Diego Santos", handle: "dsantos_rc", color: C.coral, selected: false },
];

export type GroupMember = { name: string; handle: string; color: string; role: string | null; friend: boolean };
export const GROUP_MEMBERS: GroupMember[] = [
  { name: "Vault Admin", handle: "vaultadmin", color: C.purple, role: "Admin", friend: false },
  { name: "Marcus Chen", handle: "mchen_cards", color: C.blue, role: "Moderator", friend: true },
  { name: "Ava Rodriguez", handle: "avapulls", color: C.coral, role: null, friend: true },
  { name: "Diego Santos", handle: "dsantos_rc", color: C.green, role: null, friend: true },
  { name: "Kayla Brooks", handle: "kaylapulls", color: C.amber, role: null, friend: false },
  { name: "Tom Becker", handle: "beckcards", color: C.purple, role: null, friend: false },
];

export type GroupPost = {
  initial: string;
  color: string;
  name: string;
  time: string;
  text: string;
  cardColor?: string;
  pinned?: boolean;
  likes: number;
  comments: number;
};
export const GROUP_POSTS: GroupPost[] = [
  { initial: "V", color: C.amber, name: "Vault Admin", time: "Pinned · 2d", text: "Welcome to the Vault! 🏀 Read the pinned rules before posting. No raw-card price shilling — graded comps only.", pinned: true, likes: 86, comments: 14 },
  { initial: "M", color: C.blue, name: "Marcus Chen", time: "3h", text: "Grail acquired. Took me two years to land a 10 of this one.", cardColor: C.coral, likes: 142, comments: 38 },
];

export const GROUP_MEDIA = [C.coral, C.purple, C.green, C.amber, C.blue, C.coral, C.purple, C.green, C.amber, C.blue, C.coral, C.purple];

export const GROUP_EVENTS = [
  { month: "JUN", day: "14", title: "Vault Meetup · Trade Night", loc: "Sherwood Park Mall", going: 24, color: C.purple },
  { month: "JUN", day: "27", title: "Group Break — PSA 10s only", loc: "The Card Vault · Online", going: 38, color: C.coral },
];

export const GROUP_SEARCH_RESULTS = [
  { initial: "M", name: "Marcus Chen", verb: "posted", text: "“Grail acquired — PSA 10 of this one”", color: C.blue },
  { initial: "A", name: "Ava Rodriguez", verb: "posted", text: "“Bulk submission results: 3 tens!”", color: C.coral },
  { initial: "V", name: "Vault Admin", verb: "pinned", text: "“Welcome to the Vault — read the rules”", color: C.purple },
];

// Manage menu rows.
export const MANAGE_ROWS: { key: string; icon: string; accent: string; title: string; sub: string; route: string }[] = [
  { key: "invites", icon: "mail-outline", accent: C.blue, title: "Invites", sub: "Send, accept and manage invites", route: "/(tabs)/social/invites" },
  { key: "notifs", icon: "notifications-outline", accent: C.amber, title: "Notifications", sub: "Edit preferences for what you receive", route: "/(tabs)/social/notif-prefs" },
  { key: "pins", icon: "bookmark-outline", accent: C.coral, title: "Pins", sub: "Pin favorite groups for quick access", route: "/(tabs)/social/pins" },
  { key: "following", icon: "star-outline", accent: C.purple, title: "Following", sub: "Collectors and vendors you follow", route: "/(tabs)/social/following" },
  { key: "membership", icon: "exit-outline", accent: C.coral, title: "Membership", sub: "Leave groups that no longer interest you", route: "/(tabs)/social/membership" },
];

export const INVITES_RECEIVED = [
  { group: "Vintage Hoops Vault", avatar: "🏀", accent: C.amber, who: "Marcus Chen", members: "891 members" },
  { group: "Rookie Card Investors", avatar: "📈", accent: C.purple, who: "Ava Rodriguez", members: "22.6k members" },
];

export const NOTIF_GROUPS = [
  { avatar: "🃏", color: C.purple, name: "Edmonton Card Collectors", mode: "All posts" },
  { avatar: "💎", color: C.coral, name: "PSA 10 Hunters", mode: "Highlights" },
  { avatar: "🏀", color: C.amber, name: "Vintage Hoops Vault", mode: "Off" },
];

export const MEMBERSHIP = [
  { avatar: "🃏", color: C.purple, name: "Edmonton Card Collectors", role: "Admin", members: "2,431 members" },
  { avatar: "💎", color: C.coral, name: "PSA 10 Hunters", role: "Member", members: "8,120 members" },
  { avatar: "🏀", color: C.amber, name: "Vintage Hoops Vault", role: "Member", members: "5,389 members" },
];

export const FOLLOWING_LIST: (Person & { vendor?: boolean; mutual?: boolean })[] = [
  { name: "Marcus Chen", handle: "mchen_cards", color: C.coral, mutual: true },
  { name: "Pacific Cards", handle: "pacific_cards", color: C.purple, vendor: true },
  { name: "Ava Rodriguez", handle: "avapulls", color: C.green, mutual: true },
  { name: "Graded Gems Co.", handle: "graded_gems_co", color: C.amber, vendor: true },
  { name: "Diego Santos", handle: "dsantos_rc", color: C.blue, mutual: true },
];

export const GROUP_GENRES = ["Any/All", "Sports", "Pokémon", "Magic", "Yu-Gi-Oh!", "One Piece", "Vintage"];
export const EVENT_TYPES = ["Meetup", "Card Show", "Break", "Trade Night", "Pop-up"];
