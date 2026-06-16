import { SWIMLANE_CARD_MAX } from "./swimlane.js";

/** Max real + ghost slots in the Home "Listen again" horizontal rail. */
export const LISTEN_AGAIN_RAIL_SLOT_CAP = SWIMLANE_CARD_MAX;

/** Copy for **Listen again More** Clear speed bump (`AppStackedDialog`, Figma dialogsClear parity). */
export const LISTEN_AGAIN_CLEAR_CONFIRM = Object.freeze({
  dialogTitle: "Clear listening history",
  bodyPhrase: "listening history",
  primaryLabel: "Clear listening history",
});

/** Cap stored entries (newest first); grid can show all stored. */
export const LISTEN_HISTORY_MAX_STORED = 50;

/** Single store kinds: mixed Home rail + filtered My Library rails. */
export const LISTEN_HISTORY_KINDS = Object.freeze(["music", "podcast", "radio"]);

/** @param {string} kind */
export function isListenHistoryKind(kind) {
  return LISTEN_HISTORY_KINDS.includes(kind);
}

/** Maps limited / broad browse tab id to `ListenHistoryItem.kind`. */
export const LISTEN_HISTORY_KIND_FOR_BROWSE_TAB = Object.freeze({
  music: "music",
  podcasts: "podcast",
  radio: "radio",
});
