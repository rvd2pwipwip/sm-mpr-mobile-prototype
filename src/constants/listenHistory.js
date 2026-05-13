/** Max real + ghost slots in the Home “Listen again” horizontal rail. */
export const LISTEN_AGAIN_RAIL_SLOT_CAP = 12;

/** Cap stored entries (newest first); grid can show all stored. */
export const LISTEN_HISTORY_MAX_STORED = 50;

/** Single store kinds: mixed Home rail + filtered My Library rails (Phase 3+). */
export const LISTEN_HISTORY_KINDS = Object.freeze(["music", "podcast", "radio"]);

/** @param {string} kind */
export function isListenHistoryKind(kind) {
  return LISTEN_HISTORY_KINDS.includes(kind);
}
