/** App Info swimlane tile indexes (`TvLibraryAppInfoSection` TILES order). */
export const MY_LIBRARY_APP_INFO_TILE_INDEX = Object.freeze({
  account: 0,
  faq: 1,
  contact: 2,
  about: 3,
});

/** Default focus when leaving embedded FAQ — App Info row is always group 0 on My Library. */
export const MY_LIBRARY_FAQ_RETURN_FOCUS = Object.freeze({
  groupIndex: 0,
  itemIndex: MY_LIBRARY_APP_INFO_TILE_INDEX.faq,
});
