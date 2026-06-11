/** Search -> Browse -> Radio deep links (mirrors mobile `radioBrowsePaths.js`). */

export const RADIO_BROWSE_PATH = {
  nearYou: "/search/browse/radio/near-you",
  international: "/search/browse/radio/international",
  format: (formatId) =>
    `/search/browse/radio/format/${encodeURIComponent(formatId)}`,
};

/**
 * @param {string[]} segments path under international, e.g. `['north-america','canada']`
 */
export function radioInternationalPath(segments) {
  const base = "/search/browse/radio/international";
  if (!segments?.length) return base;
  return `${base}/${segments.map(encodeURIComponent).join("/")}`;
}
