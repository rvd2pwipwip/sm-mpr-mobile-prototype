/** Max simultaneous timed skips (slots) for guest music streaming */
export const GUEST_MUSIC_MAX_ACTIVE_SKIPS = 6;

/** How long each used skip stays on the tally before it frees a slot */
export const GUEST_MUSIC_SKIP_RECOVERY_MS = 60 * 1000;

/** How often to prune expired skip timestamps */
export const GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS = 15 * 1000;
