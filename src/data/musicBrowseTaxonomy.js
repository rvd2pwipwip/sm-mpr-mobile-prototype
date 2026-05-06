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
 * @typedef {{ primary: string, subcategories: string[] }} PrototypeTagGroup
 */

/**
 * Per–lineup-lane IA **genre** pillars (primary label + subcategories for browse data).
 * Mock channels may also carry **one** IA subgenre from that row so sub-browse filters still match.
 *
 * @param {string} categoryId prototype lineup key (`pop`, `mood`, `variety`, …)
 * @returns {PrototypeTagGroup[]}
 */
export function getPrototypeCategoryTagGroups(categoryId) {
  /** @type {PrototypeTagGroup[]} */
  const groups = [];

  const genreRows = tagsForVibeFromJson("genre");
  for (const tag of genreRows) {
    const cid = GENRE_IA_LABEL_TO_CATEGORY_ID[tag.label];
    if (cid !== categoryId) continue;
    groups.push({
      primary: tag.label,
      subcategories: [...(tag.subcategories ?? [])],
    });
  }

  if (categoryId === "mood") {
    const moodSubs = tagsForVibeFromJson("mood").map((t) => t.label);
    if (moodSubs.length > 0) {
      const moodPrimary =
        BROAD_VIBES.find((v) => v.id === "mood")?.label ?? "Mood";
      groups.push({
        primary: moodPrimary,
        subcategories: moodSubs,
      });
    }
  }

  return groups;
}

/**
 * Parents then IA sub-tags in sheet order (de-duplicated) for a vibe.
 * Used when building mixed mock tags (activity / mood / era / theme pools).
 *
 * @param {"activity"|"mood"|"era"|"theme"|"genre"} vibeId
 * @returns {string[]}
 */
export function flattenVibeTagLabels(vibeId) {
  const ordered = [];
  const seen = new Set();
  for (const tag of tagsForVibeFromJson(vibeId)) {
    if (!seen.has(tag.label)) {
      seen.add(tag.label);
      ordered.push(tag.label);
    }
    for (const s of tag.subcategories ?? []) {
      if (!seen.has(s)) {
        seen.add(s);
        ordered.push(s);
      }
    }
  }
  return ordered;
}

/**
 * Flat union (parent + subs) per lane — useful when you only need allowable strings.
 * @param {string} categoryId
 * @returns {string[]}
 */
export function getPrototypeCategoryTagPool(categoryId) {
  /** @type {Set<string>} */
  const labels = new Set();
  for (const g of getPrototypeCategoryTagGroups(categoryId)) {
    labels.add(g.primary);
    for (const s of g.subcategories) labels.add(s);
  }
  return Array.from(labels);
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
 * Synthetic first sub-tag so users can open all channels for the parent tag
 * without picking a specific IA subcategory. Filter uses `tagLabel` (parent row).
 * @param {string} parentLabel
 */
function allSubTagRow(parentLabel) {
  const label = `All ${parentLabel}`;
  return {
    slug: slugifyBroadLabel(label),
    label,
    tagLabel: parentLabel,
  };
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

  const fromIa = (row.subcategories ?? []).map((label) => ({
    slug: slugifyBroadLabel(label),
    label,
    tagLabel: label,
  }));

  const hasSubs = fromIa.length > 0;
  const subs = hasSubs ? [allSubTagRow(row.label), ...fromIa] : [];

  return {
    slug: tagSlug,
    label: row.label,
    tagLabel: row.label,
    hasSubs,
    subs,
  };
}
