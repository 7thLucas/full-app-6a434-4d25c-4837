/** Format minutes as "2h 05m". */
export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

/** Format an IDR amount with the given currency label, e.g. "Rp 1.250.000". */
export function formatPrice(amount: number, currencyLabel = "Rp"): string {
  return `${currencyLabel} ${Math.round(amount).toLocaleString("id-ID")}`;
}
