import { MY_LIBRARY_APP_INFO_TILE_INDEX } from "@sm-mpr/shared/utils/appInfoLoginTile.js";

export { MY_LIBRARY_APP_INFO_TILE_INDEX };

/** Default focus when leaving embedded FAQ — App Info row is always group 0 on My Library. */
export const MY_LIBRARY_FAQ_RETURN_FOCUS = Object.freeze({
  groupIndex: 0,
  itemIndex: MY_LIBRARY_APP_INFO_TILE_INDEX.faq,
});
