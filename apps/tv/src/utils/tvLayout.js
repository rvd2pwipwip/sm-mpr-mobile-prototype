/** Read fixed card width from CSS tokens (default 308). */
export function getTvCardSize() {
  if (typeof window === "undefined") return 308;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--tv-card-size",
  );
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 308 : parsed;
}

/** Read card row gap from CSS tokens (default 30). */
export function getTvCardGap() {
  if (typeof window === "undefined") return 30;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--tv-space-card-gap",
  );
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 30 : parsed;
}
