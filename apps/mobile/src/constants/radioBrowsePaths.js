/** Search → Browse → Radio deep links (prototype). */

export const RADIO_BROWSE_PATH = {
  nearYou: "/search/browse/radio/near-you",
  international: "/search/browse/radio/international",
  format: (formatId) => `/search/browse/radio/format/${encodeURIComponent(formatId)}`,
};

/**
 * @param {string[]} segments path under international, e.g. `['north-america','canada']`
 */
export function radioInternationalPath(segments) {
  const base = "/search/browse/radio/international";
  if (!segments?.length) return base;
  return `${base}/${segments.map(encodeURIComponent).join("/")}`;
}

/** Full grid: all stations for international geo path (prototype). */
export function radioGeoMorePath(segments) {
  const base = "/search/more/radio-geo";
  if (!segments?.length) return base;
  return `${base}/${segments.map(encodeURIComponent).join("/")}`;
}

