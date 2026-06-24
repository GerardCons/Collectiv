/**
 * Local sample data for the Chat / Messages section + the peer-to-peer
 * Buy/Trade transaction flow. Design/placeholder data.
 */

const C = { coral: "#E76F51", purple: "#7C3AED", green: "#10B981", amber: "#f59e0b", blue: "#2563eb" };

export type Thread = {
  id: string;
  initial: string;
  color: string;
  name: string;
  handle?: string;
  vendor?: boolean;
  online: boolean;
  msg: string;
  time: string;
  unread: number;
  kind: "deal" | "dm" | "group";
  listing?: { title: string; price: string; color: string };
  you?: boolean;
};

export const THREADS: Thread[] = [
  { id: "t1", initial: "M", color: C.coral, name: "Marcus Chen", handle: "mchen_cards", online: true, msg: "Would you take $11k for the LeBron?", time: "8m", unread: 2, kind: "deal", listing: { title: "LeBron James · '03 Chrome RC", price: "$12,500", color: C.coral } },
  { id: "t2", initial: "P", color: C.blue, name: "pacific_cards", online: true, msg: "Shipped! Tracking sent 📦", time: "2h", unread: 1, kind: "dm" },
  { id: "t3", initial: "🏪", color: C.purple, name: "Sportscards YEG", vendor: true, online: false, msg: "We just restocked Prizm singles —", time: "5h", unread: 0, kind: "dm" },
  { id: "t4", initial: "A", color: C.purple, name: "Ava Rodriguez", handle: "avapulls", online: false, msg: "Still available? I can meet downtown", time: "1d", unread: 0, kind: "dm", listing: { title: "Shohei Ohtani · 2018 Update RC", price: "$340", color: C.blue } },
  { id: "t5", initial: "J", color: C.amber, name: "Jordan Blake", handle: "jblake_psa", online: false, msg: "Trade for your Curry rookie?", time: "2d", unread: 0, kind: "dm" },
  { id: "t6", initial: "D", color: C.green, name: "Diego Santos", handle: "dsantos_rc", online: false, msg: "You: I can do the meetup at noon", time: "4d", unread: 0, kind: "dm", you: true },
  { id: "tg", initial: "G", color: C.purple, name: "PSA 10 Hunters", online: true, msg: "Marcus: best graded singles at that show", time: "1h", unread: 0, kind: "group" },
];

export function getThread(id: string): Thread {
  return THREADS.find((t) => t.id === id) ?? THREADS[0];
}

export const CONTACTS: Thread[] = THREADS.filter((t) => t.kind !== "group");

// The card under discussion in the deal thread.
export const DISCUSSED = { title: "LeBron James — '03 Chrome RC", price: "$12,500", grade: "PSA 10", color: C.coral };

export type DealCard = { id: string; name: string; grade: string; value: string; color: string; on: boolean };

// Seller's cards the buyer can buy/bundle.
export const SELLER_CARDS: DealCard[] = [
  { id: "lebron", name: "LeBron James '03 Chrome RC", grade: "PSA 10", value: "$11,500", color: C.coral, on: true },
  { id: "kobe", name: "Kobe Bryant '96 Chrome RC", grade: "PSA 8", value: "$2,100", color: C.amber, on: false },
  { id: "curry-s", name: "Stephen Curry '09 Chrome RC", grade: "PSA 9", value: "$1,450", color: C.coral, on: false },
  { id: "luka", name: "Luka Dončić '18 Prizm RC", grade: "PSA 10", value: "$4,100", color: C.blue, on: false },
];

// Buyer's own cards offered in a trade.
export const TRADE_CARDS: DealCard[] = [
  { id: "curry", name: "Stephen Curry '09 Chrome RC", grade: "PSA 9", value: "$1,450", color: C.coral, on: true },
  { id: "morant", name: "Ja Morant '19 Prizm RC", grade: "PSA 10", value: "$620", color: C.blue, on: true },
  { id: "zion", name: "Zion Williamson '19 Prizm", grade: "PSA 9", value: "$540", color: C.green, on: false },
];

export type Msg = { id: string; me: boolean; text: string; time: string; sender?: string; senderColor?: string };

export const DEAL_SEED: Msg[] = [
  { id: "m1", me: true, text: "Saw your LeBron rookie — centering is clean 👀", time: "9:58 AM" },
  { id: "m2", me: false, text: "Thanks! Strong 10, corners are razor sharp.", time: "10:02 AM" },
  { id: "m3", me: true, text: "Would you do $11.5k? Can meet downtown this week.", time: "10:04 AM" },
  { id: "m4", me: false, text: "Done at $11.5k — tap the ✓ when you're ready.", time: "10:05 AM" },
  { id: "m5", me: true, text: "Deal! Confirming now 👍", time: "10:07 AM" },
];

export const DM_SEED: Msg[] = [
  { id: "d1", me: false, text: "Did you end up getting that Curry graded? 👀", time: "4:22 PM" },
  { id: "d2", me: true, text: "Yeah just got it back — PSA 9! Not quite a 10 but still clean.", time: "4:30 PM" },
  { id: "d3", me: false, text: "Still great! Hold or sell?", time: "4:31 PM" },
  { id: "d4", me: true, text: "Holding for now. Waiting to see where comps go this quarter.", time: "4:45 PM" },
];

export const GROUP_SEED: Msg[] = [
  { id: "g1", me: false, text: "Anyone heading to the EXPO show this Sunday? 🃏", time: "9:12 AM", sender: "Marcus", senderColor: C.coral },
  { id: "g2", me: false, text: "I'm in! Looking for BGS 9.5s mainly", time: "9:18 AM", sender: "Ava", senderColor: C.purple },
  { id: "g3", me: false, text: "Same. Also chasing a Mahomes RPA if anyone spots one", time: "9:20 AM", sender: "Diego", senderColor: C.green },
  { id: "g4", me: true, text: "I'll be there at 10 AM — meet at the Sportscards YEG table first 👍", time: "9:22 AM" },
  { id: "g5", me: false, text: "Perfect, they always have the best graded singles at that show", time: "9:24 AM", sender: "Marcus", senderColor: C.coral },
];

export const CHAT_MORE_ACTIONS = [
  { icon: "person-outline", label: "View Profile", sub: "@mchen_cards · Verified" },
  { icon: "swap-horizontal-outline", label: "Create an Offer", sub: "Propose a deal — starts the confirm flow", accent: true },
  { icon: "notifications-off-outline", label: "Mute Notifications", sub: "Stop alerts for this chat" },
  { icon: "flag-outline", label: "Report", sub: "Flag inappropriate behaviour" },
  { icon: "ban-outline", label: "Block", sub: "They won't be able to message you", danger: true },
  { icon: "trash-outline", label: "Delete Conversation", sub: "Removes chat for you only", danger: true },
] as const;
