import { MUSIC_ARTISTS } from "../data/musicArtists.js";
import { RADIO_GEO_MOCK_STATIONS } from "../data/radioInternationalBrowse.js";
import { MUSIC_CHANNELS, MUSIC_GENRES } from "../data/musicChannels.js";
import { PODCASTS } from "../data/podcasts.js";
import { RADIO_STATIONS } from "../data/radioStations.js";

function genreLabel(categoryId) {
  return MUSIC_GENRES.find((g) => g.id === categoryId)?.label ?? "";
}

/** @type {import("../data/radioStations.js").RadioStation[]} */
const ALL_RADIO_STATIONS = [...RADIO_STATIONS, ...RADIO_GEO_MOCK_STATIONS];

/**
 * @param {string} q raw query
 * @returns {string} trimmed lowercase needle (empty if no searchable text)
 */
export function normalizeSearchNeedle(q) {
  return String(q ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Channels where **title**, **description**, or **genre label** matches (substring, case-insensitive).
 * Vibe tags alone match in {@link searchMusicChannelsByTagSubstring}.
 *
 * @param {string} needle normalized (lowercase)
 */
export function searchMusicChannels(needle) {
  if (!needle) return [];
  return MUSIC_CHANNELS.filter((c) => {
    const g = genreLabel(c.categoryId).toLowerCase();
    const name = c.name.toLowerCase();
    const desc = (c.description ?? "").toLowerCase();
    return name.includes(needle) || desc.includes(needle) || g.includes(needle);
  });
}

/**
 * Channels where any **vibe tag** label contains `needle` (substring, case-insensitive).
 *
 * @param {string} needle normalized (lowercase)
 */
export function searchMusicChannelsByTagSubstring(needle) {
  if (!needle) return [];
  return MUSIC_CHANNELS.filter((c) =>
    (c.tags ?? []).some((t) => String(t).toLowerCase().includes(needle)),
  );
}

/**
 * Pick a canonical tag label for **Search → Tags → More** (`/search/more/tags?q=`) so
 * `getMusicChannelsWithTag` returns the grid. Chooses the first label in stable sort order.
 *
 * @param {string} needle normalized (lowercase)
 */
export function primaryTagLabelForSearchMore(needle) {
  if (!needle) return "";
  const labels = new Set();
  for (const c of MUSIC_CHANNELS) {
    for (const t of c.tags ?? []) {
      const s = String(t).trim();
      if (s.toLowerCase().includes(needle)) labels.add(s);
    }
  }
  const sorted = Array.from(labels).sort((a, b) => a.localeCompare(b));
  return sorted[0] ?? "";
}

/**
 * @param {string} needle normalized (lowercase)
 */
export function searchMusicArtists(needle) {
  if (!needle) return [];
  return MUSIC_ARTISTS.filter((a) => a.name.toLowerCase().includes(needle));
}

/**
 * @param {string} needle normalized (lowercase)
 */
export function searchPodcasts(needle) {
  if (!needle) return [];
  return PODCASTS.filter((p) => {
    const t = p.title.toLowerCase();
    const d = (p.description ?? "").toLowerCase();
    return t.includes(needle) || d.includes(needle);
  });
}

/**
 * Episode hits: episode title **or** show title matches.
 *
 * @param {string} needle normalized (lowercase)
 * @returns {{ podcast: import("../data/podcasts.js").Podcast, episode: import("../data/podcasts.js").PodcastEpisode }[]}
 */
export function searchEpisodeRows(needle) {
  if (!needle) return [];
  /** @type {{ podcast: import("../data/podcasts.js").Podcast, episode: import("../data/podcasts.js").PodcastEpisode }[]} */
  const rows = [];
  for (const p of PODCASTS) {
    const pt = p.title.toLowerCase();
    const showMatch = pt.includes(needle);
    for (const e of p.episodes) {
      const et = e.title.toLowerCase();
      if (showMatch || et.includes(needle)) rows.push({ podcast: p, episode: e });
    }
  }
  return rows;
}

/**
 * @param {string} needle normalized (lowercase)
 */
export function searchRadioStations(needle) {
  if (!needle) return [];
  return ALL_RADIO_STATIONS.filter((s) => {
    const name = s.name.toLowerCase();
    const desc = (s.description ?? "").toLowerCase();
    const cat = (s.categoryLabel ?? "").toLowerCase();
    const freq = (s.frequencyLabel ?? "").toLowerCase();
    const tags = (s.tags ?? []).join(" ").toLowerCase();
    return (
      name.includes(needle) ||
      desc.includes(needle) ||
      cat.includes(needle) ||
      freq.includes(needle) ||
      tags.includes(needle)
    );
  });
}
