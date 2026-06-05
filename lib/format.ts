/** Cents → "$24.00". Money is stored as integer cents, never floats. */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** "24" or "$24.50" → 2450 cents, or null if not a positive amount. */
export function dollarsToCents(input: string): number | null {
  const n = Number(input.replace(/[^0-9.]/g, ""));
  if (!isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

/** Format a Date for display: "Sat, Jun 14 · 2:00 PM" */
export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) + " · " + d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
}

/** Compact relative time, e.g. "just now", "5m", "3h", "2d". */
export function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
