/** Legal link focus groups on `tv-info-about` (`LEGAL_LINKS` order). */
export const TV_INFO_ABOUT_LEGAL_GROUP = Object.freeze({
  terms: 0,
  privacy: 1,
});

export const TV_INFO_ABOUT_LEGAL_ITEM_INDEX = 0;

export const TV_INFO_ABOUT_RETURN_FOCUS = Object.freeze({
  terms: {
    groupIndex: TV_INFO_ABOUT_LEGAL_GROUP.terms,
    itemIndex: TV_INFO_ABOUT_LEGAL_ITEM_INDEX,
  },
  privacy: {
    groupIndex: TV_INFO_ABOUT_LEGAL_GROUP.privacy,
    itemIndex: TV_INFO_ABOUT_LEGAL_ITEM_INDEX,
  },
});
