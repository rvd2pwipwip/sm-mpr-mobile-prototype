import {
  MUSIC_GENRES,
  getLimitedMusicChannelsByCategory,
  getLimitedMusicGenres,
} from "@sm-mpr/shared/data/musicChannels.js";

/** Genre filters for limited-catalog TV Home (mobile LimitedBrowse music IA). */
export function getLimitedHomeFilters() {
  return getLimitedMusicGenres();
}

export function getLimitedHomeChannels(categoryId) {
  if (!categoryId) return [];
  return getLimitedMusicChannelsByCategory(categoryId);
}

export function getLimitedHomeFilterLabel(categoryId) {
  return (
    MUSIC_GENRES.find((genre) => genre.id === categoryId)?.label ?? categoryId
  );
}
