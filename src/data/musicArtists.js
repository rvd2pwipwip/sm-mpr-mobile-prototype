/**
 * Stub **artist** entities for Search only (no artist browse screen in the prototype).
 * Tapping a result opens the first `representativeChannelIds` entry on `/music/:channelId`.
 *
 * Names are synthetic—not copied from channel titles—so the Artists lane is visibly distinct
 * from the Channels lane for demo queries.
 */

/**
 * @typedef {Object} MusicArtistStub
 * @property {string} id Stable slug for keys + art seeds.
 * @property {string} name Display / search text.
 * @property {string} [thumbnail] Optional square image URL; otherwise UI picks a deterministic seed.
 * @property {string[]} representativeChannelIds Real IDs from `musicChannels.js` (`MUSIC_CHANNELS`).
 */

/** @type {MusicArtistStub[]} */
export const MUSIC_ARTISTS = [
  {
    id: "artist-block-party-dj",
    name: "Block Party DJ",
    representativeChannelIds: ["pop__maximum-party"],
  },
  {
    id: "artist-yacht-sunset",
    name: "Yacht Sunset Collective",
    representativeChannelIds: ["pop__breezy-yacht-rock-70-80s-summer-pop-rock"],
  },
  {
    id: "artist-kwave-icons",
    name: "K-Wave Icons",
    representativeChannelIds: ["pop__today-s-k-pop"],
  },
  {
    id: "artist-metal-forge",
    name: "Metal Forge Radio",
    representativeChannelIds: ["rock__heavy-metal"],
  },
  {
    id: "artist-dusty-highway",
    name: "Dusty Highway Band",
    representativeChannelIds: ["country-roots__alt-country-americana"],
  },
  {
    id: "artist-blue-note-ghosts",
    name: "Blue Note Ghosts",
    representativeChannelIds: ["jazz-blues__the-blues"],
  },
  {
    id: "artist-opera-house",
    name: "Opera House Sessions",
    representativeChannelIds: ["classical__opera"],
  },
  {
    id: "artist-lofi-study",
    name: "Lo-Fi Study Room",
    representativeChannelIds: ["mood__music-for-focus"],
  },
  {
    id: "artist-silk-and-soul",
    name: "Silk & Soul",
    representativeChannelIds: ["pop__silk-love-songs"],
  },
  {
    id: "artist-dancefloor-heroes",
    name: "Dancefloor Heroes",
    representativeChannelIds: ["dance-electronic__dancefloor-fillers"],
  },
  {
    id: "artist-classical-dawn",
    name: "Classical Dawn Quartet",
    representativeChannelIds: ["classical__chamber-music"],
  },
  {
    id: "artist-hiphop-archive",
    name: "Hip-Hop Archive",
    representativeChannelIds: ["hip-hop__hip-hop-classics"],
  },
  {
    id: "artist-latin-heartbeat",
    name: "Latin Heartbeat",
    representativeChannelIds: ["latin__exitos-latinos"],
  },
  {
    id: "artist-morning-coffee",
    name: "Morning Coffee House",
    representativeChannelIds: ["pop__coffee-shop-blend"],
  },
  {
    id: "artist-indie-midnight",
    name: "Indie Midnight",
    representativeChannelIds: ["rock__indie-radio"],
  },
  {
    id: "artist-gospel-choir",
    name: "Golden Choir Collective",
    representativeChannelIds: ["rb-soul__gospel"],
  },
];
