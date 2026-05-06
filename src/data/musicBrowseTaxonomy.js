/**
 * Search & Browse — music taxonomy for **broad** lineup (~1000+).
 *
 * Internal names: **vibes** (top tiles), **tags** (children under a vibe).
 * See `docs/Stories/Search-story.md` Integration notes.
 */

import { MUSIC_GENRES } from "./musicChannels.js";

/** Broad-lineup top-level browse tiles (five vibes). */
export const BROAD_VIBES = [
  { id: "genre", label: "Genre" },
  { id: "activity", label: "Activity" },
  { id: "mood", label: "Mood" },
  { id: "era", label: "Era" },
  { id: "theme", label: "Theme" },
];

/** @param {string} id */
export function getBroadVibeById(id) {
  return BROAD_VIBES.find((v) => v.id === id) ?? null;
}

/** @typedef {{ slug: string, label: string, tagLabel: string }} BroadTagRow */

/**
 * Child **tags** under a vibe (for broad browse). Genre vibe reuses `MUSIC_GENRES`;
 * each row navigates to the same channel list as **limited** `category/:id`.
 * Other vibes use `tagLabel` for `getMusicChannelsWithTag` (vibe tags on channels).
 */
/** @type {Record<string, BroadTagRow[]>} */
const BROAD_TAGS_BY_VIBE = {
  activity: [
    { slug: "party", label: "Party", tagLabel: "Party" },
    { slug: "hits", label: "Hits", tagLabel: "Hits" },
    { slug: "road-trip", label: "Road trip", tagLabel: "Road trip" },
    { slug: "dance", label: "Dance", tagLabel: "Dance" },
    { slug: "turn-it-up", label: "Turn it up", tagLabel: "Turn it up" },
  ],
  mood: [
    { slug: "chill", label: "Chill", tagLabel: "Chill" },
    { slug: "focus", label: "Focus", tagLabel: "Focus" },
    { slug: "calm", label: "Calm", tagLabel: "Calm" },
    { slug: "ambient", label: "Ambient", tagLabel: "Ambient" },
  ],
  era: [
    { slug: "charts", label: "Charts", tagLabel: "Charts" },
    { slug: "hits", label: "Hits", tagLabel: "Hits" },
    { slug: "timeless", label: "Timeless", tagLabel: "Timeless" },
    { slug: "trending", label: "Trending", tagLabel: "Trending" },
  ],
  theme: [
    { slug: "kids", label: "Kids", tagLabel: "Kids" },
    { slug: "family", label: "Family", tagLabel: "Family" },
    { slug: "classical", label: "Classical", tagLabel: "Classical" },
    { slug: "acoustic", label: "Acoustic", tagLabel: "Acoustic" },
  ],
};

/**
 * Tags shown under a **broad** vibe (`genre` → genre list from `MUSIC_GENRES`).
 * @param {string} vibeId
 * @returns {{ kind: 'genre', id: string, label: string }[] | { kind: 'tag', slug: string, label: string, tagLabel: string }[]}
 */
export function getChildTagsForBroadVibe(vibeId) {
  if (vibeId === "genre") {
    return MUSIC_GENRES.map((g) => ({
      kind: "genre",
      id: g.id,
      label: g.label,
    }));
  }
  const rows = BROAD_TAGS_BY_VIBE[vibeId];
  if (!rows) return [];
  return rows.map((r) => ({
    kind: "tag",
    slug: r.slug,
    label: r.label,
    tagLabel: r.tagLabel,
  }));
}

/** Resolve broad vibe + tag slug → vibe tag label for search (prototype). */
export function getBroadTagLabelFromSlug(vibeId, tagSlug) {
  if (!tagSlug) return null;
  const rows = BROAD_TAGS_BY_VIBE[vibeId];
  if (!rows) return null;
  const row = rows.find((r) => r.slug === tagSlug);
  return row ? row.tagLabel : null;
}
