import { getMusicChannelById } from "../data/musicChannels.js";
import { getPodcastById } from "../data/podcasts.js";
import { resolveRadioStationForStub } from "../data/radioInternationalBrowse.js";

/**
 * @typedef {{
 *   kind: 'music' | 'podcast' | 'radio',
 *   id: string,
 *   thumbnail: string,
 *   title: string,
 *   path: string,
 * }} ResolvedListenAgainTile
 */

/**
 * Resolve a listen-history row to catalog metadata + navigation path.
 * @param {{ kind: string, id: string }} item
 * @returns {ResolvedListenAgainTile | null}
 */
export function resolveListenAgainItem(item) {
  if (!item?.kind || !item?.id) return null;

  if (item.kind === "music") {
    const channel = getMusicChannelById(item.id);
    if (!channel) return null;
    return {
      kind: "music",
      id: channel.id,
      thumbnail: channel.thumbnail,
      title: channel.name,
      path: `/music/${channel.id}`,
    };
  }

  if (item.kind === "podcast") {
    const podcast = getPodcastById(item.id);
    if (!podcast) return null;
    return {
      kind: "podcast",
      id: podcast.id,
      thumbnail: podcast.thumbnail,
      title: podcast.title,
      path: `/podcast/${podcast.id}`,
    };
  }

  if (item.kind === "radio") {
    const station = resolveRadioStationForStub(item.id);
    if (!station) return null;
    return {
      kind: "radio",
      id: station.id,
      thumbnail: station.thumbnail,
      title: station.name,
      path: `/radio/${station.id}`,
    };
  }

  return null;
}

/**
 * @param {readonly { kind: string, id: string }[]} items
 * @returns {ResolvedListenAgainTile[]}
 */
export function resolveListenAgainItems(items) {
  return items
    .map((item) => resolveListenAgainItem(item))
    .filter(Boolean);
}
