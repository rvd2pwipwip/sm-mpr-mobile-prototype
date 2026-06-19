import { CATALOG_SCOPE } from "../constants/catalogScope.js";
import {
  getLimitedMusicChannelsByCategory,
  getLimitedMusicGenres,
  getMusicChannelsByCategory,
  MUSIC_GENRES,
} from "./musicChannels.js";

/** Session pill memory key (mobile + TV provider lineup rail). */
export const PROVIDER_LINEUP_MEMORY_KEY = "home-provider-lineup-music";

/**
 * Genre pill rows for the provider lineup swimlane.
 * @param {string} catalogScope
 * @returns {{ slug: string, label: string }[]}
 */
export function getProviderLineupPillRows(catalogScope) {
  const isLimited = catalogScope === CATALOG_SCOPE.limited;
  if (isLimited) {
    return getLimitedMusicGenres().map((g) => ({
      slug: g.id,
      label: g.label,
    }));
  }
  return MUSIC_GENRES.filter(
    (g) => getMusicChannelsByCategory(g.id).length > 0,
  ).map((g) => ({ slug: g.id, label: g.label }));
}

/**
 * Channels for the selected provider lineup genre pill.
 * @param {string} categoryId
 * @param {string} catalogScope
 */
export function getProviderLineupChannels(categoryId, catalogScope) {
  if (!categoryId) return [];
  const isLimited = catalogScope === CATALOG_SCOPE.limited;
  return isLimited
    ? getLimitedMusicChannelsByCategory(categoryId)
    : getMusicChannelsByCategory(categoryId);
}
