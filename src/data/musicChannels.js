/**
 * Mock music channels (streams) for the SM MPR mobile prototype.
 *
 * - Lineup / grid names come from Figma `SmLineupMusicGrids` variants (browse grids).
 * - Channel **tags**: mock API mix — **one** IA genre pillar, **≤one** IA subgenre when that row
 *   has subs (for sub-browse parity), **one** era chip, plus **three or four** Activity / Mood /
 *   Theme tags (slots trimmed when a subgenre chip is placed) — see `tagsFor`. After build,
 *   **`ensureMinChannelsWithTag`** pads Mood **Adventurous** to 20 rows for category-rail **More** QA.
 * - Detail shape follows the Channel Info screen (`musicInfo`): name, square thumbnail,
 *   long description, vibe **tags** (`.music-info__tag`), and up to 6 related medium cards.
 *
 * Channel info reference:
 * https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=25-7067
 */

import {
  flattenVibeTagLabels,
  getPrototypeCategoryTagGroups,
} from "./musicBrowseTaxonomy.js";

/** @typedef {{ id: string, name: string, thumbnail: string }} RelatedMusicChannel */

/**
 * @typedef {Object} MusicChannel
 * @property {string} id Stable slug (unique across the catalog).
 * @property {string} categoryId Genre key from {@link MUSIC_GENRES}.
 * @property {string} name Display title (matches Figma card labels where noted).
 * @property {string} thumbnail Square art URL (prototype placeholder).
 * @property {string} description Blurb for the info screen (truncate + “More…” in UI).
 * @property {string[]} tags Vibe **tag** labels (Channel Info `.music-info__tag`, Search **Tags** swimlane / `getMusicChannelsWithTag`).
 * @property {RelatedMusicChannel[]} relatedChannels Up to 6 suggestions (medium cards).
 */

export const MUSIC_GENRES = [
  { id: "pop", label: "Pop" },
  { id: "rock", label: "Rock" },
  { id: "country-roots", label: "Country & Roots" },
  { id: "hip-hop", label: "Hip-Hop" },
  { id: "dance-electronic", label: "Dance/Electronic" },
  { id: "latin", label: "Latin" },
  { id: "rb-soul", label: "R&B/Soul" },
  { id: "classical", label: "Classical" },
  { id: "jazz-blues", label: "Jazz & Blues" },
  { id: "mood", label: "Mood" },
  { id: "around-the-world", label: "Around the World" },
  { id: "kids", label: "Kids" },
  { id: "variety", label: "Variety" },
];

const genreLabel = (categoryId) =>
  MUSIC_GENRES.find((g) => g.id === categoryId)?.label ?? categoryId;

/** Deterministic placeholder art (square). Swap for real CDN URLs later. */
export function channelThumbnailUrl(channelId) {
  return `https://picsum.photos/seed/${encodeURIComponent(channelId)}/512/512`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function channelId(categoryId, name) {
  return `${categoryId}__${slugify(name)}`;
}

function nameDeterministicSeed(name) {
  const s = slugify(name);
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Mock tags: **1** genre pillar, **≤1** IA subgenre when that row has subs, **1** era,
 * then **3–4** Activity / Mood / Theme tags (one fewer when the subgenre chip is used).
 */
function tagsFor(categoryId, name) {
  const seed = nameDeterministicSeed(name);

  let genreOne;
  /** @type {string[]} */
  let groupSubs = [];
  const groups = getPrototypeCategoryTagGroups(categoryId);
  if (groups.length === 0) {
    genreOne = genreLabel(categoryId);
  } else {
    const pick = groups[seed % groups.length];
    genreOne = pick.primary;
    groupSubs = pick.subcategories;
  }

  const blocked = new Set([genreOne]);
  /** @type {string[]} */
  const out = [genreOne];

  if (groupSubs.length > 0) {
    const sub = groupSubs[(seed >>> 10) % groupSubs.length];
    if (!blocked.has(sub)) {
      out.push(sub);
      blocked.add(sub);
    }
  }

  const eraLabels = flattenVibeTagLabels("era");
  const eraOne =
    eraLabels.length > 0
      ? eraLabels[seed % eraLabels.length]
      : "Today";
  blocked.add(eraOne);
  out.push(eraOne);

  const slotsAfterEra = out.length;
  const otherTarget =
    3 + (seed % 2) - Math.max(0, slotsAfterEra - 2);

  const merged = [
    ...flattenVibeTagLabels("activity"),
    ...flattenVibeTagLabels("mood"),
    ...flattenVibeTagLabels("theme"),
  ];
  /** @type {string[]} */
  const otherPool = [];
  const seenOther = new Set();
  for (const t of merged) {
    if (seenOther.has(t)) continue;
    if (blocked.has(t)) continue;
    seenOther.add(t);
    otherPool.push(t);
  }

  if (otherPool.length === 0) {
    return out;
  }

  let idx = seed % Math.max(otherPool.length, 1);
  let guard = 0;
  const guardMax = Math.max(otherPool.length * 8, 40);
  while (out.length < slotsAfterEra + otherTarget && guard < guardMax) {
    guard += 1;
    const t = otherPool[idx % otherPool.length];
    idx += 1 + ((seed >> 3) % Math.min(5, otherPool.length || 1));
    if (!out.includes(t)) out.push(t);
  }

  return out;
}

function descriptionFor(categoryId, name) {
  const g = genreLabel(categoryId);
  return (
    `${name} is a curated Stingray music channel in the ${g} collection—always-on streaming with a steady mood, no hosts, and tracks refreshed on a regular cadence. ` +
    `Use it when you want the station to stay in its lane: familiar hooks, consistent energy, and programming that fits everyday listening. ` +
    `If you like this lane, the Related row surfaces more channels that sit nearby in tone.`
  );
}

/**
 * Raw lineup from Figma browse grids (`SmLineupMusicGrids` variants), tuned per prototype counts.
 * Names are copied from design text layers where noted (including spelling/casing such as “Kid's Movie HIts”).
 * Channel counts per genre: Pop 20, Rock 21, Country & Roots 10, Hip-Hop 4, Dance/Electronic 8,
 * Latin 7, R&B/Soul 7, Classical 6, Jazz & Blues 8, Mood 14, Around the World 7, Kids 6, Variety 10.
 */
const RAW_LINEUP = [
  // Pop (20)
  { categoryId: "pop", name: "Adult Alternative US" },
  { categoryId: "pop", name: "Pop Adult" },
  { categoryId: "pop", name: "Hit List" },
  { categoryId: "pop", name: "Easy Listening" },
  { categoryId: "pop", name: "Maximum Party" },
  { categoryId: "pop", name: "Greatest Hits" },
  { categoryId: "pop", name: "Tik Tok Radio" },
  { categoryId: "pop", name: "Y2K" },
  { categoryId: "pop", name: "Easy Breezy (Soft Hits)" },
  { categoryId: "pop", name: "Today's K-Pop" },
  { categoryId: "pop", name: "Silk (Love Songs)" },
  { categoryId: "pop", name: "Freedom" },
  { categoryId: "pop", name: "Special Event" },
  { categoryId: "pop", name: "Breezy Yacht Rock (70-80s Summer Pop/Rock)" },
  { categoryId: "pop", name: "Coffee Shop Blend" },
  { categoryId: "pop", name: "Chartbreakers" },
  { categoryId: "pop", name: "Feel-Good Pop Mix" },
  { categoryId: "pop", name: "Throwback Pop Smash" },
  { categoryId: "pop", name: "Pure Pop Drive" },
  { categoryId: "pop", name: "Radio Hits Rewind" },

  // Rock (21)
  { categoryId: "rock", name: "Heavy Metal" },
  { categoryId: "rock", name: "Classic Rock US" },
  { categoryId: "rock", name: "Alternative" },
  { categoryId: "rock", name: "Rock" },
  { categoryId: "rock", name: "Christian Rock & Pop" },
  { categoryId: "rock", name: "Alt-Rock Classics" },
  { categoryId: "rock", name: "Hard Rock" },
  { categoryId: "rock", name: "Rock anthems" },
  { categoryId: "rock", name: "Rock Of Ages" },
  { categoryId: "rock", name: "Indie Classics" },
  { categoryId: "rock", name: "Indie Radio" },
  { categoryId: "rock", name: "Jam-Packed!" },
  { categoryId: "rock", name: "Punk-Rock Teenage Kicks" },
  { categoryId: "rock", name: "Chill Classic Rock" },
  { categoryId: "rock", name: "Y2K Rock" },
  { categoryId: "rock", name: "Pop Rock Party" },
  { categoryId: "rock", name: "Gods Of Hard Rock" },
  { categoryId: "rock", name: "Classic Rock: Forgotten Gems" },
  { categoryId: "rock", name: "Arena Rock Live" },
  { categoryId: "rock", name: "Southern Rock Journey" },
  { categoryId: "rock", name: "Garage Rock Revival" },

  // Country & Roots (10)
  { categoryId: "country-roots", name: "Hot Country US" },
  { categoryId: "country-roots", name: "Country Classics" },
  { categoryId: "country-roots", name: "Alt-Country/Americana" },
  { categoryId: "country-roots", name: "Bluegrass" },
  { categoryId: "country-roots", name: "No Fences" },
  { categoryId: "country-roots", name: "Drinking Songs of Country" },
  { categoryId: "country-roots", name: "Everything Outlaw Country" },
  { categoryId: "country-roots", name: "Hot Country Summer" },
  { categoryId: "country-roots", name: "Country's Biggest Hits: the '00s" },
  { categoryId: "country-roots", name: "Country Summer Nights" },

  // Hip-Hop (4)
  { categoryId: "hip-hop", name: "Hip Hop Classics" },
  { categoryId: "hip-hop", name: "Hip-Hop/R&B" },
  { categoryId: "hip-hop", name: "Hip-Hop Flashback" },
  { categoryId: "hip-hop", name: "Hip-Hop Heatwave" },

  // Dance/Electronic (8)
  { categoryId: "dance-electronic", name: "Chill Lounge" },
  { categoryId: "dance-electronic", name: "Dance Classics" },
  { categoryId: "dance-electronic", name: "Dancefloor Fillers" },
  { categoryId: "dance-electronic", name: "Groove (Disco And Funk)" },
  { categoryId: "dance-electronic", name: "Deep House Sessions" },
  { categoryId: "dance-electronic", name: "Techno Underground" },
  { categoryId: "dance-electronic", name: "Trance Anthems" },
  { categoryId: "dance-electronic", name: "EDM Party Starters" },

  // Latin (7)
  { categoryId: "latin", name: "Éxitos Tropicales" },
  { categoryId: "latin", name: "Exitos Del Momento" },
  { categoryId: "latin", name: "Éxitos Regional Mexicanos" },
  { categoryId: "latin", name: "Romance Latino" },
  { categoryId: "latin", name: "Exitos Latinos" },
  { categoryId: "latin", name: "Salsa Classics" },
  { categoryId: "latin", name: "Bachata Romance" },

  // R&B/Soul (7)
  { categoryId: "rb-soul", name: "Soul Storm" },
  { categoryId: "rb-soul", name: "Gospel" },
  { categoryId: "rb-soul", name: "Classic R'n'B And Soul" },
  { categoryId: "rb-soul", name: "Hot R&B" },
  { categoryId: "rb-soul", name: "Retro R&B Love Songs" },
  { categoryId: "rb-soul", name: "Slow Jams Tonight" },
  { categoryId: "rb-soul", name: "Neo-Soul Collective" },

  // Classical (6)
  { categoryId: "classical", name: "Classical Hits" },
  { categoryId: "classical", name: "Classical Greats" },
  { categoryId: "classical", name: "Baroque" },
  { categoryId: "classical", name: "Chamber Music" },
  { categoryId: "classical", name: "Soft Classical" },
  { categoryId: "classical", name: "Opera" },

  // Jazz & Blues (8)
  { categoryId: "jazz-blues", name: "Jazz Masters" },
  { categoryId: "jazz-blues", name: "The Blues" },
  { categoryId: "jazz-blues", name: "Swinging Standards" },
  { categoryId: "jazz-blues", name: "Big Band" },
  { categoryId: "jazz-blues", name: "Smooth Jazz" },
  { categoryId: "jazz-blues", name: "Broadway" },
  { categoryId: "jazz-blues", name: "Today's Jazz" },
  { categoryId: "jazz-blues", name: "Cool Jazz Evening" },

  // Mood (14)
  { categoryId: "mood", name: "The Spa" },
  { categoryId: "mood", name: "Easy Listening" },
  { categoryId: "mood", name: "New Age" },
  { categoryId: "mood", name: "Acoustic Serenity" },
  { categoryId: "mood", name: "Peaceful Piano" },
  { categoryId: "mood", name: "Peaceful Guitar" },
  { categoryId: "mood", name: "Music for Meditation" },
  { categoryId: "mood", name: "Music for Focus" },
  { categoryId: "mood", name: "Music for Positivity" },
  { categoryId: "mood", name: "Music for Intimacy" },
  { categoryId: "mood", name: "Relaxing Nature Sounds" },
  { categoryId: "mood", name: "Relaxing Beach Waves" },
  { categoryId: "mood", name: "Peaceful Cello" },
  { categoryId: "mood", name: "Relaxing Rain Sounds" },

  // Around the World (7)
  { categoryId: "around-the-world", name: "Today's Global Hits" },
  { categoryId: "around-the-world", name: "Today's K-Pop" },
  { categoryId: "around-the-world", name: "Reggae Classics" },
  { categoryId: "around-the-world", name: "Reggaeton" },
  { categoryId: "around-the-world", name: "Bossa Nova" },
  { categoryId: "around-the-world", name: "Afrobeats" },
  { categoryId: "around-the-world", name: "Bollywood Hits" },

  // Kids (6)
  { categoryId: "kids", name: "Kid's Movie HIts" },
  { categoryId: "kids", name: "Kids Hits" },
  { categoryId: "kids", name: "Family Friendly Pop" },
  { categoryId: "kids", name: "Relaxing Lullabies" },
  { categoryId: "kids", name: "Para Peques" },
  { categoryId: "kids", name: "Mousses Musique" },

  // Variety (10)
  { categoryId: "variety", name: "Greatest Love Songs" },
  { categoryId: "variety", name: "Christian Hits" },
  { categoryId: "variety", name: "Gospel" },
  { categoryId: "variety", name: "Movie Hits" },
  { categoryId: "variety", name: "Summer Hits" },
  { categoryId: "variety", name: "One Hit Wonders" },
  { categoryId: "variety", name: "Coffee Shop" },
  { categoryId: "variety", name: "Family Friendly Pop" },
  { categoryId: "variety", name: "Relaxing Lullabies" },
  { categoryId: "variety", name: "Para Peques" },
];

const MAX_RELATED = 6;

/** Mood IA parent label (`musicVibesIa.broad1000.json`, vibe mood); used for swimlane More QA. */
const MOOD_ADVENTUROUS_TAG_LABEL = "Adventurous";
/** Target matches for `getMusicChannelsWithTag` on that label (`SWIMLANE_CARD_MAX` is 12). */
const MOOD_ADVENTUROUS_TAG_CHANNEL_COUNT = 20;

function hasTagIgnoreCase(tags, label) {
  const needle = label.trim().toLowerCase();
  return (tags ?? []).some(
    (t) => String(t).trim().toLowerCase() === needle,
  );
}

/**
 * Mutates channels so the catalog has at least `minCount` rows carrying `tagLabel`.
 * Prototype-only: predictable Mood leaf density without hand-editing every `tagsFor` outcome.
 *
 * @param {MusicChannel[]} channels
 */
function ensureMinChannelsWithTag(channels, tagLabel, minCount) {
  let count = channels.filter((c) =>
    hasTagIgnoreCase(c.tags, tagLabel),
  ).length;
  for (let i = 0; i < channels.length && count < minCount; i += 1) {
    const c = channels[i];
    if (hasTagIgnoreCase(c.tags, tagLabel)) continue;
    c.tags = [...(c.tags ?? []), tagLabel];
    count += 1;
  }
}

function buildRelated(siblings, selfId) {
  const others = siblings.filter((c) => c.id !== selfId);
  const out = [];
  for (let i = 0; i < others.length && out.length < MAX_RELATED; i += 1) {
    const c = others[i];
    out.push({
      id: c.id,
      name: c.name,
      thumbnail: c.thumbnail,
    });
  }
  return out;
}

function buildChannels() {
  /** @type {Map<string, MusicChannel[]>} */
  const byCategory = new Map();
  for (const g of MUSIC_GENRES) {
    byCategory.set(g.id, []);
  }

  for (const row of RAW_LINEUP) {
    const id = channelId(row.categoryId, row.name);
    const thumbnail = channelThumbnailUrl(id);
    const channel = {
      id,
      categoryId: row.categoryId,
      name: row.name,
      thumbnail,
      description: descriptionFor(row.categoryId, row.name),
      tags: tagsFor(row.categoryId, row.name),
      relatedChannels: [],
    };
    byCategory.get(row.categoryId).push(channel);
  }

  /** @type {MusicChannel[]} */
  const all = [];
  for (const g of MUSIC_GENRES) {
    const list = byCategory.get(g.id);
    for (const ch of list) {
      ch.relatedChannels = buildRelated(list, ch.id);
      all.push(ch);
    }
  }

  ensureMinChannelsWithTag(
    all,
    MOOD_ADVENTUROUS_TAG_LABEL,
    MOOD_ADVENTUROUS_TAG_CHANNEL_COUNT,
  );

  return all;
}

/** Full catalog with related channels resolved (same-genre, max 6). */
export const MUSIC_CHANNELS = buildChannels();

/** @type {Map<string, MusicChannel>} */
const byId = new Map(MUSIC_CHANNELS.map((c) => [c.id, c]));

export function getMusicChannelById(id) {
  return byId.get(id) ?? null;
}

export function getMusicChannelsByCategory(categoryId) {
  return MUSIC_CHANNELS.filter((c) => c.categoryId === categoryId);
}

/** Channels whose vibe-tag list (`tags`) includes this label (case-insensitive exact chip match). */
export function getMusicChannelsWithTag(tagLabel) {
  if (!tagLabel || typeof tagLabel !== "string") return [];
  const needle = tagLabel.trim().toLowerCase();
  if (!needle) return [];
  return MUSIC_CHANNELS.filter((c) =>
    (c.tags ?? []).some((t) => String(t).trim().toLowerCase() === needle),
  );
}
