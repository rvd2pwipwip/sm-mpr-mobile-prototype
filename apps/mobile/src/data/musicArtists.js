/**
 * Stub **artist** entities for Search. Tapping a result opens a **channel grid**
 * featuring that artist (`/search/browse/music/artist/:artistId`).
 *
 * Names are synthetic. Channel picks are seeded per `id` so counts and mixes stay stable.
 */

import { getMusicChannelById, MUSIC_CHANNELS } from "./musicChannels.js";

/**
 * @typedef {Object} MusicArtistStub
 * @property {string} id Stable slug for keys + RNG seed.
 * @property {string} name Display / search text.
 * @property {string[]} featuredChannelIds Real IDs from `musicChannels.js` (`MUSIC_CHANNELS`).
 */

/** FNV-1a style hash → unsigned int (deterministic seed). */
function seededUInt(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function shuffledChannelIds(seed) {
  const next = MUSIC_CHANNELS.map((c) => c.id);
  let s = seed >>> 0;
  for (let i = next.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function deriveFeaturedChannelIds(artistId) {
  const seed = seededUInt(`artist-features-${artistId}`);
  const count = (seed % 12) + 1;
  return shuffledChannelIds(seed).slice(0, count);
}

const RAW_ARTISTS = [
  { id: "artist-midnight-romance", name: "Midnight Romance" },
  { id: "artist-velvet-romance-trio", name: "Velvet Romance Trio" },
  { id: "artist-romance-on-the-rails", name: "Romance on the Rails" },
  { id: "artist-urban-romance-collective", name: "Urban Romance Collective" },
  { id: "artist-neo-romance", name: "Neo-Romance" },
  { id: "artist-romance-and-rhythm", name: "Romance & Rhythm" },
  { id: "artist-golden-romance-quartet", name: "Golden Romance Quartet" },
  { id: "artist-coastal-romance-sessions", name: "Coastal Romance Sessions" },
  { id: "artist-electric-romance-djs", name: "Electric Romance DJs" },
  { id: "artist-soft-romance-ensemble", name: "Soft Romance Ensemble" },
  { id: "artist-romance-revival-band", name: "Romance Revival Band" },
  { id: "artist-paris-romance-nights", name: "Paris Romance Nights" },
  { id: "artist-silk-romance-orchestra", name: "Silk Romance Orchestra" },
  { id: "artist-romance-highway", name: "Romance Highway" },
  { id: "artist-crimson-romance-choir", name: "Crimson Romance Choir" },
  { id: "artist-indie-romance-echoes", name: "Indie Romance Echoes" },
  { id: "artist-romance-lab-studio", name: "Romance Lab Studio" },
  { id: "artist-summer-romance-hits", name: "Summer Romance Hits" },
  { id: "artist-vintage-romance-vinyl", name: "Vintage Romance Vinyl" },
  { id: "artist-dream-romance-synth", name: "Dream Romance Synth" },
];

/** @type {MusicArtistStub[]} */
export const MUSIC_ARTISTS = RAW_ARTISTS.map((a) => ({
  ...a,
  featuredChannelIds: deriveFeaturedChannelIds(a.id),
}));

/** @type {Map<string, MusicArtistStub>} */
const artistById = new Map(MUSIC_ARTISTS.map((a) => [a.id, a]));

/** @param {string} id */
export function getMusicArtistById(id) {
  return artistById.get(id) ?? null;
}

/**
 * @param {MusicArtistStub} artist
 * @returns {import("./musicChannels.js").MusicChannel[]}
 */
export function getFeaturedChannelsForArtist(artist) {
  if (!artist?.featuredChannelIds?.length) return [];
  /** @type {import("./musicChannels.js").MusicChannel[]} */
  const out = [];
  for (const channelId of artist.featuredChannelIds) {
    const ch = getMusicChannelById(channelId);
    if (ch) out.push(ch);
  }
  return out;
}
