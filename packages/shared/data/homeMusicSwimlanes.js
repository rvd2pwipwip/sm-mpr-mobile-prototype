import { getMusicChannelByName } from "./musicChannels.js";

/**
 * Broad Home music swimlanes for music-only MVP (Phase 1+).
 * Names must match `MusicChannel.name` in `musicChannels.js`.
 */
export const HOME_MUSIC_SWIMLANE_LISTS = Object.freeze({
  newReleases: Object.freeze({
    title: "New releases",
    channelNames: Object.freeze([
      "Loud and Proud",
      "Tik Tok Radio",
      "Hit List: Best of 2025",
      "Country: Best of 2025",
      "Rock: Best of 2025",
      "Hip-Hop and R&B: Best of 2025",
      "Indie: Best of 2025",
      "Alternative: Best of 2025",
      "Jazz: Best of 2025",
      "Metal: Best of 2025",
    ]),
  }),
  countryEssentials: Object.freeze({
    title: "Country essentials",
    channelNames: Object.freeze([
      "Hot Country US",
      "Country Classics",
      "Franco Country",
      "Alt-Country/Americana",
      "Today's Country",
      "Hot Pop & Country",
      "Country Road Trip",
      "Country: Best of 2025",
      "Soft Country",
    ]),
  }),
});

/**
 * @param {readonly string[]} channelNames
 * @returns {import("./musicChannels.js").MusicChannel[]}
 */
export function resolveHomeSwimlaneChannelsByNames(channelNames) {
  /** @type {import("./musicChannels.js").MusicChannel[]} */
  const out = [];
  for (const name of channelNames) {
    const channel = getMusicChannelByName(name);
    if (channel) {
      out.push(channel);
      continue;
    }
    if (import.meta.env?.DEV) {
      console.warn(`[homeMusicSwimlanes] No channel for name: ${name}`);
    }
  }
  return out;
}

/**
 * @param {"newReleases" | "countryEssentials"} key
 */
export function getHomeMusicSwimlaneChannels(key) {
  const list = HOME_MUSIC_SWIMLANE_LISTS[key];
  if (!list) return [];
  return resolveHomeSwimlaneChannelsByNames(list.channelNames);
}

/** @param {"newReleases" | "countryEssentials"} key */
export function getHomeMusicSwimlaneTitle(key) {
  return HOME_MUSIC_SWIMLANE_LISTS[key]?.title ?? "";
}
