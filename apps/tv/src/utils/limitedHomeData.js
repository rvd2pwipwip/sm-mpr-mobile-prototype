import {
  MUSIC_GENRES,
  getMusicChannelsByCategory,
} from "@sm-mpr/shared/data/musicChannels.js";

/** Genre filters for limited-catalog TV Home (mobile LimitedBrowse music IA). */
export function getLimitedHomeFilters() {
  return MUSIC_GENRES.filter(
    (genre) => getMusicChannelsByCategory(genre.id).length > 0,
  );
}

export function getLimitedHomeChannels(categoryId) {
  if (!categoryId) return [];
  return getMusicChannelsByCategory(categoryId);
}

export function getLimitedHomeFilterLabel(categoryId) {
  return (
    MUSIC_GENRES.find((genre) => genre.id === categoryId)?.label ?? categoryId
  );
}
