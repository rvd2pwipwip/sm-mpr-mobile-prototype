/**
 * Mock music channels (streams) for the SM MPR mobile prototype.
 *
 * - Lineup / grid names come from Figma `SmLineupMusicGrids` variants (browse grids).
 * - Detail shape follows the Channel Info screen (`musicInfo`): name, square thumbnail,
 *   long description, vibe **tags** (`.music-info__tag`), and up to 6 related medium cards.
 *
 * Channel info reference:
 * https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=25-7067
 */

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

const TAG_POOL = {
  pop: ["Pop", "Charts", "Hits", "Sing-along", "Feel-good", "Trending", "Party"],
  rock: ["Rock", "Guitar", "Anthems", "Live energy", "Classic cuts", "Turn it up"],
  "country-roots": ["Country", "Story songs", "Acoustic", "Americana", "Road trip", "Heartland"],
  "hip-hop": ["Hip-hop", "Beats", "Bars", "808s", "Urban", "Flow"],
  "dance-electronic": ["Dance", "Electronic", "Club", "House", "BPM", "Night out"],
  latin: ["Latin", "Tropical", "Rhythm", "Spanish hits", "Fiesta", "Radio hits"],
  "rb-soul": ["R&B", "Soul", "Groove", "Vocals", "Late night", "Smooth"],
  classical: ["Classical", "Orchestral", "Composers", "Focus", "Timeless", "Concert hall"],
  "jazz-blues": ["Jazz", "Blues", "Improv", "Swing", "Brass", "Late set"],
  mood: ["Chill", "Wellness", "Ambient", "Calm", "Low key", "Restore"],
  "around-the-world": ["Global", "World", "Travel", "Culture", "Groove", "Discovery"],
  kids: ["Kids", "Family", "Singalong", "Safe", "Playtime", "Bedtime"],
  variety: ["Variety", "Mix", "Soundtrack", "Feel-good", "Eclectic", "Crowd-pleaser"],
};

function tagsFor(categoryId, name, count = 6) {
  const pool = TAG_POOL[categoryId] ?? TAG_POOL.variety;
  const slug = slugify(name);
  const out = [];
  let i = 0;
  while (out.length < count && i < pool.length + 4) {
    const t = pool[(slug.length + i) % pool.length];
    if (!out.includes(t)) out.push(t);
    i += 1;
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
 * Raw lineup from Figma browse grids (`SmLineupMusicGrids` variants).
 * Names are copied from design text layers (including spelling/casing such as “Kid's Movie HIts”).
 */
const RAW_LINEUP = [
  // Pop
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

  // Rock
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

  // Country & Roots
  { categoryId: "country-roots", name: "Hot Country US" },
  { categoryId: "country-roots", name: "Country Classics" },
  { categoryId: "country-roots", name: "Alt-Country/Americana" },
  { categoryId: "country-roots", name: "Bluegrass" },
  { categoryId: "country-roots", name: "No Fences" },
  { categoryId: "country-roots", name: "Drinking Songs of Country" },
  { categoryId: "country-roots", name: "Everything Outlaw Country" },
  { categoryId: "country-roots", name: "Hot Country Summer" },
  { categoryId: "country-roots", name: "Country's Biggest Hits: the '00s" },

  // Hip-Hop
  { categoryId: "hip-hop", name: "Hip Hop Classics" },
  { categoryId: "hip-hop", name: "Hip-Hop/R&B" },
  { categoryId: "hip-hop", name: "Hip-Hop Flashback" },
  { categoryId: "hip-hop", name: "Hip-Hop Heatwave" },
  { categoryId: "hip-hop", name: "Hip-Hop Nights: the '00s" },

  // Dance/Electronic
  { categoryId: "dance-electronic", name: "Chill Lounge" },
  { categoryId: "dance-electronic", name: "Dance Classics" },
  { categoryId: "dance-electronic", name: "Dancefloor Fillers" },
  { categoryId: "dance-electronic", name: "Groove (Disco And Funk)" },

  // Latin
  { categoryId: "latin", name: "Éxitos Tropicales" },
  { categoryId: "latin", name: "Exitos Del Momento" },
  { categoryId: "latin", name: "Éxitos Regional Mexicanos" },
  { categoryId: "latin", name: "Romance Latino" },
  { categoryId: "latin", name: "Exitos Latinos" },

  // R&B/Soul
  { categoryId: "rb-soul", name: "Soul Storm" },
  { categoryId: "rb-soul", name: "Gospel" },
  { categoryId: "rb-soul", name: "Classic R'n'B And Soul" },
  { categoryId: "rb-soul", name: "Hot R&B" },
  { categoryId: "rb-soul", name: "Retro R&B Love Songs" },

  // Classical
  { categoryId: "classical", name: "Classical Hits" },
  { categoryId: "classical", name: "Classical Greats" },
  { categoryId: "classical", name: "Baroque" },
  { categoryId: "classical", name: "Chamber Music" },
  { categoryId: "classical", name: "Soft Classical" },
  { categoryId: "classical", name: "Opera" },

  // Jazz & Blues
  { categoryId: "jazz-blues", name: "Jazz Masters" },
  { categoryId: "jazz-blues", name: "The Blues" },
  { categoryId: "jazz-blues", name: "Swinging Standards" },
  { categoryId: "jazz-blues", name: "Big Band" },
  { categoryId: "jazz-blues", name: "Smooth Jazz" },
  { categoryId: "jazz-blues", name: "Broadway" },
  { categoryId: "jazz-blues", name: "Today's Jazz" },

  // Mood
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

  // Around the World
  { categoryId: "around-the-world", name: "Today's Global Hits" },
  { categoryId: "around-the-world", name: "Today's K-Pop" },
  { categoryId: "around-the-world", name: "Reggae Classics" },
  { categoryId: "around-the-world", name: "Reggaeton" },
  { categoryId: "around-the-world", name: "Bossa Nova" },
  { categoryId: "around-the-world", name: "Afrobeats" },
  { categoryId: "around-the-world", name: "Bollywood Hits" },

  // Kids
  { categoryId: "kids", name: "Kid's Movie HIts" },
  { categoryId: "kids", name: "Kids Hits" },
  { categoryId: "kids", name: "Family Friendly Pop" },
  { categoryId: "kids", name: "Relaxing Lullabies" },
  { categoryId: "kids", name: "Para Peques" },
  { categoryId: "kids", name: "Mousses Musique" },

  // Variety
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
