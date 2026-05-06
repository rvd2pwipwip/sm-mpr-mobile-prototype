/**
 * Search & Browse — music taxonomy for **broad** lineup (~1000+).
 *
 * Internal names: **vibes** (top tiles), **tags** (children under a vibe).
 * IA source: **`musicVibesIa.broad1000.json`** (exported from shared Google Sheets).
 * See `docs/Stories/Search-story.md` Integration notes.
 */

import broadIa from "./musicVibesIa.broad1000.json";

/** Broad-lineup top-level browse tiles (five vibes). */
export const BROAD_VIBES = [
  { id: "genre", label: "Genre" },
  { id: "activity", label: "Activity" },
  { id: "mood", label: "Mood" },
  { id: "era", label: "Era" },
  { id: "theme", label: "Theme" },
];

/** Normalize IA genre labels onto prototype `MUSIC_GENRES.id` where the lineup has a lane. */
const GENRE_IA_LABEL_TO_CATEGORY_ID = {
  Classical: "classical",
  "Country and Roots": "country-roots",
  Electronic: "dance-electronic",
  "Hip-Hop": "hip-hop",
  Indie: "variety",
  "Jazz & Blues": "jazz-blues",
  "Kids and Teens": "kids",
  Latin: "latin",
  Miscellaneous: "variety",
  Pop: "pop",
  "Praise and Worship": "variety",
  "R&B/Soul": "rb-soul",
  Rock: "rock",
  "Singer-Songwriter": "variety",
  World: "around-the-world",
};

/**
 * Stable URL slug from a display tag / sub-tag label (must match extractor + routes).
 * @param {string} text
 */
export function slugifyBroadLabel(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** @param {string} id */
export function getBroadVibeById(id) {
  return BROAD_VIBES.find((v) => v.id === id) ?? null;
}

/** @typedef {{ label: string, subcategories?: string[] }} JsonTagRow */

/** @returns {JsonTagRow[]} */
function tagsForVibeFromJson(vibeId) {
  const block = broadIa.taxonomy.find((t) => t.vibeId === vibeId);
  return block?.tags ?? [];
}

/**
 * Genre IA row → `{ categoryId, subs }`; `categoryId` may be absent (navigate via tag lane).
 * @param {JsonTagRow} tag
 */
function genreRowFromJson(tag) {
  const slug = slugifyBroadLabel(tag.label);
  const categoryId = GENRE_IA_LABEL_TO_CATEGORY_ID[tag.label] ?? null;
  const hasSubs =
    Array.isArray(tag.subcategories) && tag.subcategories.length > 0;
  return {
    slug,
    label: tag.label,
    categoryId,
    hasSubs,
  };
}

/**
 * Tags shown under a **broad** vibe.
 * Genre uses IA + category mapping when subs are absent; leaf tags navigate by slug.
 *
 * @param {string} vibeId
 * @returns {(
 *   | { kind: 'genre', slug: string, label: string, id: string | null, hasSubs: boolean }
 *   | { kind: 'tag', slug: string, label: string, tagLabel: string, hasSubs: boolean }
 * )[]}
 */
export function getChildTagsForBroadVibe(vibeId) {
  const rows = tagsForVibeFromJson(vibeId);
  if (rows.length === 0) return [];

  if (vibeId === "genre") {
    return rows.map((tag) => {
      const meta = genreRowFromJson(tag);
      return {
        kind: "genre",
        slug: meta.slug,
        label: meta.label,
        id: meta.categoryId,
        hasSubs: meta.hasSubs,
      };
    });
  }

  return rows.map((tag) => {
    const slug = slugifyBroadLabel(tag.label);
    const hasSubs =
      Array.isArray(tag.subcategories) && tag.subcategories.length > 0;
    return {
      kind: "tag",
      slug,
      label: tag.label,
      tagLabel: tag.label,
      hasSubs,
    };
  });
}

/**
 * Channel filter label for `/vibe/.../tag/:tagSlug(/sub/:subSlug)`.
 * @param {string} vibeId
 * @param {string} tagSlug
 * @param {string | undefined} subSlug
 * @returns {string | null}
 */
export function getBroadTagLabelFromSlug(vibeId, tagSlug, subSlug) {
  if (!tagSlug) return null;
  const meta = getBroadSubsMeta(vibeId, tagSlug);
  if (!meta) return null;
  if (!subSlug) {
    if (meta.hasSubs) return null;
    return meta.tagLabel;
  }
  const sub = meta.subs.find((s) => s.slug === subSlug);
  return sub ? sub.tagLabel : null;
}

/**
 * Lookup tag row + structured sub-tags for picker / routing.
 * @param {string} vibeId
 * @param {string} tagSlug
 */
export function getBroadSubsMeta(vibeId, tagSlug) {
  if (!vibeId || !tagSlug) return null;
  const rows = tagsForVibeFromJson(vibeId);
  const row = rows.find((t) => slugifyBroadLabel(t.label) === tagSlug);
  if (!row) return null;

  const subs = (row.subcategories ?? []).map((label) => ({
    slug: slugifyBroadLabel(label),
    label,
    tagLabel: label,
  }));

  const hasSubs = subs.length > 0;

  return {
    slug: tagSlug,
    label: row.label,
    tagLabel: row.label,
    hasSubs,
    subs,
  };
}
