import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    return format(parseISO(isoString), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    return format(parseISO(isoString), "MMM d, yyyy h:mm a");
  } catch {
    return "—";
  }
}

export function relativeTime(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function formatPercent(rate: number | null | undefined): string {
  if (rate == null) return "—";
  return `${(rate * 100).toFixed(0)}%`;
}

export function formatNumber(num: number | null | undefined): string {
  if (num == null) return "0";
  return num.toLocaleString();
}
