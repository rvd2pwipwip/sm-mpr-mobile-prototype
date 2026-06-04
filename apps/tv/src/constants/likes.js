/** @typedef {'music' | 'radio'} LikeContentKind */

/** @typedef {{ kind: LikeContentKind, id: string }} LikedContentItem */

/**
 * @param {unknown} kind
 * @returns {kind is LikeContentKind}
 */
export function isLikeContentKind(kind) {
  return kind === "music" || kind === "radio";
}
