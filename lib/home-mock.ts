/**
 * Local sample data for the Home feed and its sub-screens (feed, composer,
 * notifications, likes, comments, share). This is design/placeholder data so
 * the screens render fully populated — swap for live `use-feed` queries later.
 */

// Avatar / accent palette used across the social surfaces.
export const FEED_COLORS = {
  coral: "#E76F51",
  purple: "#7C3AED",
  green: "#10B981",
  amber: "#f59e0b",
  blue: "#2563eb",
  teal: "#0ea5b7",
} as const;

export type Person = {
  name: string;
  handle: string;
  color: string;
  /** follow state for list rows */
  state?: "follow" | "following" | "you";
};

type Author = { name: string; handle: string; color: string };

export type FeedPost =
  | {
      id: string;
      kind: "listed";
      author: Author;
      time: string;
      text: string;
      card: { title: string; sub: string; price: string; dist: string; color: string };
      likes: number;
      comments: number;
      liked?: boolean;
    }
  | {
      id: string;
      kind: "user";
      author: Author;
      time: string;
      text: string;
      photos: string[]; // gradient accent colors
      likes: number;
      comments: number;
      liked?: boolean;
    }
  | {
      id: string;
      kind: "showcase";
      author: Author;
      time: string;
      text: string;
      card: { title: string; sub: string; color: string };
      likes: number;
      comments: number;
      liked?: boolean;
    }
  | {
      id: string;
      kind: "sold";
      seller: Author;
      buyer: Author;
      card: { title: string; sub: string; color: string };
      price: string;
      likes: number;
      comments: number;
    }
  | {
      id: string;
      kind: "event";
      author: Author;
      time: string;
      text: string;
      event: { month: string; day: string; title: string; venue: string; going: number; interested: number };
      likes: number;
      comments: number;
    }
  | {
      id: string;
      kind: "group";
      groupName: string;
      members: string;
      colors: string[];
    };

const C = FEED_COLORS;

export const FEED: FeedPost[] = [
  {
    id: "p1",
    kind: "listed",
    author: { name: "Marcus Chen", handle: "mchen_cards", color: C.blue },
    time: "12m",
    text: "Just listed this beauty on the marketplace 👀 Comps are climbing — won't last long.",
    card: { title: "LeBron James — '03-04 RC", sub: "Topps Chrome · PSA 10", price: "$12,500", dist: "2.4 km away", color: C.coral },
    likes: 34,
    comments: 8,
    liked: true,
  },
  {
    id: "p2",
    kind: "user",
    author: { name: "Ava Rodriguez", handle: "avapulls", color: C.purple },
    time: "38m",
    text: "Mail day! 📬 Finally pulled the trigger on this Mahomes after months of watching. The corners are insane in person. What do we think — hold or flip?",
    photos: [C.green, C.amber],
    likes: 127,
    comments: 23,
    liked: true,
  },
  {
    id: "p3",
    kind: "showcase",
    author: { name: "Jordan Blake", handle: "jblake_psa", color: C.amber },
    time: "1h",
    text: "Added a new grail to my showcase ⭐ The '86 Fleer Jordan rookie. Not for sale — just had to share.",
    card: { title: "Michael Jordan — '86 Fleer RC", sub: "PSA 9 · Crown jewel of the collection", color: C.purple },
    likes: 418,
    comments: 56,
  },
  {
    id: "p4",
    kind: "sold",
    seller: { name: "Pacific Cards", handle: "pacific_cards", color: C.coral },
    buyer: { name: "Sam Collects", handle: "sam_collects", color: C.blue },
    card: { title: "Shohei Ohtani — 2018 RC", sub: "Topps Update · PSA 10", color: C.blue },
    price: "$890",
    likes: 51,
    comments: 4,
  },
  {
    id: "p5",
    kind: "event",
    author: { name: "Edmonton Card Collectors", handle: "yeg_collectors", color: C.purple },
    time: "2h",
    text: "We're hosting again! 🎟 Tables are filling fast — grab yours before they're gone.",
    event: { month: "JUN", day: "14", title: "Edmonton Card Show 2026", venue: "Edmonton EXPO Centre", going: 142, interested: 38 },
    likes: 89,
    comments: 12,
  },
  {
    id: "p6",
    kind: "group",
    groupName: "PSA 10 Hunters",
    members: "8,120 members",
    colors: [C.coral, C.purple, C.green],
  },
];

export const COMPOSER_ACTIONS = [
  { key: "showcase", icon: "🃏", label: "Showcase", route: "/compose/showcase" },
  { key: "photo", icon: "🖼", label: "Photo", route: "/compose/photo" },
  { key: "gif", icon: "◍", label: "GIF", route: "/compose/gif" },
  { key: "poll", icon: "📊", label: "Poll", route: "/compose/poll" },
] as const;

export const LIKERS: Person[] = [
  { name: "Ava Rodriguez", handle: "avapulls", color: C.purple, state: "follow" },
  { name: "Diego Santos", handle: "dsantos_rc", color: C.green, state: "following" },
  { name: "Kayla Brooks", handle: "kaylapulls", color: C.coral, state: "follow" },
  { name: "Sam Collects", handle: "sam_collects", color: C.blue, state: "following" },
  { name: "Pacific Cards", handle: "pacific_cards", color: C.amber, state: "follow" },
  { name: "Jordan Blake", handle: "jblake_psa", color: C.coral, state: "follow" },
  { name: "Tyler Nguyen", handle: "typulls", color: C.purple, state: "following" },
  { name: "Riley Watson", handle: "rwatson", color: C.teal, state: "follow" },
];

export type CommentItem = {
  name: string;
  handle: string;
  color: string;
  time: string;
  text: string;
  likes?: number;
  replies?: number;
  indent?: boolean;
};

export const COMMENTS_RECAP = {
  name: "Ava Rodriguez",
  handle: "avapulls",
  color: C.purple,
  time: "38m",
  text: "Mail day! 📬 Finally pulled the trigger on this Mahomes. What do we think — hold or flip?",
};

export const COMMENTS: CommentItem[] = [
  { name: "Diego Santos", handle: "dsantos_rc", color: C.green, time: "24m", text: "Absolute heater 🔥 hold it, comps are only going up.", likes: 12, replies: 3 },
  { name: "Tyler Nguyen", handle: "typulls", color: C.purple, time: "19m", text: "Flip it while it's hot imo. Demand peaks playoffs.", likes: 4 },
  { name: "Kayla Brooks", handle: "kaylapulls", color: C.coral, time: "12m", text: "Centering looks clean! Did you check the back?", indent: true },
  { name: "Pacific Cards", handle: "pacific_cards", color: C.amber, time: "6m", text: "DM me if you ever wanna move it 👀", likes: 2 },
];

export type NotifKind = "like" | "comment" | "follow" | "offer" | "event" | "sale";

export type Notif = {
  id: string;
  initial: string;
  color: string;
  kind: NotifKind;
  text: string;
  time: string;
  thumb?: string;
  unread?: boolean;
};

export const NOTIFICATIONS: { today: Notif[]; week: Notif[] } = {
  today: [
    { id: "n1", initial: "A", color: C.purple, kind: "like", text: "Ava Rodriguez and 32 others liked your post", time: "12m", thumb: C.green, unread: true },
    { id: "n2", initial: "D", color: C.green, kind: "comment", text: "Diego Santos commented: “Absolute heater 🔥”", time: "24m", thumb: C.green, unread: true },
    { id: "n3", initial: "K", color: C.coral, kind: "follow", text: "Kayla Brooks started following you", time: "1h" },
  ],
  week: [
    { id: "n4", initial: "P", color: C.amber, kind: "offer", text: "@pacific_cards made an offer on your Ohtani — $820", time: "2d", thumb: C.blue },
    { id: "n5", initial: "E", color: C.purple, kind: "event", text: "Edmonton Card Show is in 3 days — you're going", time: "3d" },
    { id: "n6", initial: "S", color: C.blue, kind: "sale", text: "Your sale to @sam_collects is complete", time: "4d", thumb: C.coral },
  ],
};

export const SHARE_TARGETS: Person[] = [
  { name: "Ava", handle: "avapulls", color: C.purple },
  { name: "Diego", handle: "dsantos_rc", color: C.green },
  { name: "Kayla", handle: "kaylapulls", color: C.coral },
  { name: "Sam", handle: "sam_collects", color: C.blue },
  { name: "Tyler", handle: "typulls", color: C.amber },
];

export const SHARE_ACTIONS: { icon: string; label: string }[] = [
  { icon: "link-outline", label: "Copy link" },
  { icon: "add-circle-outline", label: "Add to Story" },
  { icon: "repeat-outline", label: "Repost" },
  { icon: "mail-outline", label: "Message" },
  { icon: "logo-instagram", label: "Instagram" },
  { icon: "logo-twitter", label: "X / Twitter" },
  { icon: "logo-whatsapp", label: "WhatsApp" },
  { icon: "ellipsis-horizontal", label: "More" },
];

// Gradient accents for the showcase picker, photo gallery strip, and GIF grid.
export const GRID_COLORS = [C.coral, C.purple, C.blue, C.green, C.amber, C.teal];

export const GIF_TAGS = ["Trending", "Nice", "Wow", "Money", "Hype", "LOL"];
export const POLL_LENGTHS = ["1 day", "3 days", "1 week"];
